<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui"

const props = defineProps<{
  class?: string
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  isHidden: boolean
  onToggle: () => void
  tooltip?: string
}>()

const { t } = useI18n()
const tooltipText = computed(() => {
  if (props.tooltip) return props.tooltip
  return t(props.isHidden ? "editor.form.showTooltip" : "editor.form.hideTooltip")
})
</script>

<template>
  <UTooltip :text="tooltipText">
    <UButton
      :class="props.class"
      :variant="props.variant ?? 'ghost'"
      :size="props.size ?? 'sm'"
      :icon="props.isHidden ? 'i-lucide-eye-off' : 'i-lucide-eye'"
      :aria-label="tooltipText"
      @click="props.onToggle"
    />
  </UTooltip>
</template>
