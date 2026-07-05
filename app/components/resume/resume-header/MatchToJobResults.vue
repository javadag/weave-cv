<script setup lang="ts">
import type { MatchResult, MatchRewriteResult, SkillSuggestion } from "~/types/ai.types"
import MatchScoreHero from "./MatchScoreHero.vue"
import MatchInsightList from "./MatchInsightList.vue"
import MissingKeywordsSection from "./MissingKeywordsSection.vue"
import SummaryAnalysisCard from "./SummaryAnalysisCard.vue"
import ExperienceAnalysisCard from "./ExperienceAnalysisCard.vue"

defineProps<{
  result: MatchResult
  existingSummary: string | null
  existingExperiences: Record<number, string>
  scoreColor: (score: number) => string
  scoreBarColor: (score: number) => string
  isRewriting: Record<string, boolean>
  rewriteResults: Record<string, MatchRewriteResult>
}>()

const emit = defineEmits<{
  (e: "apply-summary"): void
  (e: "apply-experience", index: number): void
  (e: "apply-skill", suggestion: SkillSuggestion): void
  (e: "rewrite", index: number): void
  (e: "rewrite-summary"): void
}>()

function rewritesKey(index: number): string {
  return `experience-${index}`
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <MatchScoreHero
      :overall-score="result.overallScore"
      :score-breakdown="result.scoreBreakdown"
      :score-color="scoreColor"
      :score-bar-color="scoreBarColor"
    />

    <SummaryAnalysisCard
      v-if="result.summaryAnalysis"
      :analysis="result.summaryAnalysis"
      :existing-summary="existingSummary"
      :is-rewriting="isRewriting"
      :rewrite-results="rewriteResults"
      :score-color="scoreColor"
      @rewrite="emit('rewrite-summary')"
      @apply="emit('apply-summary')"
    />

    <MatchInsightList
      :title="$t('editor.matchToJob.strengths')"
      color="text-green-600"
      :items="result.strongMatches"
    />

    <MatchInsightList
      :title="$t('editor.matchToJob.areasToImprove')"
      color="text-amber-600"
      :items="result.weakMatches"
    />

    <MatchInsightList
      :title="$t('editor.matchToJob.criticalGaps')"
      color="text-red-600"
      :items="result.criticalGaps"
    />

    <MatchInsightList
      :title="$t('editor.matchToJob.quickWins')"
      color="text-primary"
      :items="result.quickWins"
    />

    <MissingKeywordsSection :keywords="result.missingKeywords" />

    <div v-if="result.experienceAnalysis.length > 0">
      <h4 class="text-default mb-2 text-sm font-semibold">
        {{ $t("editor.matchToJob.experienceSuggestions") }}
      </h4>
      <div class="flex flex-col gap-3">
        <ExperienceAnalysisCard
          v-for="(entry, index) in result.experienceAnalysis"
          :key="index"
          :entry="entry"
          :index="index"
          :existing-content="existingExperiences[index] ?? null"
          :rewrite-result="rewriteResults[rewritesKey(index)]"
          :is-rewriting="isRewriting[rewritesKey(index)] ?? false"
          @rewrite="emit('rewrite', $event)"
          @apply="emit('apply-experience', $event)"
        />
      </div>
    </div>

    <div v-if="result.skillSuggestions.length > 0">
      <h4 class="text-default mb-2 text-sm font-semibold">{{ $t("editor.matchToJob.skillSuggestions") }}</h4>
      <div class="flex flex-col gap-3">
        <div v-for="skill in result.skillSuggestions" :key="skill.category" class="bg-elevated rounded-lg border p-3">
          <div class="mb-1 flex items-center gap-2">
            <span class="text-default text-sm font-medium">{{ skill.category }}</span>
          </div>
          <p class="text-muted mb-2 text-xs">{{ skill.reason }}</p>
          <div v-if="skill.suggestedItems.length > 0" class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
            <template v-for="item in skill.suggestedItems" :key="item">
              <span v-if="skill.addedItems.includes(item)" class="font-medium text-green-600">{{ item }}</span>
              <span v-else class="text-muted">{{ item }}</span>
              <span class="text-muted/40 last:hidden">·</span>
            </template>
          </div>
          <div v-else class="text-muted text-xs">{{ $t("editor.matchToJob.noNewSkills") }}</div>
          <UButton
            variant="outline"
            color="primary"
            size="xs"
            class="mt-2"
            :disabled="skill.addedItems.length === 0"
            @click="emit('apply-skill', skill)"
          >
            {{ $t("editor.matchToJob.addSkills") }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
