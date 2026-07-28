import type { AiProvider } from "~/constants/aiProviders"
import { AI_PROVIDERS, AI_PROVIDER_OPTIONS } from "~/constants/aiProviders"

const STORAGE_KEY = "weave-cv:ai-keys"

export function useAiProvider() {
  const storedKeys = ref<Record<string, string>>(loadStoredKeys())

  function loadStoredKeys(): Record<string, string> {
    if (import.meta.client) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw) as Record<string, string>
      } catch {
        // corrupted storage, reset
      }
    }
    return {}
  }

  function persistKeys() {
    if (import.meta.client) {
      const filtered: Record<string, string> = {}
      for (const [k, v] of Object.entries(storedKeys.value)) {
        if (v) filtered[k] = v
      }
      if (Object.keys(filtered).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  const activeProvider = ref<AiProvider>(getFirstStoredProvider())

  function getFirstStoredProvider(): AiProvider {
    const keys = Object.keys(storedKeys.value)
    return keys.length > 0 ? (keys[0] as AiProvider) : "deepseek"
  }

  function getProviderLabel(provider: AiProvider): string {
    return AI_PROVIDERS[provider]?.label ?? provider
  }

  const apiKey = computed(() => (activeProvider.value ? storedKeys.value[activeProvider.value] || "" : ""))

  const savedProviders = computed(() =>
    (Object.entries(storedKeys.value) as [AiProvider, string][])
      .filter(([, key]) => key.length > 0)
      .map(([provider, key]) => ({
        provider,
        label: getProviderLabel(provider),
        key,
        maskedKey: maskKey(key)
      }))
  )

  const hasApiKey = computed(() => savedProviders.value.length > 0)

  const isUserProviderEnabled = computed(() => hasApiKey.value)

  function setKey(provider: AiProvider, apiKey: string) {
    storedKeys.value = { ...storedKeys.value, [provider]: apiKey }
    if (!activeProvider.value) {
      activeProvider.value = provider
    }
    persistKeys()
  }

  function removeKey(provider: AiProvider) {
    const next = { ...storedKeys.value }
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete next[provider]
    storedKeys.value = next
    if (activeProvider.value === provider) {
      activeProvider.value = getFirstStoredProvider()
    }
    persistKeys()
  }

  function getKey(provider: AiProvider): string {
    return storedKeys.value[provider] || ""
  }

  function setConfig(provider: AiProvider | "", apiKey: string) {
    if (provider && apiKey) {
      setKey(provider, apiKey)
    }
  }

  function clearConfig() {
    storedKeys.value = {}
    activeProvider.value = "deepseek"
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return {
    provider: activeProvider,
    apiKey,
    hasApiKey,
    isUserProviderEnabled,
    savedProviders,
    setKey,
    removeKey,
    getKey,
    setConfig,
    clearConfig,
    getProviderOptions: () => AI_PROVIDER_OPTIONS
  }
}

function maskKey(key: string): string {
  if (key.length <= 8) return "*".repeat(key.length)
  return key.slice(0, 4) + "*".repeat(key.length - 8) + key.slice(-4)
}

export { type AiProvider } from "~/constants/aiProviders"
