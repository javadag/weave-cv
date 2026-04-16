<script setup lang="ts">
import type { CSSProperties } from "vue"

interface Props {
  style: CSSProperties
  url?: string
}

const props = withDefaults(defineProps<Props>(), {
  url: undefined
})

const hasUrl = computed(() => props.url && props.url.trim() !== "")

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const combinedStyle = computed<CSSProperties>(() => ({
  color: configs.value.general.colors.primary.textColor,
  minWidth: "0",
  textDecoration: configs.value.personal.details.underline ? "underline" : "",
  textDecorationColor: configs.value.personal.details.color,
  ...props.style
}))
</script>

<template>
  <a v-if="hasUrl" :href="url" target="_blank" rel="noopener noreferrer" :style="combinedStyle">
    <slot />
  </a>
  <span v-else :style="combinedStyle">
    <slot />
  </span>
</template>
