<script setup lang="ts">
import { computed, type CSSProperties } from "vue"
import type { TLayout } from "~/utils/schemas/configs/generalConfigs.schema"
import LinkIcon from "./LinkIcon.vue"

interface Props {
  subtitle: string
  url?: string
  subtitleConfig: TLayout["contentLayout"]["subtitle"]
}

const props = defineProps<Props>()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const typography = computed(() => configs.value.general.typography)

const subtitleStyles = computed<CSSProperties>(() => {
  const fontSize = typography.value.fontSize * props.subtitleConfig.fontSizeMultiplier
  return {
    fontWeight: props.subtitleConfig.fontWeight,
    fontStyle: props.subtitleConfig.fontStyle,
    fontSize: `${fontSize}pt`,
    textTransform: props.subtitleConfig.fontCase,
    whiteSpace: "pre-wrap"
  }
})
</script>
<template v-if="subtitle">
  <span :style="subtitleStyles">
    {{ subtitle }}
    <LinkIcon v-if="url" usage="EntryTitle" />
  </span>
</template>
