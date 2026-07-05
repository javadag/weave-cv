<script setup lang="ts">
import type { MatchRewriteResult, SummaryAnalysis } from "~/types/ai.types"

defineProps<{
  analysis: SummaryAnalysis
  existingSummary: string | null
  isRewriting: Record<string, boolean>
  rewriteResults: Record<string, MatchRewriteResult>
  scoreColor: (score: number) => string
}>()

const emit = defineEmits<{
  (e: "rewrite"): void
  (e: "apply"): void
}>()

function getSectionScoreColor(score: number): string {
  if (score >= 70) return "bg-green-500"
  if (score >= 40) return "bg-amber-500"
  return "bg-red-500"
}
</script>

<template>
  <div class="bg-elevated rounded-lg border p-3">
    <h4 class="text-default mb-2 text-sm font-semibold">{{ $t("editor.matchToJob.summaryAnalysis") }}</h4>
    <div class="mb-2 flex items-center gap-2">
      <span class="text-muted text-xs">{{ $t("editor.matchToJob.alignmentScore") }}</span>
      <div class="bg-elevated h-1.5 flex-1 overflow-hidden rounded-full">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="getSectionScoreColor(analysis.alignmentScore)"
          :style="{ width: `${analysis.alignmentScore}%` }"
        />
      </div>
      <span class="w-8 text-right text-xs" :class="scoreColor(analysis.alignmentScore)">{{ analysis.alignmentScore }}%</span>
    </div>

    <div v-if="analysis.strengths.length > 0" class="mb-2">
      <span class="text-green-600 text-xs font-medium">{{ $t("editor.matchToJob.strengths") }}:</span>
      <ul class="text-muted list-disc pl-4 text-xs">
        <li v-for="(s, i) in analysis.strengths" :key="i">{{ s }}</li>
      </ul>
    </div>

    <div v-if="analysis.weaknesses.length > 0" class="mb-2">
      <span class="text-amber-600 text-xs font-medium">{{ $t("editor.matchToJob.areasToImprove") }}:</span>
      <ul class="text-muted list-disc pl-4 text-xs">
        <li v-for="(w, i) in analysis.weaknesses" :key="i">{{ w }}</li>
      </ul>
    </div>

    <div v-if="analysis.missingKeywords.length > 0" class="mb-2">
      <span class="text-red-500 text-xs font-medium">{{ $t("editor.matchToJob.missingKeywords") }}:</span>
      <div class="mt-1 flex flex-wrap gap-1">
        <span
          v-for="(kw, i) in analysis.missingKeywords"
          :key="i"
          class="bg-red-500/10 text-red-600 inline-block rounded-full px-2 py-0.5 text-xs font-medium"
        >
          {{ kw }}
        </span>
      </div>
    </div>

    <div v-if="analysis.recommendations.length > 0" class="mb-2">
      <p class="text-primary mb-1 text-xs font-medium">{{ $t("editor.matchToJob.aiSuggestions") }}</p>
      <ul class="text-muted list-disc pl-4 text-xs">
        <li v-for="(r, i) in analysis.recommendations" :key="i">
          <span class="font-medium">{{ r.action }}:</span> {{ r.suggestion }}
          <span class="text-muted/60">({{ r.reason }})</span>
        </li>
      </ul>
    </div>

    <div v-if="existingSummary" class="mb-2">
      <p class="text-muted mb-1 text-xs font-medium">{{ $t("editor.matchToJob.current") }}</p>
      <div class="bg-elevated text-muted rounded-lg border border-dashed p-2 text-sm" v-html="existingSummary" />
    </div>

    <div v-if="rewriteResults['summary']">
      <p class="text-green-600 mb-1 text-xs font-medium">{{ $t("editor.matchToJob.aiRewritten") }}</p>
      <div
        class="text-default bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700 rounded border p-2 text-sm"
        v-html="rewriteResults['summary']!.rewrittenContent"
      />
      <div v-if="rewriteResults['summary']!.keywordsIntegrated.length > 0" class="mt-2 flex flex-wrap gap-1">
        <UBadge v-for="kw in rewriteResults['summary']!.keywordsIntegrated" :key="kw" variant="soft" color="success" size="xs">{{ kw }}</UBadge>
      </div>
    </div>

    <div class="mt-2 flex gap-2">
      <UButton
        v-if="!rewriteResults['summary']"
        variant="outline"
        color="neutral"
        size="xs"
        :loading="isRewriting['summary']"
        @click="emit('rewrite')"
      >
        {{ $t("editor.matchToJob.rewriteSummary") }}
      </UButton>
      <UButton
        v-else
        variant="outline"
        color="primary"
        size="xs"
        @click="emit('apply')"
      >
        {{ $t("editor.matchToJob.applySummary") }}
      </UButton>
    </div>
  </div>
</template>
