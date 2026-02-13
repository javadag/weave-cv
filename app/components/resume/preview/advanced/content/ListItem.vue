<script setup lang="ts">
import { computed, h, inject, type CSSProperties } from "vue"
import { calculateLineHeight } from "~/utils/preview/helpers"
import BulletIcon from "../../basic/basic/BulletIcon.vue"
import { ColumnColorsKey } from "../../pages/columnColorsContext"

interface Props {
  style?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  style: () => ({})
})

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const columnColors = inject(ColumnColorsKey)

const listStyle = computed(() => configs.value.general.layout.contentLayout.listType)
const typography = computed(() => configs.value.general.typography)
const textColor = computed(() => columnColors?.value.textColor || "")

const markerSize = computed(() => {
  return typography.value.fontSize * 0.7
})

const createSquareMarker = (color: string, size: number) =>
  h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size - 3.5,
      height: size - 3,
      viewBox: `0 0 ${size} ${size}`,
      fill: "none"
    },
    [h("rect", { width: size, height: size, fill: color })]
  )

const listMarker = computed(() => {
  switch (listStyle.value) {
    case "disc": {
      return h(BulletIcon, { sizeInPx: markerSize.value, color: textColor.value, filled: true })
    }
    case "circle": {
      return h(BulletIcon, { sizeInPx: markerSize.value, color: textColor.value, filled: false })
    }
    case "square": {
      return createSquareMarker(textColor.value, markerSize.value)
    }
    default: {
      return null
    }
  }
})

const shouldShowMarker = computed(() => {
  return listMarker.value !== null
})

const markerContainerStyles = computed<CSSProperties>(() => ({
  paddingInlineStart: "1.5px",
  width: "0.9em",
  minWidth: "0.9em",
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  height: `${calculateLineHeight(typography.value.lineHeight, typography.value.fontSize)}px`
}))

const listItemStyles = computed(() => {
  return {
    display: "flex",
    whiteSpace: "pre-wrap" as const,
    ...props.style
  }
})
</script>
<template>
  <li :style="listItemStyles">
    <div v-if="shouldShowMarker" :style="markerContainerStyles">
      <component :is="listMarker" />
    </div>
    <slot />
  </li>
</template>
