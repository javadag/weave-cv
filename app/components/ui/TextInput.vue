<script setup lang="ts">
import type { InputProps } from "@nuxt/ui"

interface Props extends InputProps {
  label: string
  labelVariant?: "inline" | "stacked"
}

const props = defineProps<Props>()

const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>()

const model = computed<string>({
  get: () => (props.modelValue ?? "") as string,
  set: (v: string) => emit("update:modelValue", v)
})
</script>

<template>
  <UFormField
    :class="props.labelVariant === 'inline' ? 'flex flex-row items-center justify-between gap-2' : 'w-full'"
    :label="props.label"
    :ui="{ label: 'text-2sm font-medium text-muted', container: 'basis-1/2' }"
  >
    <UInput
      v-model="model"
      class="w-full"
      :placeholder="placeholder"
      v-bind="$attrs"
      :trailing-icon="props.trailingIcon"
    />
  </UFormField>
</template>
