<script setup lang="ts">
const { updateHeight } = usePreviewStore()
const { configs } = storeToRefs(useConfigsStore())

const height = computed(() => {
  const { sectionGap } = configs.value.general.layout
  const { lineHeight } = configs.value.general.typography

  return `${1.5 * lineHeight * sectionGap}px`
})

useSelfResizeObserver((observedHeight) => {
  updateHeight("personalSpace", observedHeight)
})
</script>
<template>
  <div ref="elementRef" :style="{ height }" />
</template>
