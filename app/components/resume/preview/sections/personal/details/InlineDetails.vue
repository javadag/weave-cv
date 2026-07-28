<script setup lang="ts">
import { computed, ref } from "vue"
import { SOLID_ICONS } from "~/constants/solidIcons"
import { alignToFlex } from "~/utils/preview/layout"
import DetailWrapper from "./DetailWrapper.vue"
import StyledIcon from "./StyledIcon.vue"

const resumeStore = useResumeStore()
const { personal } = storeToRefs(resumeStore)

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const separator = computed(() => configs.value.personal.details.separator)
const iconConfig = computed(() => configs.value.personal.details.icon)
const textColor = computed(() => configs.value.general.colors.primary.textColor)

const containerRef = ref<HTMLElement>()

const detailItems = computed(() => {
  return personal.value?.details.filter((item) => item.value && !item.isHidden) ?? []
})

useInlineSeparators(containerRef, detailItems)

const alignFlex = computed(() => alignToFlex(configs.value.personal.align, configs.value.general.layout.rtl))
</script>

<template>
  <div
    ref="containerRef"
    :style="{
      justifyContent: alignFlex,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center'
    }"
  >
    <template v-for="(item, index) in detailItems" :key="`wrapper${index}`">
      <DetailWrapper
        :url="item.url"
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: iconConfig.visible ? '0.3em' : '0',
          paddingBottom: '0.5em'
        }"
      >
        <StyledIcon
          v-if="iconConfig.visible && iconConfig.align === 'left'"
          :icon="SOLID_ICONS[item.type]"
          :size="iconConfig.size"
          :style="iconConfig.type"
          :color="textColor"
        />
        <span class="inline-flex items-center text-center">
          {{ item.value }}
        </span>
        <StyledIcon
          v-if="iconConfig.visible && iconConfig.align === 'right'"
          :icon="SOLID_ICONS[item.type]"
          :size="iconConfig.size"
          :style="iconConfig.type"
          :color="textColor"
        />
      </DetailWrapper>
      <span
        v-if="index !== detailItems.length - 1"
        class="separator"
        :style="{
          paddingInline: '0.5em',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: '0.5em',
          height: 'fit-content',
          lineHeight: '1',
          color: configs.general.colors.primary.textColor
        }"
      >
        <span v-if="separator === 'dot'">•</span>
        <span v-else-if="separator === 'pipe'">|</span>
        <span v-else-if="separator === 'dash'">-</span>
        <span v-else-if="separator === 'comma'">,</span>
        <span v-else-if="separator === 'slash'">/</span>
        <span v-else>{{ separator }}</span>
      </span>
    </template>
  </div>
</template>
