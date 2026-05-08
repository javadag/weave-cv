<script setup lang="ts">
import { useRoute } from "vue-router"
import ResumeConfigs from "~/components/resume/configs-forms/ResumeConfigsForms.vue"
import ConfigsSlideover from "~/components/resume/editor/ConfigsSlideover.vue"
import MobileEditorControls from "~/components/resume/editor/MobileEditorControls.vue"
import SectionsSlideover from "~/components/resume/editor/SectionsSlideover.vue"
import ResumePreview from "~/components/resume/preview/ResumePreview.vue"
import ResumePreviewSkeleton from "~/components/resume/preview/ResumePreviewSkeleton.vue"
import ResumeHeader from "~/components/resume/resume-header/ResumeHeader.vue"
import ResumeSectionsForms from "~/components/resume/sections-forms/ResumeSectionsForms.vue"
import type { Tables } from "~/types/database.types"
import { loadFont } from "~/utils/preview/core/fontUtils"
import type { TConfigs } from "~/utils/schemas/configs/configs.schema"
import type { TCoreSections, TPersonalContent } from "~/utils/schemas/content.schema"

const { t } = useI18n()
const route = useRoute()

const id = computed(() => route.params.id as string)

const resumeStore = useResumeStore()
const { setContent, setTitle } = resumeStore
const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const { setConfigs } = configsStore

const { canUndo, canRedo, undo, redo } = useUndoRedo()
provide("undoRedo", { canUndo, canRedo, undo, redo })

const pageTitle = computed(() => {
  return resumeStore.title ? t("seo.editor.titleEdit", { title: resumeStore.title }) : t("seo.editor.titleDefault")
})

useSeoMeta({
  title: pageTitle,
  description: () => t("seo.editor.description"),
  ogTitle: pageTitle,
  ogDescription: () => t("seo.editor.description"),
  ogUrl: `/editor/${id.value}`,
  twitterTitle: pageTitle,
  twitterDescription: () => t("seo.editor.description"),
  robots: "noindex, nofollow"
})

const { pending } = useFetch<Tables<"resumes">>(`/api/resumes/${id.value}`, {
  method: "GET",
  lazy: true,
  onResponse: ({ response }) => {
    const data = response._data
    if (!data) return

    const content = data.content as { personal: TPersonalContent; core: TCoreSections }
    const resumeConfigs = data.configs as TConfigs

    setContent({ personal: content.personal, core: content.core })
    setConfigs(resumeConfigs)
    setTitle(data.title)
  }
})

// load font family when configs are available
watch(
  () => configs.value.general.typography.fontFamily,
  (fontFamily) => {
    loadFont(fontFamily)
  },
  { immediate: true }
)

const scale = ref(1)

const isSectionsSlideoverOpen = ref(false)
const isConfigsSlideoverOpen = ref(false)

const toggleSectionsSlideover = () => {
  if (isSectionsSlideoverOpen.value) {
    isSectionsSlideoverOpen.value = false
  } else {
    isConfigsSlideoverOpen.value = false
    isSectionsSlideoverOpen.value = true
  }
}

const toggleConfigsSlideover = () => {
  if (isConfigsSlideoverOpen.value) {
    isConfigsSlideoverOpen.value = false
  } else {
    isSectionsSlideoverOpen.value = false
    isConfigsSlideoverOpen.value = true
  }
}

const breakpoints = useBreakpoints({
  xl: 1280
})

const isXlScreen = breakpoints.greaterOrEqual("xl")
</script>

<template>
  <ClientOnly>
    <div class="flex max-h-[calc(100dvh-88px)] w-full flex-col gap-4 overflow-hidden">
      <ResumeHeader />
      <div v-if="isXlScreen" class="overflow-hidden">
        <SplitterGroup direction="horizontal" class="flex h-full gap-1">
          <SplitterPanel :min-size="20" :default-size="25" :max-size="35">
            <ResumeSectionsForms :loading="pending" />
          </SplitterPanel>
          <SplitterResizeHandle class="bg-default/70 flex w-3 items-center justify-center rounded-2xl">
            <UIcon name="i-lucide-grip-vertical" class="text-primary" />
          </SplitterResizeHandle>
          <SplitterPanel :min-size="20" class="relative">
            <span class="text-toned mb-2 flex w-full items-center justify-center text-center text-xs tracking-wider">
              {{ $t("editor.header.preview") }}
              <span class="text-muted ms-2 flex items-center justify-center"
                >{{ configs.general.layout.size }}
                <UIcon name="i-lucide-dot" class="size-4" />
                {{ Math.round(scale * 100) }}%</span
              ></span
            >
            <ResumePreviewSkeleton v-if="pending" />
            <ResumePreview v-else :scale="scale" @update:scale="scale = $event" />
          </SplitterPanel>
          <SplitterResizeHandle class="bg-default/70 flex w-3 items-center justify-center rounded-2xl">
            <UIcon name="i-lucide-grip-vertical" class="text-primary size-5" />
          </SplitterResizeHandle>
          <SplitterPanel :min-size="20" :default-size="20" :max-size="30">
            <ResumeConfigs />
          </SplitterPanel>
        </SplitterGroup>
      </div>

      <div v-else class="relative size-full">
        <span class="text-toned mb-2 flex w-full items-center justify-center text-center text-xs tracking-wider">
          Preview
          <span class="text-muted ms-2 flex items-center justify-center"
            >{{ configs.general.layout.size }}
            <UIcon name="i-lucide-dot" class="size-4" />
            {{ Math.round(scale * 100) }}%</span
          >
        </span>
        <ResumePreviewSkeleton v-if="pending" :is-responsive="true" />
        <ResumePreview v-else :scale="scale" :is-responsive="true" @update:scale="scale = $event" />
        <MobileEditorControls
          :is-sections-open="isSectionsSlideoverOpen"
          :is-configs-open="isConfigsSlideoverOpen"
          @toggle:sections="toggleSectionsSlideover"
          @toggle:configs="toggleConfigsSlideover"
        />
      </div>

      <SectionsSlideover v-model:open="isSectionsSlideoverOpen" :loading="pending" />
      <ConfigsSlideover v-model:open="isConfigsSlideoverOpen" />
    </div>
  </ClientOnly>
</template>
