// Match-to-job disabled — remove throw and uncomment below to re-enable
export default defineEventHandler(() => {
  throw createError({ statusCode: 503, statusMessage: "Match to Job feature is temporarily disabled" })
})

/*
import { RESUME_REWRITE_PROMPT } from "../../utils/ai/prompts/matchResume"
import type { AiProvider } from "../../utils/aiClient"
import { aiChatToJson } from "../../utils/aiClient"
import { requireAuth } from "../../utils/auth"
import { checkRateLimit } from "../../utils/rateLimit"

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const { resumeText, auditItem, provider, apiKey, language } = await readBody<{
    resumeText: string
    auditItem: {
      entryId: string | null
      section: string
      instruction: string
      targetKeywords: string[]
      reason: string
    }
    provider?: AiProvider
    apiKey?: string
    language?: string
  }>(event)

  if (!resumeText?.trim() || !auditItem) {
    throw createError({ statusCode: 400, statusMessage: "resumeText and auditItem are required" })
  }

  const isUserKey = !!(provider && apiKey)

  if (!isUserKey) {
    checkRateLimit(`ai:${user.id}`, 5, 60 * 60 * 1000)
  }

  const effectiveProvider = isUserKey ? provider! : "deepseek"
  const effectiveApiKey = isUserKey ? apiKey! : process.env.DEEPSEEK_API_KEY

  if (!effectiveApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "AI rewrite not configured — add DEEPSEEK_API_KEY to your environment or provide an API key"
    })
  }

  const truncatedResume = resumeText.length > 8000 ? resumeText.slice(0, 8000) : resumeText

  const userPrompt = [
    `Resume:\n${truncatedResume}`,
    `\nSelected Improvement Item:\n${JSON.stringify(auditItem, null, 2)}`,
    `\nResume Language:\n${language?.toLowerCase()}`
  ].join("\n")

  try {
    const result = await aiChatToJson({
      provider: effectiveProvider,
      apiKey: effectiveApiKey,
      systemPrompt: RESUME_REWRITE_PROMPT,
      userPrompt,
      temperature: 0.2
    })
    return result
  } catch (error) {
    if ((error as { status?: number }).status === 401 || (error as { code?: string }).code === "invalid_api_key") {
      throw createError({ statusCode: 401, statusMessage: "Invalid API key" })
    }
    console.error(error)
    throw createError({ statusCode: 422, statusMessage: "Could not rewrite — try again" })
  }
})
*/
