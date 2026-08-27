import type { AiEntry } from "./prompts/improveResume"
import type { AiId, HonestyLevel } from "./providers"
import { assertCustomBaseUrl, jsonSize } from "./json"

export class HttpError extends Error {
  statusCode: number
  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export interface ImproveRequestShape {
  jobDescription: string
  honesty: HonestyLevel
  language: string
  provider: AiId
  model?: string
  baseUrl?: string
  apiKey: string
  entries: AiEntry[]
}

export interface HistorySuggestion {
  entryId: string
  field: "description" | "title"
  suggestedText: string
  rationale: string
  addedFacts: string[]
}

export const SECTION_TYPE_SET_EXPORTED: ReadonlySet<string> = new Set([
  "summary",
  "experiences",
  "projects",
  "educations",
  "skills",
  "languages",
  "certificates",
  "courses",
  "awards",
  "custom"
])

const PROVIDER_IDS = [
  "deepseek", "groq", "openai", "anthropic", "gemini",
  "mistral", "perplexity", "openrouter", "custom"
] as const

const HONESTY_LEVELS = ["faithful", "balanced", "bold"] as const

export function isProviderId(v: string): v is AiId {
  return (PROVIDER_IDS as readonly string[]).includes(v)
}

export function validEntry(e: unknown): e is AiEntry {
  if (!e || typeof e !== "object") return false
  const o = e as Record<string, unknown>
  return (
    typeof o.serverId === "string" &&
    typeof o.sectionType === "string" &&
    SECTION_TYPE_SET_EXPORTED.has(o.sectionType)
  )
}

export interface AiRequestBase {
  jobDescription: string
  honesty: HonestyLevel
  language: string
  provider: AiId
  model?: string
  baseUrl?: string
  apiKey: string
}

export function normalizeAiRequestBase(body: unknown): AiRequestBase {
  const b = (body ?? {}) as Record<string, unknown>
  if (typeof b.jobDescription !== "string" || b.jobDescription.trim().length === 0) {
    throw new HttpError(400, "jobDescription is required")
  }
  const provider = String(b.provider ?? "")
  if (!isProviderId(provider)) {
    throw new HttpError(400, `Unknown provider: ${provider}`)
  }
  const honesty = b.honesty as HonestyLevel
  if (!(HONESTY_LEVELS as readonly string[]).includes(honesty)) {
    throw new HttpError(400, "invalid honesty level")
  }
  const language = typeof b.language === "string" && b.language ? b.language : "en"
  const baseUrl = typeof b.baseUrl === "string" ? b.baseUrl : undefined
  if (provider === "custom") {
    if (!baseUrl || !assertCustomBaseUrl(baseUrl)) {
      throw new HttpError(400, "custom provider requires an https baseUrl")
    }
  }
  const apiKey = typeof b.apiKey === "string" ? b.apiKey : ""
  if (!apiKey.trim()) {
    throw new HttpError(400, "apiKey is required")
  }
  return {
    jobDescription: b.jobDescription,
    honesty,
    language,
    provider: provider as AiId,
    model: typeof b.model === "string" && b.model ? b.model : undefined,
    baseUrl,
    apiKey
  }
}

export function normalizeImproveRequest(body: unknown): ImproveRequestShape {
  const base = normalizeAiRequestBase(body)
  const b = (body ?? {}) as Record<string, unknown>
  const entries = (Array.isArray(b.entries) ? b.entries : []).filter(validEntry)
  if (jsonSize({ jobDescription: base.jobDescription, entries }) > 64 * 1024) {
    throw new HttpError(413, "Request body too large")
  }
  return { ...base, entries }
}

export function sanitizeSuggestions(raw: unknown, knownSections?: ReadonlySet<string>): HistorySuggestion[] {
  if (!Array.isArray(raw)) return []
  const out: HistorySuggestion[] = []
  for (const s of raw) {
    if (!s || typeof s !== "object") continue
    const o = s as Record<string, unknown>
    if (typeof o.entryId !== "string" || !o.entryId.trim()) continue
    if (o.field !== "description" && o.field !== "title") continue
    const suggestedText = typeof o.suggestedText === "string" ? o.suggestedText : ""
    if (!suggestedText.trim()) continue
    if (knownSections && o.sectionType !== undefined && (typeof o.sectionType !== "string" || !knownSections.has(o.sectionType))) continue
    out.push({
      entryId: o.entryId,
      field: o.field,
      suggestedText,
      rationale: typeof o.rationale === "string" ? o.rationale : "",
      addedFacts: Array.isArray(o.addedFacts) ? o.addedFacts.map((f) => (typeof f === "string" ? f : String(f))) : []
    })
  }
  return out
}

export function mapProviderError(error: unknown): string {
  const err = (error ?? {}) as Record<string, unknown>
  const status = err.status as number | undefined
  if (status === 401 || status === 403) {
    return "Your provider rejected the API key or credits. Open dashboard settings to fix it."
  }
  if (status === 429) {
    return "Your provider rate-limited this request. Try again shortly."
  }
  return "The AI provider failed. Please try again."
}