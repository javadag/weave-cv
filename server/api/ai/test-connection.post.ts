import { requireAuth } from "../../utils/auth"
import { createAiClient, CALL_TIMEOUT_MS } from "../../utils/ai/client"
import { getAiProvider, isCustomProvider, type AiId } from "../../utils/ai/providers"

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const body = await readBody<{
    provider: string
    apiKey: string
    model?: string
    baseUrl?: string
  }>(event)

  if (!body?.provider || !body?.apiKey?.trim()) {
    throw createError({ statusCode: 400, statusMessage: "provider and apiKey are required" })
  }

  const provider = body.provider as AiId
  const apiKey = body.apiKey.trim()
  const model = body.model?.trim() || undefined
  const baseUrl = body.baseUrl?.trim() || undefined

  // For Anthropic, use their native messages API
  if (provider === "anthropic") {
    const cfg = getAiProvider("anthropic")
    const baseURL = (baseUrl || cfg.baseURL).replace(/\/+$/, "")
    const endpoint = `${baseURL}/messages`
    const testModel = model ?? cfg.defaultModel

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15_000)

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: testModel,
          max_tokens: 5,
          messages: [{ role: "user", content: "Say hi" }]
        }),
        signal: controller.signal
      })

      if (!response.ok) {
        let errBody: Record<string, unknown> = {}
        try {
          errBody = (await response.json()) as Record<string, unknown>
        } catch {
          // fallback
        }
        const errObj = (errBody?.error ?? {}) as Record<string, unknown>
        const message = typeof errObj.message === "string" ? errObj.message : `HTTP ${response.status}`
        throw createError({ statusCode: response.status, statusMessage: message })
      }

      return { ok: true, model: testModel }
    } catch (err) {
      if ((err as { statusCode?: number }).statusCode) throw err
      throw createError({ statusCode: 422, statusMessage: (err as Error).message || "Connection failed" })
    } finally {
      clearTimeout(timeoutId)
    }
  }

  // For all OpenAI-compatible providers
  try {
    const { client, model: resolvedModel } = createAiClient({ provider, apiKey, baseUrl, model })
    const completion = await client.chat.completions.create(
      {
        model: resolvedModel,
        max_tokens: 5,
        messages: [{ role: "user", content: "Say hi" }]
      },
      { timeout: 15_000 }
    )

    const ok = !!completion.choices?.[0]?.message?.content
    return { ok, model: resolvedModel }
  } catch (err) {
    const status = (err as { status?: number }).status ?? 422
    const message = (err as Error).message || "Connection failed"
    throw createError({ statusCode: status, statusMessage: message })
  }
})
