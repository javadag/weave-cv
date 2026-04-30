<script setup lang="ts">
import { capitalize } from "vue"
import SelectItem from "~/components/ui/SelectItem.vue"
import ToggleInput from "~/components/ui/ToggleInput.vue"
import { SECTION_CONFIGS_CONFIG, SECTION_DISPLAY_CONFIG } from "~/constants/sectionConfigs"
import { variantSimpleOptions } from "~/utils/options/sharedOptions"
import type { TConfigs } from "~/utils/schemas/configs/configs.schema"
import { AdvancedSectionTypeSchema } from "~/utils/schemas/content.schema"
import { AdvancedSectionVariant, type TVariantSimple } from "~/utils/schemas/shared.schema"
import ConfigsContainer from "../wrapper/ConfigsContainer.vue"
import ConfigWrapper from "../wrapper/ConfigWrapper.vue"

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const { updateConfig } = configsStore

const handleUpdate = (sectionType: string, key: string, value: unknown) => {
  updateConfig(`${sectionType}.${key}`, value)
}

const getConfigValue = (sectionType: string, key: string) => {
  const sectionConfig = configs.value[sectionType as keyof TConfigs]
  if (sectionConfig && typeof sectionConfig === "object" && key in sectionConfig) {
    return (sectionConfig as Record<string, unknown>)[key]
  }
  return null
}

const advancedVariantOptions = AdvancedSectionVariant.options.map((option) => ({
  label: capitalize(option),
  value: option
}))
</script>

<template>
  <template v-for="sectionType in AdvancedSectionTypeSchema.options" :key="sectionType">
    <ConfigsContainer
      :title="SECTION_DISPLAY_CONFIG[sectionType].label"
      :icon="SECTION_DISPLAY_CONFIG[sectionType].icon"
    >
      <ConfigWrapper :title="$t('editor.configs.layout')" variant="grid">
        <SelectItem
          v-if="SECTION_CONFIGS_CONFIG[sectionType].includes('variant')"
          :model-value="getConfigValue(sectionType, 'variant') as string"
          :label="$t('editor.configs.variant')"
          label-variant="stacked"
          :options="advancedVariantOptions"
          @update:model-value="(value) => handleUpdate(sectionType, 'variant', value)"
        />
        <SelectItem
          v-if="SECTION_CONFIGS_CONFIG[sectionType].includes('titleSubtitleVariant')"
          :model-value="getConfigValue(sectionType, 'titleSubtitleVariant') as string"
          :label="$t('editor.configs.titleVariant')"
          label-variant="stacked"
          :options="variantSimpleOptions"
          @update:model-value="(value) => handleUpdate(sectionType, 'titleSubtitleVariant', value as TVariantSimple)"
        />
        <ToggleInput
          v-if="SECTION_CONFIGS_CONFIG[sectionType].includes('subTitleFirst')"
          :model-value="getConfigValue(sectionType, 'subTitleFirst') as boolean"
          :label="$t('editor.configs.subtitleFirst')"
          @update:model-value="(value) => handleUpdate(sectionType, 'subTitleFirst', value)"
        />
      </ConfigWrapper>
    </ConfigsContainer>
  </template>
</template>
