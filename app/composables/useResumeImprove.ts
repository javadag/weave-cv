import { useAiProvider } from "./useAiProvider"
import { flattenEntries, buildApplyPath, appendNote } from "./useResumeAdmin"
import type { TCoreSections } from "~/utils/schemas/content.schema"

export type HonestyUiLevel = "faithful" | "balanced" | "bold"

export interface ImproveSuggestion {
  entryId: string
  field: "description" | "title"
  suggestedText: string
  rationale: string
  addedFacts: string[]
}

export interface ImproveResult {
  matchScore: number
  scoreSummary: string
  strengths: string[]
  weaknesses: string[]
  missingKeywords: string[]
  suggestions: ImproveSuggestion[]
}

interface EntryMeta {
  sectionType: string
}

function extractErrorMessage(error: unknown): string | null {
  const maybe = error as { data?: { statusMessage?: string } } | null
  const msg = maybe?.data?.statusMessage
  return typeof msg === "string" && msg ? msg : null
}

export function useResumeImprove() {
  const resumeStore = useResumeStore()
  const ai = useAiProvider()
  const { locale } = useI18n()

  const honesty = ref<HonestyUiLevel>("faithful")
  const analyzing = ref(false)
  const refiningId = ref<string | null>(null)
  const result = ref<ImproveResult | null>(null)
  const error = ref<{ key: string; detail?: string } | null>(null)
  const pendingNotes = ref<Record<string, string[]>>({})
  const applied = ref<Record<string, string>>({})
  const entryIndex = ref<Record<string, EntryMeta>>({})

  const language = computed(() => (locale.value === "fa" ? "fa" : "en"))

  function entriesFromStore(): ReturnType<typeof flattenEntries> {
    return resumeStore.core ? flattenEntries(resumeStore.core as TCoreSections) : []
  }

  function currentValue(serverItemId: string, field: "description" | "title"): string | undefined {
    const meta = entryIndex.value[serverItemId]
    if (!meta) return undefined
    const section = resumeStore.core?.[meta.sectionType]
    const entry = section?.contents?.find((c) => c.id === serverItemId)
    if (!entry) return undefined
    return (entry as unknown as Record<string, unknown>)[field] as string | undefined
  }

  const lastJobDescription = ref("")

  async function runAnalyze(jobDescription: string, selected?: HonestyUiLevel) {
    if (!ai.keys.value || (!jobDescription || jobDescription.trim().length === 0)) return
    const { provider, key, model, baseUrl } = ai.keys.value
    if (selected) honesty.value = selected
    lastJobDescription.value = jobDescription

    analyzing.value = true
    error.value = null
    try {
      const entries = entriesFromStore()
      entryIndex.value = Object.fromEntries(entries.map((e) => [e.serverId, { sectionType: e.sectionType }]))
      const res = await $fetch<ImproveResult>("/api/ai/improve-resume", {
        method: "POST",
        body: {
          jobDescription,
          honesty: honesty.value,
          language: language.value,
          provider,
          apiKey: key,
          model,
          baseUrl,
          entries
        }
      })
      result.value = res
      pendingNotes.value = {}
      applied.value = {}
    } catch (error_) {
      const detail = extractErrorMessage(error_)
      error.value = { key: "improve_failed", detail: detail ?? undefined }
    } finally {
      analyzing.value = false
    }
  }

  async function refine(serverItemId: string, noteText: string) {
    if (!ai.keys.value || !result.value) return
    const current = result.value.suggestions.find((s) => s.entryId === serverItemId)
    if (!current) return
    const notes = appendNote(pendingNotes.value[serverItemId] ?? [], noteText)
    pendingNotes.value[serverItemId] = notes
    refiningId.value = serverItemId
    try {
      const entry = entriesFromStore().find((e) => e.serverId === serverItemId)
      if (!entry) return
      const { provider, key, model, baseUrl } = ai.keys.value
      const refined = await $fetch<ImproveSuggestion>("/api/ai/refine-entry", {
        method: "POST",
        body: {
          jobDescription: lastJobDescription.value,
          honesty: honesty.value,
          language: language.value,
          provider,
          apiKey: key,
          model,
          baseUrl,
          entry,
          currentSuggestion: current,
          notes
        }
      })
      const i = result.value.suggestions.findIndex((s) => s.entryId === serverItemId)
      if (i !== -1) result.value.suggestions[i] = refined
    } catch (error_) {
      const detail = extractErrorMessage(error_)
      error.value = { key: "refine_failed", detail: detail ?? undefined }
    } finally {
      refiningId.value = null
    }
  }

  function apply(serverItemId: string, suggestion: ImproveSuggestion) {
    const prev = currentValue(serverItemId, suggestion.field)
    const meta = entryIndex.value[serverItemId]
    if (prev === undefined || !meta) return
    applied.value[serverItemId] = prev
    resumeStore.updateContent(buildApplyPath(meta.sectionType, serverItemId, suggestion.field), suggestion.suggestedText)
  }

  function undo(serverItemId: string, suggestion: ImproveSuggestion) {
    const prev = applied.value[serverItemId]
    const meta = entryIndex.value[serverItemId]
    if (prev === undefined || !meta) return
    resumeStore.updateContent(buildApplyPath(meta.sectionType, serverItemId, suggestion.field), prev)
    // remove only this entry's undo record
    applied.value = Object.fromEntries(
      Object.entries(applied.value).filter(([key]) => key !== serverItemId)
    )
  }

  function isApplied(serverItemId: string): boolean {
    return applied.value[serverItemId] !== undefined
  }

  function reset() {
    result.value = null
    error.value = null
    pendingNotes.value = {}
    applied.value = {}
    entryIndex.value = {}
    lastJobDescription.value = ""
    analyzing.value = false
    refiningId.value = null
  }

  return {
    honesty,
    analyzing,
    refiningId,
    result,
    error,
    pendingNotes,
    isApplied,
    runAnalyze,
    refine,
    apply,
    undo,
    reset
  }
}