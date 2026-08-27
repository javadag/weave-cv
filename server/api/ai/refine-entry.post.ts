import { requireAuth } from "../../utils/auth"
import { mapProviderError, HttpError } from "../../utils/ai/improveChildren"
import { normalizeRefineRequest, sanitizeRefineResult } from "../../utils/ai/refineChildren"
import { parseJsonLoose } from "../../utils/ai/json"
import { completeJson } from "../../utils/ai/client"
import { buildRefineMessages } from "../../utils/ai/prompts/refineEntry"

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const req = normalizeRefineRequest(await readBody(event))

  try {
    const { system, user } = buildRefineMessages({
      jobDescription: req.jobDescription,
      language: req.language,
      honesty: req.honesty,
      entry: req.entry,
      currentSuggestion: req.currentSuggestion,
      notes: req.notes
    })
    const raw = await completeJson({
      provider: req.provider,
      apiKey: req.apiKey,
      baseUrl: req.baseUrl,
      model: req.model,
      system,
      user
    })
    const parsed = parseJsonLoose<Record<string, unknown>>(raw)
    const suggestion = sanitizeRefineResult(parsed)
    if (!suggestion) {
      throw createError({ statusCode: 422, statusMessage: "The model returned an invalid suggestion. Try again." })
    }
    return suggestion
  } catch (error) {
    if (error instanceof HttpError) {
      throw createError({ statusCode: error.statusCode, statusMessage: error.message })
    }
    throw createError({ statusCode: 422, statusMessage: mapProviderError(error) })
  }
})