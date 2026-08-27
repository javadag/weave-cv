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

export async function completeJson(opts: CallOptions): Promise<string> {
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