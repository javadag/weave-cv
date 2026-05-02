<script setup lang="ts">
import { HexColorSchema } from "~/utils/schemas/shared.schema"

const props = withDefaults(
  defineProps<{
    label: string
    labelVariant?: "inline" | "stacked"
    modelValue: string
    color?: string
    disabled?: boolean
  }>(),
  {
    labelVariant: "inline",
    color: undefined
  }
)

const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>()

const localColor = ref(props.modelValue || "#000000")
const hexInputValue = ref(props.modelValue || "#000000")
const isUpdating = ref(false)
const validationError = ref<string | null>(null)

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && newValue !== localColor.value) {
      isUpdating.value = true
      localColor.value = newValue
      hexInputValue.value = newValue
      nextTick(() => {
        isUpdating.value = false
      })
    }
  },
  { immediate: true }
)

watch(localColor, (newValue) => {
  if (isUpdating.value) return

  if (newValue && newValue !== props.modelValue) {
    if (hexInputValue.value !== newValue) {
      isUpdating.value = true
      hexInputValue.value = newValue
      nextTick(() => {
        isUpdating.value = false
      })
    }
    emit("update:modelValue", newValue)
  }
})

watch(hexInputValue, (newValue) => {
  if (isUpdating.value) return

  let hexValue = newValue.trim()

  if (hexValue.length > 7) {
    hexValue = hexValue.slice(0, 7)
    isUpdating.value = true
    hexInputValue.value = hexValue
    nextTick(() => {
      isUpdating.value = false
    })
    return
  }

  const shouldAddHash = hexValue && !hexValue.startsWith("#") && /^[A-Fa-f0-9]/.test(hexValue)
  if (shouldAddHash) {
    hexValue = "#" + hexValue
    isUpdating.value = true
    hexInputValue.value = hexValue
    nextTick(() => {
      isUpdating.value = false
    })
    return
  }

  const filteredValue = [...hexValue]
    .filter((char, index) => {
      if (index === 0) {
        return char === "#"
      }
      return /[A-Fa-f0-9]/.test(char)
    })
    .join("")

  if (filteredValue !== hexValue) {
    isUpdating.value = true
    hexInputValue.value = filteredValue
    nextTick(() => {
      isUpdating.value = false
    })
    return
  }

  const validationResult = HexColorSchema.safeParse(hexValue)

  if (validationResult.success) {
    validationError.value = null
    if (hexValue !== localColor.value) {
      isUpdating.value = true
      localColor.value = hexValue
      nextTick(() => {
        isUpdating.value = false
      })
    }
  } else if (hexValue.length > 1) {
    const firstIssue = validationResult.error.issues[0]
    validationError.value = firstIssue?.message || "Invalid hex color"
  } else {
    validationError.value = null
  }
})

const handleHexBlur = () => {
  if (isUpdating.value) return

  let value = hexInputValue.value.trim()

  if (!value) {
    value = localColor.value
  }

  if (!value.startsWith("#")) {
    value = "#" + value
  }

  const validationResult = HexColorSchema.safeParse(value)

  if (validationResult.success) {
    if (/^#([A-Fa-f0-9]{3})$/.test(value)) {
      value = "#" + value[1] + value[1] + value[2] + value[2] + value[3] + value[3]
    }
    validationError.value = null
  } else {
    value = localColor.value
    validationError.value = null
  }

  if (value !== hexInputValue.value || value !== localColor.value) {
    isUpdating.value = true
    hexInputValue.value = value
    if (value !== localColor.value) {
      localColor.value = value
    }
    nextTick(() => {
      isUpdating.value = false
    })
  }
}

const chip = computed(() => ({ backgroundColor: localColor.value }))
</script>

<template>
  <UPopover>
    <UButton
      :disabled="props.disabled"
      :label="label"
      color="neutral"
      size="sm"
      variant="outline"
      :ui="{ label: 'text-2sm' }"
    >
      <template #leading>
        <span :style="chip" class="size-4 shrink-0 rounded-full" />
      </template>
    </UButton>
    <template #content>
      <div class="grid gap-2 p-2">
        <UColorPicker v-model="localColor" :throttle="30" format="hex" :disabled="props.disabled" />
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-start gap-2">
            <label class="text-xs font-medium"> HEX </label>
            <UInput
              v-model="hexInputValue"
              size="xs"
              :disabled="props.disabled"
              placeholder="#000000"
              maxlength="7"
              :error="!!validationError"
              class=""
              @blur="handleHexBlur"
            />
          </div>
          <p v-if="validationError" class="px-1 text-xs text-red-500 dark:text-red-400">
            {{ validationError }}
          </p>
        </div>
      </div>
    </template>
  </UPopover>
</template>
