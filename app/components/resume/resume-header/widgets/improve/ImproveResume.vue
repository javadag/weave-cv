<script setup lang="ts">
import ScoreHero from "./ScoreHero.vue"
import StrengthsCard from "./StrengthsCard.vue"
import KeywordChips from "./KeywordChips.vue"
import SuggestionCard from "./SuggestionCard.vue"
import type { HonestyUiLevel } from "~/composables/useResumeImprove"

const modelValue = defineModel<boolean>({ default: false })

const user = useSupabaseUser()
const ai = useAiProvider()
const improve = useResumeImprove()
const { t } = useI18n()

const jobDescription = ref("")
const jdTouched = ref(false)

const jdInvalid = computed(() => {
  const trimmed = jobDescription.value.trim()
  if (trimmed.length === 0) return false
  const words = trimmed.split(/\s+/).length
  return trimmed.length < 80 || words < 10
})

const jdErrorText = computed(() => {
  if (!jdTouched.value || !jdInvalid.value) return ""
  return t("editor.improve.jdTooShort")
})

const canAnalyze = computed(() => !jdInvalid.value && !improve.analyzing.value)

const honestyOptions = computed<{ value: HonestyUiLevel; label: string; desc: string }[]>(() => [
  { value: "faithful", label: t("editor.improve.faithful"), desc: t("editor.improve.faithfulDesc") },
  { value: "balanced", label: t("editor.improve.balanced"), desc: t("editor.improve.balancedDesc") },
  { value: "bold", label: t("editor.improve.bold"), desc: t("editor.improve.boldDesc") }
])

const isBold = computed(() => improve.honesty.value === "bold")

function handleAnalyze() {
  jdTouched.value = true
  if (jdInvalid.value || improve.analyzing.value) return
  improve.runAnalyze(jobDescription.value)
}

function handleRetry() {
  improve.error.value = null
  improve.runAnalyze(jobDescription.value)
}

function handleClose() {
  modelValue.value = false
  improve.error.value = null
}
</script>

<template>
  <UModal
    v-model:open="modelValue"
    :ui="{
      content: 'sm:max-w-2xl'
    }"
  >
    <template #content>
      <UCard
        :ui="{
          body: 'p-4 sm:p-6 max-h-[80vh] overflow-y-auto'
        }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="bg-primary/10 dark:bg-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <UIcon name="i-lucide-sparkles" class="text-primary size-5" />
            </div>
            <div>
              <h3 class="text-default text-lg font-semibold">{{ $t("editor.improve.title") }}</h3>
              <p class="text-muted mt-1 text-sm">{{ $t("editor.improve.subtitle") }}</p>
            </div>
          </div>
        </template>

        <!-- Guest nudge -->
        <div v-if="!user" class="rounded-xl border border-muted p-5 text-center">
          <p class="text-default text-sm font-medium">{{ $t("editor.improve.mustSignIn") }}</p>
          <UButton to="/register" color="primary" variant="solid" icon="i-lucide-log-in" class="mt-3">
            {{ $t("editor.improve.goToRegister") }}
          </UButton>
        </div>

        <!-- No key gate -->
        <div v-else-if="!ai.hasKeys()" class="rounded-xl border border-muted p-5 text-center">
          <p class="text-default text-sm font-medium">{{ $t("editor.improve.noKey") }}</p>
          <UButton to="/dashboard/settings" color="primary" variant="outline" icon="i-lucide-key-round" class="mt-3">
            {{ $t("editor.improve.goToSettings") }}
          </UButton>
        </div>

        <template v-else>
          <!-- JD input -->
          <div>
            <label for="improve-jd" class="text-default mb-1.5 block text-sm font-medium">
              {{ $t("editor.improve.jdLabel") }}
            </label>
            <UTextarea
              id="improve-jd"
              v-model="jobDescription"
              :rows="4"
              :placeholder="$t('editor.improve.jdPlaceholder')"
              @blur="() => { jdTouched = true }"
            />
            <p v-if="jdErrorText" class="text-red-500 mt-1 text-xs">{{ jdErrorText }}</p>
          </div>

          <!-- Honesty dial -->
          <div class="mt-4">
            <div class="text-default mb-2 text-sm font-medium">{{ $t("editor.improve.dialTitle") }}</div>
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup">
              <button
                v-for="opt in honestyOptions"
                :key="opt.value"
                type="button"
                role="radio"
                :aria-checked="improve.honesty.value === opt.value"
                class="border-muted hover:border-primary/40 rounded-xl border p-3 text-left transition-colors"
                :class="{
                  'border-primary bg-primary/5': improve.honesty.value === opt.value
                }"
                @click="() => { improve.honesty.value = opt.value }"
              >
                <div class="text-default text-sm font-semibold">{{ opt.label }}</div>
                <div class="text-muted mt-0.5 text-xs">{{ opt.desc }}</div>
              </button>
            </div>
            <p v-if="isBold" class="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
              <UIcon name="i-lucide-flag" class="size-3.5" />
              {{ $t("editor.improve.boldNote") }}
            </p>
          </div>

          <!-- Analyze -->
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <UButton
              color="primary"
              variant="solid"
              icon="i-lucide-wand-2"
              :loading="improve.analyzing.value"
              :disabled="!canAnalyze"
              @click="handleAnalyze"
            >
              {{ improve.analyzing.value ? $t("editor.improve.analyzing") : $t("editor.improve.analyze") }}
            </UButton>
          </div>

          <!-- Error with retry -->
          <div
            v-if="improve.error.value"
            class="border-red-500/40 bg-red-500/5 text-red-600 dark:text-red-400 mt-4 rounded-xl border p-3 text-sm"
          >
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-triangle-alert" class="size-4" />
              <span>{{ $t(improve.error.value.key, { detail: improve.error.value.detail ?? "" }) }}</span>
            </div>
            <UButton color="neutral" variant="outline" size="sm" icon="i-lucide-refresh-cw" class="mt-2" @click="handleRetry">
              {{ $t("editor.improve.retry") }}
            </UButton>
          </div>

          <!-- Results -->
          <div v-if="improve.result.value" class="mt-5 space-y-4">
            <ScoreHero :match-score="improve.result.value.matchScore" :summary="improve.result.value.scoreSummary" />
            <StrengthsCard
              :strengths="improve.result.value.strengths"
              :weaknesses="improve.result.value.weaknesses"
            />
            <KeywordChips :keywords="improve.result.value.missingKeywords" />

            <div>
              <div class="text-default mb-2 text-sm font-semibold">{{ $t("editor.improve.suggestions") }}</div>
              <div v-if="improve.result.value.suggestions.length === 0" class="text-muted text-sm italic">
                {{ $t("editor.improve.noSuggestions") }}
              </div>
              <div class="space-y-3">
                <SuggestionCard
                  v-for="s in improve.result.value.suggestions"
                  :key="`${s.entryId}-${s.field}`"
                  :title="improve.entryTitleOf(s.entryId)"
                  :current="improve.currentTextOf(s.entryId, s.field)"
                  :suggestion="s"
                  :applied="improve.isApplied(s.entryId)"
                  :refining="improve.refiningId.value === s.entryId"
                  :notes="improve.pendingNotes.value[s.entryId] ?? []"
                  @apply="improve.apply(s.entryId, s)"
                  @undo="improve.undo(s.entryId, s)"
                  @refine="(note: string) => improve.refine(s.entryId, note)"
                />
              </div>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-end">
            <UButton color="neutral" variant="ghost" @click="handleClose">{{ $t("common.cancel") }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>