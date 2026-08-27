import type { AiEntry } from "./prompts/improveResume"
import { sanitizeSuggestions, normalizeAiRequestBase, validEntry, type HistorySuggestion } from "./improveChildren"
import { jsonSize } from "./json"
import { HttpError } from "./improveChildren"

export interface RefineRequestShape {
  jobDescription: string
  honesty: "faithful" | "balanced" | "bold"
  language: string
  provider: string
  model?: string
  baseUrl?: string
  apiKey: string
  entry: AiEntry
  currentSuggestion: HistorySuggestion
  notes: string[]
}

function isHistorySuggestion(v: unknown): v is HistorySuggestion {
  if (!v || typeof v !== "object") return false
  const o = v as Record<string, unknown>
  return (
    typeof o.entryId === "string" &&
    (o.field === "description" || o.field === "title") &&
    typeof o.suggestedText === "string"
  )
}

export function normalizeRefineRequest(body: unknown): RefineRequestShape {
  const base = normalizeAiRequestBase(body)
  const b = (body ?? {}) as Record<string, unknown>

  if (!validEntry(b.entry)) {
    throw new HttpError(400, "entry is required and must be a known resume entry")
  }
  if (!isHistorySuggestion(b.currentSuggestion)) {
    throw new HttpError(400, "currentSuggestion is required")
  }
  if (b.notes !== undefined && !Array.isArray(b.notes)) {
    throw new HttpError(400, "notes must be an array of strings")
  }
  const notes = Array.isArray(b.notes)
    ? (b.notes as unknown[]).filter((n): n is string => typeof n === "string")
    : []

  if (jsonSize({ jobDescription: base.jobDescription, entry: b.entry, notes }) > 64 * 1024) {
    throw new HttpError(413, "Request body too large")
  }

  return {
    ...base,
    entry: b.entry as AiEntry,
    currentSuggestion: b.currentSuggestion as HistorySuggestion,
    notes
  }
}

export function sanitizeRefineResult(raw: unknown): HistorySuggestion | null {
  const out = sanitizeSuggestions(Array.isArray(raw) ? raw : [raw])
  return out[0] ?? null
}