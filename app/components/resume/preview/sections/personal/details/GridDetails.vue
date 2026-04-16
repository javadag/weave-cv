<script setup lang="ts">
import { computed } from "vue"
import { SOLID_ICONS } from "~/constants/solidIcons"
import DetailWrapper from "./DetailWrapper.vue"
import StyledIcon from "./StyledIcon.vue"

const resumeStore = useResumeStore()
const { personal } = storeToRefs(resumeStore)

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const personalConfigs = computed(() => configs.value.personal)
const iconConfig = computed(() => configs.value.personal.details.icon)
const textColor = computed(() => configs.value.general.colors.primary.textColor)

const detailItems = computed(() => {
  return personal.value?.details.filter((item) => item.value && !item.isHidden) ?? []
})
</script>

<template>
  <div
    :style="{
      display: 'grid',
      gridTemplateColumns: detailItems.length === 1 ? '1fr' : detailItems.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
      gridColumnGap: '1em'
    }"
  >
    <div
      v-for="(item, index) in detailItems"
      :key="index"
      :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center' }"
    >
      <DetailWrapper
        :url="item?.url"
        :style="{
          display: 'flex',
          alignItems: 'center',
          justifyContent: personalConfigs.align,
          gap: iconConfig.visible ? '0.5em' : '0',
          width: '100%',
          paddingBottom: '0.5em',
          whiteSpace: 'nowrap'
        }"
      >
        <StyledIcon
          v-if="iconConfig.visible"
          :icon="SOLID_ICONS[item.type]"
          :size="iconConfig.size"
          :style="iconConfig.type"
          :color="textColor"
        />
        <span class="inline-flex leading-none items-center text-center">
          {{ item.value }}
        </span>
      </DetailWrapper>
    </div>
  </div>
</template>
