<script setup lang="ts">
import ColorPicker from "~/components/ui/ColorPicker.vue"
import { ApplyableColorItems } from "~/utils/schemas/configs/generalConfigs.schema"
import ConfigWrapper from "../wrapper/ConfigWrapper.vue"
import ConfigsContainer from "../wrapper/ConfigsContainer.vue"

const configsStore = useConfigsStore()
const { updateConfig } = configsStore
const { configs } = storeToRefs(configsStore)

const handleUpdate = (key: string, value: unknown) => {
  updateConfig(`general.colors.${key}`, value)
}

const applyableColorItemsOptions = ApplyableColorItems.options.map((item) => ({
  label: (item.charAt(0).toUpperCase() + item.slice(1)) as string,
  value: item
}))

const applyModel = computed({
  get: () =>
    configs.value.general.colors.apply.map((item) => ({
      label: (item.charAt(0).toUpperCase() + item.slice(1)) as string,
      value: item
    })),
  set: (items) =>
    handleUpdate(
      "apply",
      items.map((item) => item.value)
    )
})
</script>

<template>
  <ConfigsContainer :title="$t('editor.configs.colors')" icon="i-lucide-palette" :default-open="false">
    <ConfigWrapper :title="$t('editor.configs.applyAccent')" variant="stacked">
      <USelectMenu
        v-model="applyModel"
        :search-input="false"
        multiple
        class="w-full"
        :items="applyableColorItemsOptions"
        option-attribute="label"
        size="sm"
        value-attribute="value"
      />
    </ConfigWrapper>
    <ConfigWrapper :title="$t('editor.configs.primary')" variant="grid">
      <ColorPicker
        :model-value="configs.general.colors.primary.textColor"
        :label="$t('editor.configs.textColor')"
        :color="configs.general.colors.primary.textColor"
        @update:model-value="(value) => handleUpdate('primary.textColor', value)"
      />
      <ColorPicker
        :model-value="configs.general.colors.primary.bgColor"
        :label="$t('editor.configs.bgColor')"
        :color="configs.general.colors.primary.bgColor"
        @update:model-value="(value) => handleUpdate('primary.bgColor', value)"
      />
      <ColorPicker
        :model-value="configs.general.colors.primary.accentColor"
        :label="$t('editor.configs.accentColor')"
        :color="configs.general.colors.primary.accentColor"
        @update:model-value="(value) => handleUpdate('primary.accentColor', value)"
      />
    </ConfigWrapper>

    <ConfigWrapper :title="$t('editor.configs.secondary')" variant="grid">
      <ColorPicker
        :model-value="configs.general.colors.secondary.textColor"
        :label="$t('editor.configs.textColor')"
        :color="configs.general.colors.secondary.textColor"
        @update:model-value="(value) => handleUpdate('secondary.textColor', value)"
      />
      <ColorPicker
        :model-value="configs.general.colors.secondary.bgColor"
        :label="$t('editor.configs.bgColor')"
        :color="configs.general.colors.secondary.bgColor"
        @update:model-value="(value) => handleUpdate('secondary.bgColor', value)"
      />
      <ColorPicker
        :model-value="configs.general.colors.secondary.accentColor"
        :label="$t('editor.configs.accentColor')"
        :color="configs.general.colors.secondary.accentColor"
        @update:model-value="(value) => handleUpdate('secondary.accentColor', value)"
      />
    </ConfigWrapper>
  </ConfigsContainer>
</template>
