<script setup lang="ts">
import ChangeTemplateModal from "./ChangeTemplateModal.vue"
import Download from "./Download.vue"
import Export from "./Export.vue"
import SaveChanges from "./SaveChanges.vue"

const saving = ref(false)
const isTemplateModalOpen = ref(false)

const resumeStore = useResumeStore()
const { title } = storeToRefs(resumeStore)

const titleModel = computed({
  get: () => title.value,
  set: (v: string) => resumeStore.setTitle(v)
})

const undoRedo = inject<{
  canUndo: Ref<boolean>
  canRedo: Ref<boolean>
  undo: () => void
  redo: () => void
}>("undoRedo")

const canUndo = computed(() => undoRedo?.canUndo.value ?? false)
const canRedo = computed(() => undoRedo?.canRedo.value ?? false)
</script>

<template>
  <div
    class="bg-default relative flex flex-col items-stretch justify-between gap-2 rounded-xl p-3 sm:gap-3 sm:p-4 lg:flex-row lg:items-center"
  >
    <div class="flex min-w-0 flex-1 items-center gap-2">
      <UButton to="/dashboard" variant="ghost" color="neutral" size="lg" icon="i-lucide-arrow-left">
        <span class="hidden lg:inline">{{ $t("editor.header.dashboard") }}</span>
      </UButton>
      <UInput
        v-model="titleModel"
        :minlength="3"
        :maxlength="50"
        :placeholder="$t('editor.header.resumeTitle')"
        size="lg"
        icon="i-heroicons-document-text"
        class="w-full min-w-0"
        :ui="{
          base: 'pe-2 sm:pe-12'
        }"
      >
        <template #trailing>
          <span class="text-muted hidden text-xs sm:inline">{{ titleModel.length }}/50</span>
        </template>
      </UInput>
    </div>
    <div class="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
      <div v-if="undoRedo" class="border-muted flex items-center gap-0.5 rounded-lg border p-0.5">
        <UButton
          variant="ghost"
          color="neutral"
          size="sm"
          icon="i-lucide-undo-2"
          :disabled="!canUndo"
          :title="$t('editor.header.undo')"
          @click="undoRedo.undo()"
        />
        <UButton
          variant="ghost"
          color="neutral"
          size="sm"
          icon="i-lucide-redo-2"
          :disabled="!canRedo"
          :title="$t('editor.header.redo')"
          @click="undoRedo.redo()"
        />
      </div>
      <UButton
        color="neutral"
        variant="outline"
        size="lg"
        icon="i-lucide-layout-template"
        :ui="{
          leadingIcon: 'size-4'
        }"
        @click="isTemplateModalOpen = true"
      >
        <span class="hidden sm:inline">{{ $t("editor.header.changeTemplate") }}</span>
      </UButton>
      <div class="bg-elevated/50 border-muted flex items-center overflow-hidden rounded-lg border p-0 backdrop-blur-sm">
        <SaveChanges @saving="saving = $event" />
        <Download :disabled="saving" />
        <Export :disabled="saving" />
      </div>
    </div>
    <ChangeTemplateModal v-model="isTemplateModalOpen" />
  </div>
</template>
