<script setup lang="ts">
import NumberInput from "~/components/ui/NumberInput.vue"
import SelectItem from "~/components/ui/SelectItem.vue"
import ToggleInput from "~/components/ui/ToggleInput.vue"
import type { TConfigs } from "~/utils/schemas/configs/configs.schema"
import { HeadingsSchema } from "~/utils/schemas/configs/generalConfigs.schema"
import { extractNumberConstraintsFromPath } from "~/utils/schemas/schemaExtractors"
import SectionTypography from "../sections/SectionTypography.vue"
import ConfigsContainer from "../wrapper/ConfigsContainer.vue"
import ConfigWrapper from "../wrapper/ConfigWrapper.vue"

const configsStore = useConfigsStore()
const { updateConfig } = configsStore
const { configs } = storeToRefs(configsStore)
const { t } = useI18n()

const handleUpdate = (key: string, value: unknown) => {
  updateConfig(`general.headings.${key}`, value)
}

const headingStyleOptions = computed<{ label: string; value: TConfigs["general"]["headings"]["variant"] }[]>(() => [
  { label: t("editor.configs.headingStyles.plain"), value: "plain" },
  { label: t("editor.configs.headingStyles.underline"), value: "underline" },
  { label: t("editor.configs.headingStyles.underlineFull"), value: "underline-full" },
  { label: t("editor.configs.headingStyles.pill"), value: "pill" },
  { label: t("editor.configs.headingStyles.border"), value: "border" },
  { label: t("editor.configs.headingStyles.verticalBorder"), value: "vertical-border" }
])

const iconSizeConstraints = extractNumberConstraintsFromPath(HeadingsSchema.shape.icon, "size")
</script>

<template>
  <ConfigsContainer :title="$t('editor.configs.headings')" icon="i-lucide-type" :collapsible="true" :default-expanded="true">
    <SelectItem
      :model-value="configs.general.headings.variant"
      :label="$t('editor.configs.style')"
      :options="headingStyleOptions"
      @update:model-value="(value) => handleUpdate('variant', value)"
    />
    <SectionTypography base-key="general.headings" :exclude="['fontStyle']" :schema="HeadingsSchema" />
    <ConfigWrapper :title="$t('editor.configs.icon')">
      <ToggleInput
        :model-value="configs.general.headings.icon.visible"
        :label="$t('editor.configs.show')"
        @update:model-value="(value) => handleUpdate('icon.visible', value)"
      />
      <NumberInput
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
