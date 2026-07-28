<script setup lang="ts">
type Option = { label: string; value: string; icon?: string }

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
</script>

<template>
  <UFormField
    :label="props.label"
    :class="props.labelVariant === 'inline' ? 'flex items-center justify-between gap-2' : ''"
    :ui="{ label: 'text-2sm text-muted', container: `basis-1/2 ${props.labelVariant === 'inline' ? 'mt-0' : ''}` }"
  >
    <div class="flex gap-1">
      <UTooltip v-for="option in props.options" :key="option.value" :text="option.label">
        <UButton
          :icon="option.icon"
          :label="props.iconOnly ? undefined : option.label"
          :disabled="props.disabled"
          :variant="option.value === modelValue ? 'solid' : 'outline'"
          :color="option.value === modelValue ? 'primary' : 'neutral'"
          size="xs"
          :class="props.iconOnly ? '' : 'flex-1 justify-center'"
          @click="select(option.value)"
        />
      </UTooltip>
    </div>
  </UFormField>
</template>
