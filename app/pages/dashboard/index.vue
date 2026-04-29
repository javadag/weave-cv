<script setup lang="ts">
import CreateResumeButton from "~/components/dashboard/CreateResumeButton.vue"
import EmptyState from "~/components/dashboard/EmptyState.vue"
import ImportResumeButton from "~/components/dashboard/ImportResumeButton.vue"
import LoadingSkeleton from "~/components/dashboard/LoadingSkeleton.vue"
import ResumeGrid from "~/components/dashboard/ResumeGrid.vue"
import { useResumeCount } from "~/composables/useResumeCount"
import { MAX_RESUMES } from "~/constants/limits"

definePageMeta({ layout: "dashboard" })

useHead({
  title: "My Resumes - Weave CV",
  meta: [
    {
      name: "description",
      content:
        "Manage and edit your resumes. Create new resumes, update existing ones, and organize your professional documents."
    },
    { property: "og:title", content: "My Resumes - Weave CV" },
    {
      property: "og:description",
      content:
        "Manage and edit your resumes. Create new resumes, update existing ones, and organize your professional documents."
    },
    { property: "og:url", content: "/dashboard" },
    { name: "robots", content: "noindex, nofollow" }
  ]
})

const { resumes, count, pending, error, refresh } = useResumeCount()
const hasReachedLimit = computed(() => count.value >= MAX_RESUMES)
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-end flex-wrap gap-4 mb-6">
      <div class="flex-1">
        <h1 class="text-2xl font-bold tracking-tight text-default">{{ $t("dashboard.myResumes.title") }}</h1>
        <p class="text-muted text-sm mt-1">{{ $t("dashboard.myResumes.subtitle") }}</p>
      </div>
      <ImportResumeButton :disabled="hasReachedLimit" @created="() => refresh()" />
      <CreateResumeButton :disabled="hasReachedLimit" @created="() => refresh()" />
    </div>
    <UAlert
      v-if="hasReachedLimit"
      color="warning"
      variant="subtle"
      icon="i-lucide-alert-triangle"
      :title="$t('dashboard.myResumes.limitTitle')"
      :description="$t('dashboard.myResumes.limitDesc', { max: MAX_RESUMES })"
      class="mb-6 text-primary"
    />
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
