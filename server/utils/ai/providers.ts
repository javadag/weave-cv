export type AiId =
  | "deepseek"
  | "groq"
  | "openai"
  | "anthropic"
  | "gemini"
  | "mistral"
  | "perplexity"
  | "openrouter"
  | "custom"

export type HonestyLevel = "faithful" | "balanced" | "bold"

export interface AiProviderConfig {
  id: AiId
  label: string
  baseURL: string
  defaultModel: string
  modelEditable: boolean
  baseUrlRequired?: boolean
}

export const AI_PROVIDERS: AiProviderConfig[] = [
  { id: "deepseek", label: "DeepSeek", baseURL: "https://api.deepseek.com/v1", defaultModel: "deepseek-chat", modelEditable: false },
  { id: "groq", label: "Groq", baseURL: "https://api.groq.com/openai/v1", defaultModel: "llama-3.3-70b-versatile", modelEditable: true },
  { id: "openai", label: "OpenAI", baseURL: "https://api.openai.com/v1", defaultModel: "gpt-4o-mini", modelEditable: true },
  { id: "anthropic", label: "Anthropic", baseURL: "https://api.anthropic.com/v1", defaultModel: "claude-sonnet-4-5", modelEditable: true },
  { id: "gemini", label: "Gemini", baseURL: "https://generativelanguage.googleapis.com/v1beta/openai", defaultModel: "gemini-2.0-flash", modelEditable: true },
  { id: "mistral", label: "Mistral", baseURL: "https://api.mistral.ai/v1", defaultModel: "mistral-small-latest", modelEditable: true },
  { id: "perplexity", label: "Perplexity", baseURL: "https://api.perplexity.ai", defaultModel: "sonar-pro", modelEditable: true },
  { id: "openrouter", label: "OpenRouter", baseURL: "https://openrouter.ai/api/v1", defaultModel: "deepseek/deepseek-chat", modelEditable: true },
  { id: "custom", label: "Custom (OpenAI-compatible)", baseURL: "", defaultModel: "", modelEditable: true, baseUrlRequired: true }
]

const index = new Map<AiId, AiProviderConfig>(AI_PROVIDERS.map((p) => [p.id, p]))

export function getAiProvider(id: AiId): AiProviderConfig {
  const cfg = index.get(id)
  if (!cfg) throw new Error(`Unknown provider: ${id}`)
  return cfg
}

export function isCustomProvider(id: string): boolean {
  return id === "custom"
}