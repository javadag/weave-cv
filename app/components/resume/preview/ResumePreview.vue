<script setup lang="ts">
import { generateSectionsOrder } from "~/utils/preview/core/layoutGenerator"
import { sizeToPx } from "~/utils/preview/units"
import RenderPages from "./pages/RenderPages.vue"

const SCALE_DEBOUNCE_MS = 150
const SCALE_THRESHOLD = 0.005

interface Props {
  scale: number
  isResponsive?: boolean
  maxScale?: number
}

const emit = defineEmits<{
  (e: "update:scale", value: number): void
}>()

const props = withDefaults(defineProps<Props>(), {
  maxScale: 1.05
})

const container = ref<HTMLElement>()

const { width } = useElementSize(container)

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const resumeStore = useResumeStore()
const { core, title } = storeToRefs(resumeStore)

const sectionsOrder = computed(() => generateSectionsOrder(configs.value.general.layout))

useProcessContent(core, title)

const pages = useGeneratePages(sectionsOrder)

const scale = computed(() => props.scale)

const debouncedFitWidth = useDebounceFn(() => {
  if (width.value <= 0) return
  const rawScale = width.value / sizeToPx(configs.value.general.layout.size, "w")
  const newScale = props.maxScale ? Math.min(rawScale, props.maxScale) : rawScale
  if (Math.abs(newScale - scale.value) > SCALE_THRESHOLD) {
    emit("update:scale", newScale)
  }
}, SCALE_DEBOUNCE_MS)

watch(width, debouncedFitWidth)

const paperWidth = computed(() => sizeToPx(configs.value.general.layout.size, "w"))

const transformWrapperStyle = computed(() => ({
  width: `${paperWidth.value * props.scale}px`,
  minWidth: `${paperWidth.value * props.scale}px`
}))

const transformStyle = computed(() => ({
  width: `${paperWidth.value}px`,
  transformOrigin: "top left",
  transform: `scale(${props.scale})`
}))
</script>
<template>
  <div
    ref="container"
    class="hide-scrollbar flex h-full w-full justify-center overflow-y-auto"
    :class="{ absolute: isResponsive }"
    style="direction: ltr"
  >
    <div :style="transformWrapperStyle">
      <div :style="transformStyle">
        <RenderPages :pages="pages" />
      </div>
    </div>
  </div>
</template>
