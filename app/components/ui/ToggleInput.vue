<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    modelValue: boolean
    style?: "start" | "center"
  }>(),
  {
    style: "center"
  }
)

const emit = defineEmits<{ (e: "update:modelValue", value: boolean): void }>()

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v)
})
</script>

<template>
  <USwitch
    v-model="model"
    :label="props.label"
    dir="rtl"
    size="xs"
    :ui="{
      label: 'text-2sm font-medium text-muted',
      root: props.style === 'center' ? 'flex justify-between items-center gap-2' : 'justify-start'
    }"
  />
</template>
