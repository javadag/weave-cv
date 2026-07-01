<script setup lang="ts">
import MatchToJobResults from "./MatchToJobResults.vue"

const modelValue = defineModel<boolean>({ default: false })

const {
  jobDescription,
  isMatching,
  matchResult,
  matchError,
  tailoringIndex,
  refinedSuggestions,
  existingSummary,
  existingExperiences,
  existingProjects,
  hasApiKey,
  handleMatch,
  applySummarySuggestion,
  applyExperienceSuggestion,
  applyProjectSuggestion,
  applySkillSuggestion,
  reset,
  getScoreColor,
  getScoreBarColor
} = useMatchToJob()

function onCancel() {
  reset()
  modelValue.value = false
}

function onClose() {
  modelValue.value = false
}

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const dir = computed(() => (configs.value.general.layout.rtl ? "rtl" : "ltr"))
</script>

<template>
  <UModal v-model:open="modelValue" :ui="{ content: 'sm:max-w-2xl flex flex-col max-h-[90dvh]' }">
    <template #content>
      <UCard
        :dir="dir"
        :ui="{
          root: 'flex flex-col flex-1 overflow-hidden',
          body: 'flex-1 overflow-y-auto flex flex-col gap-4 p-3'
        }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="bg-primary/10 dark:bg-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            >
              <UIcon name="i-lucide-sparkles" class="text-primary size-5" />
            </div>
            <div>
              <h3 class="text-default text-lg font-semibold">{{ $t("editor.matchToJob.title") }}</h3>
              <p class="text-muted mt-1 text-sm">{{ $t("editor.matchToJob.subtitle") }}</p>
            </div>
          </div>
        </template>
        <UAlert
          v-if="!hasApiKey && !matchResult"
          variant="subtle"
          icon="i-lucide-info"
          :title="$t('editor.matchToJob.freeTierNoticeTitle')"
          :description="$t('editor.matchToJob.freeTierNoticeDesc')"
        />
        <div class="flex flex-col gap-4">
          <UTextarea
            v-model="jobDescription"
            :placeholder="$t('editor.matchToJob.placeholder')"
            :rows="10"
            :ui="{
              base: 'resize-none'
            }"
            :disabled="isMatching"
            size="lg"
          />
          <UButton
            color="primary"
            size="lg"
            :loading="isMatching"
            :disabled="!jobDescription.trim()"
            block
            @click="handleMatch"
          >
            {{ isMatching ? $t("editor.matchToJob.matching") : $t("editor.matchToJob.match") }}
          </UButton>
          <p v-if="matchError" class="text-center text-sm text-red-500">{{ matchError }}</p>
        </div>

        <template v-if="matchResult">
          <USeparator />
            <MatchToJobResults
              :result="matchResult"
              :refinements="refinedSuggestions"
              :tailoring="tailoringIndex"
              :existing-summary="existingSummary"
              :existing-experiences="existingExperiences"
              :existing-projects="existingProjects"
              :score-color="getScoreColor"
              :score-bar-color="getScoreBarColor"
            @apply-summary="applySummarySuggestion"
            @apply-experience="applyExperienceSuggestion"
            @apply-project="applyProjectSuggestion"
            @apply-skill="applySkillSuggestion"
          />
        </template>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="ghost" @click="onCancel">{{ $t("common.cancel") }}</UButton>
            <UButton v-if="matchResult" color="neutral" variant="ghost" @click="onClose">
              {{ $t("editor.matchToJob.close") }}
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
