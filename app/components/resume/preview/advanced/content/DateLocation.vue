<script setup lang="ts">
import { computed, nextTick, onMounted, ref, type CSSProperties } from "vue"
import type { TAdvancedSectionVariant } from "~/utils/schemas/shared.schema"
import AdvancedDate from "./date-location/AdvancedDate.vue"
import AdvancedLocation from "./date-location/AdvancedLocation.vue"

interface Props {
  width?: number
  position: TAdvancedSectionVariant | "columns"
  startDate?: string | null
  endDate?: string | null
  location?: string
  present?: boolean
  showDateDay?: boolean
  style?: CSSProperties
}

const props = defineProps<Props>()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const layout = computed(() => configs.value.general.layout)
const typography = computed(() => configs.value.general.typography)
const titleFontSize = computed(() => typography.value.fontSize * layout.value.contentLayout.title.fontSizeMultiplier)

const containerRef = ref<HTMLElement | null>(null)
const dateRef = ref<HTMLElement | null>(null)
const locationRef = ref<HTMLElement | null>(null)
const sepratorRef = ref<HTMLElement | null>(null)

const isWrapped = ref(false)

const getElement = (ref: HTMLElement | { $el?: HTMLElement } | null): HTMLElement | null => {
  if (!ref) return null
  if (ref instanceof HTMLElement) return ref
  if (typeof ref === "object" && "$el" in ref && ref.$el instanceof HTMLElement) {
    return ref.$el
  }
  return null
}

const checkWrapAndHandleSpacer = () => {
  if (!dateRef.value || !locationRef.value) return

  // Use requestAnimationFrame to ensure we measure AFTER the browser layout pass
  requestAnimationFrame(() => {
    const dateElement = getElement(dateRef.value)
    const locationElement = getElement(locationRef.value)

    if (!dateElement || !locationElement) return

    const dateTop = dateElement.getBoundingClientRect().top
    const locationTop = locationElement.getBoundingClientRect().top

    const wrapped = locationTop - 5 > dateTop

    if (wrapped === isWrapped.value) return
    isWrapped.value = wrapped
  })
}

useResizeObserver(containerRef, () => {
  checkWrapAndHandleSpacer()
})

onMounted(() => {
  // Wait for sub-components and layout to settle
  nextTick(() => {
    checkWrapAndHandleSpacer()
  })
})

const containerStyles = computed<CSSProperties>(() => ({
  width: `${props.width}%`,
  paddingBottom: `${0.4 * typography.value.lineHeight * layout.value.sectionGap}px`,
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  rowGap: `${0.15 * titleFontSize.value}px`,
  ...(props.position === "contentFirst" ? { justifyContent: "flex-end" } : {}),
  ...(props.position === "stacked" ? { alignItems: "flex-end" } : {})
}))

const spacerStyles = computed<CSSProperties>(() => ({
  display: isWrapped.value ? "none" : "block",
  paddingInline: `0.4em`
}))
</script>

<template>
  <div ref="containerRef" :style="[containerStyles, props.style]">
    <span
      v-if="isWrapped && (position === 'contentFirst' || position === 'stacked' || position === 'columns')"
      :style="{ paddingInline: `0.5em`, whiteSpace: 'pre' }"
    />
    <AdvancedDate
      ref="dateRef"
      :position="position"
      :start-date="startDate"
      :end-date="endDate"
      :present="present"
      :show-date-day="showDateDay"
      :style="
        isWrapped &&
        position === 'dateFirst' && {
          paddingInlineEnd: `1em`,
          whiteSpace: 'pre-wrap'
        }
      "
    />

    <span v-if="!isWrapped && (startDate || endDate)" ref="sepratorRef" :style="spacerStyles">|</span>
    <div style="display: flex; align-items: center">
      <AdvancedLocation ref="locationRef" :position="position" :location="location" />
      <span v-if="isWrapped && position === 'dateFirst'" :style="{ paddingInline: `0.5em`, whiteSpace: 'pre' }" />
    </div>
  </div>
</template>
