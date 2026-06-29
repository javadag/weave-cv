<script setup lang="ts">
import type { TResume } from "~/types/resume.types"
import MiniResumePreview from "./MiniResumePreview.vue"

interface Props {
  resume: TResume
}

const props = defineProps<Props>()

const { language } = useLocaleInfo()

const formatDate = (dateString: string | null) => {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString(language.value, {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}
</script>
<template>
  <div class="flex h-full min-h-65 flex-col gap-3">
    <ULink
      to="`/editor/${id}`"
      class="hover:border-primary border-muted/20 flex flex-1 cursor-pointer flex-col overflow-hidden rounded-lg border shadow-sm duration-300"
    >
      <MiniResumePreview
        :resume-id="props.resume.id"
        :personal="props.resume.content.personal"
        :core="props.resume.content.core"
        :configs="props.resume.configs"
        :resume-title="props.resume.title"
      />
    </ULink>
    <div class="text-muted mt-auto mb-0 flex flex-wrap items-center justify-between gap-1.5 text-xs">
      <span>{{ $t("resumeCard.createdAt", { date: formatDate(props.resume.created_at) }) }}</span>
      <span v-if="props.resume.updated_at !== props.resume.created_at">
        {{ $t("resumeCard.updatedAt", { date: formatDate(props.resume.updated_at) }) }}
      </span>
    </div>
  </div>
</template>
