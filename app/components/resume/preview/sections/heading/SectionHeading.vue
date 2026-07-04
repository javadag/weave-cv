<script setup lang="ts">
import type { CSSProperties } from "vue"
import { getIcon, getSectionIconNameWithCustom } from "~/utils/preview/helpers"
import { ColumnColorsKey } from "../../pages/columnColorsContext"
import HeadingBorder from "./HeadingBorder.vue"
import HeadingPill from "./HeadingPill.vue"
import HeadingPlain from "./HeadingPlain.vue"
import HeadingUnderline from "./HeadingUnderline.vue"
import HeadingUnderlineFull from "./HeadingUnderlineFull.vue"
import HeadingVerticalBorder from "./HeadingVerticalBorder.vue"

const props = defineProps<{
  sid: string
  elementId: string
}>()

const { updateHeight } = usePreviewStore()

useSelfResizeObserver((height) => {
  updateHeight(props.elementId, height)
})

const resumeStore = useResumeStore()
const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const { core } = storeToRefs(resumeStore)

const section = computed(() => {
  return core.value?.[props.sid]
})

const headingConfigs = computed(() => configs.value.general.headings)
const colorsConfigs = computed(() => configs.value.general.colors)
const layoutConfigs = computed(() => configs.value.general.layout)
const typographyConfigs = computed(() => configs.value.general.typography)

const columnColors = inject(ColumnColorsKey)

const headingColor = computed(() => {
  const applyAccentColor = colorsConfigs.value.apply.includes("headings")
  if (!columnColors) return colorsConfigs.value.secondary.textColor
  return applyAccentColor ? columnColors?.value.accentColor : columnColors?.value.textColor
})

const containerStyle = computed<CSSProperties>(() => ({
  display: "flex",
  alignItems: "center",
  fontWeight: headingConfigs.value.fontWeight,
  textTransform: headingConfigs.value.fontCase,
  fontSize: `${typographyConfigs.value.fontSize * headingConfigs.value.fontSizeMultiplier}pt`,
  color: headingColor.value,
  paddingBottom: `${0.5 * typographyConfigs.value.lineHeight * layoutConfigs.value.sectionGap}px`
}))

const headingVariant = computed(() => headingConfigs.value.variant)

const heading = computed(() => {
  return {
    plain: HeadingPlain,
    underline: HeadingUnderline,
    "underline-full": HeadingUnderlineFull,
    pill: HeadingPill,
    border: HeadingBorder,
    "vertical-border": HeadingVerticalBorder
  }[headingVariant.value]
})

const iconHtml = computed(() => {
  const iconConfig = headingConfigs.value.icon
  if (!iconConfig?.visible || !section.value?.type) return null

  const iconName = getSectionIconNameWithCustom(section.value.type, iconConfig.custom)
  if (!iconName) return null

  return getIcon(iconName, iconConfig.size)
})

const iconSize = computed(() => headingConfigs.value.icon?.size || 16)
</script>
<template>
  <div v-if="section?.isTitleVisible && section.title && section" ref="elementRef" :style="containerStyle">
    <component
      :is="heading"
      :section="section"
      :heading-color="headingColor"
      :icon-html="iconHtml"
      :icon-size="iconSize"
    />
  </div>
</template>
