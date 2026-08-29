import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { completeJson, completeAnthropicJson } from "../../server/utils/ai/client"
import { mapProviderError } from "../../server/utils/ai/improveChildren"

interface ErrorWithStatus extends Error {
  status?: number
  statusCode?: number
}

describe("ai client - anthropic support", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("calls Anthropic Messages API with correct headers and payload", async () => {
    let capturedUrl = ""
    let capturedOptions: RequestInit | undefined

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async (url: string, opts: RequestInit) => {
        capturedUrl = url
        capturedOptions = opts
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          json: async () => ({
            content: [{ type: "text", text: "{\"matchScore\": 85, \"suggestions\": []}" }]
          })
        } as Response
      })
    )

    const res = await completeAnthropicJson({
      provider: "anthropic",
      apiKey: "sk-ant-test-123",
      system: "system prompt",
      user: "user prompt",
      model: "claude-3-5-sonnet-latest"
    })

    expect(res).toBe("{\"matchScore\": 85, \"suggestions\": []}")
    expect(capturedUrl).toBe("https://api.anthropic.com/v1/messages")

    const headers = capturedOptions?.headers as Record<string, string>
    expect(headers["x-api-key"]).toBe("sk-ant-test-123")
    expect(headers["anthropic-version"]).toBe("2023-06-01")
    expect(headers["content-type"]).toBe("application/json")

    const body = JSON.parse(capturedOptions?.body as string)
    expect(body).toMatchObject({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 4096,
      temperature: 0.2,
      system: "system prompt",
      messages: [{ role: "user", content: "user prompt" }]
    })
  })

  it("routes anthropic provider in completeJson to completeAnthropicJson", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async () => {
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          json: async () => ({
            content: [{ type: "text", text: "routed-anthropic-response" }]
          })
        } as Response
      })
    )

    const res = await completeJson({
      provider: "anthropic",
      apiKey: "sk-ant-test-123",
      system: "sys",
      user: "usr"
    })

    expect(res).toBe("routed-anthropic-response")
  })

  it("throws error with status code on Anthropic API error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async () => {
        return {
          ok: false,
          status: 401,
          statusText: "Unauthorized",
          json: async () => ({
            error: { type: "authentication_error", message: "invalid x-api-key" }
          })
        } as Response
      })
    )

    let caughtError: ErrorWithStatus | undefined
    try {
      await completeAnthropicJson({
        provider: "anthropic",
        apiKey: "bad-key",
        system: "sys",
        user: "usr"
      })
    } catch (error) {
      caughtError = error as ErrorWithStatus
    }

    expect(caughtError).toBeDefined()
    expect(caughtError?.status).toBe(401)
    expect(mapProviderError(caughtError)).toContain("rejected the API key or credits")
  })

  it("handles 429 rate limit error via mapProviderError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async () => {
        return {
          ok: false,
          status: 429,
          statusText: "Too Many Requests",
          json: async () => ({
            error: { type: "rate_limit_error", message: "Rate limit exceeded" }
          })
        } as Response
      })
    )

    let caughtError: ErrorWithStatus | undefined
    try {
      await completeAnthropicJson({
        provider: "anthropic",
        apiKey: "key",
        system: "sys",
        user: "usr"
      })
    } catch (error) {
      caughtError = error as ErrorWithStatus
    }

    expect(caughtError).toBeDefined()
    expect(caughtError?.status).toBe(429)
    expect(mapProviderError(caughtError)).toContain("rate-limited")
  })

  it("throws on empty Anthropic response text", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async () => {
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          json: async () => ({
            content: []
          })
        } as Response
      })
    )

    await expect(
      completeAnthropicJson({
        provider: "anthropic",
        apiKey: "key",
        system: "sys",
        user: "usr"
      })
    ).rejects.toThrow("Empty response from model")
  })
})
