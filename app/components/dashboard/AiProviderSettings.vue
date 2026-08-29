<script setup lang="ts">
import { AI_PROVIDERS, type AiProviderId, type AiKeyStore } from "~/services/ai/registry"

const { t } = useI18n()
const toast = useToast()
const ai = useAiProvider()

const selectedProvider = ref<AiProviderId>(ai.keys.value?.provider ?? "deepseek")
const keyInput = ref("")
const modelInput = ref(ai.keys.value?.model ?? "")
const baseUrlInput = ref(ai.keys.value?.baseUrl ?? "")

const providerOptions = AI_PROVIDERS.map((p) => ({ value: p.id, label: p.label }))
const selectedConfig = computed(() => AI_PROVIDERS.find((p) => p.id === selectedProvider.value) ?? AI_PROVIDERS[0])

const hasStoredKey = computed(() => ai.keys.value?.provider === selectedProvider.value && (ai.keys.value?.key ?? "").length > 0)
const storedOtherProvider = computed(() => ai.keys.value !== null && ai.keys.value.provider !== selectedProvider.value)

const maskedKey = computed(() => {
  if (!hasStoredKey.value) return ""
  const key = ai.keys.value?.key ?? ""
  if (key.length <= 8) return "••••••••"
  return `${key.slice(0, 4)}${'•'.repeat(Math.min(key.length - 8, 16))}${key.slice(-4)}`
})

const showModel = computed(() => selectedConfig.value?.modelEditable ?? false)
const showBaseUrl = computed(() => selectedProvider.value === "openrouter" || selectedProvider.value === "custom")

const modelOptions = computed(() => {
  const config = selectedConfig.value
  if (!config) return []
  // Start with the provider's curated model list
  const models = [...config.models]
  // If the user typed a custom model name not in the list, include it
  if (modelInput.value && !models.includes(modelInput.value)) {
    models.push(modelInput.value)
  }
  return models
})

const customBaseUrlInvalid = computed(
  () =>
    selectedProvider.value === "custom" &&
    baseUrlInput.value.trim().length > 0 &&
    !/^https?:\/\/.+/.test(baseUrlInput.value.trim())
)

const needsNewKey = computed(() => {
  if (keyInput.value.trim()) return false
  return !hasStoredKey.value
})

const canSave = computed(() => {
  if (needsNewKey.value) return false
  if (selectedProvider.value === "custom" && !baseUrlInput.value.trim()) return false
  return !customBaseUrlInvalid.value
})

// ── Test Connection ──────────────────────────────────────────
const testing = ref(false)
const testResult = ref<{ ok: boolean; message?: string } | null>(null)

async function testConnection() {
  const config = selectedConfig.value
  if (!config) return

  const key = keyInput.value.trim() || (hasStoredKey.value ? (ai.keys.value?.key ?? "") : "")
  if (!key) return

  testing.value = true
  testResult.value = null

  try {
    await $fetch("/api/ai/test-connection", {
      method: "POST",
      body: {
        provider: selectedProvider.value,
        apiKey: key,
        model: showModel.value && modelInput.value.trim() ? modelInput.value.trim() : config.defaultModel,
        baseUrl: showBaseUrl.value ? baseUrlInput.value.trim() : config.baseURL
      }
    })
    testResult.value = { ok: true }
    toast.add({
      title: t("dashboard.settings.aiTestSuccess"),
      color: "success",
      icon: "i-lucide-check-circle"
    })
  } catch (err) {
    const detail = (err as { data?: { statusMessage?: string } })?.data?.statusMessage
    testResult.value = { ok: false, message: detail || t("dashboard.settings.aiTestFailed") }
    toast.add({
      title: t("dashboard.settings.aiTestFailed"),
      description: detail || undefined,
      color: "error",
      icon: "i-lucide-x-circle"
    })
  } finally {
    testing.value = false
  }
}

const canTest = computed(() => {
  const key = keyInput.value.trim() || (hasStoredKey.value ? (ai.keys.value?.key ?? "") : "")
  if (!key) return false
  if (selectedProvider.value === "custom" && !baseUrlInput.value.trim()) return false
  return !customBaseUrlInvalid.value
})

// ── Save / Clear ─────────────────────────────────────────────
function save() {
  const config = selectedConfig.value
  if (!config || !canSave.value) return
  const key = keyInput.value.trim() || (hasStoredKey.value ? (ai.keys.value?.key ?? "") : "")
  const store: AiKeyStore = {
    provider: selectedProvider.value,
    key,
    model: showModel.value && modelInput.value.trim() ? modelInput.value.trim() : config.defaultModel,
    baseUrl: showBaseUrl.value ? baseUrlInput.value.trim() : config.baseURL
  }
  ai.setKeys(store)
  keyInput.value = ""
  testResult.value = null
}

function clearKeys() {
  ai.setKeys(null)
  keyInput.value = ""
  modelInput.value = AI_PROVIDERS.find((p) => p.id === selectedProvider.value)?.defaultModel ?? ""
  baseUrlInput.value = ""
  testResult.value = null
}

