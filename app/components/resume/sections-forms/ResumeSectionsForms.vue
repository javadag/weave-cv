<script setup lang="ts">
import { computed } from "vue"
import SectionsOrderControl from "~/components/resume/configs-forms/general/SectionsOrderControl.vue"
import type { TCoreSection } from "~/utils/schemas/content.schema"
import AddSectionButton from "./AddSectionButton.vue"
import SectionForm from "./advanced-section-form/SectionForm.vue"
import PersonalSectionForm from "./personal/PersonalSectionForm.vue"
import ResumeSectionsFormsSkeleton from "./ResumeSectionsFormsSkeleton.vue"

interface Props {
  loading: boolean
}

defineProps<Props>()

const resumeStore = useResumeStore()
const configsStore = useConfigsStore()
const { core, personal } = storeToRefs(resumeStore)
const { configs } = storeToRefs(configsStore)

const isTwoColumnLayout = computed(() => {
  return configs.value.general.layout.columns === "2"
})

const orderedSections = computed(() => {
  if (!core.value) {
    return []
  }

  const sections = Object.entries(core.value)

  if (isTwoColumnLayout.value) {
    const leftOrder = configs.value.general.layout.order.twoCol.left || []
    const rightOrder = configs.value.general.layout.order.twoCol.right || []
    const allOrderedIds = [...leftOrder, ...rightOrder]

    const ordered: Array<[string, TCoreSection]> = []
    const processedKeys = new Set<string>()

    for (const sectionId of allOrderedIds) {
      const sectionEntry = sections.find(([key]) => key === sectionId)
      if (sectionEntry && !processedKeys.has(sectionEntry[0])) {
        ordered.push(sectionEntry)
        processedKeys.add(sectionEntry[0])
      }
    }

    for (const sectionEntry of sections) {
      if (!processedKeys.has(sectionEntry[0])) {
        ordered.push(sectionEntry)
      }
    }

    return ordered
  }

  {
    const sectionOrder = configs.value.general.layout.order.oneCol || []

    if (sectionOrder.length === 0) {
      return sections
    }

    const ordered: Array<[string, TCoreSection]> = []
    const processedKeys = new Set<string>()

    for (const sectionId of sectionOrder) {
      const sectionEntry = sections.find(([key]) => key === sectionId)
      if (sectionEntry && !processedKeys.has(sectionEntry[0])) {
        ordered.push(sectionEntry)
        processedKeys.add(sectionEntry[0])
      }
    }

    for (const sectionEntry of sections) {
      if (!processedKeys.has(sectionEntry[0])) {
        ordered.push(sectionEntry)
      }
    }

    return ordered
  }
})

const renderSection = (sectionId: string, section: TCoreSection) =>
  h(SectionForm, { sectionId, sectionType: section.type, section })

const isOrderPanelOpen = ref(false)

const { isAllCollapsed, toggle: toggleCollapse } = useSectionsCollapse()
</script>
<template>
  <ResumeSectionsFormsSkeleton v-if="loading" />
  <div
    v-else
    class="hide-scrollbar bg-default border-default/30 flex h-full flex-col overflow-y-auto rounded-xl border"
  >
    <div class="border-default/30 flex items-center justify-between border-b px-4 py-2">
      <span class="text-2sm text-muted font-medium">{{ $t("editor.sections") }}</span>
      <div class="flex items-center gap-2">
        <AddSectionButton />
        <UTooltip :text="$t('editor.sectionsReorder')">
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-arrow-up-down"
            size="xs"
            @click="
              () => {
                isOrderPanelOpen = !isOrderPanelOpen
              }
            "
          />
        </UTooltip>
        <UTooltip :text="isAllCollapsed ? $t('editor.expandAll') : $t('editor.collapseAll')">
          <UButton
            variant="ghost"
            color="neutral"
            :icon="isAllCollapsed ? 'i-lucide-chevrons-down' : 'i-lucide-chevrons-up'"
            size="xs"
            @click="toggleCollapse"
          />
        </UTooltip>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-4">
      <UCollapsible v-if="isOrderPanelOpen" :default-open="true" class="mb-3">
        <template #content>
          <SectionsOrderControl />
        </template>
      </UCollapsible>
      <div class="flex flex-col gap-3">
        <PersonalSectionForm v-if="personal" :section="personal" />
        <component :is="() => renderSection(key, section)" v-for="[key, section] in orderedSections" :key="key" />
      </div>
    </div>
  </div>
</template>
