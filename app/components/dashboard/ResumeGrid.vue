<script setup lang="ts">
import { MAX_RESUMES } from "~/constants/config"
import type { TResume } from "~/types/resume.types"
import ResumeCard from "./card/ResumeCard.vue"

interface Props {
  resumes: TResume[]
  resumeCount: number
}

const props = defineProps<Props>()

const emits = defineEmits<{
  refresh: []
}>()

const hasReachedLimit = computed(() => props.resumeCount >= MAX_RESUMES)
</script>

<template>
  <div class="grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    <ResumeCard
      v-for="resume in resumes"
      :key="resume.id"
      :resume="resume"
      :disable-duplicate="hasReachedLimit"
      @refresh="emits('refresh')"
    />
  </div>
</template>
