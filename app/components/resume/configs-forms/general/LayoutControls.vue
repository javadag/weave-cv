<script setup lang="ts">
import ButtonGroupInput from "~/components/ui/ButtonGroupInput.vue"
import SelectItem from "~/components/ui/SelectItem.vue"
import SliderInput from "~/components/ui/SliderInput.vue"
import ToggleInput from "~/components/ui/ToggleInput.vue"
import { PAPER_SIZES, type TPaperSize } from "~/constants/papers.js"
import { CUSTOM_ICON_NAMES } from "~/utils/preview/icons"
import { createOptionsFromEnum, createTranslatedOptions } from "~/utils/options"
import { ContentLayoutSchema, LayoutSchema } from "~/utils/schemas/configs/generalConfigs.schema"
import { extractNumberConstraintsFromPath } from "~/utils/schemas/schemaExtractors"
import { DateFormat, ListType, PersonalPosition } from "~/utils/schemas/shared.schema"
import ConfigsContainer from "../wrapper/ConfigsContainer.vue"
import ConfigWrapper from "../wrapper/ConfigWrapper.vue"
import SectionsOrderControl from "./SectionsOrderControl.vue"

const configsStore = useConfigsStore()
const { updateConfig } = configsStore
const { configs } = storeToRefs(configsStore)
const { t } = useI18n()

const handleUpdate = (key: string, value: unknown) => {
  updateConfig(`general.layout.${key}`, value)
}

const sectionGapConstraints = extractNumberConstraintsFromPath(LayoutSchema, "sectionGap")
const verticalMarginConstraints = extractNumberConstraintsFromPath(LayoutSchema, "verticalMargin")
const horizontalMarginConstraints = extractNumberConstraintsFromPath(LayoutSchema, "horizontalMargin")

const RESUME_LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "fa", label: "فارسی (Persian)" },
  { value: "fr", label: "Français (French)" },
  { value: "de", label: "Deutsch (German)" },
  { value: "ar", label: "العربية (Arabic)" },
  { value: "es", label: "Español (Spanish)" },
  { value: "it", label: "Italiano (Italian)" },
  { value: "pt", label: "Português (Portuguese)" },
  { value: "ru", label: "Русский (Russian)" },
  { value: "tr", label: "Türkçe (Turkish)" },
  { value: "zh", label: "中文 (Chinese)" },
  { value: "ja", label: "日本語 (Japanese)" },
  { value: "ko", label: "한국어 (Korean)" },
  { value: "nl", label: "Nederlands (Dutch)" },
  { value: "pl", label: "Polski (Polish)" }
]

const dateFormatOptions = createOptionsFromEnum(DateFormat.options)
const pageSizeOptions = createOptionsFromEnum(Object.keys(PAPER_SIZES) as TPaperSize[], (value) => value)
const COLUMNS_ICONS: Record<string, string> = { "1": "i-lucide-square", "2": "i-lucide-columns-2" }
const columnsOptions = computed(() =>
  createTranslatedOptions(t, "editor.configs.columnsOptions", LayoutSchema.shape.columns.options).map((o) => ({
    ...o,
    icon: COLUMNS_ICONS[o.value]
  }))
)
const POSITION_ICONS: Record<string, string> = {
  left: "i-lucide-panel-left",
  right: "i-lucide-panel-right",
  top: "i-lucide-panel-top"
}
const personalPositionOptions = computed(() =>
  createTranslatedOptions(t, "editor.configs.personalPositionOptions", PersonalPosition.options).map((o) => ({
    ...o,
    icon: POSITION_ICONS[o.value]
  }))
)
const LIST_TYPE_ICONS: Record<string, string> = {
  disc: CUSTOM_ICON_NAMES.disc,
  circle: CUSTOM_ICON_NAMES.circle,
  square: CUSTOM_ICON_NAMES.square,
  none: "i-lucide-ban"
}
const listTypeOptions = computed(() =>
  createTranslatedOptions(t, "editor.configs.listTypeOptions", ListType.options).map((o) => ({
    ...o,
    icon: LIST_TYPE_ICONS[o.value] ?? "i-lucide-circle"
  }))
)

