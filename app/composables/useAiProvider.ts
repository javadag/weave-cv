import { buildAiKeyStore, clampKeys, type AiKeyStore } from "~/services/ai/registry"

const STORAGE_KEY = "weave-cv:ai-keys"

export function useAiProvider() {
  const keys = ref<AiKeyStore | null>(loadStoredKeys())

  function loadStoredKeys(): AiKeyStore | null {
    if (import.meta.server) return null
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      return buildAiKeyStore(JSON.parse(raw))
    } catch {
      return null
    }
  }

  function persist(v: AiKeyStore | null) {
    if (import.meta.server) return
    if (v) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clampKeys(v)))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  function setKeys(k: AiKeyStore | null) {
    keys.value = k
    persist(k)
  }

  function hasKeys(): boolean {
    return keys.value !== null && keys.value.key.trim().length > 0
  }

  return { keys, setKeys, hasKeys }
}