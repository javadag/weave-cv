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
      class="mt-2 flex items-center justify-center gap-2"
      @click="showAddSectionModal = true"
    >
      <UIcon name="i-lucide-plus" class="h-4 w-4" />
      {{ $t("editor.addSection.button") }}
    </UButton>

    <UModal v-model:open="showAddSectionModal">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div
                class="bg-primary/10 dark:bg-primary/20 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              >
                <UIcon name="i-lucide-layers" class="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 class="text-default text-lg font-semibold">{{ $t("editor.addSection.modalTitle") }}</h3>
                <p class="text-muted mt-1 text-sm">{{ $t("editor.addSection.modalSubtitle") }}</p>
              </div>
            </div>
          </template>

          <div class="py-2">
            <div v-if="availableSectionTypes.length === 0" class="text-muted p-4 text-center">
              <p>{{ $t("editor.addSection.empty") }}</p>
            </div>
            <div v-else class="grid grid-cols-2 gap-3">
              <button
                v-for="sectionType in availableSectionTypes"
                :key="sectionType"
                type="button"
                class="border-default/20 hover:border-primary/40 hover:bg-primary/5 group flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all duration-200"
                @click="handleAddSection(sectionType)"
              >
                <div
                  class="bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors"
                >
                  <UIcon :name="SECTION_DISPLAY_CONFIG[sectionType].icon" class="text-primary h-5 w-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <h4 class="text-default font-semibold">{{ SECTION_DISPLAY_CONFIG[sectionType].label }}</h4>
                  <p class="text-muted mt-0.5 text-sm capitalize">{{ sectionType }}</p>
                </div>
                <UIcon
                  name="i-lucide-chevron-right"
                  class="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors"
                />
              </button>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton color="neutral" variant="ghost" @click="showAddSectionModal = false">{{
                $t("common.cancel")
              }}</UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
