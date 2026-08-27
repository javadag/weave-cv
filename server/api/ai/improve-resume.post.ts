import { requireAuth } from "../../utils/auth"
import {
  normalizeImproveRequest,
  mapProviderError,
  sanitizeSuggestions,
  clampMatchScore,
  toStr,
  toStrArr,
  HttpError,
  SECTION_TYPE_SET_EXPORTED
} from "../../utils/ai/improveChildren"
import { parseJsonLoose } from "../../utils/ai/json"
import { completeJson } from "../../utils/ai/client"
import { buildImproveMessages } from "../../utils/ai/prompts/improveResume"

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const req = normalizeImproveRequest(await readBody(event))

  try {
    const { system, user } = buildImproveMessages({
      jobDescription: req.jobDescription,
      language: req.language,
      honesty: req.honesty,
      entries: req.entries
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
    const suggestions = sanitizeSuggestions(parsed.suggestions, SECTION_TYPE_SET_EXPORTED)
    return {
      matchScore: clampMatchScore(parsed.matchScore),
      scoreSummary: toStr(parsed.scoreSummary),
      strengths: toStrArr(parsed.strengths),
      weaknesses: toStrArr(parsed.weaknesses),
      missingKeywords: toStrArr(parsed.missingKeywords),
      suggestions
    }
  } catch (error) {
    if (error instanceof HttpError) {
      throw createError({ statusCode: error.statusCode, statusMessage: error.message })
    }
    throw createError({ statusCode: 422, statusMessage: mapProviderError(error) })
  }
})