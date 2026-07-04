import { MATCH_PROMPT } from "../../utils/ai/prompts/matchResume"
import type { AiProvider } from "../../utils/aiClient"
import { aiChatToJson } from "../../utils/aiClient"
import { requireAuth } from "../../utils/auth"
import { checkRateLimit } from "../../utils/rateLimit"

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const { resumeText, jobDescription, provider, apiKey, language } = await readBody<{
    resumeText: string
    jobDescription: string
    provider?: AiProvider
    apiKey?: string
    language?: string
  }>(event)

  if (!resumeText?.trim() || !jobDescription?.trim()) {
    throw createError({ statusCode: 400, statusMessage: "resumeText and jobDescription are required" })
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
      statusMessage: "AI matching not configured — add DEEPSEEK_API_KEY to your environment or provide an API key"
    })
  }

  const truncatedJD = jobDescription.length > 8000 ? jobDescription.slice(0, 8000) : jobDescription
  const truncatedResume = resumeText.length > 8000 ? resumeText.slice(0, 8000) : resumeText

  try {
    const result = await aiChatToJson({
      provider: effectiveProvider,
      apiKey: effectiveApiKey,
      systemPrompt: MATCH_PROMPT,
      userPrompt: `Resume:\n${truncatedResume}\n\nJob Description:\n${truncatedJD}\n\nResume Language:\n${language?.toLowerCase()}`,
      temperature: 0.2
    })
    return result
  } catch (error) {
    if ((error as { status?: number }).status === 401 || (error as { code?: string }).code === "invalid_api_key") {
      throw createError({ statusCode: 401, statusMessage: "Invalid API key" })
    }
    console.error(error)
    throw createError({ statusCode: 422, statusMessage: "Could not analyze resume — try again" })
  }
})
