export type AiProvider = "groq" | "openai" | "deepseek" | "anthropic" | "gemini" | "mistral" | "perplexity" | "xai"

export interface GapItem {
  impact?: string
  section?: string
  explanation?: string
  suggestion?: string
  estimatedScoreGain?: number
}

export interface MissingKeywordItem {
  keyword?: string
  impact?: string
  section?: string
  explanation?: string
  suggestion?: string
  estimatedScoreGain?: number
}

export interface SummaryRecommendation {
  impact: "critical" | "high" | "medium" | "low"
  action: string
  reason: string
  suggestion: string
}

export interface SummaryAnalysis {
  alignmentScore: number
  strengths: string[]
  weaknesses: string[]
  missingKeywords: string[]
  recommendations: SummaryRecommendation[]
}

export interface ExperienceAnalysisSuggestion {
  action: string
  content: string
  reason: string
}

export interface ExperienceAnalysis {
  entryId: string
  impact: string
  matches: string[]
  gaps: string[]
  suggestions: ExperienceAnalysisSuggestion[]
}

export interface SkillSuggestion {
  category: string
  currentItems: string[]
  suggestedItems: string[]
  addedItems: string[]
  reason: string
}

export interface ScoreBreakdown {
  skillsScore: number
  experienceScore: number
  keywordsScore: number
  seniorityScore: number
  responsibilityScore: number
  atsScore: number
}

export interface MatchResult {
  overallScore: number
  scoreBreakdown: ScoreBreakdown
  strongMatches: (string | GapItem)[]
  weakMatches: (string | GapItem)[]
  criticalGaps: (string | GapItem)[]
  quickWins: GapItem[]
  missingKeywords: (string | MissingKeywordItem)[]
  experienceAnalysis: ExperienceAnalysis[]
  skillSuggestions: SkillSuggestion[]
  summaryAnalysis?: SummaryAnalysis
}

export interface MatchRewriteRequest {
  entryId: string | null
  section: "experience" | "project" | "summary" | "skills"
  instruction: string
  targetKeywords: string[]
  reason: string
}

export interface MatchRewriteResult {
  entryId: string | null
  section: string
  rewrittenContent: string
  changesApplied: string[]
  keywordsIntegrated: string[]
  reason: string
}
