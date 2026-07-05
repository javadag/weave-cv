<script setup lang="ts">
import type { MissingKeywordItem } from "~/types/ai.types"

defineProps<{
  keywords: (string | MissingKeywordItem)[]
}>()

function keywordLabel(item: string | MissingKeywordItem): string {
  if (typeof item === "string") return item
  return item.keyword ?? JSON.stringify(item)
}

function keywordSuggestion(item: string | MissingKeywordItem): string | null {
  if (typeof item === "string") return null
  return item.suggestion ?? null
}
</script>

<template>
  <div v-if="keywords.length > 0">
    <h4 class="text-default mb-2 text-sm font-semibold">{{ $t("editor.matchToJob.missingKeywords") }}</h4>
    <div class="flex flex-wrap gap-1.5">
      <UTooltip v-for="(kw, i) in keywords" :key="i" :text="keywordSuggestion(kw) || undefined" :content="{ side: 'top' }">
        <span
          class="bg-primary/10 text-primary inline-block cursor-default rounded-full px-3 py-1 text-xs font-medium"
        >
          {{ keywordLabel(kw) }}
        </span>
      </UTooltip>
    </div>
  </div>
</template>
