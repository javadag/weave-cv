<script setup lang="ts">
import { defineAsyncComponent } from "vue"
import { useRoute } from "vue-router"
import ResumeConfigs from "~/components/resume/configs-forms/ResumeConfigsForms.vue"
import MobileEditorControls from "~/components/resume/editor/MobileEditorControls.vue"
import ResumePreview from "~/components/resume/preview/ResumePreview.vue"
import ResumePreviewSkeleton from "~/components/resume/preview/ResumePreviewSkeleton.vue"
import ResumeHeader from "~/components/resume/resume-header/ResumeHeader.vue"
import ResumeSectionsForms from "~/components/resume/sections-forms/ResumeSectionsForms.vue"
import type { Tables } from "~/types/database.types"
import { loadFont } from "~/utils/preview/core/fontUtils"
import type { TConfigs } from "~/utils/schemas/configs/configs.schema"
import type { TCoreSections, TPersonalContent } from "~/utils/schemas/content.schema"

const SectionsSlideover = defineAsyncComponent(() => import("~/components/resume/editor/SectionsSlideover.vue"))
const ConfigsSlideover = defineAsyncComponent(() => import("~/components/resume/editor/ConfigsSlideover.vue"))

const { t } = useI18n()
const { isRtl } = useLocaleInfo()
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
const activeSidebar = ref<"sections" | "configs" | null>(null)

const toggleSidebar = (panel: "sections" | "configs") => {
  activeSidebar.value = activeSidebar.value === panel ? null : panel
}

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
  lg: 1024,
  xl: 1536
})

const isMedium = breakpoints.between("lg", "xl")
const isDesktop = breakpoints.greaterOrEqual("xl")

const { startTour, checkFirstVisit } = useEditorTour()
provide("startTour", startTour)

watch([pending, isDesktop], ([p, isDesk]) => {
  if (!p && isDesk) {
    setTimeout(() => {
      if (checkFirstVisit()) {
        startTour()
      }
    }, 800)
  }
})

// Keyboard shortcuts
useEditorKeyboardShortcuts({ canUndo, canRedo, undo, redo })

// Warn on navigate-away with unsaved changes
onBeforeRouteLeave(() => {
  // autosave handles persistence, but warn if pending changes exist
})

if (import.meta.client) {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault()
  }
  onMounted(() => window.addEventListener("beforeunload", handleBeforeUnload))
  onUnmounted(() => window.removeEventListener("beforeunload", handleBeforeUnload))
}
</script>

<template>
  <ClientOnly>
    <div class="flex h-[calc(100dvh-6rem)] w-full flex-col gap-4 overflow-hidden">
      <ResumeHeader id="editor-toolbar" />

      <!-- Desktop (> 1536px): 3-panel SplitterGroup -->
      <div v-if="isDesktop" class="min-h-0 flex-1 overflow-hidden" dir="ltr">
        <SplitterGroup direction="horizontal" class="flex h-full gap-1">
          <SplitterPanel id="editor-sections" :min-size="15" :default-size="25" :max-size="30" class="overflow-y-auto">
            <ResumeSectionsForms :dir="isRtl ? 'rtl' : 'ltr'" :loading="pending" />
          </SplitterPanel>
          <SplitterResizeHandle class="bg-default/70 flex w-3 items-center justify-center rounded-2xl">
            <UIcon name="i-lucide-grip-vertical" class="text-primary shrink-0" />
          </SplitterResizeHandle>
          <SplitterPanel id="editor-preview" :min-size="30" class="relative overflow-hidden">
            <span class="text-toned mb-2 flex w-full items-center justify-center text-center text-xs tracking-wider">
              {{ $t("editor.header.preview") }}
              <span class="text-muted ms-2 flex items-center justify-center"
                >{{ configs.general.layout.size }}
                <UIcon name="i-lucide-dot" class="size-4" />
                {{ Math.round(scale * 100) }}%</span
              >
            </span>
            <ResumePreviewSkeleton v-if="pending" />
            <ResumePreview v-else :scale="scale" @update:scale="scale = $event" />
          </SplitterPanel>
          <SplitterResizeHandle class="bg-default/70 flex w-3 items-center justify-center rounded-2xl">
            <UIcon name="i-lucide-grip-vertical" class="text-primary size-5" />
          </SplitterResizeHandle>
          <SplitterPanel id="editor-configs" :min-size="15" :default-size="20" :max-size="25" class="overflow-y-auto">
            <ResumeConfigs :dir="isRtl ? 'rtl' : 'ltr'" />
          </SplitterPanel>
        </SplitterGroup>
      </div>

      <!-- Medium (1024–1536px): 2-panel with toggleable sidebar -->
      <div v-else-if="isMedium" class="min-h-0 flex-1 overflow-hidden">
        <div class="flex h-full gap-2">
          <!-- Sidebar: Sections or Configs -->
          <Transition name="slide-sidebar">
            <div v-if="activeSidebar" class="w-80 max-w-[320px] min-w-70 shrink-0 overflow-y-auto">
              <ResumeSectionsForms
                v-if="activeSidebar === 'sections'"
                :dir="isRtl ? 'rtl' : 'ltr'"
                :loading="pending"
              />
              <ResumeConfigs v-else :dir="isRtl ? 'rtl' : 'ltr'" />
            </div>
          </Transition>

          <!-- Preview -->
          <div class="relative min-w-0 flex-1 overflow-hidden">
            <div class="absolute top-2 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              <UButton
                :color="activeSidebar === 'sections' ? 'primary' : 'neutral'"
                :variant="activeSidebar === 'sections' ? 'solid' : 'outline'"
                icon="i-lucide-file-text"
                size="sm"
                @click="toggleSidebar('sections')"
              >
                {{ $t("editor.sections") }}
              </UButton>
              <UButton
                :color="activeSidebar === 'configs' ? 'primary' : 'neutral'"
                :variant="activeSidebar === 'configs' ? 'solid' : 'outline'"
                icon="i-lucide-settings"
                size="sm"
                @click="toggleSidebar('configs')"
              >
                {{ $t("editor.style") }}
              </UButton>
            </div>
            <span class="text-toned mb-2 flex w-full items-center justify-center text-center text-xs tracking-wider">
              {{ $t("editor.header.preview") }}
              <span class="text-muted ms-2 flex items-center justify-center"
                >{{ configs.general.layout.size }}
                <UIcon name="i-lucide-dot" class="size-4" />
                {{ Math.round(scale * 100) }}%</span
              >
            </span>
            <ResumePreviewSkeleton v-if="pending" :is-responsive="true" />
            <ResumePreview v-else :scale="scale" :is-responsive="true" @update:scale="scale = $event" />
          </div>
        </div>
      </div>

      <!-- Mobile (< 1024px): Full preview + bottom sheets -->
      <div v-else class="relative min-h-0 flex-1 overflow-hidden">
        <span class="text-toned mb-2 flex w-full items-center justify-center text-center text-xs tracking-wider">
          {{ $t("editor.header.preview") }}
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

<style scoped>
.slide-sidebar-enter-active,
.slide-sidebar-leave-active {
  transition: all 0.2s ease;
}

.slide-sidebar-enter-from,
.slide-sidebar-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>
