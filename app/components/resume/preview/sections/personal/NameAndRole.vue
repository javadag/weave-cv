<script setup lang="ts">
import type { CSSProperties } from "vue"

interface Props {
  isSameLine: boolean
}
const { isSameLine } = defineProps<Props>()

const resumeStore = useResumeStore()
const { personal } = storeToRefs(resumeStore)

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const colors = computed(() => configs.value.general.colors)
const personalConfigs = computed(() => configs.value.personal)
const mainConfigs = computed(() => personalConfigs.value.main)

const color = computed(() =>
  colors.value.apply.includes("name") ? colors.value.primary.accentColor : colors.value.primary.textColor
)

const isStacked = computed(() => mainConfigs.value.variant === "stacked")

const containerStyles = computed<CSSProperties>(() => ({
  color: color.value,
  display: "flex",
  flexDirection: isStacked.value ? "column" : "row",
  alignItems: isStacked.value ? personalConfigs.value.align : "center",
  justifyContent: isStacked.value ? "flex-start" : personalConfigs.value.align,
  paddingBottom: isSameLine ? undefined : `${mainConfigs.value.bottomSpace}px`
}))

const nameStyles = computed<CSSProperties>(() => ({
  fontSize: `${personalConfigs.value.main.title.fontSize}pt`,
  fontWeight: personalConfigs.value.main.title.fontWeight,
  marginInlineEnd: isStacked.value ? "0" : "0.3em"
}))

const jobTitleStyles = computed<CSSProperties>(() => ({
  fontWeight: personalConfigs.value.main.subtitle.fontWeight,
  fontSize: `${personalConfigs.value.main.subtitle.fontSize}pt`
}))
</script>

<template>
  <div :style="containerStyles">
    <span :style="nameStyles">
      {{ personal?.title }}
    </span>
    <span v-if="personal?.subtitle" :style="jobTitleStyles">
      {{ personal?.subtitle }}
    </span>
  </div>
</template>
