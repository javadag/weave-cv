<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    variant?: "stacked" | "grid"
  }>(),
  {
    title: undefined,
    variant: "stacked"
  }
)
</script>

<template>
  <div>
    <h4 class="text-default mb-1 text-sm font-medium empty:hidden">{{ title }}</h4>
    <div v-if="variant === 'grid'" class="grid grid-cols-2 gap-2">
      <slot />
    </div>
    <div v-else class="space-y-2"><slot /></div>
  </div>
</template>
