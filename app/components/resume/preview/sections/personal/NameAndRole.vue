<script setup lang="ts">
import { alignToFlex } from "~/utils/preview/layout"

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
const layout = computed(() => configs.value.general.layout)

const color = computed(() =>
  colors.value.apply.includes("name") ? colors.value.primary.accentColor : colors.value.primary.textColor
)

const isStacked = computed(() => mainConfigs.value.variant === "stacked")

const alignFlex = computed(() => alignToFlex(personalConfigs.value.align, layout.value.rtl))
</script>

<template>
  <div
    :style="{
      color,
      display: 'flex',
      flexDirection: isStacked ? 'column' : 'row',
      alignItems: isStacked ? alignFlex : 'center',
      justifyContent: isStacked ? 'center' : alignFlex,
      paddingBottom: isSameLine ? undefined : `${mainConfigs.bottomSpace}px`
    }"
  >
    <span
      :style="{
        fontSize: `${personalConfigs.main.title.fontSize}pt`,
        fontWeight: personalConfigs.main.title.fontWeight,
        marginInlineEnd: isStacked ? '0' : '0.3em'
      }"
    >
      {{ personal?.title }}
    </span>
    <span
      v-if="personal?.subtitle"
      :style="{
        fontWeight: personalConfigs.main.subtitle.fontWeight,
        fontSize: `${personalConfigs.main.subtitle.fontSize}pt`
      }"
    >
      {{ personal?.subtitle }}
    </span>
  </div>
</template>
