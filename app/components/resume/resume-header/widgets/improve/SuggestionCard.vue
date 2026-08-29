<script setup lang="ts">
import type { ImproveSuggestion } from "~/composables/useResumeImprove"

interface Props {
  title: string
  current: string
  suggestion: ImproveSuggestion
  applied: boolean
  refining: boolean
  notes: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  apply: []
  undo: []
  refine: [note: string]
}>()

const noteInput = ref<string>("")
const isNoteOpen = ref(false)

function submitRefine() {
  const note = noteInput.value.trim()
  if (!note || props.refining) return
  emit("refine", note)
  noteInput.value = ""
}
</script>

<template>
  <div class="rounded-xl border border-muted p-4">
    <div class="flex items-center justify-between gap-2">
      <div class="text-default text-sm font-semibold">{{ props.title }}</div>
      <span
        v-if="props.applied"
        class="bg-green-500/10 text-green-600 dark:text-green-400 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      >
        <UIcon name="i-lucide-check" class="size-3.5" />
        {{ $t("editor.improve.applied") }}
      </span>
    </div>

    <div class="mt-3 space-y-2">
      <div class="text-muted rounded-md border border-muted bg-muted/30 p-2.5 text-sm line-through">
        {{ props.current || "—" }}
      </div>
      <div class="bg-primary/5 text-default rounded-md border border-primary/20 p-2.5 text-sm">
        {{ props.suggestion.suggestedText }}
      </div>
    </div>

    <p class="text-muted mt-2 text-xs">{{ props.suggestion.rationale }}</p>

    <div v-if="props.suggestion.addedFacts.length > 0" class="mt-2 space-y-1">
      <span
        v-for="fact in props.suggestion.addedFacts"
        :key="fact"
        class="bg-amber-500/10 text-amber-600 dark:text-amber-400 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs"
      >
        <UIcon name="i-lucide-flag" class="size-3" />
        {{ $t("editor.improve.addedVerify") }} — {{ fact }}
      </span>
    </div>

    <div class="mt-3 flex flex-wrap items-center gap-2">
      <template v-if="!props.applied">
        <UButton color="primary" variant="solid" size="sm" icon="i-lucide-check" @click="emit('apply')">
          {{ $t("editor.improve.apply") }}
        </UButton>
        <UButton color="neutral" variant="outline" size="sm" icon="i-lucide-message-square-plus" @click="() => { isNoteOpen = !isNoteOpen }">
          {{ $t("editor.improve.addNote") }}
        </UButton>
      </template>
      <UButton v-else color="neutral" variant="ghost" size="sm" icon="i-lucide-undo-2" @click="emit('undo')">
        {{ $t("editor.improve.undo") }}
      </UButton>
    </div>

    <div v-if="isNoteOpen && !props.applied" class="mt-3 space-y-2">
      <div v-if="props.notes.length > 0" class="text-muted space-y-1 text-xs">
        <div v-for="(n, i) in props.notes" :key="i" class="border-muted rounded bg-elevated/50 border p-1.5">
          {{ n }}
        </div>
      </div>
      <UTextarea
        v-model="noteInput"
        :rows="2"
        :placeholder="$t('editor.improve.notePlaceholder')"
        @keydown.ctrl.enter.prevent="submitRefine"
        @keydown.meta.enter.prevent="submitRefine"
      />
      <UButton
        color="primary"
        variant="outline"
        size="sm"
        icon="i-lucide-wand-2"
        :loading="props.refining"
        :disabled="!noteInput.trim()"
        @click="submitRefine"
      >
        {{ $t("editor.improve.refine") }}
      </UButton>
    </div>
  </div>
</template>