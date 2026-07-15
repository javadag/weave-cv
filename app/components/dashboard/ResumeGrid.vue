<script setup lang="ts">
import type { TResume } from "~/types/resume.types"
import ResumeCard from "./card/ResumeCard.vue"

defineProps<{
  resumes: TResume[]
  resumeCount: number
}>()

const emits = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <div class="grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    <ResumeCard
      v-for="resume in resumes"
      :key="resume.id"
      :resume="resume"
      @refresh="emits('refresh')"
    />
  </div>
</template>
