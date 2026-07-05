<script setup lang="ts">
import FeedbackModal from "./FeedbackModal.vue"

const isOpen = ref(false)
</script>

<template>
  <div class="pointer-events-none fixed inset-e-6 bottom-6 z-40">
    <UButton
      icon="i-lucide-message-circle-warning"
      size="lg"
      color="primary"
      variant="solid"
      class="pointer-events-auto rounded-full shadow-lg"
      :title="$t('feedback.button')"
      :aria-label="$t('feedback.button')"
      @click="
        () => {
          isOpen = true
        }
      "
    />
    <FeedbackModal v-model="isOpen" />
  </div>
</template>
