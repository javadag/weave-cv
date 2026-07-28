import type { MatchResult, MatchRewriteResult, SkillSuggestion } from "~/types/ai.types"
import { resumeToText } from "~/utils/ai/resumeToText"

function getScoreColor(score: number): string {
  if (score >= 70) return "text-green-500"
  if (score >= 40) return "text-amber-500"
  return "text-red-500"
}

function getScoreBarColor(score: number): string {
  if (score >= 70) return "bg-green-500"
  if (score >= 40) return "bg-amber-500"
  return "bg-red-500"
}

function normalize(s: string): string {
  return s.toLowerCase().replaceAll(/\s+/g, " ").trim()
}

const MIN_JD_LENGTH = 80
const MIN_JD_WORDS = 10

function isValidJobDescription(text: string): boolean {
  const trimmed = text.trim()
  if (trimmed.length < MIN_JD_LENGTH) return false
  const words = trimmed.split(/\s+/)
  if (words.length < MIN_JD_WORDS) return false
  const hasStructure = /[.!?\n]/.test(trimmed)
  return hasStructure
}

export function useMatchToJob() {
  const resumeStore = useResumeStore()
  const configsStore = useConfigsStore()
  const { addSection } = useEditorState()
  const toast = useToast()
  const { t } = useI18n()
  const { provider: userProvider, apiKey: userApiKey, hasApiKey } = useAiProvider()

  const currentJD = useState<string>("currentJobDescription", () => "")

  const jobDescription = ref(currentJD.value)
  const isMatching = ref(false)
  const matchResult = ref<MatchResult | null>(null)
  const matchError = ref("")
  const isRewriting = ref<Record<string, boolean>>({})
  const rewriteResults = ref<Record<string, MatchRewriteResult>>({})

  function getResumeText(): string {
    return resumeToText(resumeStore.personal, resumeStore.core)
  }

  function getResumeLanguage(): string {
    return configsStore.configs?.general?.layout?.language ?? "en"
  }

  async function handleMatch() {
    if (!jobDescription.value.trim()) return
    if (!isValidJobDescription(jobDescription.value)) {
      matchError.value = t("editor.matchToJob.invalidJDError")
      return
    }
    isMatching.value = true
    matchError.value = ""
    matchResult.value = null
    rewriteResults.value = {}
    isRewriting.value = {}
    currentJD.value = jobDescription.value

    try {
      const result = await $fetch<MatchResult>("/api/ai/match-resume", {
        method: "POST",
        body: {
          resumeText: getResumeText(),
          jobDescription: jobDescription.value,
          language: getResumeLanguage(),
          provider: userProvider.value || undefined,
          apiKey: userApiKey.value || undefined
        }
      })
      matchResult.value = result
    } catch (error: unknown) {
      const err = error as { statusCode?: number; statusMessage?: string }
      if (err.statusCode === 429) {
        matchError.value = t("editor.matchToJob.rateLimitError")
      } else if (err.statusCode === 401) {
        matchError.value = t("editor.matchToJob.invalidKeyError")
      } else {
        matchError.value = t("editor.matchToJob.unexpectedError")
      }
    } finally {
      isMatching.value = false
    }
  }

  async function handleRewrite(index: number) {
    const result = matchResult.value
    if (!result) return

    const entry = result.experienceAnalysis[index]
    if (!entry) return

    const key = `experience-${index}`
    isRewriting.value[key] = true

    try {
      const gapsText = entry.gaps.join("; ")
      const suggestionsText = entry.suggestions.map((s) => `${s.action}: ${s.content}`).join("; ")
      const instruction = `${gapsText} | ${suggestionsText}`

      const rewriteResult = await $fetch<MatchRewriteResult>("/api/ai/match-rewrite", {
        method: "POST",
        body: {
          resumeText: getResumeText(),
          auditItem: {
            entryId: entry.entryId,
            section: "experience",
            instruction,
            targetKeywords: result.missingKeywords ?? [],
            reason: instruction
          },
          language: getResumeLanguage(),
          provider: userProvider.value || undefined,
          apiKey: userApiKey.value || undefined
        }
      })

      rewriteResults.value[key] = rewriteResult
    } catch (error: unknown) {
      const err = error as { statusCode?: number; statusMessage?: string }
      if (err.statusCode === 429) {
        matchError.value = t("editor.matchToJob.rateLimitError")
      } else if (err.statusCode === 401) {
        matchError.value = t("editor.matchToJob.invalidKeyError")
      } else {
        matchError.value = t("editor.matchToJob.unexpectedError")
      }
    } finally {
      isRewriting.value[key] = false
    }
  }

  async function handleRewriteSummary() {
    const result = matchResult.value
    if (!result?.summaryAnalysis) return

    const key = "summary"
    isRewriting.value[key] = true

    try {
      const recommendationsText = result.summaryAnalysis.recommendations
        .map((r) => `${r.action}: ${r.suggestion}`)
        .join("; ")
      const instruction = `Weaknesses: ${result.summaryAnalysis.weaknesses.join("; ")} | Recommendations: ${recommendationsText}`

      const rewriteResult = await $fetch<MatchRewriteResult>("/api/ai/match-rewrite", {
        method: "POST",
        body: {
          resumeText: getResumeText(),
          auditItem: {
            entryId: null,
            section: "summary",
            instruction,
            targetKeywords: result.summaryAnalysis.missingKeywords ?? [],
            reason: instruction
          },
          language: getResumeLanguage(),
          provider: userProvider.value || undefined,
          apiKey: userApiKey.value || undefined
        }
      })

      rewriteResults.value[key] = rewriteResult
    } catch (error: unknown) {
      const err = error as { statusCode?: number; statusMessage?: string }
      if (err.statusCode === 429) {
        matchError.value = t("editor.matchToJob.rateLimitError")
      } else if (err.statusCode === 401) {
        matchError.value = t("editor.matchToJob.invalidKeyError")
      } else {
        matchError.value = t("editor.matchToJob.unexpectedError")
      }
    } finally {
      isRewriting.value[key] = false
    }
  }

  function findSectionOfType(
    type: string
  ): { sectionKey: string; section: NonNullable<typeof resumeStore.core>[string] } | null {
    const core = resumeStore.core
    if (!core) return null
    for (const [key, section] of Object.entries(core)) {
      if (section.type === type) return { sectionKey: key, section }
    }
    return null
  }

  function findEntryById(
    section: NonNullable<typeof resumeStore.core>[string],
    entryId: string
  ): { index: number; id: string } | null {
    const entries = section.contents
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      if (entry && "id" in entry && entry.id === entryId) {
        return { index: i, id: entry.id }
      }
    }
    return null
  }

  function applyExperienceRewrite(index: number) {
    const result = matchResult.value
    if (!result) return
    const entry = result.experienceAnalysis[index]
    if (!entry) return

    const rewriteKey = `experience-${index}`
    const rewrite = rewriteResults.value[rewriteKey]
    if (!rewrite?.rewrittenContent) return

    const found = findSectionOfType("experiences")
    if (!found) {
      toast.add({ title: t("editor.matchToJob.sectionNotFound"), color: "warning" })
      return
    }
    const match = findEntryById(found.section, entry.entryId)
    if (!match) {
      toast.add({ title: t("editor.matchToJob.entryNotFound"), color: "warning" })
      return
    }
    resumeStore.updateContent(`${found.sectionKey}.contents.${match.id}.description`, rewrite.rewrittenContent)
    toast.add({ title: t("editor.matchToJob.suggestionApplied"), color: "success" })
  }

  function applySummaryRewrite() {
    const rewrite = rewriteResults.value["summary"]
    if (!rewrite?.rewrittenContent) return

    const found = findSectionOfType("summary")
    if (!found) {
      addSection("summary")
      toast.add({
        title: t("editor.matchToJob.summaryApplied"),
        color: "success"
      })
      return
    }
    const contents = found.section.contents
    if (contents.length === 0) return
    resumeStore.updateContent(`${found.sectionKey}.contents.${contents[0]!.id}.description`, rewrite.rewrittenContent)
    toast.add({ title: t("editor.matchToJob.summaryApplied"), color: "success" })
  }

  function applySkillSuggestion(suggestion: SkillSuggestion) {
    const found = findSectionOfType("skills")
    const items = suggestion.suggestedItems.join(", ")

    if (!found) {
      const id = crypto.randomUUID()
      const sectionKey = `skills-${crypto.randomUUID()}`
      resumeStore.$patch((state) => {
        state.core = {
          ...state.core,
          [sectionKey]: {
            type: "skills" as const,
            title: "Skills",
            isTitleVisible: true,
            isSectionVisible: true,
            contents: [{ id, isHidden: false, title: suggestion.category, description: `<p>${items}</p>` }]
          }
        }
      })
      const left = [...configsStore.configs.general.layout.order.twoCol.left, sectionKey]
      configsStore.updateOrder("twoCol", { left, right: configsStore.configs.general.layout.order.twoCol.right })
      toast.add({ title: t("editor.matchToJob.skillsAdded"), color: "success" })
      return
    }

    const contents = found.section.contents

    for (const entry of contents) {
      if (!entry || !("title" in entry)) continue
      if (normalize(entry.title) === normalize(suggestion.category)) {
        const existing = (entry.description as string) || ""
        const added = suggestion.addedItems.join(", ")
        const merged = existing.replace(/<\/p>$/, `, ${added}</p>`)
        resumeStore.updateContent(`${found.sectionKey}.contents.${entry.id}.description`, merged)
        toast.add({ title: t("editor.matchToJob.skillsAdded"), color: "success" })
        return
      }
    }

    const id = crypto.randomUUID()
    resumeStore.updateContent(`${found.sectionKey}.contents`, [
      ...contents,
      { id, isHidden: false, title: suggestion.category, description: `<p>${items}</p>` }
    ])
    toast.add({ title: t("editor.matchToJob.skillsAdded"), color: "success" })
  }

  const existingSummary = computed(() => {
    const found = findSectionOfType("summary")
    if (!found) return null
    const contents = found.section.contents
    if (contents.length === 0) return null
    return (contents[0] as { description?: string }).description || ""
  })

  const existingExperiences = computed(() => {
    if (!matchResult.value) return {} as Record<number, string>
    const found = findSectionOfType("experiences")
    if (!found) return {} as Record<number, string>

    const result: Record<number, string> = {}
    for (const [index, entry] of matchResult.value.experienceAnalysis.entries()) {
      const match = findEntryById(found.section, entry.entryId)
      if (!match) continue
      const content = found.section.contents[match.index]
      if (content && "description" in content) {
        result[index] = (content as { description?: string }).description || ""
      }
    }
    return result
  })

  function reset() {
    jobDescription.value = ""
    matchResult.value = null
    matchError.value = ""
    rewriteResults.value = {}
    isRewriting.value = {}
  }

  return {
    jobDescription,
    isMatching,
    matchResult,
    matchError,
    isRewriting,
    rewriteResults,
    existingSummary,
    existingExperiences,
    handleMatch,
    handleRewrite,
    handleRewriteSummary,
    applySummaryRewrite,
    applyExperienceRewrite,
    applySkillSuggestion,
    reset,
    getScoreColor,
    getScoreBarColor,
    hasApiKey
  }
}
