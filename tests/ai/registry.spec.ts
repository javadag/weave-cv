import { describe, it, expect } from "vitest"
import { AI_PROVIDERS, buildAiKeyStore, clampKeys } from "~/services/ai/registry"

describe("client registry", () => {
  it("covers the nine providers including custom", () => {
    expect(AI_PROVIDERS).toHaveLength(9)
    expect(AI_PROVIDERS.map((p) => p.id)).toContain("custom")
  })
  it("custom is baseUrlRequired", () => {
    expect(AI_PROVIDERS.find((p) => p.id === "custom")?.baseUrlRequired).toBe(true)
  })
  it("mirrors server base URLs", () => {
    expect(AI_PROVIDERS.find((p) => p.id === "deepseek")?.baseURL).toBe("https://api.deepseek.com/v1")
  })
})

describe("clampKeys", () => {
  it("round-trips key config", () => {
    expect(clampKeys({ provider: "openai", key: "sk-x", model: "gpt-4o-mini", baseUrl: undefined }))
      .toEqual({ provider: "openai", key: "sk-x", model: "gpt-4o-mini", baseUrl: undefined })
  })
  it("trims whitespace", () => {
    expect(clampKeys({ provider: "openai", key: `${" ".repeat(2)}sk-x${" ".repeat(2)}` })?.key).toBe("sk-x")
  })
  it("returns null for empty key", () => {
    expect(clampKeys({ provider: "openai", key: " ".repeat(3) })).toBeNull()
  })
  it("falls back to the first provider for an unknown id", () => {
    expect(clampKeys({ provider: "nope" as never, key: "sk-x" })?.provider).toBe("deepseek")
  })
})

describe("buildAiKeyStore", () => {
  it("parses arbitrary input", () => {
    expect(buildAiKeyStore({ provider: "openai", key: "sk-x" })?.key).toBe("sk-x")
    expect(buildAiKeyStore("nope")).toBeNull()
    expect(buildAiKeyStore(null)).toBeNull()
  })
})