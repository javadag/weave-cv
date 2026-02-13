<script setup lang="ts">
import { capitalize } from "vue"
import NumberInput from "~/components/ui/NumberInput.vue"
import SelectItem from "~/components/ui/SelectItem.vue"
import ToggleInput from "~/components/ui/ToggleInput.vue"
import type { TPaperSize } from "~/constants/papers"
import { PAPER_SIZES } from "~/constants/papers"
import { createOptionsFromEnum } from "~/utils/preview/helpers"
import { ContentLayoutSchema, LayoutSchema } from "~/utils/schemas/configs/generalConfigs.schema"
import { extractNumberConstraintsFromPath } from "~/utils/schemas/schemaExtractors"
import { DateFormat, ListType, PersonalPosition } from "~/utils/schemas/shared.schema"
import ConfigsContainer from "../wrapper/ConfigsContainer.vue"
import ConfigWrapper from "../wrapper/ConfigWrapper.vue"
import SectionsOrderControl from "./SectionsOrderControl.vue"

const configsStore = useConfigsStore()
const { updateConfig } = configsStore
const { configs } = storeToRefs(configsStore)

const handleUpdate = (key: string, value: unknown) => {
  updateConfig(`general.layout.${key}`, value)
}

const sectionGapConstraints = extractNumberConstraintsFromPath(LayoutSchema, "sectionGap")
const verticalMarginConstraints = extractNumberConstraintsFromPath(LayoutSchema, "verticalMargin")
const horizontalMarginConstraints = extractNumberConstraintsFromPath(LayoutSchema, "horizontalMargin")

const dateFormatOptions = createOptionsFromEnum(DateFormat.options)
const pageSizeOptions = createOptionsFromEnum(Object.keys(PAPER_SIZES) as TPaperSize[], (value) => value)
const columnsOptions = createOptionsFromEnum(
  LayoutSchema.shape.columns.options,
  (value) => `${value} Column${value === "1" ? "" : "s"}`
)
const personalPositionOptions = createOptionsFromEnum(PersonalPosition.options, capitalize)
const listTypeOptions = createOptionsFromEnum(ListType.options, capitalize)

/* const languageOptions = [
  { label: "English", value: "en" },
  { label: "Farsi", value: "fa" }
] */

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
  <ConfigsContainer title="Layout" icon="i-lucide-grid" :collapsible="true" :default-expanded="true">
    <!-- <SelectItem
      :model-value="configs.general.layout.language"
      label="Language"
      :options="languageOptions"
      @update:model-value="(value) => handleUpdate('language', value)"
    />  -->
    <ToggleInput
      v-model="configs.general.layout.rtl"
      label="Right-to-left (RTL)"
      @update:model-value="(value) => handleUpdate('rtl', value)"
    />
    <SelectItem
      v-model="configs.general.layout.dateFormat"
      label="Date format"
      :options="dateFormatOptions"
      @update:model-value="(value) => handleUpdate('dateFormat', value)"
    />
    <SelectItem
      :model-value="configs.general.layout.size"
      label="Page Size"
      :options="pageSizeOptions"
      @update:model-value="(value) => handleUpdate('size', value)"
    />
    <SelectItem
      :model-value="configs.general.layout.columns"
      label="Columns"
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
    <SelectItem
      :disabled="configs.general.layout.columns === '1'"
      :model-value="configs.general.layout.personalPosition"
      label="Personal Section"
      :options="personalPositionOptions"
      @update:model-value="(value) => handleUpdate('personalPosition', value)"
    />
    <NumberInput
      v-model="configs.general.layout.sectionGap"
      label="Section Gap"
      :min="sectionGapConstraints.min"
      :max="sectionGapConstraints.max"
      @update:model-value="(value) => handleUpdate('sectionGap', value)"
    />
    <ConfigWrapper title="Margins" variant="grid">
      <NumberInput
        label-variant="stacked"
        :model-value="configs.general.layout.verticalMargin"
        label="Vertical (Top/Bottom)"
        :min="verticalMarginConstraints.min"
        :max="verticalMarginConstraints.max"
        @update:model-value="(value) => handleUpdate('verticalMargin', value)"
      />
      <NumberInput
        label-variant="stacked"
        :model-value="configs.general.layout.horizontalMargin"
        label="Horizontal (Left/Right)"
        :min="horizontalMarginConstraints.min"
        :max="horizontalMarginConstraints.max"
        @update:model-value="(value) => handleUpdate('horizontalMargin', value)"
      />
    </ConfigWrapper>
    <ConfigWrapper title="Columns Width" variant="grid">
      <NumberInput
        :disabled="configs.general.layout.columns === '1'"
        label-variant="stacked"
        :model-value="configs.general.layout.columnsWidth.left"
        label="Left Column (%)"
        :min="columnsWidthConstraints.min"
        :max="columnsWidthConstraints.max"
        @update:model-value="(value) => handleColumnWidthUpdate('left', value)"
      />
      <NumberInput
        :disabled="configs.general.layout.columns === '1'"
        label-variant="stacked"
        :model-value="configs.general.layout.columnsWidth.right"
        label="Right Column (%)"
        :min="columnsWidthConstraints.min"
        :max="columnsWidthConstraints.max"
        @update:model-value="(value) => handleColumnWidthUpdate('right', value)"
      />
    </ConfigWrapper>
    <ConfigWrapper title="Content Layout Width (Content First)" variant="grid">
      <NumberInput
        label-variant="stacked"
        :model-value="configs.general.layout.contentLayout.contentFirstWidth.left"
        label="Left Column (%)"
        :min="contentFirstWidthConstraints.min"
        :max="contentFirstWidthConstraints.max"
        @update:model-value="(value) => handleContentLayoutWidthUpdate('contentFirst', 'left', value)"
      />
      <NumberInput
        label-variant="stacked"
        :model-value="configs.general.layout.contentLayout.contentFirstWidth.right"
        label="Right Column (%)"
        :min="contentFirstWidthConstraints.min"
        :max="contentFirstWidthConstraints.max"
        @update:model-value="(value) => handleContentLayoutWidthUpdate('contentFirst', 'right', value)"
      />
    </ConfigWrapper>
    <ConfigWrapper title="Content Layout Width (Date First)" variant="grid">
      <NumberInput
        label-variant="stacked"
        :model-value="configs.general.layout.contentLayout.dateFirstWidth.left"
        label="Left Column (%)"
        :min="dateFirstWidthConstraints.min"
        :max="dateFirstWidthConstraints.max"
        @update:model-value="(value) => handleContentLayoutWidthUpdate('dateFirst', 'left', value)"
      />
      <NumberInput
        label-variant="stacked"
        :model-value="configs.general.layout.contentLayout.dateFirstWidth.right"
        label="Right Column (%)"
        :min="dateFirstWidthConstraints.min"
        :max="dateFirstWidthConstraints.max"
        @update:model-value="(value) => handleContentLayoutWidthUpdate('dateFirst', 'right', value)"
      />
    </ConfigWrapper>
    <NumberInput
      v-model="configs.general.layout.contentLayout.indent"
      label="Content Indent"
      :min="indentConstraints.min"
      :max="indentConstraints.max"
      @update:model-value="(value) => handleUpdate('contentLayout.indent', value)"
    />
    <SelectItem
      :model-value="configs.general.layout.contentLayout.listType"
      label="List Type"
      :options="listTypeOptions"
      @update:model-value="(value) => handleUpdate('contentLayout.listType', value)"
    />
    <SectionsOrderControl />
  </ConfigsContainer>
</template>
