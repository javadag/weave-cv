<script setup lang="ts">
import CustomIcon from "~/components/ui/CustomIcon.vue"

type Option = { label: string; value: string; icon?: string; description?: string }

const props = withDefaults(
  defineProps<{
    label: string
    labelVariant?: "inline" | "stacked"
    iconOnly?: boolean
    disabled?: boolean
    modelValue: string
    options: Option[]
  }>(),
  {
    labelVariant: "inline",
    iconOnly: false
  }
)

const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>()

function select(value: string) {
  if (!props.disabled) {
    emit("update:modelValue", value)
  }
}

function isCustomIcon(icon?: string) {
  return icon?.startsWith("i-custom-") ?? false
}
</script>

<template>
  <UFormField
    :label="props.label"
    :class="props.labelVariant === 'inline' ? 'flex items-center justify-between gap-2' : ''"
    :ui="{ label: 'text-2sm text-muted', container: `basis-1/2 ${props.labelVariant === 'inline' ? 'mt-0' : ''}` }"
  >
    <div class="flex w-full flex-wrap gap-2" :class="props.labelVariant === 'inline' ? 'justify-end' : ''">
      <UTooltip
        v-for="option in props.options"
        :key="option.value"
        :text="option.label"
        :ui="{
          content: `p-1 ${option.description ? 'h-10' : ''}`
        }"
      >
        <template #content>
          <div>
            <div class="text-xs">{{ option.label }}</div>
            <div v-if="option.description" class="text-xs opacity-60">{{ option.description }}</div>
          </div>
        </template>
        <UButton
          :icon="isCustomIcon(option.icon) ? undefined : option.icon"
          :label="props.iconOnly ? undefined : option.label"
          :disabled="props.disabled"
          :variant="option.value === modelValue ? 'solid' : 'outline'"
          :color="option.value === modelValue ? 'primary' : 'neutral'"
          size="xs"
          :class="props.iconOnly ? '' : 'flex-1 justify-center'"
          @click="select(option.value)"
        >
          <template v-if="isCustomIcon(option.icon)" #leading>
            <CustomIcon :name="option.icon!" class="h-4 w-4" />
          </template>
        </UButton>
      </UTooltip>
    </div>
  </UFormField>
</template>
