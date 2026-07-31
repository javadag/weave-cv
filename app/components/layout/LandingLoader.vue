<script setup lang="ts">
import Logo from "./Logo.vue"

const visible = ref(true)

onMounted(() => {
  // Small delay so the first paint completes before we start fading
  requestAnimationFrame(() => {
    visible.value = false
  })
})
</script>

<template>
  <Transition name="loader">
    <div v-if="visible" class="loader-overlay">
      <div class="loader-content">
        <Logo />
        <div class="loader-spinner">
          <div class="spinner-ring" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ui-bg);
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loader-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.loader-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
}

.spinner-ring {
  width: 1.5rem;
  height: 1.5rem;
  border: 2.5px solid var(--ui-border);
  border-top-color: var(--ui-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Fade-out transition */
.loader-leave-active {
  transition: opacity 0.4s ease;
}
.loader-leave-to {
  opacity: 0;
}
</style>
