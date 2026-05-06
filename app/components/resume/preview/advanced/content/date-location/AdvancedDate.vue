<script setup lang="ts">
import { computed, type CSSProperties } from "vue"
import { ColumnColorsKey } from "~/components/resume/preview/pages/columnColorsContext"
import { getTextAlign } from "~/utils/preview/core/entryUtils"
import { fmtDate } from "~/utils/preview/html/shared"

interface Props {
  position: string
  startDate?: string | null
  endDate?: string | null
  present?: boolean
  showDateDay?: boolean
  style?: CSSProperties | false
}

const props = defineProps<Props>()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const layout = computed(() => configs.value.general.layout)
const colors = computed(() => configs.value.general.colors)

const columnColors = inject(ColumnColorsKey)
const { language } = useLocaleInfo()

const color = computed(() =>
  colors.value.apply.includes("dates") ? columnColors?.value.accentColor : columnColors?.value.textColor
)

const hideDay = computed(() => props.showDateDay === false)

const startDateFormatted = computed(() =>
  fmtDate(props.startDate, layout.value.dateFormat, { hideDay: hideDay.value, locale: language.value })
)
const endDateFormatted = computed(() =>
  fmtDate(props.endDate, layout.value.dateFormat, { hideDay: hideDay.value, locale: language.value })
)
const endDateDisplay = computed(() => (props.present ? "Present" : endDateFormatted.value))

const dateStyles = computed<CSSProperties>(() => ({
  color: color.value,
  textAlign: getTextAlign(props.position),
  wordBreak: "break-all",
  minWidth: 0,
  ...props.style
}))
</script>

<template>
  <span :style="dateStyles">
    {{ startDateFormatted }} {{ startDate && endDate ? " - " : "" }} {{ endDateDisplay ? `${endDateDisplay}` : "" }}
  </span>
</template>
