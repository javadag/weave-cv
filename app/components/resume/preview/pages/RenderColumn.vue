<script setup lang="ts">
import { computed, provide, type CSSProperties } from "vue"
import { getColumnColors } from "~/utils/preview/core/colorUtils"
import { calculateHeaderMargin } from "~/utils/preview/helpers"
import { ColumnColorsKey, type ColumnColorsContext } from "./columnColorsContext"

interface Props {
  side: "left" | "right"
}

const { side } = defineProps<Props>()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const layout = computed(() => configs.value.general.layout)
const colors = computed(() => configs.value.general.colors)

const { left, right } = getColumnColors(colors.value, layout.value.personalPosition)
const columnColors = computed<ColumnColorsContext>(() => (side === "left" ? left : right))
const hasUniformBackground = computed(() => left.bgColor === right.bgColor || layout.value.personalPosition === "top")

const columnStyles = computed<CSSProperties>(() => {
  const isSideLayout = layout.value.personalPosition === "left" || layout.value.personalPosition === "right"
  const width = side === "left" ? layout.value.columnsWidth.left : layout.value.columnsWidth.right

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
