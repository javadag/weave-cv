<script setup lang="ts">
import { generateSectionsOrder } from "~/utils/preview/core/layoutGenerator"
import { sizeToPx } from "~/utils/preview/units"
import RenderPages from "./pages/RenderPages.vue"

const SCALE_DEBOUNCE_MS = 150
const SCALE_THRESHOLD = 0.005

interface Props {
  scale: number
  isResponsive?: boolean
}

const emit = defineEmits<{
  (e: "update:scale", value: number): void
}>()

const props = defineProps<Props>()

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
  const newScale = width.value / sizeToPx(configs.value.general.layout.size, "w")
  if (Math.abs(newScale - scale.value) > SCALE_THRESHOLD) {
    emit("update:scale", newScale)
  }
}, SCALE_DEBOUNCE_MS)

watch(width, debouncedFitWidth)

const transformStyle = computed(() => ({
  width: "fit-content",
  transformOrigin: "top left",
  transform: `scale(${props.scale})`
}))
</script>
<template>
  <div
    ref="container"
    class="hide-scrollbar h-full w-full overflow-y-auto"
    :class="{ absolute: isResponsive }"
    style="direction: ltr"
  >
    <div :style="transformStyle">
      <RenderPages :pages="pages" />
    </div>
  </div>
</template>
