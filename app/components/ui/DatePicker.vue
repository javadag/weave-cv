<script setup lang="ts">
import type { CalendarDate } from "@internationalized/date"
import { DateFormatter, getLocalTimeZone, parseDate } from "@internationalized/date"

interface Props {
  modelValue: string | CalendarDate | null
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  locale?: string
  dateStyle?: "full" | "long" | "medium" | "short"
  buttonVariant?: "solid" | "outline" | "soft" | "ghost" | "link" | "subtle"
  buttonColor?: "primary" | "secondary" | "neutral" | "success" | "error" | "info" | "warning"
  buttonSize?: "xs" | "sm" | "md" | "lg" | "xl"
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  placeholder: "Select a date",
  disabled: false,
  required: false,
  locale: "en-US",
  dateStyle: "medium",
  buttonVariant: "outline",
  buttonColor: "neutral",
  buttonSize: "md"
})

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void
}>()

const calendarValue = computed(() => {
  if (!props.modelValue) return null

  if (typeof props.modelValue === "string") {
    try {
      return parseDate(props.modelValue)
    } catch {
      return null
    }
  }

  return props.modelValue
})

const dateFormatter = computed(() => {
  return new DateFormatter(props.locale, {
    dateStyle: props.dateStyle
  })
})

const displayText = computed(() => {
  if (!calendarValue.value) return props.placeholder

  try {
    return dateFormatter.value.format(calendarValue.value.toDate(getLocalTimeZone()))
  } catch {
    return props.placeholder
  }
})

const handleDateChange = (date: CalendarDate | null) => {
  if (!date) {
    emit("update:modelValue", null)
    return
  }

  const isoString = date.toString()
  emit("update:modelValue", isoString)
}
</script>

<template>
  <UFormField :label="props.label" :required="props.required" :ui="{ label: 'text-2sm font-medium text-muted' }">
    <UPopover :disabled="props.disabled">
      <UButton
        :color="props.buttonColor"
        :variant="props.buttonVariant"
        :size="props.buttonSize"
        :disabled="props.disabled"
        class="w-full justify-start"
      >
        {{ displayText }}
      </UButton>
      <template #content>
        <UCalendar :model-value="calendarValue as any" class="p-2" @update:model-value="handleDateChange as any" />
      </template>
    </UPopover>
  </UFormField>
</template>
