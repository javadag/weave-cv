<script setup lang="ts">
import { determineDisplayMode, isContentEmpty } from "~/utils/preview/core/entryUtils"
import type { AdvancedSectionTypeSchema } from "~/utils/schemas/content.schema"
import type { TAdvancedSectionVariant } from "~/utils/schemas/shared.schema"
import DescriptionContent from "./content/DescriptionContent.vue"

interface Props {
  index: number
  sid: string
  contentId: string
  sectionType: (typeof AdvancedSectionTypeSchema.options)[number]
  lineId: string
}

const props = defineProps<Props>()

const { updateHeight } = usePreviewStore()
useSelfResizeObserver((height) => {
  updateHeight(props.lineId, height)
})

const { getContentLine } = usePreviewStore()

const contentLine = computed(() => getContentLine(props.contentId)[props.index] ?? "")

const isLast = computed(() => getContentLine(props.contentId).length === props.index + 1)

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const typography = computed(() => configs.value.general.typography)
const layout = computed(() => configs.value.general.layout)
const sectionConfigs = computed(() => configs.value[props.sectionType])

const displayMode = computed<TAdvancedSectionVariant | "columns">(() =>
  determineDisplayMode({
    columns: layout.value.columns,
    displayMode: sectionConfigs.value.variant
  })
)

const contentStyle = computed(() => ({
  width: "100%",
  display: "flex",
  flexDirection: displayMode.value === "columns" || displayMode.value === "stacked" ? ("column" as const) : undefined,
  paddingBottom: isLast.value ? `${0.6 * typography.value.lineHeight * layout.value.sectionGap}px` : undefined
}))

const resumeStore = useResumeStore()
const { core } = storeToRefs(resumeStore)

const content = computed(() => {
  return core.value?.[props.sid]?.contents?.find((content) => content.id === props.contentId)
})

const contentLayoutWidth = computed(() =>
  displayMode.value === "contentFirst"
    ? layout.value.contentLayout.contentFirstWidth
    : layout.value.contentLayout.dateFirstWidth
)
</script>
<template>
  <div
    v-if="content && !isContentEmpty(content)"
    ref="elementRef"
    :style="{
      wordBreak: 'break-word'
    }"
  >
    <div :style="contentStyle">
      <template v-if="displayMode === 'contentFirst'">
        <div :style="{ width: `${contentLayoutWidth.left}%` }">
          <DescriptionContent :html="contentLine ?? ''" :is-last="isLast" />
        </div>
      </template>
      <template v-if="displayMode === 'dateFirst'">
        <div :style="{ width: `${contentLayoutWidth.left}%` }"></div>
        <div :style="{ width: `${contentLayoutWidth.right}%` }">
          <DescriptionContent :html="contentLine ?? ''" :is-last="isLast" />
        </div>
      </template>
      <template v-if="displayMode === 'stacked'">
        <DescriptionContent :html="contentLine ?? ''" :is-last="isLast" />
      </template>
      <template v-if="displayMode === 'columns'">
        <DescriptionContent :html="contentLine ?? ''" :is-last="isLast" />
      </template>
    </div>
  </div>
</template>
