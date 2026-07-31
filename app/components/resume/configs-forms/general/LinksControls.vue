<script setup lang="ts">
import ButtonGroupInput from "~/components/ui/ButtonGroupInput.vue"
import ColorPicker from "~/components/ui/ColorPicker.vue"
import ToggleInput from "~/components/ui/ToggleInput.vue"
import { CUSTOM_ICON_NAMES } from "~/utils/preview/icons"
import { createTranslatedOptions } from "~/utils/options"
import { LinkIconType } from "~/utils/schemas/shared.schema"
import ConfigWrapper from "../wrapper/ConfigWrapper.vue"
import ConfigsContainer from "../wrapper/ConfigsContainer.vue"

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const { updateConfig } = configsStore
const { t } = useI18n()

const ICON_TYPE_ICONS: Record<string, string> = {
  arrow: CUSTOM_ICON_NAMES.arrow,
  chain: CUSTOM_ICON_NAMES.chain,
  pill: CUSTOM_ICON_NAMES.pill
}
const iconTypeOptions = computed(() =>
  createTranslatedOptions(t, "editor.configs.iconTypeOptions", LinkIconType.options).map((o) => ({
    ...o,
    icon: ICON_TYPE_ICONS[o.value] ?? "i-lucide-link"
  }))
)

const handleUpdate = (key: string, value: unknown) => {
  updateConfig(`general.links.${key}`, value)
}
</script>

<template>
  <ConfigsContainer :title="$t('editor.configs.links')" icon="i-lucide-link" :default-open="false">
    <ConfigWrapper variant="stacked">
      <ToggleInput
        v-model="configs.general.links.underline"
        :label="$t('editor.configs.underline')"
        @update:model-value="(value) => handleUpdate('underline', value)"
      />
      <ColorPicker
        v-model="configs.general.links.color"
        :label="$t('editor.configs.color')"
        :color="configs.general.links.color"
        @update:model-value="(value) => handleUpdate('color', value)"
      />
    </ConfigWrapper>
    <ConfigWrapper :title="$t('editor.configs.icon')">
      <ToggleInput
        v-model="configs.general.links.icon.visible"
        :label="$t('editor.configs.show')"
        @update:model-value="(value) => handleUpdate('icon.visible', value)"
      />
      <ButtonGroupInput
        icon-only
        :model-value="configs.general.links.icon.type"
        :label="$t('editor.configs.type')"
        :disabled="!configs.general.links.icon.visible"
        :options="iconTypeOptions"
        @update:model-value="(value) => handleUpdate('icon.type', value)"
      />
      <ColorPicker
        v-model="configs.general.links.icon.color"
        :disabled="!configs.general.links.icon.visible"
        :label="$t('editor.configs.color')"
        :color="configs.general.links.icon.color"
        @update:model-value="(value) => handleUpdate('icon.color', value)"
      />
    </ConfigWrapper>
  </ConfigsContainer>
</template>
