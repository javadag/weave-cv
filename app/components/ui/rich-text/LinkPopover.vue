<script setup lang="ts">
interface Props {
  isActive: boolean
  linkUrl: string
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void
  (e: "update:linkUrl", value: string): void
  (e: "action", action: "apply" | "clear" | "open"): void
}>()

const linkInputRef = ref<HTMLInputElement | null>(null)

const openLinkPanel = () => {
  emit("action", "open")
  nextTick(() => linkInputRef.value?.focus())
}

const applyLink = () => {
  emit("action", "apply")
}

const clearLink = () => {
  emit("action", "clear")
}

const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    applyLink()
  }
}
</script>

<template>
  <UPopover :open="isOpen" @update:open="(value) => emit('update:isOpen', value)">
    <UTooltip :text="$t('ui.richText.link')" class="flex items-center justify-center">
      <button :class="{ 'is-active': isActive }" :aria-label="$t('ui.richText.link')" @click="openLinkPanel">
        <UIcon name="i-lucide-link" />
      </button>
    </UTooltip>

    <template #content>
      <div class="flex items-center gap-2 p-3">
        <UInput
          ref="linkInputRef"
          :model-value="linkUrl"
          :placeholder="$t('ui.richText.linkPlaceholder')"
          class="w-64"
          @update:model-value="(value) => emit('update:linkUrl', value)"
          @keyup="handleKeyup"
        />
        <UButton size="sm" @click="applyLink">{{ $t('ui.richText.apply') }}</UButton>
        <UButton size="sm" color="neutral" variant="soft" @click="clearLink">{{ $t('ui.richText.clear') }}</UButton>
      </div>
    </template>
  </UPopover>
</template>
