export type AiProviderId =
  | "deepseek"
  | "groq"
  | "openai"
  | "anthropic"
  | "gemini"
  | "mistral"
  | "perplexity"
  | "openrouter"
  | "custom"

export interface AiProviderRegistry {
  id: AiProviderId
  label: string
  baseURL: string
  defaultModel: string
  modelEditable: boolean
  baseUrlRequired?: boolean
  keyHintUrl?: string
}

export const AI_PROVIDERS: AiProviderRegistry[] = [
  { id: "deepseek", label: "DeepSeek", baseURL: "https://api.deepseek.com/v1", defaultModel: "deepseek-chat", modelEditable: false, keyHintUrl: "https://platform.deepseek.com/api_keys" },
  { id: "groq", label: "Groq", baseURL: "https://api.groq.com/openai/v1", defaultModel: "llama-3.3-70b-versatile", modelEditable: true, keyHintUrl: "https://console.groq.com/keys" },
  { id: "openai", label: "OpenAI", baseURL: "https://api.openai.com/v1", defaultModel: "gpt-4o-mini", modelEditable: true, keyHintUrl: "https://platform.openai.com/api-keys" },
  { id: "anthropic", label: "Anthropic", baseURL: "https://api.anthropic.com/v1", defaultModel: "claude-3-5-sonnet-latest", modelEditable: true, keyHintUrl: "https://console.anthropic.com/settings/keys" },
  { id: "gemini", label: "Gemini", baseURL: "https://generativelanguage.googleapis.com/v1beta/openai", defaultModel: "gemini-2.0-flash", modelEditable: true, keyHintUrl: "https://aistudio.google.com/app/apikey" },
  { id: "mistral", label: "Mistral", baseURL: "https://api.mistral.ai/v1", defaultModel: "mistral-small-latest", modelEditable: true, keyHintUrl: "https://console.mistral.ai/api-keys" },
  { id: "perplexity", label: "Perplexity", baseURL: "https://api.perplexity.ai", defaultModel: "sonar-pro", modelEditable: true, keyHintUrl: "https://www.perplexity.ai/settings/api" },
  { id: "openrouter", label: "OpenRouter", baseURL: "https://openrouter.ai/api/v1", defaultModel: "deepseek/deepseek-chat", modelEditable: true, keyHintUrl: "https://openrouter.ai/keys" },
  { id: "custom", label: "Custom (OpenAI-compatible)", baseURL: "", defaultModel: "", modelEditable: true, baseUrlRequired: true, keyHintUrl: "https://openai.com" }
]

export interface AiKeyStore {
  provider: AiProviderId
  key: string
  model?: string
  baseUrl?: string
}

export function clampKeys(k: Partial<AiKeyStore>): AiKeyStore | null {
  if (!k || typeof k.key !== "string" || !k.key.trim()) return null
  const provider = (AI_PROVIDERS.some((p) => p.id === k.provider) ? k.provider : AI_PROVIDERS[0]!.id) as AiProviderId
  return {
    provider,
    key: k.key.trim(),
    model: typeof k.model === "string" && k.model.trim() ? k.model.trim() : undefined,
    baseUrl: typeof k.baseUrl === "string" && k.baseUrl.trim() ? k.baseUrl.trim() : undefined
  }
}

export function buildAiKeyStore(data: unknown): AiKeyStore | null {
  if (!data || typeof data !== "object") return null
  return clampKeys(data as Partial<AiKeyStore>)
}