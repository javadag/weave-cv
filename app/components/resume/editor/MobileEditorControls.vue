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
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-3 xl:hidden">
    <UButton
      :icon="'i-lucide-file-text'"
      size="lg"
      color="primary"
      class="shadow-lg hover:bg-primary/100"
      @click="toggleSections"
    >
      <span class="hidden sm:inline">Sections</span>
    </UButton>
    <UButton
      :icon="'i-lucide-settings'"
      size="lg"
      color="primary"
      class="shadow-lg hover:bg-primary/100"
      @click="toggleConfigs"
    >
      <span class="hidden sm:inline">Settings</span>
    </UButton>
  </div>
</template>