// Reset model & base URL when provider changes
watch(selectedProvider, (newId) => {
  const config = AI_PROVIDERS.find((p) => p.id === newId)
  modelInput.value = config?.defaultModel ?? ""
  baseUrlInput.value = ""
  testResult.value = null
})
</script>

<template>
  <UCard class="mt-4">
    <template #header>
      <div>
        <h2 class="text-default text-base font-semibold">{{ $t("dashboard.settings.aiKeyTitle") }}</h2>
        <p class="text-muted mt-0.5 text-sm">{{ $t("dashboard.settings.aiKeySubtitle") }}</p>
      </div>
    </template>

    <div class="grid max-w-2xl gap-4">
      <div class="flex flex-col gap-1.5">
        <label for="ai-provider" class="text-default text-sm font-medium">{{ $t("dashboard.settings.aiProviderLabel") }}</label>
        <USelect
          id="ai-provider"
          v-model="selectedProvider"
          :items="providerOptions"
          value-key="value"
          label-key="label"
        />
        <a
          v-if="selectedConfig?.keyHintUrl"
          :href="selectedConfig.keyHintUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted hover:text-primary mt-0.5 inline-flex items-center gap-1 text-xs"
        >
          <UIcon name="i-lucide-external-link" class="size-3" />
          {{ $t("dashboard.settings.aiGetKey") }}
        </a>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="ai-key" class="text-default text-sm font-medium">{{ $t("dashboard.settings.aiKeyLabel") }}</label>
        <UInput
          id="ai-key"
          v-model="keyInput"
          type="password"
          autocomplete="off"
          :placeholder="hasStoredKey ? maskedKey : $t('dashboard.settings.aiKeyPlaceholder')"
        />
        <p v-if="storedOtherProvider" class="text-amber-600 dark:text-amber-400 text-xs">
          {{ $t("dashboard.settings.aiKeyProviderChanged") }}
        </p>
        <p v-else-if="hasStoredKey" class="text-green-600 dark:text-green-400 text-xs">
          {{ $t("dashboard.settings.aiKeySaved") }} · <span class="font-mono">{{ maskedKey }}</span>
        </p>
      </div>

      <div v-if="showModel" class="flex flex-col gap-1.5">
        <label for="ai-model" class="text-default text-sm font-medium">{{ $t("dashboard.settings.aiModelLabel") }}</label>
        <UInput
          id="ai-model"
          v-model="modelInput"
          :placeholder="$t('dashboard.settings.aiModelPlaceholder')"
          autocomplete="off"
        />
        <div v-if="selectedConfig?.models?.length" class="flex flex-wrap gap-1.5">
          <button
            v-for="m in selectedConfig.models"
            :key="m"
            type="button"
            class="rounded-md border px-2 py-0.5 text-xs transition-colors"
            :class="modelInput === m
              ? 'border-primary bg-primary/10 text-primary font-medium'
              : 'border-muted text-muted hover:border-default hover:text-default'"
            @click="modelInput = m"
          >
            {{ m }}
          </button>
        </div>
        <p class="text-muted text-xs">{{ $t("dashboard.settings.aiModelHint") }}</p>
      </div>

      <div v-if="showBaseUrl" class="flex flex-col gap-1.5">
        <label for="ai-base-url" class="text-default text-sm font-medium">{{ $t("dashboard.settings.aiBaseUrlLabel") }}</label>
        <UInput
          id="ai-base-url"
          v-model="baseUrlInput"
          :placeholder="selectedProvider === 'custom' ? 'https://…' : $t('dashboard.settings.aiBaseUrlPlaceholder')"
        />
        <p v-if="customBaseUrlInvalid" class="text-red-500 text-xs">{{ $t("dashboard.settings.aiBaseUrlInvalid") }}</p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <UButton color="primary" variant="solid" icon="i-lucide-save" :disabled="!canSave" @click="save">
          {{ $t("dashboard.settings.aiSave") }}
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-wifi"
          :loading="testing"
          :disabled="!canTest || testing"
          @click="testConnection"
        >
          {{ $t("dashboard.settings.aiTestConnection") }}
        </UButton>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-trash-2"
          :disabled="!ai.keys.value"
          @click="clearKeys"
        >
          {{ $t("dashboard.settings.aiClear") }}
        </UButton>
      </div>

      <!-- Test result inline feedback -->
      <div v-if="testResult" class="flex items-start gap-2 rounded-md p-2" :class="testResult.ok ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30'">
        <UIcon
          :name="testResult.ok ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
          :class="testResult.ok ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
          class="mt-0.5 size-4 shrink-0"
        />
        <p class="text-sm" :class="testResult.ok ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
          {{ testResult.ok ? $t("dashboard.settings.aiTestSuccess") : testResult.message }}
        </p>
      </div>
    </div>
  </UCard>
</template>