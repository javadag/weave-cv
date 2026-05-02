<script setup lang="ts">
type Option = { label: string; value: string }

const props = withDefaults(
  defineProps<{
    label: string
    labelVariant?: "inline" | "stacked"
    disabled?: boolean
    modelValue: string
    options: Option[]
  }>(),
  {
    labelVariant: "inline"
  }
)

const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>()

const model = computed({
  get: () => props.modelValue,
  set: (v: string) => emit("update:modelValue", v)
})
</script>

<template>
  <UFormField
    :label="props.label"
    :class="props.labelVariant === 'inline' ? 'flex items-center justify-between gap-2' : ''"
    :ui="{ label: 'text-2sm text-muted ', container: `basis-1/2 ${props.labelVariant === 'inline' ? 'mt-0' : ''}` }"
  >
    <USelect
      :id="props.label"
      v-model="model"
      :disabled="props.disabled"
      class="w-full"
      :items="props.options"
      option-attribute="label"
      value-attribute="value"
      size="sm"
    />
  </UFormField>
</template>
