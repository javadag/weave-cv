import OpenAI from "openai"
import { getAiProvider, isCustomProvider, type AiId } from "./providers"

export const CALL_TIMEOUT_MS = 60_000

export interface CallOptions {
  provider: AiId
  apiKey: string
  baseUrl?: string
  model?: string
  system: string
  user: string
  temperature?: number
}

export function createAiClient(opts: { provider: AiId; apiKey: string; baseUrl?: string; model?: string }) {
  const cfg = getAiProvider(opts.provider)
  const baseURL = isCustomProvider(opts.provider) ? opts.baseUrl! : cfg.baseURL
  const client = new OpenAI({ apiKey: opts.apiKey, baseURL })
  const model = opts.model ?? cfg.defaultModel
  return { client, model }
}

export async function completeAnthropicJson(opts: CallOptions): Promise<string> {
  const cfg = getAiProvider("anthropic")
  const baseURL = (opts.baseUrl || cfg.baseURL).replace(/\/+$/, "")
  const endpoint = `${baseURL}/messages`
  const model = opts.model ?? cfg.defaultModel

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), CALL_TIMEOUT_MS)

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "x-api-key": opts.apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        temperature: opts.temperature ?? 0.2,
        system: opts.system,
        messages: [{ role: "user", content: opts.user }]
      }),
      signal: controller.signal
    })

    if (!response.ok) {
      let errBody: Record<string, unknown> = {}
      try {
        errBody = (await response.json()) as Record<string, unknown>
      } catch {
        // use fallback message below
      }
      const errObj = (errBody?.error ?? {}) as Record<string, unknown>
      const message = typeof errObj.message === "string" ? errObj.message : `Anthropic error: ${response.statusText}`
      const err = new Error(message) as Error & { status?: number; statusCode?: number }
      err.status = response.status
      err.statusCode = response.status
      throw err
    }

    const data = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>
    }
    const text = data.content
      ?.filter((item) => item.type === "text" && item.text)
      .map((item) => item.text)
      .join("")

    if (!text || !text.trim()) {
      throw new Error("Empty response from model")
    }
    return text
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function completeJson(opts: CallOptions): Promise<string> {
  if (opts.provider === "anthropic") {
    return completeAnthropicJson(opts)
  }
  const { client, model } = createAiClient(opts)
  const completion = await client.chat.completions.create(
    {
      model,
      temperature: opts.temperature ?? 0.2,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.user }
      ]
    },
    { timeout: CALL_TIMEOUT_MS }
  )
  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new Error("Empty response from model")
  return raw
}