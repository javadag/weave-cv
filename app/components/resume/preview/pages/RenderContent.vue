<script setup lang="ts">
import type { CSSProperties } from "vue"
import { calculateHeaderMargin } from "~/utils/preview/helpers"
import { ColumnColorsKey } from "./columnColorsContext"

interface Props {
  isFirstPage: boolean
}

const { isFirstPage } = defineProps<Props>()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const layout = computed(() => configs.value.general.layout)
const colors = computed(() => configs.value.general.colors)

const contentStyles = computed<CSSProperties>(() => {
  const { bgColor, textColor } = colors.value.secondary
  const isSideLayout = layout.value.personalPosition === "left" || layout.value.personalPosition === "right"
  const isTopLayout = layout.value.personalPosition === "top"

  const paddingTop =
    isSideLayout || (isTopLayout && isFirstPage) ? 0 : calculateHeaderMargin(layout.value.verticalMargin)
  const paddingHorizontal = isSideLayout ? 0 : layout.value.horizontalMargin

  return {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    flexGrow: "1",
    paddingTop: `${paddingTop}mm`,
    paddingBottom: layout.value.columns === "1" ? `${layout.value.verticalMargin}mm` : "0",
    paddingInlineStart: `${paddingHorizontal}mm`,
    paddingInlineEnd: `${paddingHorizontal}mm`,
    backgroundColor: bgColor,
    color: textColor
  }
})
provide(
  ColumnColorsKey,
  computed(() => configs.value.general.colors.secondary)
)
</script>

<template>
  <div :style="contentStyles">
    <slot />
  </div>
</template>
