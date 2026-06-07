<script setup lang="ts">
import { computed } from "vue"
import type { BasicSectionTypeSchema } from "~/utils/schemas/content.schema"
import DescriptionContent from "../advanced/content/DescriptionContent.vue"
import GridItems from "./basic/GridItems.vue"
import InlineItems from "./basic/InlineItems.vue"
import StackedItems from "./basic/StackedItems.vue"

interface Props {
  sid: string
  sectionType: (typeof BasicSectionTypeSchema.options)[number]
}

const props = defineProps<Props>()

const { updateHeight } = usePreviewStore()
const { elementRef } = useSelfResizeObserver((height) => {
  updateHeight(props.sid, height)
})

const resumeStore = useResumeStore()
const { core } = storeToRefs(resumeStore)
const section = computed(() => core.value?.[props.sid])

const contents = computed(() => section.value?.contents ?? [])

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const sectionConfigs = computed(() => configs.value[props.sectionType])

const isSummary = computed(() => props.sectionType === "summary")

const processedContents = computed(() => {
  if (isSummary.value) {
    return contents.value.filter((content) => !content.isHidden)
  }
  return contents.value.filter(
    (content) => content && !content.isHidden && content.id && (content.description || content.title)
  )
})
</script>
<template>
  <div v-if="isSummary" ref="elementRef">
    <DescriptionContent :html="processedContents[0]?.description ?? ''" :is-profile-section="true" />
  </div>
  <div v-else-if="processedContents.length > 0" ref="elementRef" :style="{ whiteSpace: 'pre-wrap' }">
    <GridItems
      v-if="sectionConfigs.variant === 'grid'"
      :contents="processedContents"
      :section-configs="sectionConfigs"
    />
    <InlineItems
      v-else-if="sectionConfigs.variant === 'inline'"
      :contents="processedContents"
      :section-configs="sectionConfigs"
    />
    <StackedItems
      v-else-if="sectionConfigs.variant === 'stacked'"
      :contents="processedContents"
      :section-configs="sectionConfigs"
    />
  </div>
</template>
