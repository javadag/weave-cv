<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    labelVariant?: "inline" | "stacked"
    modelValue: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
  }>(),
  {
    min: undefined,
    max: undefined,
    step: 1,
    labelVariant: "inline"
  }
)

const emit = defineEmits<{ (e: "update:modelValue", value: number): void }>()

const model = computed({
  get: () => props.modelValue,
  set: (v: number) => emit("update:modelValue", v)
})
</script>

<template>
  <UFormField
    :label="props.label"
    :class="props.labelVariant === 'inline' ? 'flex flex-row items-center justify-between gap-2' : ''"
    :ui="{ label: 'text-2sm font-medium text-muted line-clamp-1', container: 'basis-1/2' }"
  >
    <UInputNumber v-model="model" :disabled="disabled" :min="props.min" :max="props.max" :step="props.step" size="sm" />
  </UFormField>
</template>
