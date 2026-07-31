<script setup lang="ts">
interface Props {
  isSectionsOpen: boolean
  isConfigsOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  "toggle:sections": []
  "toggle:configs": []
}>()

const toggleSections = () => {
  emit("toggle:sections")
}

const toggleConfigs = () => {
  emit("toggle:configs")
}
</script>

<template>
  <div class="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 gap-3 lg:hidden">
    <UButton
      :icon="'i-lucide-file-text'"
      size="lg"
      color="primary"
      class="hover:bg-primary shadow-lg"
      @click="toggleSections"
    >
      <span class="hidden sm:inline">{{ $t("editor.sections") }}</span>
    </UButton>
    <UButton
      :icon="'i-lucide-settings'"
      size="lg"
      color="primary"
      class="hover:bg-primary shadow-lg"
      @click="toggleConfigs"
    >
      <span class="hidden sm:inline">{{ $t("editor.style") }}</span>
    </UButton>
  </div>
</template>
