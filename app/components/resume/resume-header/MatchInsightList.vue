<script setup lang="ts">
import type { GapItem } from "~/types/ai.types"

defineProps<{
  title: string
  color: string
  items: (string | GapItem)[]
}>()

function isGapItem(item: unknown): item is GapItem {
  return typeof item === "object" && item !== null && "explanation" in item
}
</script>

<template>
  <div v-if="items.length > 0">
    <h4 class="mb-2 text-sm font-semibold" :class="color">{{ title }}</h4>
    <ul class="text-muted list-disc pl-5 text-sm">
      <li v-for="(item, i) in items" :key="i">
        <template v-if="isGapItem(item)">
          {{ item.explanation }}
          <span v-if="item.suggestion" class="text-primary mt-0.5 block text-xs">{{ item.suggestion }}</span>
        </template>
        <template v-else>{{ item }}</template>
      </li>
    </ul>
  </div>
</template>
