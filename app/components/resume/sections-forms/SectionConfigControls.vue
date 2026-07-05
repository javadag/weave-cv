<script setup lang="ts">
import NumberInput from "~/components/ui/NumberInput.vue"
import SelectItem from "~/components/ui/SelectItem.vue"
import ToggleInput from "~/components/ui/ToggleInput.vue"
import { SECTION_CONFIGS_CONFIG } from "~/constants/sectionConfigs"
import { getSeparatorOptions, getTitleStyleOptions, getVariantOptions, getVariantSimpleOptions } from "~/utils/options/sharedOptions"
import { createTranslatedOptions } from "~/utils/preview/helpers"
import type { TCoreSectionType } from "~/utils/schemas/content.schema"
import { AdvancedSectionVariant } from "~/utils/schemas/shared.schema"
import type { TSeparator, TVariant, TVariantSimple } from "~/utils/schemas/shared.schema"
import type { TConfigs } from "~/utils/schemas/configs/configs.schema"

const props = defineProps<{ sectionType: TCoreSectionType }>()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const { updateConfig } = configsStore
const { t } = useI18n()

const configOptions = computed(() => SECTION_CONFIGS_CONFIG[props.sectionType] ?? [])

const advancedVariantOptions = computed(() => createTranslatedOptions(t, "editor.configs.advancedSectionVariantOptions", AdvancedSectionVariant.options))

const separatorOptions = computed(() => getSeparatorOptions(t))
const titleStyleOptions = computed(() => getTitleStyleOptions(t))
const variantOptions = computed(() => getVariantOptions(t))
const variantSimpleOptions = computed(() => getVariantSimpleOptions(t))

const isAdvancedSection = computed(() => configOptions.value.includes("titleSubtitleVariant"))
const currentVariantOptions = computed(() => (isAdvancedSection.value ? advancedVariantOptions.value : variantOptions.value))

const getConfigValue = (key: string) => {
  const sectionConfig = configs.value[props.sectionType as keyof TConfigs]
  if (sectionConfig && typeof sectionConfig === "object" && key in sectionConfig) {
    return (sectionConfig as Record<string, unknown>)[key]
  }
  return null
}

const handleUpdate = (key: string, value: unknown) => {
  updateConfig(`${props.sectionType}.${key}`, value)
}
</script>

<template>
  <div class="space-y-2 p-1">
    <SelectItem
      v-if="configOptions.includes('variant')"
      :model-value="getConfigValue('variant') as string"
      :label="$t('editor.configs.variant')"
      label-variant="stacked"
      :options="currentVariantOptions"
      @update:model-value="(value) => handleUpdate('variant', value as TVariant)"
    />
    <NumberInput
      v-if="configOptions.includes('grids') && getConfigValue('variant') === 'grid'"
      :model-value="getConfigValue('grids') as number"
      :label="$t('editor.configs.grids')"
      :min="1"
      :max="4"
      @update:model-value="(value) => handleUpdate('grids', value)"
    />
    <SelectItem
      v-if="configOptions.includes('separator') && getConfigValue('variant') === 'inline'"
      :model-value="getConfigValue('separator') as string"
      :label="$t('editor.configs.separator')"
      label-variant="stacked"
      :options="separatorOptions"
      @update:model-value="(value) => handleUpdate('separator', value as TSeparator)"
    />
    <SelectItem
      v-if="configOptions.includes('titleStyle')"
      :model-value="getConfigValue('titleStyle') as string"
      :label="$t('editor.configs.titleStyle')"
      label-variant="stacked"
      :options="titleStyleOptions"
      @update:model-value="(value) => handleUpdate('titleStyle', value)"
    />
    <SelectItem
      v-if="configOptions.includes('titleSubtitleVariant')"
      :model-value="getConfigValue('titleSubtitleVariant') as string"
      :label="$t('editor.configs.titleVariant')"
      label-variant="stacked"
      :options="variantSimpleOptions"
      @update:model-value="(value) => handleUpdate('titleSubtitleVariant', value as TVariantSimple)"
    />
    <ToggleInput
      v-if="configOptions.includes('subTitleFirst')"
      :model-value="getConfigValue('subTitleFirst') as boolean"
      :label="$t('editor.configs.subtitleFirst')"
      @update:model-value="(value) => handleUpdate('subTitleFirst', value)"
    />
    <ToggleInput
      v-if="configOptions.includes('linkInTitle')"
      :model-value="getConfigValue('linkInTitle') as boolean"
      :label="$t('editor.configs.linkInTitle')"
      @update:model-value="(value) => handleUpdate('linkInTitle', value)"
    />
  </div>
</template>
