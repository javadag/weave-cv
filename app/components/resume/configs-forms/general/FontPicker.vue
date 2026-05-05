<script setup lang="ts">
import type { FontEntry } from "~/composables/useGoogleFonts"
import { loadFont } from "~/utils/preview/core/fontUtils"

const props = defineProps<{
  modelValue: string
  label: string
}>()

const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>()

const isOpen = ref(false)
const { fonts, subsets, search, selectedSubset } = useGoogleFonts()

// Subset labels shown in the UI
const SUBSET_LABELS: Record<string, string> = {
  all: "All",
  latin: "Latin",
  "latin-ext": "Latin Ext",
  arabic: "Arabic",
  cyrillic: "Cyrillic",
  greek: "Greek",
  hebrew: "Hebrew",
  devanagari: "Devanagari",
  vietnamese: "Vietnamese",
  korean: "Korean",
  thai: "Thai"
}

// Only show a curated set of subset tabs to keep the UI clean
const SHOWN_SUBSETS = new Set(["all", "latin", "arabic", "cyrillic", "greek", "hebrew", "devanagari"])

const visibleSubsets = computed(() => subsets.value.filter((s) => SHOWN_SUBSETS.has(s)))

function selectFont(entry: FontEntry) {
  emit("update:modelValue", entry.family)
  isOpen.value = false
  search.value = ""
}

// Lazy-load font CSS when an item becomes visible
const loadedInPicker: Record<string, boolean> = {}

function onFontVisible(family: string) {
  if (loadedInPicker[family]) return
  loadedInPicker[family] = true
  loadFont(family)
}

// IntersectionObserver-based directive for lazy font loading
const vFontVisible = {
  mounted(el: HTMLElement, binding: { value: string }) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onFontVisible(binding.value)
            observer.unobserve(el)
          }
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    ;(el as HTMLElement & { _fontObserver?: IntersectionObserver })._fontObserver = observer
  },
  unmounted(el: HTMLElement & { _fontObserver?: IntersectionObserver }) {
    el._fontObserver?.disconnect()
  }
}
</script>

<template>
  <UFormField :label="props.label" :ui="{ label: 'text-2sm text-muted', container: 'mt-0' }">
    <UPopover v-model:open="isOpen" :ui="{ content: 'w-72 p-0' }">
      <UButton variant="outline" size="sm" class="w-full justify-between" trailing-icon="i-lucide-chevron-down">
        <span :style="{ fontFamily: `'${modelValue}', sans-serif` }" class="truncate">{{ modelValue }}</span>
      </UButton>
      <template #content>
        <div class="flex flex-col">
          <div class="p-2">
            <UInput v-model="search" placeholder="Search fonts..." size="sm" icon="i-lucide-search" autofocus />
          </div>
          <div class="border-muted flex gap-1 overflow-x-auto border-b px-2 pb-2">
            <UButton
              v-for="subset in visibleSubsets"
              :key="subset"
              size="xs"
              :variant="selectedSubset === subset ? 'solid' : 'ghost'"
              @click="selectedSubset = subset"
            >
              {{ SUBSET_LABELS[subset] ?? subset }}
            </UButton>
          </div>
          <div class="max-h-64 overflow-y-auto">
            <button
              v-for="entry in fonts"
              :key="entry.family"
              v-font-visible="entry.family"
              type="button"
              class="hover:bg-muted flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors"
              :class="{ 'bg-primary/10 text-primary font-medium': modelValue === entry.family }"
              @click="selectFont(entry)"
            >
              <span :style="{ fontFamily: `'${entry.family}', sans-serif` }" class="flex-1 truncate">
                {{ entry.label }}
              </span>
              <span class="text-muted shrink-0 text-xs">{{ entry.category }}</span>
            </button>
            <div v-if="fonts.length === 0" class="text-muted py-6 text-center text-sm">No fonts found</div>
          </div>
        </div>
      </template>
    </UPopover>
  </UFormField>
</template>
