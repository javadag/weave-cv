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
const secondaryBg = computed(() => props.configs.general.colors.secondary.bgColor)
const secondaryText = computed(() => props.configs.general.colors.secondary.textColor)
const secondaryAccent = computed(() => props.configs.general.colors.secondary.accentColor)
const fontFamily = computed(() => props.configs.general.typography.fontFamily)
const headingVariant = computed(() => props.configs.general.headings.variant)

const visibleDetails = computed(() => {
  if (!props.personal?.details) return []
  return props.personal.details.filter((d) => d.value && !d.isHidden).slice(0, 3)
})

const previewSections = computed(() => {
  if (!props.core) return []
  const core = props.core as TCoreSections

  const order =
    props.configs.general.layout.columns === "2"
      ? [...props.configs.general.layout.order.twoCol.left, ...props.configs.general.layout.order.twoCol.right]
      : props.configs.general.layout.order.oneCol

  const sectionsById = new Map<string, TCoreSection>()
  const sectionsByType = new Map<string, TCoreSection>()
  for (const [id, section] of Object.entries(core) as [string, TCoreSection][]) {
    if (section.isSectionVisible && section.contents.some((c) => !c.isHidden)) {
      sectionsById.set(id, section)
      if (!sectionsByType.has(section.type)) sectionsByType.set(section.type, section)
    }
  }

  const result: TCoreSection[] = []
  for (const entry of order) {
    const section = sectionsById.get(entry) ?? sectionsByType.get(entry)
    if (section) {
      result.push(section)
      if (result.length >= 4) break
    }
  }
  return result
})

function stripHtml(html: string): string {
  return html.replaceAll(/<[^>]*>/g, "").trim()
}

type TextItem = { text: string }
type TitleItem = { title: string; subtitle: string }

function getSectionItems(section: TCoreSection): (TextItem | TitleItem)[] {
  const visible = section.contents.filter((c) => !c.isHidden)

  if (section.type === "summary") {
    const first = visible[0]
    if (first && "description" in first && first.description) {
      const text = stripHtml(first.description)
      return [{ text: text.length > 110 ? text.slice(0, 110) + "…" : text }]
    }
    return []
  }

  if (section.type === "skills" || section.type === "languages" || section.type === "certificates") {
    const titles = visible
      .slice(0, 5)
      .map((c) => c.title)
      .filter(Boolean)
    return titles.length > 0 ? [{ text: titles.join(", ") }] : []
  }

  return visible.slice(0, 2).map((c) => ({
    title: "title" in c ? c.title : "",
    subtitle: "subtitle" in c ? (c.subtitle as string) : ""
  }))
}
</script>

<template>
  <div class="flex h-full w-full flex-col overflow-hidden rounded-md shadow-sm" :style="{ fontFamily }">
    <!-- Header -->
    <div class="flex flex-col gap-1 px-4 pt-3 pb-3" :style="{ backgroundColor: bgColor, color: textColor }">
      <h3 class="m-0 truncate text-base leading-tight font-bold" :style="{ color: accentColor }">
        {{ personal?.title || "Your Name" }}
      </h3>
      <p v-if="personal?.subtitle" class="m-0 truncate text-xs leading-tight opacity-80">{{ personal.subtitle }}</p>
      <div v-if="visibleDetails.length > 0" class="mt-0.5 flex items-center gap-1.5 text-[10px] opacity-70">
        <template v-for="(detail, index) in visibleDetails" :key="index">
          <span class="truncate">{{ detail.value }}</span>
          <span v-if="index < visibleDetails.length - 1" class="shrink-0 opacity-60">·</span>
        </template>
      </div>
    </div>

    <!-- Content sections -->
    <div class="flex flex-1 flex-col gap-2 p-3" :style="{ backgroundColor: secondaryBg, color: secondaryText }">
      <template v-if="previewSections.length > 0">
        <div v-for="section in previewSections" :key="section.type" class="flex flex-col gap-1">
          <!-- Section heading -->
          <div
            v-if="section.isTitleVisible"
            class="text-[9px] leading-none font-bold tracking-wide uppercase"
            :class="{
              'border-l-2 pl-1': headingVariant === 'vertical-border' || headingVariant === 'border',
              'border-b pb-0.5': headingVariant === 'underline' || headingVariant === 'underline-full'
            }"
            :style="{
              color: secondaryAccent,
              borderColor: secondaryAccent,
              ...(headingVariant === 'pill'
                ? { backgroundColor: secondaryAccent + '22', padding: '1px 4px', borderRadius: '2px' }
                : {})
            }"
          >
            {{ section.title }}
          </div>
          <!-- Items -->
          <div v-for="(item, i) in getSectionItems(section)" :key="i" class="text-[10px] leading-snug">
            <template v-if="'text' in item">
              <span class="opacity-75">{{ item.text }}</span>
            </template>
            <template v-else>
              <span v-if="item.title" class="font-medium">{{ item.title }}</span>
              <span v-if="item.subtitle" class="opacity-60"> · {{ item.subtitle }}</span>
            </template>
          </div>
        </div>
      </template>
      <p v-else class="m-0 text-[10px] italic opacity-40">No content yet</p>
    </div>
  </div>
</template>
