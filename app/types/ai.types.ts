export type AiProvider = "groq" | "openai" | "deepseek" | "anthropic" | "gemini" | "mistral" | "perplexity" | "xai"

export interface ExperienceSuggestion {
  entryId: string
  entryTitle: string
  alignmentScore: number
  suggestion: string
  rationale: string
}

export interface ProjectSuggestion {
  entryId: string
  entryTitle: string
  alignmentScore: number
  suggestion: string
  rationale: string
}

export interface SkillSuggestion {
  category: string
  currentItems: string[]
  suggestedItems: string[]
  addedItems: string[]
  reason: string
}

export interface MatchResult {
  matchScore: number
  strengths: string[]
  weaknesses: string[]
  missingKeywords: string[]
  summarySuggestion: string
  experienceSuggestions: ExperienceSuggestion[]
  projectSuggestions: ProjectSuggestion[]
  skillSuggestions: SkillSuggestion[]
}
