<script setup lang="ts">
interface Props {
  icon: string
  tooltip: string
  isActive?: boolean
  disabled?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  disabled: false,
  ariaLabel: ""
})

const emit = defineEmits<{
  (e: "click"): void
}>()

const handleClick = () => {
  if (!props.disabled) {
    emit("click")
  }
}
</script>

<template>
  <UTooltip :text="tooltip" class="flex items-center justify-center">
    <button
      :disabled="disabled"
      :class="{ 'is-active': isActive }"
      :aria-label="ariaLabel || tooltip"
      @click="handleClick"
    >
      <UIcon :name="icon" />
    </button>
  </UTooltip>
</template>
