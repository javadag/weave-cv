<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui"

const { locale, locales, setLocale } = useI18n()

const items = computed<DropdownMenuItem[]>(() =>
  (locales.value as { code: string; name: string }[]).map((l) => ({
    label: l.name,
    icon: l.code === locale.value ? "i-lucide-check" : undefined,
    onSelect: () => setLocale(l.code as typeof locale.value)
  }))
)

const currentCode = computed(() => locale.value.toUpperCase())
</script>

<template>
  <UDropdownMenu :items="items" :popper="{ placement: 'bottom-end' }">
    <UButton
      :aria-label="$t('dashboard.settings.languageLabel')"
      icon="i-lucide-languages"
      color="neutral"
      variant="ghost"
      class="gap-1.5"
      :ui="{
        leadingIcon: 'size-4.5'
      }"
    >
      <span class="text-xs font-semibold tracking-wide">{{ currentCode }}</span>
    </UButton>
  </UDropdownMenu>
</template>
