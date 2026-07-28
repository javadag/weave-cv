<script setup lang="ts">
import type { CSSProperties } from "vue"
import { alignToFlex } from "~/utils/preview/layout"
import DetailsContainer from "./details/DetailsContainer.vue"
import NameAndRole from "./NameAndRole.vue"
import PersonalPhoto from "./PersonalPhoto.vue"

const { updateHeight } = usePreviewStore()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const resumeStore = useResumeStore()
const { personal } = storeToRefs(resumeStore)

const colors = computed(() => configs.value.general.colors)
const layout = computed(() => configs.value.general.layout)
const personalConfigs = computed(() => configs.value.personal)

const isPersonalOnTop = computed(() => layout.value.personalPosition === "top")

const photoConfig = computed(() => personalConfigs.value.photo)
const photoUrl = computed(() => personal.value?.photo?.url ?? "")
const showPhoto = computed(() => !!photoUrl.value && photoConfig.value.visible)
const isPhotoSide = computed(() => showPhoto.value && photoConfig.value.position !== "top")
const isPhotoTop = computed(() => showPhoto.value && photoConfig.value.position === "top")

const flexDirection = computed<CSSProperties["flex-direction"]>(() =>
  personalConfigs.value.variant === "stacked" ? "column" : "row"
)

const alignFlex = computed(() => alignToFlex(personalConfigs.value.align, layout.value.rtl))

const justifyContent = computed(() => (flexDirection.value === "column" ? "center" : alignFlex.value))

const alignItems = computed(() => (flexDirection.value === "row" ? "center" : alignFlex.value))

const basePaddingStyles = computed(() => ({
  paddingTop: isPersonalOnTop.value ? `${layout.value.verticalMargin}mm` : undefined,
  paddingInlineEnd: isPersonalOnTop.value ? `${layout.value.horizontalMargin}mm` : undefined,
  paddingInlineStart: isPersonalOnTop.value ? `${layout.value.horizontalMargin}mm` : undefined,
  backgroundColor: isPersonalOnTop.value ? colors.value.primary.bgColor : "transparent",
  paddingBottom: `${personalConfigs.value.bottomSpace}px`,
  whiteSpace: "pre-wrap" as const,
  textAlign: personalConfigs.value.align
}))

// Original layout (no photo)
const containerStyles = computed<CSSProperties>(() => ({
  ...basePaddingStyles.value,
  display: "flex",
  flexDirection: flexDirection.value,
  justifyContent: justifyContent.value,
  alignItems: alignItems.value,
  gap: personalConfigs.value.variant === "inline" ? "1em" : undefined
}))

// Outer wrapper when photo is left/right
const sidePhotoOuterStyles = computed<CSSProperties>(() => ({
  ...basePaddingStyles.value,
  display: "flex",
  flexDirection: photoConfig.value.position === "right" ? "row-reverse" : "row",
  justifyContent: justifyContent.value,
  alignItems: "center",
  gap: "16px"
}))

// Outer wrapper when photo is top
const topPhotoOuterStyles = computed<CSSProperties>(() => ({
  ...basePaddingStyles.value,
  display: "flex",
  flexDirection: "column",
  alignItems: alignFlex.value
}))

// Inner content when photo is present (holds NameAndRole + DetailsContainer)
const innerContentStyles = computed<CSSProperties>(() => ({
  display: "flex",
  flexDirection: flexDirection.value,
  textAlign: personalConfigs.value.align,
  justifyContent: justifyContent.value,
  alignItems: alignItems.value,
  gap: personalConfigs.value.variant === "inline" ? "1em" : undefined,
  flex: "1",
  minWidth: 0
}))

useSelfResizeObserver((height) => {
  updateHeight("personal", height)
})
</script>

<template>
  <!-- Photo on left or right -->
  <div v-if="isPhotoSide" ref="elementRef" :style="sidePhotoOuterStyles">
    <PersonalPhoto
      :url="photoUrl"
      :size="photoConfig.size"
      :shape="photoConfig.shape"
      :border-width="photoConfig.border.width"
      :border-color="photoConfig.border.color"
    />
    <div :style="innerContentStyles">
      <NameAndRole :is-same-line="personalConfigs.variant === 'inline'" />
      <DetailsContainer :is-personal-on-top="isPersonalOnTop" />
    </div>
  </div>

  <!-- Photo on top -->
  <div v-else-if="isPhotoTop" ref="elementRef" :style="topPhotoOuterStyles">
    <PersonalPhoto
      :url="photoUrl"
      :size="photoConfig.size"
      :shape="photoConfig.shape"
      :border-width="photoConfig.border.width"
      :border-color="photoConfig.border.color"
    />
    <div :style="innerContentStyles">
      <NameAndRole :is-same-line="personalConfigs.variant === 'inline'" />
      <DetailsContainer :is-personal-on-top="isPersonalOnTop" />
    </div>
  </div>

  <!-- No photo or photo hidden -->
  <div v-else ref="elementRef" :style="containerStyles">
    <NameAndRole :is-same-line="personalConfigs.variant === 'inline'" />
    <DetailsContainer :is-personal-on-top="isPersonalOnTop" />
  </div>
</template>
