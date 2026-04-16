<script setup lang="ts">
import { computed, type CSSProperties } from "vue"
import type { TLinkIconType } from "~/utils/schemas/shared.schema"

const { linkIconStyles, linkStyles } = useLinkConfigs()

const LINK_ICON_PATHS: Record<TLinkIconType, string[]> = {
  arrow: [
    "M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm11-3v8h-2V6.413l-7.793 7.794l-1.414-1.414L17.585 5H13V3z"
  ],
  chain: [
    "m13.06 8.111l1.415 1.414a7 7 0 0 1 0 9.9l-.354.353a7 7 0 1 1-9.9-9.9l1.415 1.415a5 5 0 1 0 7.071 7.071l.354-.354a5 5 0 0 0 0-7.07l-1.415-1.415zm6.718 6.01l-1.414-1.414a5 5 0 0 0-7.071-7.07l-.354.353a5 5 0 0 0 0 7.07l1.415 1.415l-1.415 1.414l-1.414-1.414a7 7 0 0 1 0-9.9l.354-.353a7 7 0 1 1 9.9 9.9"
  ],
  pill: [
    "M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 0 0-7.071-7.071L9.878 7.05L8.464 5.636l1.414-1.414a7 7 0 0 1 9.9 9.9zm-2.829 2.828l-1.414 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 0 0 7.07 7.071l1.415-1.414zm-.707-10.607l1.415 1.415l-7.072 7.07l-1.414-1.414z"
  ]
}

const svgStyles = computed<CSSProperties>(() => ({
  display: "inline-block",
  fill: linkIconStyles.value.color,
  width: "0.8em",
  height: "0.8em",
  flexShrink: 0,
  paddingInlineStart: linkStyles.value.textDecoration === "underline" ? "0.1em" : "0"
}))

const selectedIconPaths = computed(() => LINK_ICON_PATHS[linkIconStyles.value.type] || LINK_ICON_PATHS.arrow)
const isVisible = computed(() => linkIconStyles.value.visible)
</script>

<template>
  <svg
    v-if="isVisible"
    :style="svgStyles"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(path, index) in selectedIconPaths" :key="index" :d="path" />
  </svg>
</template>
