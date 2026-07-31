<script setup lang="ts">
import { defineAsyncComponent } from "vue"
import SaveChanges from "./SaveChanges.vue"

const ChangeTemplateModal = defineAsyncComponent(() => import("./ChangeTemplateModal.vue"))
const ExportModal = defineAsyncComponent(() => import("./ExportModal.vue"))
const ShareModal = defineAsyncComponent(() => import("./ShareModal.vue"))

const saving = ref(false)
const isTemplateModalOpen = ref(false)
const isExportModalOpen = ref(false)
const isShareModalOpen = ref(false)
const isHelpModalOpen = ref(false)

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

const startTour = inject<() => Promise<void>>("startTour", async () => {})

const shortcuts = [
  { keys: ["Ctrl", "S"], label: "editor.shortcuts.save" },
  { keys: ["Ctrl", "Z"], label: "editor.shortcuts.undo" },
  { keys: ["Ctrl", "Shift", "Z"], label: "editor.shortcuts.redo" },
  { keys: ["Ctrl", "Y"], label: "editor.shortcuts.redoAlt" }
]
</script>

<template>
  <div
    class="bg-default relative flex flex-col items-stretch justify-between gap-2 rounded-xl p-3 sm:gap-3 sm:p-4 xl:flex-row xl:items-center"
  >
    <div class="flex min-w-0 flex-1 items-center gap-2">
      <UButton to="/dashboard" variant="ghost" color="neutral" size="lg" icon="i-lucide-arrow-left">
        <span class="hidden xl:inline">{{ $t("editor.header.dashboard") }}</span>
      </UButton>
      <UInput
        v-model="titleModel"
        :minlength="3"
        :maxlength="50"
        :placeholder="$t('editor.header.resumeTitle')"
        class="w-full min-w-0"
        :ui="{
          base: 'pe-2 sm:pe-12 text-sm md:text-sm'
        }"
      >
        <template #trailing>
          <span class="text-muted hidden text-xs sm:inline">{{ titleModel.length }}/50</span>
        </template>
      </UInput>
    </div>
    <div class="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
      <div v-if="undoRedo" class="border-muted flex items-center gap-0.5 rounded-lg border">
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-undo-2"
          :disabled="!canUndo"
          :title="$t('editor.header.undo')"
          :ui="{
            leadingIcon: 'size-4'
          }"
          @click="undoRedo.undo()"
        />
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-redo-2"
          :disabled="!canRedo"
          :title="$t('editor.header.redo')"
          :ui="{
            leadingIcon: 'size-4'
          }"
          @click="undoRedo.redo()"
        />
      </div>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-circle-help"
        :title="$t('editor.tour.help')"
        :ui="{
          leadingIcon: 'size-4'
        }"
        @click="
          () => {
            isHelpModalOpen = true
          }
        "
      />
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-layout-template"
        :ui="{
          leadingIcon: 'size-4'
        }"
        :title="$t('editor.header.changeTemplate')"
        @click="
          () => {
            isTemplateModalOpen = true
          }
        "
      >
        <span class="hidden sm:inline">{{ $t("editor.header.changeTemplate") }}</span>
      </UButton>
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-share-2"
        :ui="{
          leadingIcon: 'size-4'
        }"
        :title="$t('editor.share.button')"
        @click="
          () => {
            isShareModalOpen = true
          }
        "
      >
        <span class="hidden sm:inline">{{ $t("editor.share.button") }}</span>
      </UButton>
      <div
        id="editor-save-group"
        class="bg-elevated/50 border-muted flex items-center overflow-hidden rounded-lg border p-0 backdrop-blur-sm"
      >
        <SaveChanges @saving="saving = $event" />
        <UButton
          :disabled="saving"
          color="primary"
          variant="solid"
          icon="i-lucide-file-down"
          :ui="{
            leadingIcon: 'size-4'
          }"
          @click="
            () => {
              isExportModalOpen = true
            }
          "
        >
          <span class="hidden sm:inline">{{ $t("editor.export.button") }}</span>
          <span class="sm:hidden">{{ $t("editor.export.buttonShort") }}</span>
        </UButton>
      </div>
    </div>
    <ChangeTemplateModal v-model="isTemplateModalOpen" />
    <ExportModal v-model="isExportModalOpen" :disabled="saving" />
    <ShareModal v-model="isShareModalOpen" :disabled="saving" />
    <UModal v-model:open="isHelpModalOpen" :title="$t('editor.tour.help')">
      <template #content>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="shortcut in shortcuts" :key="shortcut.label" class="flex items-center justify-between">
              <span class="text-sm">{{ $t(shortcut.label) }}</span>
              <div class="flex items-center gap-1">
                <kbd
                  v-for="key in shortcut.keys"
                  :key="key"
                  class="bg-muted border-default inline-flex h-6 min-w-6 items-center justify-center rounded border px-1.5 text-xs font-medium"
                >
                  {{ key }}
                </kbd>
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <UButton
              variant="ghost"
              color="primary"
              @click="
                () => {
                  startTour()
                  isHelpModalOpen = false
                }
              "
            >
              {{ $t("editor.tour.restart") }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
