<script setup lang="ts">
import { loadFont } from "~/utils/preview/core/fontUtils"
import { sizeToPx } from "~/utils/preview/units"
import type { TConfigs } from "~/utils/schemas/configs/configs.schema"
import type { TCoreSections, TPersonalContent } from "~/utils/schemas/content.schema"

definePageMeta({ layout: false })

const { t } = useI18n()
const route = useRoute()
const slug = computed(() => route.params.slug as string)

interface PublicResumeResponse {
  title: string
  content: { personal: TPersonalContent; core: TCoreSections }
  configs: TConfigs
  public_view_count: number | null
  updated_at: string
}

const {
  data: resume,
  pending,
  error
} = useFetch<PublicResumeResponse>(`/api/resumes/public/${slug.value}`, {
  method: "GET",
  key: `public-resume-${slug.value}`
})

const personName = computed(() => {
  return resume.value?.content?.personal?.title || resume.value?.title || ""
})

const personRole = computed(() => {
  return resume.value?.content?.personal?.subtitle || ""
})

useSeoMeta({
  title: () => t("publicResume.seoTitle", { name: personName.value || slug.value }),
  description: () =>
    personRole.value
      ? t("publicResume.seoDescription", { name: personName.value })
      : `View ${personName.value || slug.value}'s professional resume on Weave CV`,
  ogTitle: () => (personName.value ? t("publicResume.seoTitle", { name: personName.value }) : "Resume — Weave CV"),
  ogDescription: () =>
    personRole.value ? `${personName.value} — ${personRole.value}` : `View this professional resume on Weave CV`,
  ogType: "profile",
  ogUrl: () => `/r/${slug.value}`,
  twitterTitle: () => (personName.value ? t("publicResume.seoTitle", { name: personName.value }) : "Resume — Weave CV"),
  twitterDescription: () =>
    personRole.value ? `${personName.value} — ${personRole.value}` : `View this professional resume on Weave CV`,
  robots: "index, follow"
})

useHead({
  link: [{ rel: "canonical", href: `https://weavecv.app/r/${slug.value}` }]
})

const resumeStore = useResumeStore()
const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

watchEffect(() => {
  if (!resume.value) {
    return
  }

  resumeStore.setContent({
    personal: resume.value.content.personal,
    core: resume.value.content.core
  })
  resumeStore.setTitle(resume.value.title)
  configsStore.setConfigs(resume.value.configs)
  loadFont(configs.value.general.typography.fontFamily)
})

// Scale the preview to fit the container, capped at 1 (never scale up)
const previewWrapper = ref<HTMLElement>()
const { width: wrapperWidth } = useElementSize(previewWrapper)

const fitScale = computed(() => {
  if (wrapperWidth.value <= 0) return 1
  const paperPxWidth = sizeToPx(configs.value.general.layout.size, "w")
  return Math.min(wrapperWidth.value / paperPxWidth, 1)
})

const notFound = computed(() => {
  return error.value && (error.value as { statusCode?: number }).statusCode === 404
})
</script>

<template>
  <div class="bg-default flex min-h-dvh flex-col md:items-center">
    <div v-if="pending" class="flex flex-1 items-center justify-center">
      <UIcon name="i-lucide-loader-2" class="text-muted size-8 animate-spin" />
    </div>
    <div v-else-if="notFound" class="flex flex-1 flex-col items-center justify-center gap-4 px-4">
      <div class="bg-muted/10 flex h-20 w-20 items-center justify-center rounded-full">
        <UIcon name="i-lucide-file-question" class="text-muted size-10" />
      </div>
      <h1 class="text-default text-2xl font-bold">{{ $t("publicResume.notFound") }}</h1>
      <p class="text-muted text-center text-sm">{{ $t("publicResume.notFoundDesc") }}</p>
      <UButton to="/" color="primary" size="lg">
        {{ $t("publicResume.createCta") }}
      </UButton>
    </div>
    <template v-else-if="resume">
      <div class="flex flex-1 justify-center overflow-auto p-2 md:p-4">
        <ClientOnly>
          <div ref="previewWrapper" class="flex w-full justify-center overflow-hidden">
            <ResumePreview :scale="fitScale" />
          </div>
          <template #fallback>
            <div class="flex items-center justify-center py-20">
              <UIcon name="i-lucide-loader-2" class="text-muted size-8 animate-spin" />
            </div>
          </template>
        </ClientOnly>
      </div>
      <div class="border-default/50 text-muted flex items-center justify-center gap-1 border-t px-4 py-3 text-xs">
        <span>{{ $t("publicResume.madeWith") }}</span>
        <span class="text-primary">♥</span>
        <NuxtLink to="/" class="text-primary hover:underline">
          {{ $t("publicResume.createYourOwn") }}
        </NuxtLink>
      </div>
    </template>
    <div v-else class="flex flex-1 flex-col items-center justify-center gap-4 px-4">
      <p class="text-muted">{{ $t("publicResume.notFoundDesc") }}</p>
      <UButton to="/" color="primary">{{ $t("publicResume.createCta") }}</UButton>
    </div>
  </div>
</template>
