<script setup lang="ts">
import IconPicker from "~/components/ui/IconPicker.vue"
import { getSectionIconName } from "~/utils/preview/helpers"

const props = withDefaults(
  defineProps<{
    isVisible: boolean
    value: string
    onUpdate: (value: string) => void
    class?: string
    sectionId?: string
    sectionType?: string
  }>(),
  {
    class: undefined,
    sectionId: undefined,
    sectionType: undefined
  }
)

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const { updateConfig } = configsStore

const isEditing = ref(false)
const localValue = ref(props.value)

const iconConfig = computed(() => configs.value.general.headings.icon)

const currentIcon = computed(() => {
  if (!props.sectionType) return ""

  const customIcon = iconConfig.value?.custom?.[props.sectionType]
  const defaultIcon = getSectionIconName(props.sectionType)

  return customIcon || defaultIcon || ""
})

const handleIconUpdate = (iconName: string) => {
  if (!props.sectionType) return

  const defaultIcon = getSectionIconName(props.sectionType)
  const currentCustom = iconConfig.value?.custom || {}

  const updated =
    iconName === defaultIcon
      ? Object.fromEntries(Object.entries(currentCustom).filter(([key]) => key !== props.sectionType))
      : { ...currentCustom, [props.sectionType]: iconName }

  updateConfig("general.headings.icon.custom", updated)
}

const handleUpdate = (value: string) => {
  if (props.value === value) {
    isEditing.value = false
    return
  }
  props.onUpdate(value)
  isEditing.value = false
}

const handleEdit = () => {
  if (isEditing.value) {
    handleUpdate(localValue.value)
    return
  }
  isEditing.value = true
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div :class="['flex items-center gap-2 duration-200', props.isVisible ? 'opacity-100' : 'opacity-50']">
      <IconPicker :model-value="currentIcon" :label="$t('editor.form.iconLabel')" @update:model-value="handleIconUpdate" />
      <UInput v-if="isEditing" v-model="localValue" size="sm" />

      <div v-else :class="props.class" v-html="localValue"></div>
      <UButton
        v-if="props.isVisible"
        variant="ghost"
        size="sm"
        :icon="isEditing ? 'i-lucide-check' : 'i-lucide-pencil'"
        @click="handleEdit"
      />
    </div>
  </div>
</template>