const handleColumnWidthUpdate = (side: "left" | "right", value: number) => {
  const newValue = Math.max(0, Math.min(100, value))
  const otherSide = side === "left" ? "right" : "left"
  handleUpdate(`columnsWidth.${side}`, newValue)
  handleUpdate(`columnsWidth.${otherSide}`, 100 - newValue)
}

const handleContentLayoutWidthUpdate = (
  variant: "contentFirst" | "dateFirst",
  side: "left" | "right",
  value: number
) => {
  const newValue = Math.max(25, Math.min(75, value))
  const otherSide = side === "left" ? "right" : "left"
  handleUpdate(`contentLayout.${variant}Width.${side}`, newValue)
  handleUpdate(`contentLayout.${variant}Width.${otherSide}`, 100 - newValue)
}

const contentFirstWidthConstraints = extractNumberConstraintsFromPath(ContentLayoutSchema, "contentFirstWidth")
const dateFirstWidthConstraints = extractNumberConstraintsFromPath(ContentLayoutSchema, "dateFirstWidth")
const columnsWidthConstraints = extractNumberConstraintsFromPath(LayoutSchema, "columnsWidth")
const indentConstraints = extractNumberConstraintsFromPath(ContentLayoutSchema, "indent")
</script>

<template>
  <ConfigsContainer :title="$t('editor.configs.layout')" icon="i-lucide-grid">
    <ToggleInput
      v-model="configs.general.layout.rtl"
      :label="$t('editor.configs.rtl')"
      @update:model-value="(value) => handleUpdate('rtl', value)"
    />
    <SelectItem
      :model-value="configs.general.layout.language"
      :label="$t('editor.configs.resumeLanguage')"
      :options="RESUME_LANGUAGE_OPTIONS"
      @update:model-value="(value) => handleUpdate('language', value)"
    />
    <SelectItem
      v-model="configs.general.layout.dateFormat"
      :label="$t('editor.configs.dateFormat')"
      :options="dateFormatOptions"
      @update:model-value="(value) => handleUpdate('dateFormat', value)"
    />
    <SelectItem
      :model-value="configs.general.layout.size"
      :label="$t('editor.configs.pageSize')"
      :options="pageSizeOptions"
      @update:model-value="(value) => handleUpdate('size', value)"
    />
    <ButtonGroupInput
      icon-only
      :model-value="configs.general.layout.columns"
      :label="$t('editor.configs.columns')"
      :options="columnsOptions"
      @update:model-value="
        (value) => {
          if (value === '1') {
            handleUpdate('personalPosition', 'top')
          }
          handleUpdate('columns', value)
        }
      "
    />
    <ButtonGroupInput
      icon-only
      :disabled="configs.general.layout.columns === '1'"
      :model-value="
        configs.general.layout.rtl
          ? configs.general.layout.personalPosition === 'left'
            ? 'right'
            : configs.general.layout.personalPosition === 'right'
              ? 'left'
              : 'top'
          : configs.general.layout.personalPosition
      "
      :label="$t('editor.configs.personalSection')"
      :options="personalPositionOptions"
      @update:model-value="
        (value) =>
          configs.general.layout.rtl
            ? value === 'left'
              ? handleUpdate('personalPosition', 'right')
              : value === 'right'
                ? handleUpdate('personalPosition', 'left')
                : handleUpdate('personalPosition', 'top')
            : handleUpdate('personalPosition', value)
      "
    />
    <SliderInput
      v-model="configs.general.layout.sectionGap"
      :label="$t('editor.configs.sectionGap')"
      :min="sectionGapConstraints.min"
      :max="sectionGapConstraints.max"
      @update:model-value="(value) => handleUpdate('sectionGap', value)"
    />
    <ConfigWrapper :title="$t('editor.configs.margins')" variant="grid">
      <SliderInput
        label-variant="stacked"
        :model-value="configs.general.layout.verticalMargin"
        :label="$t('editor.configs.vertical')"
        :min="verticalMarginConstraints.min"
        :max="verticalMarginConstraints.max"
        @update:model-value="(value) => handleUpdate('verticalMargin', value)"
      />
      <SliderInput
        label-variant="stacked"
        :model-value="configs.general.layout.horizontalMargin"
        :label="$t('editor.configs.horizontal')"
        :min="horizontalMarginConstraints.min"
        :max="horizontalMarginConstraints.max"
        @update:model-value="(value) => handleUpdate('horizontalMargin', value)"
      />
    </ConfigWrapper>
    <ConfigWrapper :title="$t('editor.configs.columnsWidth')" variant="grid">
      <SliderInput
        :disabled="configs.general.layout.columns === '1'"
        label-variant="stacked"
        :model-value="configs.general.layout.columnsWidth.left"
        :label="$t('editor.configs.leftColumn')"
        :min="columnsWidthConstraints.min"
        :max="columnsWidthConstraints.max"
        @update:model-value="(value) => handleColumnWidthUpdate('left', value)"
      />
      <SliderInput
        :disabled="configs.general.layout.columns === '1'"
        label-variant="stacked"
        :model-value="configs.general.layout.columnsWidth.right"
        :label="$t('editor.configs.rightColumn')"
        :min="columnsWidthConstraints.min"
        :max="columnsWidthConstraints.max"
        @update:model-value="(value) => handleColumnWidthUpdate('right', value)"
      />
    </ConfigWrapper>
    <ConfigWrapper :title="$t('editor.configs.contentLayoutContentFirst')" variant="grid">
      <SliderInput
        label-variant="stacked"
        :model-value="configs.general.layout.contentLayout.contentFirstWidth.left"
        :label="$t('editor.configs.leftColumn')"
        :min="contentFirstWidthConstraints.min"
        :max="contentFirstWidthConstraints.max"
        @update:model-value="(value) => handleContentLayoutWidthUpdate('contentFirst', 'left', value)"
      />
      <SliderInput
        label-variant="stacked"
        :model-value="configs.general.layout.contentLayout.contentFirstWidth.right"
        :label="$t('editor.configs.rightColumn')"
        :min="contentFirstWidthConstraints.min"
        :max="contentFirstWidthConstraints.max"
        @update:model-value="(value) => handleContentLayoutWidthUpdate('contentFirst', 'right', value)"
      />
    </ConfigWrapper>
    <ConfigWrapper :title="$t('editor.configs.contentLayoutDateFirst')" variant="grid">
      <SliderInput
        label-variant="stacked"
        :model-value="configs.general.layout.contentLayout.dateFirstWidth.left"
        :label="$t('editor.configs.leftColumn')"
        :min="dateFirstWidthConstraints.min"
        :max="dateFirstWidthConstraints.max"
        @update:model-value="(value) => handleContentLayoutWidthUpdate('dateFirst', 'left', value)"
      />
      <SliderInput
        label-variant="stacked"
        :model-value="configs.general.layout.contentLayout.dateFirstWidth.right"
        :label="$t('editor.configs.rightColumn')"
        :min="dateFirstWidthConstraints.min"
        :max="dateFirstWidthConstraints.max"
        @update:model-value="(value) => handleContentLayoutWidthUpdate('dateFirst', 'right', value)"
      />
    </ConfigWrapper>
    <SliderInput
      v-model="configs.general.layout.contentLayout.indent"
      :label="$t('editor.configs.contentIndent')"
      :min="indentConstraints.min"
      :max="indentConstraints.max"
      @update:model-value="(value) => handleUpdate('contentLayout.indent', value)"
    />
    <ButtonGroupInput
      icon-only
      :model-value="configs.general.layout.contentLayout.listType"
      :label="$t('editor.configs.listType')"
      :options="listTypeOptions"
      @update:model-value="(value) => handleUpdate('contentLayout.listType', value)"
    />
    <SectionsOrderControl />
  </ConfigsContainer>
</template>
