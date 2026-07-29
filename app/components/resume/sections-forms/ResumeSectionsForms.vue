<script setup lang="ts">
import { computed } from "vue"
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
</script>

<template>
  <ResumeSectionsFormsSkeleton v-if="loading" />
  <div
    v-else
    class="hide-scrollbar bg-default border-default/30 flex h-full flex-col gap-3 overflow-y-auto rounded-xl border p-4"
  >
    <PersonalSectionForm v-if="personal" :section="personal" />
    <component :is="() => renderSection(key, section)" v-for="[key, section] in orderedSections" :key="key" />
    <AddSectionButton />
  </div>
</template>
