<script setup lang="ts">
import type { MatchResult, SkillSuggestion } from "~/types/ai.types"

defineProps<{
  result: MatchResult
  refinements: Record<number, string>
  tailoring: number | null
  existingSummary: string | null
  existingExperiences: Record<number, string>
  existingProjects: Record<number, string>
  scoreColor: (score: number) => string
  scoreBarColor: (score: number) => string
}>()

const emit = defineEmits<{
  (e: "apply-summary"): void
  (e: "apply-experience" | "apply-project", index: number): void
  (e: "apply-skill", suggestion: SkillSuggestion): void
}>()
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-col items-center gap-2">
      <span class="text-muted text-sm">{{ $t("editor.matchToJob.matchScore") }}</span>
      <span class="text-4xl font-bold" :class="scoreColor(result.matchScore)">{{ result.matchScore }}%</span>
      <div class="bg-elevated h-2 w-full max-w-xs overflow-hidden rounded-full">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="scoreBarColor(result.matchScore)"
          :style="{ width: `${result.matchScore}%` }"
        />
      </div>
    </div>

    <div v-if="result.strengths.length > 0">
      <h4 class="mb-2 text-sm font-semibold text-green-600">{{ $t("editor.matchToJob.strengths") }}</h4>
      <ul class="text-muted list-disc pl-5 text-sm">
        <li v-for="s in result.strengths" :key="s">{{ s }}</li>
      </ul>
    </div>

    <div v-if="result.weaknesses.length > 0">
      <h4 class="mb-2 text-sm font-semibold text-amber-600">{{ $t("editor.matchToJob.areasToImprove") }}</h4>
      <ul class="text-muted list-disc pl-5 text-sm">
        <li v-for="w in result.weaknesses" :key="w">{{ w }}</li>
      </ul>
    </div>

    <div v-if="result.missingKeywords.length > 0">
      <h4 class="text-default mb-2 text-sm font-semibold">{{ $t("editor.matchToJob.missingKeywords") }}</h4>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="kw in result.missingKeywords"
          :key="kw"
          class="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-xs font-medium"
        >
          {{ kw }}
        </span>
      </div>
    </div>

    <div v-if="result.summarySuggestion">
      <h4 class="text-default mb-2 text-sm font-semibold">{{ $t("editor.matchToJob.summarySuggestion") }}</h4>
      <div v-if="existingSummary" class="mb-2">
        <p class="text-muted mb-1 text-xs font-medium">{{ $t("editor.matchToJob.current") }}</p>
        <div class="bg-elevated text-muted rounded-lg border border-dashed p-3 text-sm" v-html="existingSummary" />
      </div>
      <div>
        <p class="text-primary mb-1 text-xs font-medium">{{ $t("editor.matchToJob.suggested") }}</p>
        <div
          class="text-default bg-primary/5 border-primary/30 rounded-lg border p-3 text-sm"
          v-html="result.summarySuggestion"
        />
      </div>
      <UButton variant="outline" color="primary" size="sm" class="mt-3" @click="emit('apply-summary')">
        {{ $t("editor.matchToJob.applySummary") }}
      </UButton>
    </div>

    <div v-if="result.experienceSuggestions.length > 0">
      <h4 class="text-default mb-2 text-sm font-semibold">
        {{ $t("editor.matchToJob.experienceSuggestions") }}
      </h4>
      <div class="flex flex-col gap-3">
        <div
          v-for="(suggestion, index) in result.experienceSuggestions"
          :key="index"
          class="bg-elevated rounded-lg border p-3"
        >
          <div class="mb-2 flex items-center gap-2">
            <span class="text-default text-sm font-medium">{{ suggestion.entryTitle }}</span>
            <UBadge variant="soft" color="neutral" size="xs">{{ suggestion.alignmentScore }}%</UBadge>
          </div>
          <p class="text-muted mb-2 text-xs">{{ suggestion.rationale }}</p>
          <div v-if="existingExperiences[index]" class="mb-2">
            <p class="text-muted mb-1 text-xs font-medium">{{ $t("editor.matchToJob.current") }}</p>
            <div
              class="bg-elevated text-muted rounded-lg border border-dashed p-2 text-sm"
              v-html="existingExperiences[index]"
            />
          </div>
          <div>
            <p class="text-primary mb-1 text-xs font-medium">{{ $t("editor.matchToJob.suggested") }}</p>
            <div
              class="text-default border-primary/30 bg-primary/5 rounded border p-2 text-sm"
              v-html="refinements[index] || suggestion.suggestion"
            />
          </div>
          <div class="mt-2 flex gap-2">
            <UButton variant="outline" color="primary" size="xs" @click="emit('apply-experience', index)">
              {{ $t("editor.matchToJob.apply") }}
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <div v-if="result.projectSuggestions.length > 0">
      <h4 class="text-default mb-2 text-sm font-semibold">
        {{ $t("editor.matchToJob.projectSuggestions") }}
      </h4>
      <div class="flex flex-col gap-3">
        <div
          v-for="(suggestion, index) in result.projectSuggestions"
          :key="index"
          class="bg-elevated rounded-lg border p-3"
        >
          <div class="mb-2 flex items-center gap-2">
            <span class="text-default text-sm font-medium">{{ suggestion.entryTitle }}</span>
            <UBadge variant="soft" color="neutral" size="xs">{{ suggestion.alignmentScore }}%</UBadge>
          </div>
          <p class="text-muted mb-2 text-xs">{{ suggestion.rationale }}</p>
          <div v-if="existingProjects[index]" class="mb-2">
            <p class="text-muted mb-1 text-xs font-medium">{{ $t("editor.matchToJob.current") }}</p>
            <div
              class="bg-elevated text-muted rounded-lg border border-dashed p-2 text-sm"
              v-html="existingProjects[index]"
            />
          </div>
          <div>
            <p class="text-primary mb-1 text-xs font-medium">{{ $t("editor.matchToJob.suggested") }}</p>
            <div
              class="text-default border-primary/30 bg-primary/5 rounded border p-2 text-sm"
              v-html="refinements[index] || suggestion.suggestion"
            />
          </div>
          <div class="mt-2 flex gap-2">
            <UButton variant="outline" color="primary" size="xs" @click="emit('apply-project', index)">
              {{ $t("editor.matchToJob.apply") }}
            </UButton>
          </div>
        </div>
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
          <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
            <template v-for="item in skill.suggestedItems" :key="item">
              <span v-if="skill.addedItems.includes(item)" class="font-medium text-green-600">{{ item }}</span>
              <span v-else class="text-muted">{{ item }}</span>
              <span class="text-muted/40 last:hidden">·</span>
            </template>
          </div>
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
