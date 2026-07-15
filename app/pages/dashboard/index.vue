<script setup lang="ts">
import CreateResumeButton from "~/components/dashboard/CreateResumeButton.vue"
import EmptyState from "~/components/dashboard/EmptyState.vue"
import ImportResumeButton from "~/components/dashboard/ImportResumeButton.vue"
import LoadingSkeleton from "~/components/dashboard/LoadingSkeleton.vue"
import ResumeGrid from "~/components/dashboard/ResumeGrid.vue"
import { useResumeCount } from "~/composables/useResumeCount"

const { t } = useI18n()

definePageMeta({ layout: "dashboard" })

useSeoMeta({
  title: () => t("seo.dashboardIndex.title"),
  description: () => t("seo.dashboardIndex.description"),
  ogTitle: () => t("seo.dashboardIndex.title"),
  ogDescription: () => t("seo.dashboardIndex.description"),
  ogUrl: "/dashboard",
  twitterTitle: () => t("seo.dashboardIndex.title"),
  twitterDescription: () => t("seo.dashboardIndex.description")
})

useHead({
  meta: [{ name: "robots", content: "noindex, nofollow" }]
})

const { resumes, count, pending, error, refresh } = useResumeCount()
const { importGuestResume, hasPending } = useGuestResume()

onMounted(async () => {
  if (hasPending.value) {
    const imported = await importGuestResume()
    if (imported) await refresh()
  }
})
</script>

<template>
  <div class="w-full">
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div class="flex-1">
        <h1 class="text-default text-2xl font-bold tracking-tight">{{ $t("dashboard.myResumes.title") }}</h1>
        <p class="text-muted mt-1 text-sm">{{ $t("dashboard.myResumes.subtitle") }}</p>
      </div>
      <ImportResumeButton @created="() => refresh()" />
      <CreateResumeButton @created="() => refresh()" />
    </div>
    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      :title="$t('dashboard.myResumes.errorTitle')"
      :description="$t('dashboard.myResumes.errorDesc')"
      class="mb-6"
    />
    <LoadingSkeleton v-if="pending" />
    <EmptyState v-else-if="resumes?.length === 0" />
    <ResumeGrid
      v-else-if="resumes && resumes.length > 0"
      :resumes="resumes"
      :resume-count="count"
      @refresh="() => refresh()"
    />
  </div>
</template>
