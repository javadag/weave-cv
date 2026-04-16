<script setup lang="ts">
const { updateHeight } = usePreviewStore()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const height = computed(() => {
  const verticalMargin = configs.value.general.layout.verticalMargin
  const spacingHeight = 0.4 * verticalMargin

  return `${spacingHeight}mm`
})

const { elementRef } = useSelfResizeObserver((height) => {
  updateHeight("personalSpace", height)
})
</script>
<template>
  <div ref="elementRef" :style="{ height }" />
</template>
