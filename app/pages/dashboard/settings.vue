<script setup lang="ts">
definePageMeta({ layout: "dashboard" })

const { t, locale, locales, setLocale } = useI18n()

useHead({
  title: () => `${t("dashboard.settings.title")} - Weave CV`,
  meta: [{ name: "robots", content: "noindex, nofollow" }]
})

const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === "dark",
  set: (v: boolean) => {
    colorMode.preference = v ? "dark" : "light"
  }
})

const language = computed({
  get: () => locale.value,
  set: (val: string) => {
    setLocale(val as "en" | "fa")
  }
})

const languageOptions = computed(() =>
  (locales.value as { code: string; name: string }[]).map((l) => ({ label: l.name, value: l.code }))
)
</script>

<template>
  <div class="max-w-6xl">
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight text-default">{{ $t("dashboard.settings.title") }}</h1>
      <p class="text-muted text-sm mt-1">{{ $t("dashboard.settings.subtitle") }}</p>
    </div>

    <UCard class="mb-4">
      <template #header>
        <div>
          <h2 class="text-base font-semibold text-default">{{ $t("dashboard.settings.appearanceTitle") }}</h2>
          <p class="text-sm text-muted mt-0.5">{{ $t("dashboard.settings.appearanceSubtitle") }}</p>
        </div>
      </template>
      <ClientOnly>
        <div class="flex items-center justify-between gap-4 py-1">
          <div>
            <div class="text-sm font-semibold text-default">{{ $t("dashboard.settings.darkMode") }}</div>
            <div class="text-sm text-muted">{{ $t("dashboard.settings.darkModeDesc") }}</div>
          </div>
          <USwitch v-model="isDark" size="md" />
        </div>
        <template #fallback>
          <div class="h-10" />
        </template>
      </ClientOnly>
    </UCard>

    <UCard>
      <template #header>
        <div>
          <h2 class="text-base font-semibold text-default">{{ $t("dashboard.settings.languageTitle") }}</h2>
          <p class="text-sm text-muted mt-0.5">{{ $t("dashboard.settings.languageSubtitle") }}</p>
        </div>
      </template>
      <div class="max-w-xs flex flex-col gap-1.5">
        <label for="language-select" class="text-sm font-medium text-default">
          {{ $t("dashboard.settings.languageLabel") }}
        </label>
        <USelect id="language-select" v-model="language" :items="languageOptions" value-key="value" />
      </div>
    </UCard>
  </div>
</template>
