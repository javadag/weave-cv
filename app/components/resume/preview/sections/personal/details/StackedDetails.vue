<script setup lang="ts">
import { computed } from "vue"
import { SOLID_ICONS } from "~/constants/solidIcons"
import DetailWrapper from "./DetailWrapper.vue"
import StyledIcon from "./StyledIcon.vue"

interface Props {
  align: "left" | "center" | "right"
}
const props = defineProps<Props>()

const resumeStore = useResumeStore()
const { personal } = storeToRefs(resumeStore)

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const iconConfig = computed(() => configs.value.personal.details.icon)
const textColor = computed(() => configs.value.general.colors.primary.textColor)

const detailItems = computed(() => {
  return personal.value?.details.filter((item) => item.value && !item.isHidden) ?? []
})
</script>
<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: 'column'
    }"
  >
    <DetailWrapper
      v-for="(item, index) in detailItems"
      :key="index"
      :url="item?.url"
      :style="{
        display: 'flex',
        alignItems: 'center',
        gap: iconConfig.visible ? '0.5em' : '0',
        paddingBottom: '0.5em',
        whiteSpace: 'nowrap'
      }"
    >
      <span
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: iconConfig.visible ? '0.5em' : '0',
          textAlign: props.align,
          justifyContent: props.align === 'center' ? 'center' : props.align === 'right' ? 'flex-end' : 'flex-start',
          overflowWrap: 'anywhere',
          width: '100%'
        }"
      >
        <StyledIcon
          v-if="iconConfig.visible && iconConfig.align === 'left'"
          :icon="SOLID_ICONS[item.type]"
          :size="iconConfig.size"
          :style="iconConfig.type"
          :color="textColor"
        />
        <span class="inline-flex leading-none items-center text-center">
          {{ item.value }}
        </span>
        <StyledIcon
          v-if="iconConfig.visible && iconConfig.align === 'right'"
          :icon="SOLID_ICONS[item.type]"
          :size="iconConfig.size"
          :style="iconConfig.type"
          :color="textColor"
        />
      </span>
    </DetailWrapper>
  </div>
</template>
