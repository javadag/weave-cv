<script setup lang="ts">
import ColorPicker from "~/components/ui/ColorPicker.vue"
import NumberInput from "~/components/ui/NumberInput.vue"
import SelectItem from "~/components/ui/SelectItem.vue"
import ToggleInput from "~/components/ui/ToggleInput.vue"
import {
  alignOptions,
  iconAlignOptions,
  iconStyleOptions,
  separatorOptions,
  variantOptions,
  variantSimpleOptions
} from "~/utils/options/sharedOptions"
import type { TAlign, TIconStyle, TSeparator, TSide, TVariant, TVariantSimple } from "~/utils/schemas/shared.schema"
import ConfigsContainer from "../wrapper/ConfigsContainer.vue"
import ConfigWrapper from "../wrapper/ConfigWrapper.vue"

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const { updateConfig } = configsStore

const handleUpdate = (key: string, value: unknown) => {
  updateConfig(`personal.${key}`, value)
}
</script>

<template>
  <ConfigsContainer title="Personal Details" icon="i-lucide-user">
    <ConfigWrapper title="Layout">
      <SelectItem
        v-model="configs.personal.variant"
        label="Variant"
        :options="variantSimpleOptions"
        @update:model-value="(value) => handleUpdate('variant', value as TVariantSimple)"
      />
      <SelectItem
        v-model="configs.personal.align"
        label="Alignment"
        :options="alignOptions"
        @update:model-value="(value) => handleUpdate('align', value as TAlign)"
      />
      <NumberInput
        v-model="configs.personal.bottomSpace"
        label="Bottom Space"
        :min="0"
        :max="100"
        @update:model-value="(value) => handleUpdate('bottomSpace', value)"
      />
    </ConfigWrapper>
    <ConfigWrapper title="Main Section">
      <SelectItem
        v-model="configs.personal.main.variant"
        label="Variant"
        :options="variantSimpleOptions"
        @update:model-value="(value) => handleUpdate('main.variant', value as TVariantSimple)"
      />
      <NumberInput
        v-model="configs.personal.main.bottomSpace"
        :disabled="configs.personal.variant === 'inline'"
        label="Bottom Space"
        :min="0"
        :max="100"
        @update:model-value="(value) => handleUpdate('main.bottomSpace', value)"
      />
    </ConfigWrapper>
    <ConfigWrapper title="Details">
      <ConfigWrapper variant="grid">
        <ToggleInput
          v-model="configs.personal.details.underline"
          label="Underline"
          @update:model-value="(value) => handleUpdate('details.underline', value)"
        />
        <ColorPicker
          v-model="configs.personal.details.color"
          label="Color"
          :color="configs.personal.details.color"
          @update:model-value="(value) => handleUpdate('details.color', value)"
        />
      </ConfigWrapper>
      <SelectItem
        v-model="configs.personal.details.variant"
        label="Variant"
        :options="variantOptions"
        @update:model-value="(value) => handleUpdate('details.variant', value as TVariant)"
      />
      <SelectItem
        v-model="configs.personal.details.separator"
        label="Separator"
        :options="separatorOptions"
        @update:model-value="(value) => handleUpdate('details.separator', value as TSeparator)"
      />
    </ConfigWrapper>
    <ConfigWrapper title="Icons">
      <ToggleInput
        v-model="configs.personal.details.icon.visible"
        label="Show Icons"
        @update:model-value="(value) => handleUpdate('details.icon.visible', value)"
      />
      <SelectItem
        v-model="configs.personal.details.icon.align"
        label="Icon Alignment"
        :options="iconAlignOptions"
        :disabled="!configs.personal.details.icon.visible"
        @update:model-value="(value) => handleUpdate('details.icon.align', value as TSide)"
      />
      <SelectItem
        v-model="configs.personal.details.icon.type"
        label="Icon Style"
        :options="iconStyleOptions"
        :disabled="!configs.personal.details.icon.visible"
        @update:model-value="(value) => handleUpdate('details.icon.type', value as TIconStyle)"
      />
      <NumberInput
        v-model="configs.personal.details.icon.size"
        label="Icon Size"
        :min="8"
        :max="64"
        :disabled="!configs.personal.details.icon.visible"
        @update:model-value="(value) => handleUpdate('details.icon.size', value)"
      />
    </ConfigWrapper>
  </ConfigsContainer>
</template>
