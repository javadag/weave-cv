<script setup lang="ts">
import HeadingStylePicker from "~/components/ui/HeadingStylePicker.vue"
import SliderInput from "~/components/ui/SliderInput.vue"
import ToggleInput from "~/components/ui/ToggleInput.vue"
import { HeadingsSchema } from "~/utils/schemas/configs/generalConfigs.schema"
import { extractNumberConstraintsFromPath } from "~/utils/schemas/schemaExtractors"
import SectionTypography from "../sections/SectionTypography.vue"
import ConfigsContainer from "../wrapper/ConfigsContainer.vue"
import ConfigWrapper from "../wrapper/ConfigWrapper.vue"

const configsStore = useConfigsStore()
const { updateConfig } = configsStore
const { configs } = storeToRefs(configsStore)

const handleUpdate = (key: string, value: unknown) => {
  updateConfig(`general.headings.${key}`, value)
}

const iconSizeConstraints = extractNumberConstraintsFromPath(HeadingsSchema.shape.icon, "size")
</script>

<template>
  <ConfigsContainer :title="$t('editor.configs.headings')" icon="i-lucide-type">
    <HeadingStylePicker
      label-variant="stacked"
      :model-value="configs.general.headings.variant"
      :label="$t('editor.configs.style')"
      @update:model-value="(value) => handleUpdate('variant', value)"
    />
    <SectionTypography base-key="general.headings" :exclude="['fontStyle']" :schema="HeadingsSchema" />
    <ConfigWrapper :title="$t('editor.configs.icon')">
      <ToggleInput
        :model-value="configs.general.headings.icon.visible"
        :label="$t('editor.configs.show')"
        @update:model-value="(value) => handleUpdate('icon.visible', value)"
      />
      <SliderInput
        :model-value="configs.general.headings.icon.size"
        :label="$t('editor.configs.size')"
        :min="iconSizeConstraints.min"
        :max="iconSizeConstraints.max"
        :disabled="!configs.general.headings.icon.visible"
        @update:model-value="(value) => handleUpdate('icon.size', value)"
      />
    </ConfigWrapper>
  </ConfigsContainer>
</template>
