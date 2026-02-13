<script setup lang="ts">
import type { CSSProperties } from "vue"

const props = defineProps<{
  section: { title: string }
  iconHtml?: string | null
  iconSize?: number
}>()

const iconStyle = computed<CSSProperties>(() => ({
  display: "inline-flex",
  alignItems: "center",
  marginInlineEnd: props.iconHtml ? "0.4em" : "0",
  flexShrink: 0,
  color: "currentColor"
}))
</script>
<template>
  <span :style="{ display: 'flex', alignItems: 'center' }">
    <span v-if="iconHtml" :style="iconStyle" v-html="iconHtml" />
    {{ props.section.title }}
  </span>
</template>
