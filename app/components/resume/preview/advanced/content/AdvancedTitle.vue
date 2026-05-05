<script setup lang="ts">
import { computed, type CSSProperties } from "vue"
import type { TLayout } from "~/utils/schemas/configs/generalConfigs.schema"
import LinkIcon from "./LinkIcon.vue"

interface Props {
  title: string
  url?: string
  isInlineLayout: boolean
  titleConfig: TLayout["contentLayout"]["title"]
}

const props = defineProps<Props>()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const typography = computed(() => configs.value.general.typography)

const titleStyles = computed<CSSProperties>(() => {
  return {
    fontWeight: props.titleConfig.fontWeight,
    fontStyle: props.titleConfig.fontStyle,
    fontSize: `${typography.value.fontSize * props.titleConfig.fontSizeMultiplier}pt`,
    textTransform: props.titleConfig.fontCase,
    display: props.isInlineLayout ? "" : "block",
    whiteSpace: "pre-wrap"
  }
})
</script>
<template v-if="title">
  <span :style="titleStyles">{{ title }}<LinkIcon v-if="url" /></span>
</template>
