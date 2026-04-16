<script setup lang="ts">
import { computed, h } from "vue"
import type { TIconStyle } from "~/utils/schemas/shared.schema"

interface Props {
  size: number
  style: TIconStyle
  color?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: "currentColor",
  icon: undefined
})

type FrameType = "none" | "circle" | "square"
type FrameStyle = "fill" | "outline"

const STYLE_CONFIG: Record<TIconStyle, { type: FrameType; frameStyle: FrameStyle }> = {
  simple: { type: "none", frameStyle: "fill" },
  filledRounded: { type: "circle", frameStyle: "fill" },
  filledSquare: { type: "square", frameStyle: "fill" },
  outlineRounded: { type: "circle", frameStyle: "outline" },
  outlineSquare: { type: "square", frameStyle: "outline" }
}

const frameConfig = computed(() => STYLE_CONFIG[props.style])
const { configs } = storeToRefs(useConfigsStore())

const innerIconColor = computed(() =>
  frameConfig.value.frameStyle === "outline" ? props.color : configs.value.general.colors.primary.bgColor
)

const VIEW_BOX_SIZE = 24
const ICON_SCALE = 0.7
const ICON_OFFSET = (VIEW_BOX_SIZE * (1 - ICON_SCALE)) / 2

const createIconPath = (fillColor: string) =>
  h("path", {
    d: props.icon!,
    fill: fillColor,
    stroke: "none"
  })

const createSimpleIcon = () =>
  h(
    "svg",
    {
      width: `${props.size}`,
      height: `${props.size}`,
      viewBox: `0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      role: "img",
      style: {
        display: "inline-flex",
        justifyContent: "center",
        aliitems: "center",
        verticalAlign: "middle",
        flexShrink: 0
      }
    },
    [createIconPath(props.color)]
  )

const createSquareFramedIcon = () => {
  const isOutline = frameConfig.value.frameStyle === "outline"

  return h(
    "svg",
    {
      width: `${props.size}`,
      height: `${props.size}`,
      viewBox: `0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`,
      xmlns: "http://www.w3.org/2000/svg",
      role: "img",
      style: {
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0
      }
    },
    [
      h("rect", {
        x: "0.5",
        y: "0.5",
        width: `${VIEW_BOX_SIZE - 1}`,
        height: `${VIEW_BOX_SIZE - 1}`,
        rx: "0",
        fill: isOutline ? "none" : props.color,
        stroke: isOutline ? props.color : "none",
        "stroke-width": isOutline ? "1" : "0"
      }),
      h(
        "g",
        {
          transform: `translate(${ICON_OFFSET}, ${ICON_OFFSET}) scale(${ICON_SCALE})`
        },
        [createIconPath(innerIconColor.value)]
      )
    ]
  )
}

const createCircularFramedIcon = () => {
  const isOutline = frameConfig.value.frameStyle === "outline"

  return h(
    "svg",
    {
      width: `${props.size}`,
      height: `${props.size}`,
      viewBox: `0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`,
      xmlns: "http://www.w3.org/2000/svg",
      role: "img",
      style: {
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0
      }
    },
    [
      h("circle", {
        cx: VIEW_BOX_SIZE / 2,
        cy: VIEW_BOX_SIZE / 2,
        r: VIEW_BOX_SIZE / 2,
        fill: isOutline ? "none" : props.color,
        stroke: isOutline ? props.color : "none",
        "stroke-width": isOutline ? "1" : "0"
      }),
      h(
        "g",
        {
          transform: `translate(${ICON_OFFSET}, ${ICON_OFFSET}) scale(${ICON_SCALE})`
        },
        [createIconPath(innerIconColor.value)]
      )
    ]
  )
}

const iconComponent = computed(() => {
  if (!props.icon) return null

  switch (frameConfig.value.type) {
    case "none": {
      return createSimpleIcon()
    }
    case "square": {
      return createSquareFramedIcon()
    }
    case "circle": {
      return createCircularFramedIcon()
    }
    default: {
      return null
    }
  }
})
</script>

<template>
  <component :is="iconComponent" v-if="iconComponent" />
</template>
