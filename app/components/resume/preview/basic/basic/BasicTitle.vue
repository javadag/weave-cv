<script setup lang="ts">
import { computed, toRef, type CSSProperties } from "vue"
import { useLinkConfigs } from "~/composables/useLinkConfigs"
import type { TBasicSectionConfigs } from "~/utils/schemas/configs/sectionsConfigs.schema"
import LinkIcon from "../../advanced/content/LinkIcon.vue"

interface Props {
  title: string
  url?: string
  sectionConfigs: TBasicSectionConfigs
}

const props = defineProps<Props>()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const typography = computed(() => configs.value.general.typography)
const titleConfigs = computed(() => configs.value.general.layout.contentLayout.title)

const displayText = computed(() => {
  if (props.sectionConfigs.titleStyle === "colon") {
    return `${props.title}:`
  }

  if (props.sectionConfigs.titleStyle === "dash") {
    return `${props.title} — `
  }
  return props.title
})

const baseTextStyles = computed<CSSProperties>(() => ({
  overflowWrap: "break-word",
  fontWeight: titleConfigs.value.fontWeight,
  fontSize: `${typography.value.fontSize * titleConfigs.value.fontSizeMultiplier}pt`,
  fontCase: titleConfigs.value.fontCase,
  fontStyle: titleConfigs.value.fontStyle
}))

const { isLink, linkAttributes, linkStyles } = useLinkConfigs(toRef(props, "url"))

const textStyles = computed(() => ({
  ...baseTextStyles.value,
  ...(isLink.value && linkStyles.value)
}))
</script>

<template>
  <a v-if="isLink" v-bind="linkAttributes" :style="textStyles">
    {{ displayText }}
    <LinkIcon />
  </a>
  <span v-else :style="textStyles">
    {{ displayText }}
  </span>
</template>
