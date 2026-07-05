<script setup lang="ts">
import type { ScoreBreakdown } from "~/types/ai.types"

defineProps<{
  overallScore: number
  scoreBreakdown: ScoreBreakdown
  scoreColor: (score: number) => string
  scoreBarColor: (score: number) => string
}>()

function getScoreLabel(score: number): string {
  if (score >= 70) return "Strong"
  if (score >= 40) return "Moderate"
  return "Weak"
}

function getSectionScoreColor(score: number): string {
  if (score >= 70) return "bg-green-500"
  if (score >= 40) return "bg-amber-500"
  return "bg-red-500"
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col items-center gap-2">
      <span class="text-muted text-sm">{{ $t("editor.matchToJob.matchScore") }}</span>
      <span class="text-4xl font-bold" :class="scoreColor(overallScore)">{{ overallScore }}%</span>
      <div class="bg-elevated h-2 w-full max-w-xs overflow-hidden rounded-full">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="scoreBarColor(overallScore)"
          :style="{ width: `${overallScore}%` }"
        />
      </div>
      <span class="text-muted text-xs">{{ getScoreLabel(overallScore) }} Match</span>
    </div>

    <div v-if="scoreBreakdown" class="bg-elevated rounded-lg border p-3">
      <h4 class="text-default mb-3 text-sm font-semibold">{{ $t("editor.matchToJob.scoreBreakdown") }}</h4>
      <div class="flex flex-col gap-2">
        <div v-for="[key, value] in Object.entries(scoreBreakdown)" :key="key" class="flex items-center gap-2">
          <span class="text-muted w-28 shrink-0 text-xs capitalize">{{ key.replace(/([A-Z])/g, " $1").replace("Score", "") }}</span>
          <div class="bg-elevated h-1.5 flex-1 overflow-hidden rounded-full">
            <div class="h-full rounded-full transition-all duration-500" :class="getSectionScoreColor(value)" :style="{ width: `${value}%` }" />
          </div>
          <span class="text-muted w-8 text-right text-xs">{{ value }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
