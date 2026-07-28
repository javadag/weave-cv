<script setup lang="ts">
import { getCustomIconSvg } from "~/utils/preview/icons"

const props = defineProps<{
  name: string
  class?: string
}>()

const svgHtml = computed(() => {
  if (props.name.startsWith("i-custom-")) {
    return getCustomIconSvg(props.name)
  }
  return null
})
</script>

<template>
  <span
    v-if="svgHtml"
    :class="[props.class, 'inline-flex items-center justify-center [&>svg]:h-full [&>svg]:w-full']"
    v-html="svgHtml"
  />
  <UIcon v-else :name="props.name" :class="props.class" />
</template>
