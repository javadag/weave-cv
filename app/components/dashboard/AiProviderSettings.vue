<script setup lang="ts">
import { AI_PROVIDERS, type AiProviderId, type AiKeyStore } from "~/services/ai/registry"

const ai = useAiProvider()

const selectedProvider = ref<AiProviderId>(ai.keys.value?.provider ?? "deepseek")
const keyInput = ref("")
const modelInput = ref(ai.keys.value?.model ?? "")
const baseUrlInput = ref(ai.keys.value?.baseUrl ?? "")

const providerOptions = AI_PROVIDERS.map((p) => ({ value: p.id, label: p.label }))
const selectedConfig = computed(() => AI_PROVIDERS.find((p) => p.id === selectedProvider.value) ?? AI_PROVIDERS[0])

const hasStoredKey = computed(() => ai.keys.value?.provider === selectedProvider.value && (ai.keys.value?.key ?? "").length > 0)
const storedOtherProvider = computed(() => ai.keys.value !== null && ai.keys.value.provider !== selectedProvider.value)

const showModel = computed(() => selectedConfig.value?.modelEditable ?? false)
const showBaseUrl = computed(() => selectedProvider.value === "openrouter" || selectedProvider.value === "custom")

const modelOptions = computed(() => {
  const config = selectedConfig.value
  if (!config) return []
  const suggested = config.defaultModel ? [config.defaultModel] : []
  if (modelInput.value && !suggested.includes(modelInput.value)) suggested.push(modelInput.value)
  return suggested
})

const customBaseUrlInvalid = computed(
  () =>
    selectedProvider.value === "custom" &&
    baseUrlInput.value.trim().length > 0 &&
    !/^https?:\/\/.+/.test(baseUrlInput.value.trim())
)

const needsNewKey = computed(() => {
  if (keyInput.value.trim()) return false
  // keep the stored key as long as the provider is unchanged and a key exists
  return !(hasStoredKey.value)
})

const canSave = computed(() => {
  if (needsNewKey.value) return false
  if (selectedProvider.value === "custom" && !baseUrlInput.value.trim()) return false
  return !customBaseUrlInvalid.value
})

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
}

function clearKeys() {
  ai.setKeys(null)
  keyInput.value = ""
  modelInput.value = AI_PROVIDERS.find((p) => p.id === selectedProvider.value)?.defaultModel ?? ""
  baseUrlInput.value = ""
}
</script>

<template>
  <UCard>
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
          :placeholder="hasStoredKey ? $t('dashboard.settings.aiKeyStored') : $t('dashboard.settings.aiKeyPlaceholder')"
        />
        <p v-if="storedOtherProvider" class="text-amber-600 dark:text-amber-400 text-xs">
          {{ $t("dashboard.settings.aiKeyProviderChanged") }}
        </p>
        <p v-else-if="hasStoredKey" class="text-green-600 dark:text-green-400 text-xs">
          {{ $t("dashboard.settings.aiKeySaved") }}
        </p>
      </div>

      <div v-if="showModel" class="flex flex-col gap-1.5">
        <label for="ai-model" class="text-default text-sm font-medium">{{ $t("dashboard.settings.aiModelLabel") }}</label>
        <USelect
          id="ai-model"
          v-model="modelInput"
          :items="modelOptions"
          :placeholder="$t('dashboard.settings.aiModelPlaceholder')"
        />
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

      <div class="flex items-center gap-2">
        <UButton color="primary" variant="solid" icon="i-lucide-save" :disabled="!canSave" @click="save">
          {{ $t("dashboard.settings.aiSave") }}
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-trash-2"
          :disabled="!ai.keys.value"
          @click="clearKeys"
        >
          {{ $t("dashboard.settings.aiClear") }}
        </UButton>
      </div>
    </div>
  </UCard>
</template>