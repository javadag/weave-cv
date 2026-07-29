<script setup lang="ts">
import type { CSSProperties } from "vue"
import { PAPER_SIZES } from "~/constants/papers"

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const typography = computed(() => configs.value.general.typography)

const pageStyles = computed<CSSProperties>(() => {
  const paperSize = PAPER_SIZES[configs.value.general.layout.size]
  const isTopPersonal = configs.value.general.layout.personalPosition === "top"

  return {
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    lineHeight: String(typography.value.lineHeight),
    fontSize: `${typography.value.fontSize}pt`,
    fontFamily: `${typography.value.fontFamily}, sans-serif`,
    fontStretch: "normal",
    textRendering: "geometricPrecision",
    fontVariantLigatures: "none",
    width: `${paperSize.w}mm`,
    height: `${paperSize.h}mm`,
    direction: configs.value.general.layout.rtl ? "rtl" : "ltr",
    backgroundColor: isTopPersonal ? configs.value.general.colors.primary.bgColor : undefined
  }
})
</script>

<template>
  <div class="resumePage" :style="pageStyles">
    <slot />
  </div>
</template>
