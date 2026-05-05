<script setup lang="ts">
import { computed, toRef } from "vue"
import { useLinkConfigs } from "~/composables/useLinkConfigs"
import type { AdvancedSectionTypeSchema } from "~/utils/schemas/content.schema"
import { ColumnColorsKey } from "../../pages/columnColorsContext"
import Subtitle from "./AdvancedSubtitle.vue"
import Title from "./AdvancedTitle.vue"

interface Props {
  width?: number
  title?: string
  subtitle?: string
  url?: string
  isInColumn: boolean
  sectionType: (typeof AdvancedSectionTypeSchema.options)[number]
}

const props = defineProps<Props>()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const sectionConfigs = computed(() => configs.value[props.sectionType])

const layout = computed(() => configs.value.general.layout)
const typography = computed(() => configs.value.general.typography)
const titleConfig = computed(() => layout.value.contentLayout.title)
const subtitleConfig = computed(() => layout.value.contentLayout.subtitle)

const columnColors = inject(ColumnColorsKey)

const containerStyles = computed(() => ({
  width: `${props.width}%`,
  display: props.title || props.subtitle ? "inline-block" : "",
  paddingBottom: `${0.4 * typography.value.lineHeight * layout.value.sectionGap}px`,
  color: columnColors?.value.textColor || ""
}))

const { isLink, linkAttributes, linkStyles } = useLinkConfigs(toRef(props, "url"))
</script>

<template>
  <div :style="containerStyles">
    <component
      :is="isLink && sectionConfigs.linkInTitle ? 'a' : 'span'"
      v-if="title"
      :style="isLink && sectionConfigs.linkInTitle ? linkStyles : {}"
      v-bind="isLink && sectionConfigs.linkInTitle ? linkAttributes : {}"
    >
      <Title
        :is-inline-layout="sectionConfigs.titleSubtitleVariant === 'inline'"
        :title-config="titleConfig"
        :title="title"
        :url="isLink && sectionConfigs.linkInTitle ? url : undefined"
      />
    </component>
    <span
      v-if="subtitle && sectionConfigs.titleSubtitleVariant === 'inline'"
      :style="{ fontSize: `${typography.fontSize * titleConfig.fontSizeMultiplier}pt` }"
      >,
    </span>
    <component
      :is="isLink && !sectionConfigs.linkInTitle ? 'a' : 'span'"
      v-if="subtitle"
      :style="isLink && !sectionConfigs.linkInTitle ? linkStyles : {}"
      v-bind="isLink && !sectionConfigs.linkInTitle ? linkAttributes : {}"
    >
      <Subtitle
        :subtitle="subtitle"
        :url="isLink && !sectionConfigs.linkInTitle ? url : undefined"
        :subtitle-config="subtitleConfig"
      />
    </component>
  </div>
</template>
