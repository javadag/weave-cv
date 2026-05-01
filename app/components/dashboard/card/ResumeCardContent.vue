<script setup lang="ts">
import type { TResume } from "~/types/resume.types"
import MiniResumePreview from "./MiniResumePreview.vue"

interface Props {
  resume: TResume
}

const props = defineProps<Props>()

const { locale } = useI18n()

const formatDate = (dateString: string | null) => {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString(locale.value === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

const handleEdit = (id: string) => {
  navigateTo(`/editor/${id}`)
}
</script>
<template>
  <div class="space-y-3">
    <div
      class="hover:border-primary border-muted/20 cursor-pointer overflow-hidden rounded-lg border shadow-sm duration-300"
      @click="handleEdit(props.resume.id)"
    >
      <MiniResumePreview
        :resume-id="props.resume.id"
        :personal="props.resume.content.personal"
        :core="props.resume.content.core"
        :configs="props.resume.configs"
        :resume-title="props.resume.title"
      />
    </div>
    <div class="text-muted flex items-center justify-between text-xs">
      <span>{{ $t("resumeCard.createdAt", { date: formatDate(props.resume.created_at) }) }}</span>
      <span v-if="props.resume.updated_at !== props.resume.created_at">
        {{ $t("resumeCard.updatedAt", { date: formatDate(props.resume.updated_at) }) }}
      </span>
    </div>
  </div>
</template>
