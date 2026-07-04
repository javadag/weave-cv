<script setup lang="ts">
import type { AiProvider } from "~/constants/aiProviders"
import { AI_PROVIDERS } from "~/constants/aiProviders"

const { t } = useI18n()
const toast = useToast()

const { provider, hasApiKey, savedProviders, setKey, removeKey, getKey, clearConfig, getProviderOptions } =
  useAiProvider()

const inputKey = ref("")
const showKey = ref(false)

watch(provider, (newVal) => {
  inputKey.value = newVal ? getKey(newVal as AiProvider) : ""
})

const providerOptions = computed(() => getProviderOptions().map((p) => ({ label: p.label, value: p.value })))

function handleSaveConfig() {
  if (!provider.value || !inputKey.value) return

  setKey(provider.value as AiProvider, inputKey.value)
  toast.add({ title: t("dashboard.settings.aiProvider.keySaved"), color: "success" })
}

function handleRemoveKey(providerToRemove: AiProvider) {
  removeKey(providerToRemove)
  if (provider.value === providerToRemove) {
    inputKey.value = ""
  }
  toast.add({ title: t("dashboard.settings.aiProvider.keyCleared"), color: "success" })
}

function handleClearAll() {
  clearConfig()
  inputKey.value = ""
  toast.add({ title: t("dashboard.settings.aiProvider.keyCleared"), color: "success" })
}

function getKeyHintUrl(providerId: string): string {
  return (AI_PROVIDERS as Record<string, { keyHintUrl: string }>)[providerId]?.keyHintUrl || ""
}
</script>

<template>
  <UCard class="mb-4">
    <template #header>
      <div>
        <h2 class="text-default text-base font-semibold">{{ $t("dashboard.settings.aiProvider.title") }}</h2>
        <p class="text-muted mt-0.5 text-sm">{{ $t("dashboard.settings.aiProvider.subtitle") }}</p>
      </div>
    </template>
    <div class="flex max-w-md flex-col gap-4">
      <div class="flex flex-col gap-1.5">
        <label for="provider-select" class="text-default text-sm font-medium">
          {{ $t("dashboard.settings.aiProvider.providerLabel") }}
        </label>
        <USelect id="provider-select" v-model="provider" :items="providerOptions" value-key="value" />
      </div>
      <div class="flex flex-col gap-1.5">
        <label for="api-key-input" class="text-default text-sm font-medium">
          {{ $t("dashboard.settings.aiProvider.keyLabel") }}
        </label>
        <div class="flex gap-2">
          <UInput
            id="api-key-input"
            v-model="inputKey"
            :type="showKey ? 'text' : 'password'"
            :placeholder="$t('dashboard.settings.aiProvider.providerHint')"
            class="flex-1"
          />
          <UButton
            variant="ghost"
            color="neutral"
            size="md"
            :icon="showKey ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            @click="showKey = !showKey"
          />
        </div>
      </div>
      <div class="flex items-center gap-3">
        <UButton color="primary" size="sm" :disabled="!provider || !inputKey" @click="handleSaveConfig">
          Save
        </UButton>
        <UButton v-if="hasApiKey" variant="ghost" color="neutral" size="sm" @click="handleClearAll">
          {{ $t("dashboard.settings.aiProvider.removeAll") }}
        </UButton>
      </div>
      <a
        v-if="provider"
        :href="getKeyHintUrl(provider)"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary text-xs hover:underline"
      >
        {{ $t("dashboard.settings.aiProvider.getKeyForProvider", { provider }) }}
      </a>
      <div v-if="savedProviders.length > 0" class="flex flex-col gap-2">
        <p class="text-default text-sm font-medium">
          {{ $t("dashboard.settings.aiProvider.savedKeys") }}
        </p>
        <div
          v-for="sp in savedProviders"
          :key="sp.provider"
          class="bg-default/5 ring-default/10 flex items-center justify-between gap-3 rounded-lg px-3 py-2 ring-1"
        >
          <div class="min-w-0 flex-1">
            <div class="text-default text-sm font-medium">{{ sp.label }}</div>
            <div class="text-muted truncate font-mono text-xs">{{ sp.maskedKey }}</div>
          </div>
          <div class="flex items-center gap-2">
            <UBadge v-if="provider === sp.provider" color="primary" variant="subtle" size="xs">
              {{ $t("dashboard.settings.aiProvider.active") }}
            </UBadge>
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              icon="i-lucide-trash-2"
              @click="handleRemoveKey(sp.provider)"
            />
          </div>
        </div>
      </div>

      <p class="text-muted text-xs">
        {{ $t("dashboard.settings.aiProvider.storedLocally") }}
      </p>
    </div>
  </UCard>
</template>
