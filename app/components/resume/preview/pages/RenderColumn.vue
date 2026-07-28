<script setup lang="ts">
import { computed, provide, type CSSProperties } from "vue"
import { getColumnColors } from "~/utils/preview/core/colorUtils"
import { calculateHeaderMargin } from "~/utils/preview/units"
import { ColumnColorsKey, type ColumnColorsContext } from "./columnColorsContext"

interface Props {
  side: "left" | "right"
}

const { side } = defineProps<Props>()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const layout = computed(() => configs.value.general.layout)
const colors = computed(() => configs.value.general.colors)

const bothColumnColors = computed(() =>
  getColumnColors(colors.value, layout.value.personalPosition, layout.value.rtl)
)
const columnColors = computed<ColumnColorsContext>(() =>
  side === "left" ? bothColumnColors.value.left : bothColumnColors.value.right
)
const hasUniformBackground = computed(() =>
  bothColumnColors.value.left.bgColor === bothColumnColors.value.right.bgColor ||
  layout.value.personalPosition === "top"
)

const columnStyles = computed<CSSProperties>(() => {
  const isSideLayout = layout.value.personalPosition === "left" || layout.value.personalPosition === "right"
  const widthConfig = layout.value.rtl
    ? { left: layout.value.columnsWidth.right, right: layout.value.columnsWidth.left }
    : { left: layout.value.columnsWidth.left, right: layout.value.columnsWidth.right }
  const width = side === "left" ? widthConfig.left : widthConfig.right

  const verticalPadding = isSideLayout ? calculateHeaderMargin(layout.value.verticalMargin) : 0
  const horizontalPadding = isSideLayout ? layout.value.horizontalMargin : 0
  const sidePadding = hasUniformBackground.value ? "1em" : `${0.5 * layout.value.horizontalMargin}mm`

  const paddingStart = side === "left" ? `${horizontalPadding}mm` : sidePadding
  const paddingEnd = side === "right" ? `${horizontalPadding}mm` : sidePadding

  return {
    background: columnColors.value.bgColor,
    width: `${width}%`,
    maxWidth: `${width}%`,
    color: columnColors.value.textColor,
    paddingTop: `${verticalPadding}mm`,
    paddingBottom: `${verticalPadding}mm`,
    paddingInlineStart: paddingStart,
    paddingInlineEnd: paddingEnd
  }
})

provide(ColumnColorsKey, columnColors)
</script>

<template>
  <div :style="columnStyles">
    <slot />
  </div>
</template>
