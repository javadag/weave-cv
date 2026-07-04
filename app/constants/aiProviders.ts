import type { AiProvider } from "~/types/ai.types"

export interface AiProviderInfo {
  id: AiProvider
  label: string
  model: string
  baseURL?: string
  keyHintUrl: string
}

export const AI_PROVIDERS: Record<AiProvider, AiProviderInfo> = {
  groq: {
    id: "groq",
    label: "Groq (Llama 3.3 70B)",
    model: "llama-3.3-70b-versatile",
    keyHintUrl: "https://console.groq.com/keys"
  },
  openai: {
    id: "openai",
    label: "OpenAI (GPT-4o)",
    model: "gpt-4o",
    keyHintUrl: "https://platform.openai.com/api-keys"
  },
  deepseek: {
    id: "deepseek",
    label: "DeepSeek (Chat)",
    model: "deepseek-chat",
    baseURL: "https://api.deepseek.com/v1",
    keyHintUrl: "https://platform.deepseek.com/api_keys"
  },
  anthropic: {
    id: "anthropic",
    label: "Anthropic (Claude 3.5 Sonnet)",
    model: "claude-3-5-sonnet-20241022",
    keyHintUrl: "https://console.anthropic.com/settings/keys"
  },
  gemini: {
    id: "gemini",
    label: "Gemini 2.5 Flash",
    model: "gemini-2.5-flash",
    keyHintUrl: "https://aistudio.google.com/app/apikey"
  },
  mistral: {
    id: "mistral",
    label: "Mistral (Large)",
    model: "mistral-large-latest",
    baseURL: "https://api.mistral.ai/v1",
    keyHintUrl: "https://console.mistral.ai/api-keys/"
  },
  perplexity: {
    id: "perplexity",
    label: "Perplexity (Sonar Pro)",
    model: "sonar-pro",
    baseURL: "https://api.perplexity.ai",
    keyHintUrl: "https://www.perplexity.ai/settings/api"
  },
  xai: {
    id: "xai",
    label: "xAI (Grok 2)",
    model: "grok-2-latest",
    baseURL: "https://api.x.ai/v1",
    keyHintUrl: "https://console.x.ai/"
  }
}

export const AI_PROVIDER_OPTIONS: { value: AiProvider; label: string }[] = Object.values(AI_PROVIDERS).map(
  ({ id, label }) => ({ value: id, label })
)

export { type AiProvider } from "~/types/ai.types"
