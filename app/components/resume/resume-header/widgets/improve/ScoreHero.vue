<script setup lang="ts">
interface Props {
  matchScore: number
  summary: string
}

const props = defineProps<Props>()

const scoreColor = computed(() => {
  if (props.matchScore >= 70) return { text: "text-green-600 dark:text-green-400", bar: "bg-green-500" }
  if (props.matchScore >= 40) return { text: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500" }
  return { text: "text-red-600 dark:text-red-400", bar: "bg-red-500" }
})
</script>

<template>
  <div class="border-muted bg-elevated/50 flex items-center gap-5 rounded-xl border p-4">
    <div class="shrink-0 text-center">
      <div class="text-3xl font-bold" :class="scoreColor.text">{{ matchScore }}</div>
      <div class="text-muted mt-0.5 text-xs">{{ $t("editor.improve.scoreLabel") }}</div>
    </div>
    <div class="min-w-0 flex-1">
      <p class="text-default mt-2 text-sm">{{ summary }}</p>
    </div>
  </div>
</template>
