<script setup lang="ts">
import { computed } from "vue"
import { useHtmlTransformers } from "~/composables/useHtmlTransformers"
import { convertHtmlToVNodes } from "~/utils/preview/core/html"

interface Props {
  html: string
  isProfileSection?: boolean
  isLast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isProfileSection: false,
  isLast: false
})

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const contentLayout = computed(() => configs.value.general.layout.contentLayout)
const typographyConfigs = computed(() => configs.value.general.typography)
const layoutConfigs = computed(() => configs.value.general.layout)

const htmlTransformers = computed(() => useHtmlTransformers())

const vNodes = computed(() => {
  return props.html ? convertHtmlToVNodes(props.html, htmlTransformers.value) : []
})

const hasIndentation = computed(() => !props.isProfileSection && contentLayout.value.indent > 0)
const paddingInlineStart = computed(() => (hasIndentation.value ? `${contentLayout.value.indent}px` : undefined))

const containerStyles = computed(() => ({
  width: "100%",
  paddingInlineStart: paddingInlineStart.value,
  whiteSpace: "pre-wrap" as const,
  wordBreak: "break-word" as const,
  paddingBottom: props.isLast
    ? undefined
    : `${0.1 * typographyConfigs.value.lineHeight * layoutConfigs.value.sectionGap}px`
}))
</script>

<template>
  <div :style="containerStyles">
    <component :is="vNode" v-for="(vNode, index) in vNodes" :key="index" />
  </div>
</template>
