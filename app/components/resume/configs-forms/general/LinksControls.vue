<script setup lang="ts">
import { capitalize } from "vue"
import ColorPicker from "~/components/ui/ColorPicker.vue"
import SelectItem from "~/components/ui/SelectItem.vue"
import ToggleInput from "~/components/ui/ToggleInput.vue"
import { createOptionsFromEnum } from "~/utils/preview/helpers"
import { LinkIconType } from "~/utils/schemas/shared.schema"
import ConfigWrapper from "../wrapper/ConfigWrapper.vue"
import ConfigsContainer from "../wrapper/ConfigsContainer.vue"

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const { updateConfig } = configsStore

const iconTypeOptions = createOptionsFromEnum(LinkIconType.options, (value) => capitalize(value))

const handleUpdate = (key: string, value: unknown) => {
  updateConfig(`general.links.${key}`, value)
}
</script>

<template>
  <ConfigsContainer title="Links" icon="i-lucide-link" :collapsible="true" :default-expanded="true">
    <ConfigWrapper variant="grid">
      <ToggleInput
        v-model="configs.general.links.underline"
        label="Underline"
        @update:model-value="(value) => handleUpdate('underline', value)"
      />
      <ColorPicker
        v-model="configs.general.links.color"
        label="Color"
        :color="configs.general.links.color"
        @update:model-value="(value) => handleUpdate('color', value)"
      />
    </ConfigWrapper>
    <ConfigWrapper title="Icon">
      <ToggleInput
        v-model="configs.general.links.icon.visible"
        label="Show"
        @update:model-value="(value) => handleUpdate('icon.visible', value)"
      />
      <SelectItem
        :model-value="configs.general.links.icon.type"
        label="Type"
        :disabled="!configs.general.links.icon.visible"
        :options="iconTypeOptions"
        @update:model-value="(value) => handleUpdate('icon.type', value)"
      />
      <ColorPicker
        v-model="configs.general.links.icon.color"
        :disabled="!configs.general.links.icon.visible"
        label="Color"
        :color="configs.general.links.icon.color"
        @update:model-value="(value) => handleUpdate('icon.color', value)"
      />
    </ConfigWrapper>
  </ConfigsContainer>
</template>
