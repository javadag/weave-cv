<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    labelVariant?: "inline" | "stacked"
    disabled?: boolean
    modelValue: string
  }>(),
  {
    labelVariant: "inline"
  }
)

const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>()

const styles = [
  { value: "plain", label: "Plain" },
  { value: "underline", label: "Underline" },
  { value: "underline-full", label: "Full Underline" },
  { value: "pill", label: "Pill" },
  { value: "border", label: "Border" },
  { value: "vertical-border", label: "Side Border" }
] as const

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
    <div class="flex flex-wrap gap-1">
      <UTooltip v-for="style in styles" :key="style.value" :text="style.label">
        <UButton
          square
          :disabled="props.disabled"
          :variant="style.value === modelValue ? 'solid' : 'outline'"
          :color="style.value === modelValue ? 'primary' : 'neutral'"
          size="xs"
          class="h-7 w-9"
          @click="select(style.value)"
        >
          <!-- Plain: just "H" -->
          <svg v-if="style.value === 'plain'" viewBox="0 0 32 20" class="h-5">
            <text
              x="16"
              y="15"
              text-anchor="middle"
              fill="currentColor"
              font-size="14"
              font-weight="600"
              font-family="sans-serif"
            >
              H
            </text>
          </svg>

          <!-- Underline: "H" with partial underline -->
          <svg v-else-if="style.value === 'underline'" viewBox="0 0 32 20" class="h-4">
            <text
              x="16"
              y="13"
              text-anchor="middle"
              fill="currentColor"
              font-size="14"
              font-weight="600"
              font-family="sans-serif"
            >
              H
            </text>
            <line x1="10" y1="18" x2="22" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>

          <!-- Underline Full: "H" with full underline -->
          <svg v-else-if="style.value === 'underline-full'" viewBox="0 0 32 20" class="h-4">
            <text
              x="16"
              y="13"
              text-anchor="middle"
              fill="currentColor"
              font-size="14"
              font-weight="600"
              font-family="sans-serif"
            >
              H
            </text>
            <line x1="4" y1="18" x2="28" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>

          <!-- Pill: "H" with rounded background -->
          <svg v-else-if="style.value === 'pill'" viewBox="0 0 32 20" class="h-4">
            <rect x="2" y="2" width="28" height="16" rx="8" fill="none" stroke="currentColor" stroke-width="1.5" />
            <text
              x="16"
              y="14"
              text-anchor="middle"
              fill="currentColor"
              font-size="12"
              font-weight="600"
              font-family="sans-serif"
            >
              H
            </text>
          </svg>

          <!-- Border: "H" with rectangular border -->
          <svg v-else-if="style.value === 'border'" viewBox="0 0 32 20" class="h-4">
            <rect x="3" y="2" width="26" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" />
            <text
              x="16"
              y="14"
              text-anchor="middle"
              fill="currentColor"
              font-size="12"
              font-weight="600"
              font-family="sans-serif"
            >
              H
            </text>
          </svg>

          <!-- Vertical Border: "H" with left bar -->
          <svg v-else-if="style.value === 'vertical-border'" viewBox="0 0 32 20" class="h-4">
            <line x1="7" y1="3" x2="7" y2="17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
            <text
              x="20"
              y="14"
              text-anchor="middle"
              fill="currentColor"
              font-size="14"
              font-weight="600"
              font-family="sans-serif"
            >
              H
            </text>
          </svg>
        </UButton>
      </UTooltip>
    </div>
  </UFormField>
</template>
