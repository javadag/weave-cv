<script setup lang="ts">
import { computed, type CSSProperties } from "vue"
import { determineDisplayMode, isContentEmpty } from "~/utils/preview/core/entryUtils"
import type { AdvancedSectionTypeSchema, TAdvancedContent } from "~/utils/schemas/content.schema"
import type { TAdvancedSectionVariant } from "~/utils/schemas/shared.schema"
import DateLocation from "./content/DateLocation.vue"
import TitleSubtitle from "./content/TitleSubtitle.vue"

interface Props {
  sid: string
  contentId: string
  sectionType: (typeof AdvancedSectionTypeSchema.options)[number]
}

const props = defineProps<Props>()

const resumeStore = useResumeStore()
const { core } = storeToRefs(resumeStore)
const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const content = computed(
  () => core.value?.[props.sid]?.contents?.find((content) => content.id === props.contentId) as TAdvancedContent
)

const { updateHeight } = usePreviewStore()
useSelfResizeObserver((height) => {
  updateHeight(props.contentId, height)
})

const sectionConfigs = computed(() => configs.value[props.sectionType])

const titleSubTitle = computed(() => {
  if (sectionConfigs.value.subTitleFirst) {
    return [content.value.subtitle, content.value.title]
  }
  return [content.value.title, content.value.subtitle]
})

const layout = computed(() => configs.value.general.layout)

const displayMode = computed<TAdvancedSectionVariant | "columns">(() =>
  determineDisplayMode({
    columns: layout.value.columns,
    displayMode: sectionConfigs.value.variant
  })
)

const contentStyle = computed<CSSProperties>(() => ({
  width: "100%",
  display: "flex",
  wordBreak: "break-word",
  flexDirection: displayMode.value === "columns" || displayMode.value === "stacked" ? ("column" as const) : undefined
}))

const contentLayoutWidth = computed(() =>
  displayMode.value === "contentFirst"
    ? layout.value.contentLayout.contentFirstWidth
    : layout.value.contentLayout.dateFirstWidth
)
</script>
<template>
  <div v-if="content && !isContentEmpty(content)" ref="elementRef" :style="contentStyle">
    <template v-if="displayMode === 'contentFirst'">
      <TitleSubtitle
        :width="contentLayoutWidth.left"
        :title="titleSubTitle[0]"
        :subtitle="titleSubTitle[1]"
        :url="content.url"
        :is-in-column="false"
        :section-type="sectionType"
      />
      <DateLocation
        :width="contentLayoutWidth.right"
        :position="displayMode"
        :start-date="content.startDate"
        :end-date="content.endDate"
        :location="content.location"
        :present="content.present"
        :show-date-day="content.showDateDay"
      />
    </template>
    <template v-if="displayMode === 'dateFirst'">
      <DateLocation
        :width="contentLayoutWidth.left"
        :position="displayMode"
        :start-date="content.startDate"
        :end-date="content.endDate"
        :location="content.location"
        :present="content.present"
        :show-date-day="content.showDateDay"
      />
      <TitleSubtitle
        :width="contentLayoutWidth.right"
        :title="titleSubTitle[0]"
        :subtitle="titleSubTitle[1]"
        :url="content.url"
        :is-in-column="false"
        :section-type="sectionType"
      />
    </template>
    <template v-if="displayMode === 'stacked'">
      <div :style="{ display: 'flex', justifyContent: 'space-between' }">
        <TitleSubtitle
          :title="titleSubTitle[0]"
          :subtitle="titleSubTitle[1]"
          :url="content.url"
          :is-in-column="false"
          :section-type="sectionType"
        />
        <DateLocation
          :position="displayMode"
          :style="{ display: 'flex', justifyContent: 'flex-end', alignItems: 'start' }"
          :start-date="content.startDate"
          :end-date="content.endDate"
          :location="content.location"
          :present="content.present"
          :show-date-day="content.showDateDay"
        />
      </div>
    </template>
    <template v-if="displayMode === 'columns'">
      <TitleSubtitle
        :title="titleSubTitle[0]"
        :subtitle="titleSubTitle[1]"
        :url="content.url"
        :is-in-column="true"
        :section-type="sectionType"
      />
      <DateLocation
        v-if="content.startDate || content.endDate || content.location"
        :position="displayMode"
        :start-date="content.startDate"
        :end-date="content.endDate"
        :location="content.location"
        :present="content.present"
        :show-date-day="content.showDateDay"
      />
    </template>
  </div>
</template>
