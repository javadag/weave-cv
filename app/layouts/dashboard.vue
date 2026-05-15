<script setup lang="ts">
import DashboardSidebar from "~/components/dashboard/Sidebar.vue"
import FeedbackFab from "~/components/feedback/FeedbackFab.vue"
import DashboardHeader from "~/components/layout/DashboardHeader.vue"

const open = ref(true)
</script>

<template>
  <div class="bg-muted flex min-h-dvh flex-col">
    <div class="flex flex-1">
      <DashboardSidebar v-model:open="open" />
      <div class="flex-1">
        <DashboardHeader v-model:open="open" />
        <main class="flex-1 overflow-auto px-4 py-6 sm:px-8 sm:py-8">
          <slot />
        </main>
      </div>
    </div>
    <FeedbackFab />
  </div>
</template>
