<script setup lang="ts">
import type { CSSProperties } from "vue"

const props = defineProps<{
  section: { title: string }
  headingColor: string
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
  <div
    :style="{
      borderColor: props.headingColor,
      borderBlockStartWidth: '0.15em',
      borderBlockEndWidth: '0.15em',
      padding: '0.15em 0.5em',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      borderRadius: '0.2em'
    }"
  >
    <span v-if="iconHtml" :style="iconStyle" v-html="iconHtml" />
    {{ props.section.title }}
  </div>
</template>
