<script setup lang="ts">
import type { ExperienceAnalysis, MatchRewriteResult } from "~/types/ai.types"

defineProps<{
  entry: ExperienceAnalysis
  index: number
  existingContent: string | null
  rewriteResult: MatchRewriteResult | undefined
  isRewriting: boolean
}>()

const emit = defineEmits<{
  (e: "rewrite", index: number): void
  (e: "apply", index: number): void
}>()
</script>

<template>
  <div class="bg-elevated rounded-lg border p-3">
    <div class="mb-2 flex items-center gap-2">
      <span class="text-default text-sm font-medium">{{ entry.entryId }}</span>
      <UBadge
        variant="soft"
        :color="entry.impact === 'high' ? 'success' : entry.impact === 'medium' ? 'warning' : 'neutral'"
        size="xs"
      >
        {{ entry.impact }}
      </UBadge>
    </div>

    <div v-if="entry.matches.length > 0" class="mb-2">
      <span class="text-muted text-xs font-medium">{{ $t("editor.matchToJob.matches") }}:</span>
      <span class="text-muted text-xs">{{ entry.matches.join(", ") }}</span>
    </div>

    <div v-if="entry.gaps.length > 0" class="mb-2">
      <span class="text-red-500 text-xs font-medium">{{ $t("editor.matchToJob.gaps") }}:</span>
      <span class="text-muted text-xs">{{ entry.gaps.join(", ") }}</span>
    </div>

    <div v-if="entry.suggestions.length > 0" class="mb-2">
      <p class="text-primary mb-1 text-xs font-medium">{{ $t("editor.matchToJob.aiSuggestions") }}</p>
      <ul class="text-muted list-disc pl-4 text-xs">
        <li v-for="(s, i) in entry.suggestions" :key="i">
          <span class="font-medium">{{ s.action }}:</span> {{ s.content }}
        </li>
      </ul>
    </div>

    <div v-if="existingContent" class="mb-2">
      <p class="text-muted mb-1 text-xs font-medium">{{ $t("editor.matchToJob.current") }}</p>
      <div class="bg-elevated text-muted rounded-lg border border-dashed p-2 text-sm" v-html="existingContent" />
    </div>

    <div v-if="rewriteResult">
      <p class="text-green-600 mb-1 text-xs font-medium">{{ $t("editor.matchToJob.aiRewritten") }}</p>
      <div
        class="text-default bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700 rounded border p-2 text-sm"
        v-html="rewriteResult.rewrittenContent"
      />
      <div v-if="rewriteResult.keywordsIntegrated.length > 0" class="mt-2 flex flex-wrap gap-1">
        <UBadge v-for="kw in rewriteResult.keywordsIntegrated" :key="kw" variant="soft" color="success" size="xs">{{ kw }}</UBadge>
      </div>
    </div>

    <div class="mt-2 flex gap-2">
      <UButton
        v-if="!rewriteResult"
        variant="outline"
        color="neutral"
        size="xs"
        :loading="isRewriting"
        @click="emit('rewrite', index)"
      >
        {{ $t("editor.matchToJob.rewriteWithAi") }}
      </UButton>
      <UButton
        v-else
        variant="outline"
        color="primary"
        size="xs"
        @click="emit('apply', index)"
      >
        {{ $t("editor.matchToJob.apply") }}
      </UButton>
    </div>
  </div>
</template>
