<script setup lang="ts">
import { computed } from "vue"
import { SECTION_DISPLAY_CONFIG } from "~/constants/sectionConfigs"
import { ADVANCED_SECTION_TYPES, BASIC_SECTION_TYPES } from "~/constants/sectionTypes"
import type { TCoreSectionType } from "~/utils/schemas/content.schema"

const resumeStore = useResumeStore()
const { core } = storeToRefs(resumeStore)

const availableSectionTypes = computed(() => {
  const allSectionTypes: TCoreSectionType[] = [...ADVANCED_SECTION_TYPES, ...BASIC_SECTION_TYPES]
  const existingTypes = new Set(Object.values(core?.value || {}).map((section) => section.type))

  return allSectionTypes.filter((type) => !existingTypes.has(type))
})

const showAddSectionModal = ref(false)

const handleAddSection = (sectionType: TCoreSectionType) => {
  resumeStore.addSection(sectionType)
  showAddSectionModal.value = false
}
</script>

<template>
  <div>
    <UButton
      v-if="availableSectionTypes.length > 0"
      variant="subtle"
      color="primary"
      class="flex justify-center items-center gap-2 mt-2"
      @click="showAddSectionModal = true"
    >
      <UIcon name="i-lucide-plus" class="w-4 h-4" />
      {{ $t('editor.addSection.button') }}
    </UButton>

    <UModal v-model:open="showAddSectionModal">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center"
              >
                <UIcon name="i-lucide-layers" class="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-default">{{ $t('editor.addSection.modalTitle') }}</h3>
                <p class="text-sm text-muted mt-1">{{ $t('editor.addSection.modalSubtitle') }}</p>
              </div>
            </div>
          </template>

          <div class="py-2">
            <div v-if="availableSectionTypes.length === 0" class="p-4 text-center text-muted">
              <p>{{ $t('editor.addSection.empty') }}</p>
            </div>
            <div v-else class="grid grid-cols-2 gap-3">
              <button
                v-for="sectionType in availableSectionTypes"
                :key="sectionType"
                type="button"
                class="flex items-center gap-3 p-4 rounded-lg border-2 border-default/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 text-left group"
                @click="handleAddSection(sectionType)"
              >
                <div
                  class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                >
                  <UIcon :name="SECTION_DISPLAY_CONFIG[sectionType].icon" class="w-5 h-5 text-primary" />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-semibold text-default">{{ SECTION_DISPLAY_CONFIG[sectionType].label }}</h4>
                  <p class="text-sm text-muted mt-0.5 capitalize">{{ sectionType }}</p>
                </div>
                <UIcon
                  name="i-lucide-chevron-right"
                  class="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
                />
              </button>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton color="neutral" variant="ghost" @click="showAddSectionModal = false">{{ $t('common.cancel') }}</UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
