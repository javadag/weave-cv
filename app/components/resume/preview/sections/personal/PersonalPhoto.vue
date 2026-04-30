<script setup lang="ts">
import type { CSSProperties } from "vue"

const props = defineProps<{
  url: string
  size: number
  shape: "circle" | "rounded" | "square"
  borderWidth: number
  borderColor: string
}>()

const styles = computed<CSSProperties>(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  borderRadius: props.shape === "circle" ? "50%" : props.shape === "rounded" ? "12px" : "0",
  border: props.borderWidth > 0 ? `${props.borderWidth}px solid ${props.borderColor}` : undefined,
  objectFit: "cover",
  flexShrink: 0,
  display: "block"
}))
</script>

<template>
  <img v-if="url" :src="url" :style="styles" alt="" />
</template>
