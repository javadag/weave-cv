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

const titleSubtitle = computed(() => {
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
  flexDirection: "column"
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
      <div style="display: flex">
        <TitleSubtitle
          :width="contentLayoutWidth.left"
          :title="titleSubtitle[0]"
          :subtitle="titleSubtitle[1]"
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
      </div>
    </template>
    <template v-if="displayMode === 'dateFirst'">
      <div style="display: flex">
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
          :title="titleSubtitle[0]"
          :subtitle="titleSubtitle[1]"
          :url="content.url"
          :is-in-column="false"
          :section-type="sectionType"
        />
      </div>
    </template>
    <template v-if="displayMode === 'stacked'">
      <div :style="{ display: 'flex', justifyContent: 'space-between' }">
        <TitleSubtitle
          :title="titleSubtitle[0]"
          :subtitle="titleSubtitle[1]"
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
        :title="titleSubtitle[0]"
        :subtitle="titleSubtitle[1]"
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

    <template v-for="(subRole, index) in content.subRoles" :key="index">
      <template v-if="subRole.title">
        <template v-if="displayMode === 'contentFirst'">
          <div style="display: flex">
            <TitleSubtitle
              :width="contentLayoutWidth.left"
              :title="subRole.title"
              :subtitle="subRole.subtitle"
              :is-in-column="false"
              :section-type="sectionType"
            />
            <DateLocation
              :width="contentLayoutWidth.right"
              :position="displayMode"
              :start-date="subRole.startDate"
              :end-date="subRole.endDate"
              :present="subRole.present"
              :show-date-day="subRole.showDateDay"
            />
          </div>
        </template>
        <template v-else-if="displayMode === 'dateFirst'">
          <div style="display: flex">
            <DateLocation
              :width="contentLayoutWidth.left"
              :position="displayMode"
              :start-date="subRole.startDate"
              :end-date="subRole.endDate"
              :present="subRole.present"
              :show-date-day="subRole.showDateDay"
            />
            <TitleSubtitle
              :width="contentLayoutWidth.right"
              :title="subRole.title"
              :subtitle="subRole.subtitle"
              :is-in-column="false"
              :section-type="sectionType"
            />
          </div>
        </template>
        <template v-else-if="displayMode === 'stacked'">
          <div :style="{ display: 'flex', justifyContent: 'space-between' }">
            <TitleSubtitle :title="subRole.title" :subtitle="subRole.subtitle" :is-in-column="false" :section-type="sectionType" />
            <DateLocation
              :position="displayMode"
              :style="{ display: 'flex', justifyContent: 'flex-end', alignItems: 'start' }"
              :start-date="subRole.startDate"
              :end-date="subRole.endDate"
              :present="subRole.present"
              :show-date-day="subRole.showDateDay"
            />
          </div>
        </template>
        <template v-else-if="displayMode === 'columns'">
          <TitleSubtitle :title="subRole.title" :subtitle="subRole.subtitle" :is-in-column="true" :section-type="sectionType" />
          <DateLocation
            v-if="subRole.startDate || subRole.endDate"
            :position="displayMode"
            :start-date="subRole.startDate"
            :end-date="subRole.endDate"
            :present="subRole.present"
            :show-date-day="subRole.showDateDay"
          />
        </template>
      </template>
    </template>
  </div>
</template>
