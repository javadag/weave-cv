<script setup lang="ts">
definePageMeta({ layout: "dashboard" })

const { t, locale, locales, setLocale } = useI18n()

useHead({
  title: () => t("seo.dashboardSettings.title"),
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
      <h1 class="text-default text-2xl font-bold tracking-tight">{{ $t("dashboard.settings.title") }}</h1>
      <p class="text-muted mt-1 text-sm">{{ $t("dashboard.settings.subtitle") }}</p>
    </div>

    <UCard class="mb-4">
      <template #header>
        <div>
          <h2 class="text-default text-base font-semibold">{{ $t("dashboard.settings.appearanceTitle") }}</h2>
          <p class="text-muted mt-0.5 text-sm">{{ $t("dashboard.settings.appearanceSubtitle") }}</p>
        </div>
      </template>
      <ClientOnly>
        <div class="flex items-center justify-between gap-4 py-1">
          <div>
            <div class="text-default text-sm font-semibold">{{ $t("dashboard.settings.darkMode") }}</div>
            <div class="text-muted text-sm">{{ $t("dashboard.settings.darkModeDesc") }}</div>
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
          <h2 class="text-default text-base font-semibold">{{ $t("dashboard.settings.languageTitle") }}</h2>
          <p class="text-muted mt-0.5 text-sm">{{ $t("dashboard.settings.languageSubtitle") }}</p>
        </div>
      </template>
      <div class="flex max-w-xs flex-col gap-1.5">
        <label for="language-select" class="text-default text-sm font-medium">
          {{ $t("dashboard.settings.languageLabel") }}
        </label>
        <USelect id="language-select" v-model="language" :items="languageOptions" value-key="value" />
      </div>
    </UCard>
  </div>
</template>
