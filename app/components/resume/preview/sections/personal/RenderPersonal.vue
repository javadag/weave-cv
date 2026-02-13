<script setup lang="ts">
import type { CSSProperties } from "vue"
import NameAndRole from "./NameAndRole.vue"
import DetailsContainer from "./details/DetailsContainer.vue"

const { updateHeight } = usePreviewStore()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const colors = computed(() => configs.value.general.colors)
const layout = computed(() => configs.value.general.layout)
const personalConfigs = computed(() => configs.value.personal)

const isPersonalOnTop = computed(() => layout.value.personalPosition === "top")

const containerStyles = computed<CSSProperties>(() => ({
  paddingTop: isPersonalOnTop.value ? `${layout.value.verticalMargin}mm` : undefined,
  paddingInlineEnd: isPersonalOnTop.value ? `${layout.value.horizontalMargin}mm` : undefined,
  paddingInlineStart: isPersonalOnTop.value ? `${layout.value.horizontalMargin}mm` : undefined,
  backgroundColor: colors.value.primary.bgColor,
  paddingBottom: `${personalConfigs.value.bottomSpace}px`,
  whiteSpace: "pre-wrap",
  display: "flex",
  flexDirection: personalConfigs.value.variant === "stacked" ? "column" : "row",
  textAlign: personalConfigs.value.align,
  justifyContent:
    personalConfigs.value.align === "center"
      ? "center"
      : (personalConfigs.value.align === "left" && !layout.value.rtl) ||
          (personalConfigs.value.align === "right" && layout.value.rtl)
        ? "flex-start"
        : "flex-end",
  gap: personalConfigs.value.variant === "inline" ? "1em" : undefined
}))

const { elementRef } = useSelfResizeObserver((height) => {
  updateHeight("personal", height)
})
</script>

<template>
  <div ref="elementRef" :style="containerStyles">
    <NameAndRole :is-same-line="personalConfigs.variant === 'inline'" />
    <DetailsContainer :is-personal-on-top="isPersonalOnTop" />
  </div>
</template>
