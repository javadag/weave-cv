<script setup lang="ts">
defineProps<{
  placeholder?: string
  size?: "sm" | "md" | "lg" | "xl"
  disabled?: boolean
}>()

const modelValue = defineModel<string>({ default: "" })
const show = ref(false)
</script>

<template>
  <UInput
    v-model="modelValue"
    :type="show ? 'text' : 'password'"
    :placeholder="placeholder"
    :size="size ?? 'lg'"
    :disabled="disabled"
    class="w-full"
  >
    <template #trailing>
      <button type="button" class="text-muted hover:text-highlighted flex" @click="show = !show">
        <UIcon :name="show ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="size-4" />
      </button>
    </template>
  </UInput>
</template>
