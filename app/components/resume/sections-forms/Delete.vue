<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui"

const props = defineProps<{
  class?: string
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  onDelete: () => void
  tooltip?: string
}>()

const isOpen = ref(false)
const { t } = useI18n()

const handleDelete = () => {
  props.onDelete()
  isOpen.value = false
}

const handleCancel = () => {
  isOpen.value = false
}
</script>

<template>
  <UPopover v-model:open="isOpen">
    <UTooltip :text="props.tooltip ?? t('common.delete')">
      <UButton
        :class="props.class"
        :variant="props.variant ?? 'ghost'"
        :size="props.size ?? 'sm'"
        icon="i-lucide-trash-2"
        :aria-label="props.tooltip ?? t('editor.form.deleteSection')"
        @click="
          () => {
            isOpen = true
          }
        "
      />
    </UTooltip>
    <template #content>
      <div class="space-y-3 p-3">
        <p class="text-default text-sm">{{ $t("editor.form.deleteConfirm") }}</p>
        <div class="flex justify-end gap-2">
          <UButton size="sm" color="neutral" variant="ghost" @click="handleCancel">{{ $t("common.cancel") }}</UButton>
          <UButton size="sm" color="error" @click="handleDelete">{{ $t("common.delete") }}</UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>
