<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { VueDraggable, type SortableEvent } from "vue-draggable-plus"
import { useConfigsStore } from "~/stores/configs.store"
import { useResumeStore } from "~/stores/resume.store"
import type { TCoreSection } from "~/utils/schemas/content.schema"
import ConfigWrapper from "../wrapper/ConfigWrapper.vue"

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const resumeStore = useResumeStore()
const { core } = storeToRefs(resumeStore)

const isTwoColumnLayout = computed(() => {
  return configs.value.general.layout.columns === "2"
})

const sections = computed(() => {
  const sectionOrder = configs.value.general.layout.order.oneCol || []

  if (!core.value) {
    return []
  }

  if (sectionOrder.length === 0) {
    return Object.entries(core.value).filter(([_, section]) => (section as TCoreSection).isSectionVisible) as [
      string,
      TCoreSection
    ][]
  }

  return sectionOrder
    .map((sectionId: string) => {
      const section = core.value?.[sectionId]

      if (section?.isSectionVisible) {
        return [sectionId, section] as [string, TCoreSection]
      }
      return null
    })
    .filter(Boolean) as [string, TCoreSection][]
})

const leftColumnSections = computed(() => {
  const leftSectionOrder = configs.value.general.layout.order.twoCol.left || []
  if (!isTwoColumnLayout.value || !core.value) return []

  return leftSectionOrder
    .map((sectionId: string) => {
      const section = core.value?.[sectionId]
      if (section?.isSectionVisible) {
        return [sectionId, section] as [string, TCoreSection]
      }
      return null
    })
    .filter(Boolean) as [string, TCoreSection][]
})

const rightColumnSections = computed(() => {
  const rightSectionOrder = configs.value.general.layout.order.twoCol.right || []
  if (!isTwoColumnLayout.value || !core.value) return []

  return rightSectionOrder
    .map((sectionId: string) => {
      const section = core.value?.[sectionId]
      if (section?.isSectionVisible) {
        return [sectionId, section] as [string, TCoreSection]
      }
      return null
    })
    .filter(Boolean) as [string, TCoreSection][]
})

type SectionEntry = [string, TCoreSection]
const leftColumnSectionsRef = ref<SectionEntry[]>([])
const rightColumnSectionsRef = ref<SectionEntry[]>([])
const singleColumnSectionsRef = ref<SectionEntry[]>([])

watch(
  leftColumnSections,
  (newSections) => {
    leftColumnSectionsRef.value = newSections.filter(Boolean) as SectionEntry[]
  },
  { immediate: true }
)

watch(
  rightColumnSections,
  (newSections) => {
    rightColumnSectionsRef.value = newSections.filter(Boolean) as SectionEntry[]
  },
  { immediate: true }
)

watch(
  sections,
  (newSections) => {
    singleColumnSectionsRef.value = newSections.filter(Boolean) as SectionEntry[]
  },
  { immediate: true }
)

const updateTwoColumnSections = (_event: SortableEvent) => {
  const rightOrder = rightColumnSectionsRef.value.map(([key]: SectionEntry) => key)
  const leftOrder = leftColumnSectionsRef.value.map(([key]: SectionEntry) => key)

  configsStore.updateOrder("twoCol", { left: leftOrder, right: rightOrder })
}

const updateSingleColumnSections = (_event: SortableEvent) => {
  const singleOrder = singleColumnSectionsRef.value.map(([key]: SectionEntry) => key)
  configsStore.updateOrder("oneCol", singleOrder)
}
</script>

<template>
  <ConfigWrapper :title="$t('editor.configs.sectionsOrder')">
    <div v-if="isTwoColumnLayout" class="gap-2 items-start justify-between grid grid-cols-2 mt-2">
      <VueDraggable
        ref="leftColumnRef"
        v-model="leftColumnSectionsRef"
        group="columns"
        :animation="150"
        class="flex flex-col justify-start items-start flex-1 gap-4 h-full bg-accented/30 rounded-lg p-2"
        @update="updateTwoColumnSections"
        @add="updateTwoColumnSections"
        @remove="updateTwoColumnSections"
      >
        <div
          v-for="[key, section] in leftColumnSectionsRef"
          :key="key"
          class="flex items-center gap-2 w-full p-2 rounded-lg cursor-move bg-muted"
        >
          <UIcon name="i-lucide-grip-vertical" class="text-muted-foreground" />
          <span class="text-sm font-medium capitalize">{{ section.title || section.type }}</span>
        </div>
      </VueDraggable>
      <VueDraggable
        ref="rightColumnRef"
        v-model="rightColumnSectionsRef"
        group="columns"
        :animation="150"
        class="flex flex-col justify-start items-start flex-1 h-full gap-4 bg-accented/30 rounded-lg p-2"
        @update="updateTwoColumnSections"
        @add="updateTwoColumnSections"
        @remove="updateTwoColumnSections"
      >
        <div
          v-for="[key, section] in rightColumnSectionsRef"
          :key="key"
          class="flex items-center gap-2 w-full p-2 rounded-lg cursor-move bg-muted"
        >
          <UIcon name="i-lucide-grip-vertical" class="text-muted-foreground" />
          <span class="text-sm font-medium capitalize">{{ section.title || section.type }}</span>
        </div>
      </VueDraggable>
    </div>
    <VueDraggable
      v-else
      ref="singleColumnRef"
      v-model="singleColumnSectionsRef"
      :animation="150"
      class="flex flex-col justify-start items-start flex-1 h-full gap-4 bg-accented/30 rounded-lg p-2"
      @update="updateSingleColumnSections"
    >
      <div
        v-for="[key, section] in singleColumnSectionsRef"
        :key="key"
        class="flex items-center gap-2 w-full p-2 rounded-lg cursor-move bg-muted"
      >
        <UIcon name="i-lucide-grip-vertical" class="text-muted-foreground" />
        <span class="text-sm font-medium capitalize">{{ section.title || section.type }}</span>
      </div>
    </VueDraggable>
  </ConfigWrapper>
</template>
