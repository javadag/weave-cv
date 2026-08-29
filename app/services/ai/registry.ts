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
  /** Popular models the user can pick from in the searchable dropdown */
  models: string[]
  modelEditable: boolean
  baseUrlRequired?: boolean
  keyHintUrl?: string
}

export const AI_PROVIDERS: AiProviderRegistry[] = [
  {
    id: "deepseek",
    label: "DeepSeek",
    baseURL: "https://api.deepseek.com/v1",
    defaultModel: "deepseek-chat",
    models: ["deepseek-chat", "deepseek-reasoner"],
    modelEditable: true,
    keyHintUrl: "https://platform.deepseek.com/api_keys"
  },
  {
    id: "groq",
    label: "Groq",
    baseURL: "https://api.groq.com/openai/v1",
    defaultModel: "llama-3.3-70b-versatile",
    models: [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "gemma2-9b-it",
      "mixtral-8x7b-32768",
      "deepseek-r1-distill-llama-70b"
    ],
    modelEditable: true,
    keyHintUrl: "https://console.groq.com/keys"
  },
  {
    id: "openai",
    label: "OpenAI",
    baseURL: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-4.1", "o4-mini", "o3-mini"],
    modelEditable: true,
    keyHintUrl: "https://platform.openai.com/api-keys"
  },
  {
    id: "anthropic",
    label: "Anthropic",
    baseURL: "https://api.anthropic.com/v1",
    defaultModel: "claude-sonnet-4-20250514",
    models: [
      "claude-sonnet-4-20250514",
      "claude-3-5-sonnet-latest",
      "claude-3-5-haiku-latest",
      "claude-opus-4-20250514"
    ],
    modelEditable: true,
    keyHintUrl: "https://console.anthropic.com/settings/keys"
  },
  {
    id: "gemini",
    label: "Gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    defaultModel: "gemini-2.0-flash",
    models: ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash-lite"],
    modelEditable: true,
    keyHintUrl: "https://aistudio.google.com/app/apikey"
  },
  {
    id: "mistral",
    label: "Mistral",
    baseURL: "https://api.mistral.ai/v1",
    defaultModel: "mistral-small-latest",
    models: ["mistral-small-latest", "mistral-medium-latest", "mistral-large-latest", "open-mistral-nemo"],
    modelEditable: true,
    keyHintUrl: "https://console.mistral.ai/api-keys"
  },
  {
    id: "perplexity",
    label: "Perplexity",
    baseURL: "https://api.perplexity.ai",
    defaultModel: "sonar-pro",
    models: ["sonar-pro", "sonar", "sonar-reasoning-pro", "sonar-reasoning"],
    modelEditable: true,
    keyHintUrl: "https://www.perplexity.ai/settings/api"
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    baseURL: "https://openrouter.ai/api/v1",
    defaultModel: "deepseek/deepseek-chat",
    models: [
      "deepseek/deepseek-chat",
      "google/gemini-2.0-flash-001",
      "openai/gpt-4o-mini",
      "anthropic/claude-3.5-sonnet",
      "meta-llama/llama-3.3-70b-instruct"
    ],
    modelEditable: true,
    keyHintUrl: "https://openrouter.ai/keys"
  },
  {
    id: "custom",
    label: "Custom (OpenAI-compatible)",
    baseURL: "",
    defaultModel: "",
    models: [],
    modelEditable: true,
    baseUrlRequired: true,
    keyHintUrl: "https://openai.com"
  }
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