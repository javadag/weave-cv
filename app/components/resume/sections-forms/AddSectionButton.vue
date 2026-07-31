<script setup lang="ts">
import { computed } from "vue"
import { SECTION_DISPLAY_CONFIG } from "~/constants/sectionConfigs"
import { ADVANCED_SECTION_TYPES, BASIC_SECTION_TYPES } from "~/constants/sectionTypes"
import type { TCoreSectionType } from "~/utils/schemas/content.schema"

const resumeStore = useResumeStore()
const { addSection } = useEditorState()
const { core } = storeToRefs(resumeStore)

const availableSectionTypes = computed(() => {
  const allSectionTypes: TCoreSectionType[] = [...ADVANCED_SECTION_TYPES, ...BASIC_SECTION_TYPES]
  const existingTypes = new Set(Object.values(core?.value || {}).map((section) => section.type))

  // "custom" is always available since multiple custom sections are allowed
  return allSectionTypes.filter((type) => type === "custom" || !existingTypes.has(type))
})

const showAddSectionModal = ref(false)

const openModal = () => {
  showAddSectionModal.value = true
}

const closeModal = () => {
  showAddSectionModal.value = false
}

const handleAddSection = (sectionType: TCoreSectionType) => {
  addSection(sectionType)
  showAddSectionModal.value = false
}
</script>

<template>
  <UTooltip :text="$t('editor.sectionsReorder')">
    <UButton
      v-if="availableSectionTypes.length > 0"
      id="editor-add-section"
      size="xs"
      variant="ghost"
      color="neutral"
      icon="i-lucide-plus"
      @click="openModal"
    />
  </UTooltip>
  <UModal v-model:open="showAddSectionModal">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="bg-primary/10 dark:bg-primary/20 flex size-10 shrink-0 items-center justify-center rounded-full"
            >
              <UIcon name="i-lucide-layers" class="text-primary size-5" />
            </div>
            <div>
              <span class="text-default text-md font-semibold">{{ $t("editor.addSection.modalTitle") }}</span>
              <p class="text-muted text-sm">{{ $t("editor.addSection.modalSubtitle") }}</p>
            </div>
          </div>
        </template>
        <div class="py-2">
          <div v-if="availableSectionTypes.length === 0" class="text-muted p-3 text-center">
            <p>{{ $t("editor.addSection.empty") }}</p>
          </div>
          <div v-else class="grid grid-cols-2 gap-2">
            <button
              v-for="sectionType in availableSectionTypes"
              :key="sectionType"
              type="button"
              class="border-default/20 hover:border-primary/40 hover:bg-primary/5 group flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all duration-200"
              @click="handleAddSection(sectionType)"
            >
              <div
                class="bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors"
              >
                <UIcon :name="SECTION_DISPLAY_CONFIG[sectionType].icon" class="text-primary size-5" />
              </div>
              <span class="text-default text-sm font-semibold">{{ SECTION_DISPLAY_CONFIG[sectionType].label }} </span>
              <UIcon
                name="i-lucide-chevron-right"
                class="text-muted-foreground group-hover:text-primary ml-auto size-5 transition-colors"
              />
            </button>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <UButton color="neutral" variant="ghost" @click="closeModal">{{ $t("common.cancel") }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
