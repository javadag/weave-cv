<script setup lang="ts">
import DeleteAccountModal from "~/components/dashboard/DeleteAccountModal.vue"

definePageMeta({ layout: "dashboard" })

useHead({
  title: "Account - Weave CV",
  meta: [{ name: "robots", content: "noindex, nofollow" }]
})

const isModalOpen = ref(false)
</script>

<template>
  <div class="max-w-6xl">
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight text-default">{{ $t("dashboard.account.title") }}</h1>
      <p class="text-muted text-sm mt-1">{{ $t("dashboard.account.subtitle") }}</p>
    </div>

    <div class="rounded-xl border border-error/30 bg-gradient-to-b from-error/10 to-transparent">
      <div class="flex items-center justify-between gap-4 p-5 flex-wrap">
        <div class="min-w-0">
          <div class="text-sm font-semibold text-default">{{ $t("dashboard.account.deleteTitle") }}</div>
          <div class="text-sm text-muted mt-0.5">
            {{ $t("dashboard.account.deleteDesc") }}
          </div>
        </div>
        <UButton color="error" icon="i-lucide-user-x" @click="isModalOpen = true">{{
          $t("dashboard.account.deleteBtn")
        }}</UButton>
      </div>
    </div>

    <div class="mt-4 rounded-lg border border-default bg-elevated p-4 text-sm text-muted flex gap-2.5 items-start">
      <UIcon name="i-lucide-alert-triangle" class="size-4 shrink-0 mt-0.5" />
      <p>{{ $t("dashboard.account.warningNote") }}</p>
    </div>

    <DeleteAccountModal v-model="isModalOpen" />
  </div>
</template>
