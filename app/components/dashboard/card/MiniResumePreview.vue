<script setup lang="ts">
import type { TResume } from "~/types/resume.types"
import type { TCoreSection, TCoreSections } from "~/utils/schemas/content.schema"

interface Props {
  personal: TResume["content"]["personal"]
  core: TResume["content"]["core"] | null
  configs: TResume["configs"]
  resumeId: string
  resumeTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  resumeTitle: "Preview"
})

const accentColor = computed(() => props.configs.general.colors.primary.accentColor)
const bgColor = computed(() => props.configs.general.colors.primary.bgColor)
const textColor = computed(() => props.configs.general.colors.primary.textColor)

const visibleDetails = computed(() => {
  if (!props.personal?.details) return []
  return props.personal.details.filter((d) => d.value && !d.isHidden).slice(0, 3)
})

const summaryContent = computed(() => {
  if (!props.core) return null
  const core = props.core as TCoreSections
  const sections: TCoreSection[] = Object.values(core)
  const summary = sections.find(
    (s): s is TCoreSection & { type: "summary" } => s.type === "summary" && s.isSectionVisible
  )
  if (summary?.contents && summary.contents.length > 0) {
    const firstContent = summary.contents.find((c) => !c.isHidden)
    if (firstContent && "description" in firstContent && firstContent.description) {
      const htmlTagRegex = /<[^>]*>/g
      const text = firstContent.description.replaceAll(htmlTagRegex, "").trim()
      return text.length > 120 ? text.slice(0, 120) + "..." : text
    }
  }
  return null
})

const firstExperience = computed(() => {
  if (!props.core) return null
  const core = props.core as TCoreSections
  const sections: TCoreSection[] = Object.values(core)
  const experience = sections.find(
    (s): s is TCoreSection & { type: "experiences" | "educations" } =>
      (s.type === "experiences" || s.type === "educations") && s.isSectionVisible
  )
  if (experience?.contents && experience.contents.length > 0) {
    const firstContent = experience.contents.find((c) => !c.isHidden)
    if (firstContent && "title" in firstContent && firstContent.title) {
      return firstContent.title
    }
  }
  return null
})
</script>

<template>
  <div class="flex min-h-35 w-full flex-col overflow-hidden rounded-md shadow-sm">
    <div class="flex flex-col gap-2 p-4" :style="{ backgroundColor: bgColor, color: textColor }">
      <h3 class="m-0 text-lg leading-[1.2] font-bold" :style="{ color: accentColor }">
        {{ personal?.title || "Your Name" }}
      </h3>
      <p v-if="personal?.subtitle" class="m-0 text-sm leading-[1.3] opacity-90">{{ personal.subtitle }}</p>
      <div v-if="visibleDetails.length > 0" class="mt-1 flex flex-wrap gap-2 text-xs opacity-80">
        <template v-for="(detail, index) in visibleDetails" :key="index">
          <span class="inline-flex items-center gap-2">{{ detail.value }}</span>
          <span v-if="index < visibleDetails.length - 1" class="ml-2 opacity-50">•</span>
        </template>
      </div>
    </div>
    <div class="flex flex-1 items-start bg-white p-4">
      <div v-if="summaryContent" class="w-full">
        <p class="text-2sm m-0 line-clamp-3 leading-6 text-gray-700">{{ summaryContent }}</p>
      </div>
      <div v-else-if="firstExperience" class="w-full">
        <p class="text-2sm m-0 line-clamp-3 leading-6 text-gray-700">{{ firstExperience }}</p>
      </div>
      <div v-else class="w-full">
        <p class="text-2sm m-0 leading-6 text-gray-700 italic">No content yet</p>
      </div>
    </div>
  </div>
</template>
