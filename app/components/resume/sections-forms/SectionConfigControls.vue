<script setup lang="ts">
import ButtonGroupInput from "~/components/ui/ButtonGroupInput.vue"
import SliderInput from "~/components/ui/SliderInput.vue"
import ToggleInput from "~/components/ui/ToggleInput.vue"
import { SECTION_CONFIGS_CONFIG } from "~/constants/sectionConfigs"
import { createTranslatedOptions } from "~/utils/options"
import {
  getSeparatorOptions,
  getTitleStyleOptions,
  getVariantOptions,
  getVariantSimpleOptions
} from "~/utils/options/sharedOptions"
import { CUSTOM_ICON_NAMES } from "~/utils/preview/icons"
import type { TConfigs } from "~/utils/schemas/configs/configs.schema"
import type { TCoreSectionType } from "~/utils/schemas/content.schema"
import type { TSeparator, TVariant, TVariantSimple } from "~/utils/schemas/shared.schema"
import { AdvancedSectionVariant } from "~/utils/schemas/shared.schema"

const props = defineProps<{ sectionType: TCoreSectionType }>()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const { updateConfig } = configsStore
const { t } = useI18n()

const configOptions = computed(() => SECTION_CONFIGS_CONFIG[props.sectionType] ?? [])

const VARIANT_ICONS: Record<string, string> = {
  grid: "i-lucide-grid-2x2",
  stacked: "i-lucide-rows-3",
  inline: "i-custom-same-line"
}
const SEPARATOR_ICONS: Record<string, string> = {
  pipe: CUSTOM_ICON_NAMES.pipe,
  dot: CUSTOM_ICON_NAMES.dot,
  dash: "i-lucide-minus",
  comma: CUSTOM_ICON_NAMES.comma,
  slash: "i-lucide-slash",
  none: "i-lucide-ban"
}
const TITLE_STYLE_ICONS: Record<string, string> = {
  colon: CUSTOM_ICON_NAMES.colon,
  bracket: CUSTOM_ICON_NAMES.parentheses,
  dash: "i-lucide-minus",
  none: "i-lucide-ban"
}
const ADVANCED_VARIANT_ICONS: Record<string, string> = {
  contentFirst: "i-lucide-file-text",
  dateFirst: "i-lucide-calendar",
  stacked: "i-lucide-rows-3"
}

const advancedVariantOptions = computed(() =>
  createTranslatedOptions(t, "editor.configs.advancedSectionVariantOptions", AdvancedSectionVariant.options).map(
    (o) => ({
      ...o,
      icon: ADVANCED_VARIANT_ICONS[o.value] ?? "i-lucide-square"
    })
  )
)

const separatorOptions = computed(() =>
  getSeparatorOptions(t).map((o) => ({ ...o, icon: SEPARATOR_ICONS[o.value] ?? "i-lucide-minus" }))
)
const titleStyleOptions = computed(() =>
  getTitleStyleOptions(t).map((o) => ({ ...o, icon: TITLE_STYLE_ICONS[o.value] ?? "i-lucide-minus" }))
)
const variantOptions = computed(() =>
  getVariantOptions(t).map((o) => ({ ...o, icon: VARIANT_ICONS[o.value] ?? "i-lucide-square" }))
)
const variantSimpleOptions = computed(() =>
  getVariantSimpleOptions(t).map((o) => ({ ...o, icon: VARIANT_ICONS[o.value] ?? "i-lucide-square" }))
)

const isAdvancedSection = computed(() => configOptions.value.includes("titleSubtitleVariant"))
const currentVariantOptions = computed(() =>
  isAdvancedSection.value ? advancedVariantOptions.value : variantOptions.value
)

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
    <ButtonGroupInput
      v-if="configOptions.includes('variant')"
      :model-value="getConfigValue('variant') as string"
      :label="$t('editor.configs.variant')"
      label-variant="stacked"
      :options="currentVariantOptions"
      @update:model-value="(value) => handleUpdate('variant', value as TVariant)"
    />
    <SliderInput
      v-if="configOptions.includes('grids') && getConfigValue('variant') === 'grid'"
      :model-value="getConfigValue('grids') as number"
      :label="$t('editor.configs.grids')"
      :min="1"
      :max="4"
      @update:model-value="(value) => handleUpdate('grids', value)"
    />
    <ButtonGroupInput
      icon-only
      v-if="configOptions.includes('separator') && getConfigValue('variant') === 'inline'"
      :model-value="getConfigValue('separator') as string"
      :label="$t('editor.configs.separator')"
      label-variant="stacked"
      :options="separatorOptions"
      @update:model-value="(value) => handleUpdate('separator', value as TSeparator)"
    />
    <ButtonGroupInput
      icon-only
      v-if="configOptions.includes('titleStyle')"
      :model-value="getConfigValue('titleStyle') as string"
      :label="$t('editor.configs.titleStyle')"
      label-variant="stacked"
      :options="titleStyleOptions"
      @update:model-value="(value) => handleUpdate('titleStyle', value)"
    />
    <ButtonGroupInput
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
