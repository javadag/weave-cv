<script setup lang="ts">
import { defineAsyncComponent } from "vue"
import ResumeConfigs from "~/components/resume/configs-forms/ResumeConfigsForms.vue"
import MobileEditorControls from "~/components/resume/editor/MobileEditorControls.vue"
import ResumePreview from "~/components/resume/preview/ResumePreview.vue"
import ResumePreviewSkeleton from "~/components/resume/preview/ResumePreviewSkeleton.vue"
import ResumeHeader from "~/components/resume/resume-header/ResumeHeader.vue"
import ResumeSectionsForms from "~/components/resume/sections-forms/ResumeSectionsForms.vue"
import { SAMPLE_RESUME } from "~/constants/sample-data"
import { loadFont } from "~/utils/preview/core/fontUtils"

const SectionsSlideover = defineAsyncComponent(() => import("~/components/resume/editor/SectionsSlideover.vue"))
const ConfigsSlideover = defineAsyncComponent(() => import("~/components/resume/editor/ConfigsSlideover.vue"))
const GuestCtaBanner = defineAsyncComponent(() => import("~/components/try/GuestCtaBanner.vue"))

const { t } = useI18n()

const user = useSupabaseUser()
if (user.value) {
  navigateTo("/dashboard")
}

const resumeStore = useResumeStore()
const { setContent, setTitle } = resumeStore
const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const { setConfigs } = configsStore

setContent({ personal: SAMPLE_RESUME.content.personal, core: SAMPLE_RESUME.content.core })
setConfigs(SAMPLE_RESUME.configs)
setTitle(SAMPLE_RESUME.title)

const { canUndo, canRedo, undo, redo } = useUndoRedo()
provide("undoRedo", { canUndo, canRedo, undo, redo })

useSeoMeta({
  title: () => t("try.seo.title"),
  description: () => t("try.seo.description"),
  ogTitle: () => t("try.seo.title"),
  ogDescription: () => t("try.seo.description"),
  ogUrl: "/try",
  twitterTitle: () => t("try.seo.title"),
  twitterDescription: () => t("try.seo.description"),
  robots: "noindex, nofollow"
})

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

const { startTour, checkFirstVisit } = useEditorTour()
provide("startTour", startTour)

const pending = ref(false)

onMounted(() => {
  if (isXlScreen.value) {
    setTimeout(() => {
      if (checkFirstVisit()) {
        startTour()
      }
    }, 800)
  }
})
</script>

<template>
  <ClientOnly>
    <div class="flex max-h-[calc(100dvh-88px)] w-full flex-col gap-4 overflow-hidden">
      <GuestCtaBanner />
      <ResumeHeader id="editor-toolbar" />
      <div v-if="isXlScreen" class="overflow-hidden" dir="ltr">
        <SplitterGroup direction="horizontal" class="flex h-full gap-1">
          <SplitterPanel id="editor-sections" :min-size="20" :default-size="25" :max-size="35">
            <ResumeSectionsForms :loading="pending" />
          </SplitterPanel>
          <SplitterResizeHandle class="bg-default/70 flex w-3 items-center justify-center rounded-2xl">
            <UIcon name="i-lucide-grip-vertical" class="text-primary shrink-0" />
          </SplitterResizeHandle>
          <SplitterPanel id="editor-preview" :min-size="20" class="relative">
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
          <SplitterPanel id="editor-configs" :min-size="20" :default-size="20" :max-size="30">
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
