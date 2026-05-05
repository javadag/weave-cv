<script setup lang="ts">
import NumberInput from "~/components/ui/NumberInput.vue"
import SelectItem from "~/components/ui/SelectItem.vue"
import { SECTION_CONFIGS_CONFIG, SECTION_DISPLAY_CONFIG } from "~/constants/sectionConfigs"
import { separatorOptions, titleStyleOptions, variantOptions } from "~/utils/options/sharedOptions"
import { BasicSectionTypeSchema } from "~/utils/schemas/content.schema"
import type { TSeparator, TVariant } from "~/utils/schemas/shared.schema"
import ConfigsContainer from "../wrapper/ConfigsContainer.vue"
import ConfigWrapper from "../wrapper/ConfigWrapper.vue"

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const { updateConfig } = configsStore

const handleUpdate = (sectionType: string, key: string, value: unknown) => {
  updateConfig(`${sectionType}.${key}`, value)
}

const getConfigValue = (sectionType: string, key: string) => {
  const sectionConfig = configs.value[sectionType as keyof typeof configs.value]
  if (sectionConfig && typeof sectionConfig === "object" && key in sectionConfig) {
    return (sectionConfig as Record<string, unknown>)[key]
  }
  return null
}
</script>

<template>
  <template v-for="sectionType in BasicSectionTypeSchema.options" :key="sectionType">
    <ConfigsContainer
      v-if="SECTION_CONFIGS_CONFIG[sectionType]?.length > 0"
      :title="SECTION_DISPLAY_CONFIG[sectionType].label"
      :icon="SECTION_DISPLAY_CONFIG[sectionType].icon"
    >
      <ConfigWrapper :title="$t('editor.configs.layout')">
        <SelectItem
          v-if="SECTION_CONFIGS_CONFIG[sectionType].includes('variant')"
          :model-value="getConfigValue(sectionType, 'variant') as string"
          :label="$t('editor.configs.variant')"
          :options="variantOptions"
          @update:model-value="(value) => handleUpdate(sectionType, 'variant', value as TVariant)"
        />
        <NumberInput
          v-if="
            getConfigValue(sectionType, 'variant') === 'grid' && SECTION_CONFIGS_CONFIG[sectionType].includes('grids')
          "
          :model-value="getConfigValue(sectionType, 'grids') as number"
          :label="$t('editor.configs.grids')"
          :min="1"
          :max="4"
          @update:model-value="(value) => handleUpdate(sectionType, 'grids', value)"
        />
        <SelectItem
          v-if="
            getConfigValue(sectionType, 'variant') === 'inline' &&
            SECTION_CONFIGS_CONFIG[sectionType].includes('separator')
          "
          :model-value="getConfigValue(sectionType, 'separator') as string"
          :label="$t('editor.configs.separator')"
          :options="separatorOptions"
          @update:model-value="(value) => handleUpdate(sectionType, 'separator', value as TSeparator)"
        />
        <SelectItem
          v-if="SECTION_CONFIGS_CONFIG[sectionType].includes('titleStyle')"
          :model-value="getConfigValue(sectionType, 'titleStyle') as string"
          :label="$t('editor.configs.titleStyle')"
          :options="titleStyleOptions"
          @update:model-value="(value) => handleUpdate(sectionType, 'titleStyle', value)"
        />
      </ConfigWrapper>
    </ConfigsContainer>
  </template>
</template>
