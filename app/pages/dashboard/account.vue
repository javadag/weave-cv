<script setup lang="ts">
import DeleteAccountModal from "~/components/dashboard/DeleteAccountModal.vue"

definePageMeta({ layout: "dashboard" })

const { t } = useI18n()

useHead({
  title: () => t("seo.dashboardAccount.title"),
  meta: [{ name: "robots", content: "noindex, nofollow" }]
})

const isModalOpen = ref(false)
</script>

<template>
  <div class="max-w-6xl">
    <div class="mb-6">
      <h1 class="text-default text-2xl font-bold tracking-tight">{{ $t("dashboard.account.title") }}</h1>
      <p class="text-muted mt-1 text-sm">{{ $t("dashboard.account.subtitle") }}</p>
    </div>

    <div class="border-error/30 from-error/10 rounded-xl border bg-linear-to-b to-transparent">
      <div class="flex flex-wrap items-center justify-between gap-4 p-5">
        <div class="min-w-0">
          <div class="text-default text-sm font-semibold">{{ $t("dashboard.account.deleteTitle") }}</div>
          <div class="text-muted mt-0.5 text-sm">
            {{ $t("dashboard.account.deleteDesc") }}
          </div>
        </div>
        <UButton color="error" icon="i-lucide-user-x" @click="isModalOpen = true">{{
          $t("dashboard.account.deleteBtn")
        }}</UButton>
      </div>
    </div>

    <div class="border-default bg-elevated text-muted mt-4 flex items-start gap-2.5 rounded-lg border p-4 text-sm">
      <UIcon name="i-lucide-alert-triangle" class="mt-0.5 size-4 shrink-0" />
      <p>{{ $t("dashboard.account.warningNote") }}</p>
    </div>

    <DeleteAccountModal v-model="isModalOpen" />
  </div>
</template>
