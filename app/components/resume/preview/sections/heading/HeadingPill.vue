<script setup lang="ts">
import type { CSSProperties } from "vue"

const props = defineProps<{
  section: { title: string }
  headingColor: string
  iconHtml?: string | null
  iconSize?: number
}>()

const backgroundColor = computed(() => {
  const hex = props.headingColor.replace("#", "")
  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, 0.15)`
})

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
      backgroundColor: backgroundColor,
      color: props.headingColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '0.3em 1em',
      borderRadius: '1.5em'
    }"
  >
    <span v-if="iconHtml" :style="iconStyle" v-html="iconHtml" />
    {{ props.section.title }}
  </div>
</template>
