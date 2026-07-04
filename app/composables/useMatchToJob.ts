import type { MatchResult, SkillSuggestion } from "~/types/ai.types"
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
  const toast = useToast()
  const { t } = useI18n()
  const { provider: userProvider, apiKey: userApiKey, hasApiKey } = useAiProvider()

  const currentJD = useState<string>("currentJobDescription", () => "")

  const jobDescription = ref(currentJD.value)
  const isMatching = ref(false)
  const matchResult = ref<MatchResult | null>(null)
  const matchError = ref("")
  const tailoringIndex = ref<number | null>(null)
  const refinedSuggestions = ref<Record<number, string>>({})

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
    refinedSuggestions.value = {}
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

  function applySummarySuggestion() {
    if (!matchResult.value?.summarySuggestion) return
    const found = findSectionOfType("summary")
    if (!found) {
      resumeStore.addSection("summary")
      toast.add({
        title: t("editor.matchToJob.noSummaryTitle"),
        description: t("editor.matchToJob.noSummaryDesc"),
        color: "warning"
      })
      return
    }
    const contents = found.section.contents
    if (contents.length === 0) return
    resumeStore.updateContent(
      `${found.sectionKey}.contents.${contents[0]!.id}.description`,
      matchResult.value.summarySuggestion
    )
    toast.add({ title: t("editor.matchToJob.summaryApplied"), color: "success" })
  }

  function applyExperienceSuggestion(index: number) {
    const result = matchResult.value
    if (!result) return
    const suggestion = result.experienceSuggestions[index]
    if (!suggestion) return

    const found = findSectionOfType("experiences")
    if (!found) {
      toast.add({ title: t("editor.matchToJob.sectionNotFound"), color: "warning" })
      return
    }
    const match = findEntryById(found.section, suggestion.entryId)
    if (!match) {
      toast.add({ title: t("editor.matchToJob.entryNotFound"), color: "warning" })
      return
    }
    const html = refinedSuggestions.value[index] || suggestion.suggestion
    resumeStore.updateContent(`${found.sectionKey}.contents.${match.id}.description`, html)
    toast.add({ title: t("editor.matchToJob.suggestionApplied"), color: "success" })
  }

  function applyProjectSuggestion(index: number) {
    const result = matchResult.value
    if (!result) return
    const suggestion = result.projectSuggestions[index]
    if (!suggestion) return

    const found = findSectionOfType("projects")
    if (!found) {
      toast.add({ title: t("editor.matchToJob.sectionNotFound"), color: "warning" })
      return
    }
    const match = findEntryById(found.section, suggestion.entryId)
    if (!match) {
      toast.add({ title: t("editor.matchToJob.entryNotFound"), color: "warning" })
      return
    }
    const html = refinedSuggestions.value[index] || suggestion.suggestion
    resumeStore.updateContent(`${found.sectionKey}.contents.${match.id}.description`, html)
    toast.add({ title: t("editor.matchToJob.suggestionApplied"), color: "success" })
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
        resumeStore.updateContent(`${found.sectionKey}.contents.${entry.id}.description`, `<p>${items}</p>`)
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
    for (const [index, suggestion] of matchResult.value.experienceSuggestions.entries()) {
      const match = findEntryById(found.section, suggestion.entryId)
      if (!match) continue
      const entry = found.section.contents[match.index]
      if (entry && "description" in entry) {
        result[index] = (entry as { description?: string }).description || ""
      }
    }
    return result
  })

  const existingProjects = computed(() => {
    if (!matchResult.value) return {} as Record<number, string>
    const found = findSectionOfType("projects")
    if (!found) return {} as Record<number, string>

    const result: Record<number, string> = {}
    for (const [index, suggestion] of matchResult.value.projectSuggestions.entries()) {
      const match = findEntryById(found.section, suggestion.entryId)
      if (!match) continue
      const entry = found.section.contents[match.index]
      if (entry && "description" in entry) {
        result[index] = (entry as { description?: string }).description || ""
      }
    }
    return result
  })

  function reset() {
    jobDescription.value = ""
    matchResult.value = null
    matchError.value = ""
    refinedSuggestions.value = {}
  }

  return {
    jobDescription,
    isMatching,
    matchResult,
    matchError,
    tailoringIndex,
    refinedSuggestions,
    existingSummary,
    existingExperiences,
    existingProjects,
    handleMatch,
    applySummarySuggestion,
    applyExperienceSuggestion,
    applyProjectSuggestion,
    applySkillSuggestion,
    reset,
    getScoreColor,
    getScoreBarColor,
    hasApiKey
  }
}
