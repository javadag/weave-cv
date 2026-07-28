<script setup lang="ts">
import { computed, type CSSProperties } from "vue"
import DescriptionContent from "~/components/resume/preview/advanced/content/DescriptionContent.vue"
import { hasValidDescription } from "~/utils/preview/core/entryUtils"
import type { TBasicSectionConfigs } from "~/utils/schemas/configs/sectionsConfigs.schema"
import type { TBasicContent } from "~/utils/schemas/content.schema"
import BasicTitle from "./BasicTitle.vue"

interface Props {
  contents: TBasicContent[]
  sectionConfigs: TBasicSectionConfigs
}

const props = defineProps<Props>()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const layout = computed(() => configs.value.general.layout)
const hasInfo = computed(() => hasValidDescription(props.contents))
const nrOfColumns = computed(() => (layout.value.columns === "2" ? 1 : props.sectionConfigs.grids))

const spacingFactor = computed(() => configs.value.general.layout.sectionGap)
const lineHeight = computed(
  () => configs.value.general.typography.lineHeight / configs.value.general.typography.fontSize
)

const splitIntoColumns = (numColumns: number) => {
  const columns: TBasicContent[][] = Array.from({ length: numColumns }, () => [])
  for (const [index, content] of props.contents.entries()) {
    const columnIndex = index % numColumns
    if (columns[columnIndex]) {
      columns[columnIndex].push(content)
    }
  }
  return columns
}

const columns = computed(() => splitIntoColumns(nrOfColumns.value))

const gridStyle = computed(() => ({
  display: "grid",
  gap: "1.5em",
  gridTemplateColumns: Array.from({ length: nrOfColumns.value }, () => "1fr").join(" ")
}))

const getItemContainerStyle = (isLast: boolean): CSSProperties => {
  const marginBottom = isLast
    ? undefined
    : `${(hasInfo.value ? 0.75 : 0.45) * lineHeight.value * Math.sqrt(spacingFactor.value)}em`

  return {
    display: "flex",
    flexDirection: "column",
    marginBottom
  }
}
</script>

<template>
  <div :style="gridStyle">
    <div v-for="(columnItems, colIndex) in columns" :key="colIndex">
      <div
        v-for="(content, itemIndex) in columnItems"
        :key="`col-${colIndex}-item-${itemIndex}`"
        :style="getItemContainerStyle(itemIndex === columnItems.length - 1)"
      >
        <BasicTitle :title="content.title" :url="content.url" :section-configs="sectionConfigs" />
        <DescriptionContent v-if="content.description" :html="content.description" />
      </div>
    </div>
  </div>
</template>
