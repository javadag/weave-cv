<script setup lang="ts">
import ColorPicker from "~/components/ui/ColorPicker.vue"
import NumberInput from "~/components/ui/NumberInput.vue"
import SelectItem from "~/components/ui/SelectItem.vue"
import ToggleInput from "~/components/ui/ToggleInput.vue"
import ConfigWrapper from "~/components/resume/configs-forms/wrapper/ConfigWrapper.vue"
import {
  alignOptions,
  iconAlignOptions,
  iconStyleOptions,
  photoPositionOptions,
  photoShapeOptions,
  separatorOptions,
  variantOptions,
  variantSimpleOptions
} from "~/utils/options/sharedOptions"
import type { TAlign, TIconStyle, TSeparator, TSide, TVariant, TVariantSimple } from "~/utils/schemas/shared.schema"

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const { updateConfig } = configsStore

const handleUpdate = (key: string, value: unknown) => {
  updateConfig(`personal.${key}`, value)
}
</script>

<template>
  <div class="space-y-3 p-1">
    <ConfigWrapper :title="$t('editor.configs.photo')">
      <ToggleInput
        v-model="configs.personal.photo.visible"
        :label="$t('editor.configs.showPhoto')"
        @update:model-value="(value) => handleUpdate('photo.visible', value)"
      />
      <SelectItem
        v-model="configs.personal.photo.position"
        :label="$t('editor.configs.photoPosition')"
        label-variant="stacked"
        :options="photoPositionOptions"
        :disabled="!configs.personal.photo.visible"
        @update:model-value="(value) => handleUpdate('photo.position', value as 'left' | 'right' | 'top')"
      />
      <SelectItem
        v-model="configs.personal.photo.shape"
        :label="$t('editor.configs.photoShape')"
        label-variant="stacked"
        :options="photoShapeOptions"
        :disabled="!configs.personal.photo.visible"
        @update:model-value="(value) => handleUpdate('photo.shape', value as 'circle' | 'rounded' | 'square')"
      />
      <NumberInput
        v-model="configs.personal.photo.size"
        :label="$t('editor.configs.photoSize')"
        :min="40"
        :max="200"
        :disabled="!configs.personal.photo.visible"
        @update:model-value="(value) => handleUpdate('photo.size', value)"
      />
      <ConfigWrapper variant="grid">
        <NumberInput
          v-model="configs.personal.photo.border.width"
          :label="$t('editor.configs.photoBorderWidth')"
          :min="0"
          :max="10"
          :disabled="!configs.personal.photo.visible"
          @update:model-value="(value) => handleUpdate('photo.border.width', value)"
        />
        <ColorPicker
          v-model="configs.personal.photo.border.color"
          :label="$t('editor.configs.photoBorderColor')"
          :color="configs.personal.photo.border.color"
          :disabled="!configs.personal.photo.visible"
          @update:model-value="(value) => handleUpdate('photo.border.color', value)"
        />
      </ConfigWrapper>
    </ConfigWrapper>
    <ConfigWrapper :title="$t('editor.configs.layout')">
      <SelectItem
        v-model="configs.personal.variant"
        :label="$t('editor.configs.variant')"
        label-variant="stacked"
        :options="variantSimpleOptions"
        @update:model-value="(value) => handleUpdate('variant', value as TVariantSimple)"
      />
      <SelectItem
        v-model="configs.personal.align"
        :label="$t('editor.configs.alignment')"
        label-variant="stacked"
        :options="alignOptions"
        @update:model-value="(value) => handleUpdate('align', value as TAlign)"
      />
      <NumberInput
        v-model="configs.personal.bottomSpace"
        :label="$t('editor.configs.bottomSpace')"
        :min="0"
        :max="100"
        @update:model-value="(value) => handleUpdate('bottomSpace', value)"
      />
    </ConfigWrapper>
    <ConfigWrapper :title="$t('editor.configs.mainSection')">
      <SelectItem
        v-model="configs.personal.main.variant"
        :label="$t('editor.configs.variant')"
        label-variant="stacked"
        :options="variantSimpleOptions"
        @update:model-value="(value) => handleUpdate('main.variant', value as TVariantSimple)"
      />
      <NumberInput
        v-model="configs.personal.main.bottomSpace"
        :disabled="configs.personal.variant === 'inline'"
        :label="$t('editor.configs.bottomSpace')"
        :min="0"
        :max="100"
        @update:model-value="(value) => handleUpdate('main.bottomSpace', value)"
      />
    </ConfigWrapper>
    <ConfigWrapper :title="$t('editor.configs.details')">
      <ConfigWrapper variant="grid">
        <ToggleInput
          v-model="configs.personal.details.underline"
          :label="$t('editor.configs.underline')"
          @update:model-value="(value) => handleUpdate('details.underline', value)"
        />
        <ColorPicker
          v-model="configs.personal.details.color"
          :label="$t('editor.configs.color')"
          :color="configs.personal.details.color"
          @update:model-value="(value) => handleUpdate('details.color', value)"
        />
      </ConfigWrapper>
      <SelectItem
        v-model="configs.personal.details.variant"
        :label="$t('editor.configs.variant')"
        label-variant="stacked"
        :options="variantOptions"
        @update:model-value="(value) => handleUpdate('details.variant', value as TVariant)"
      />
      <SelectItem
        v-model="configs.personal.details.separator"
        :label="$t('editor.configs.separator')"
        label-variant="stacked"
        :options="separatorOptions"
        @update:model-value="(value) => handleUpdate('details.separator', value as TSeparator)"
      />
    </ConfigWrapper>
    <ConfigWrapper :title="$t('editor.configs.icons')">
      <ToggleInput
        v-model="configs.personal.details.icon.visible"
        :label="$t('editor.configs.showIcons')"
        @update:model-value="(value) => handleUpdate('details.icon.visible', value)"
      />
      <SelectItem
        v-model="configs.personal.details.icon.align"
        :label="$t('editor.configs.iconAlignment')"
        label-variant="stacked"
        :options="iconAlignOptions"
        :disabled="!configs.personal.details.icon.visible"
        @update:model-value="(value) => handleUpdate('details.icon.align', value as TSide)"
      />
      <SelectItem
        v-model="configs.personal.details.icon.type"
        :label="$t('editor.configs.iconStyle')"
        label-variant="stacked"
        :options="iconStyleOptions"
        :disabled="!configs.personal.details.icon.visible"
        @update:model-value="(value) => handleUpdate('details.icon.type', value as TIconStyle)"
      />
      <NumberInput
        v-model="configs.personal.details.icon.size"
        :label="$t('editor.configs.iconSize')"
        :min="8"
        :max="64"
        :disabled="!configs.personal.details.icon.visible"
        @update:model-value="(value) => handleUpdate('details.icon.size', value)"
      />
    </ConfigWrapper>
  </div>
</template>
