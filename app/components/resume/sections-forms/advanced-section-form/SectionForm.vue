<script setup lang="ts">
import { ref, watch } from "vue"
import { VueDraggable, type SortableEvent } from "vue-draggable-plus"
import { ADVANCED_SECTION_ITEM, BASIC_SECTION_ITEM } from "~/constants/singleContent"
import type {
  BasicSectionTypeSchema,
  TAdvancedContent,
  TBasicContent,
  TCoreSection,
  TCoreSectionType
} from "~/utils/schemas/content.schema"
import { AdvancedSectionTypeSchema } from "~/utils/schemas/content.schema"
import SectionFormWrapper from "../SectionFormWrapper.vue"
import SectionFormItem from "./SectionFormItem.vue"

interface Props {
  sectionId: string
  sectionType: TCoreSectionType
  section: TCoreSection
}
const props = defineProps<Props>()

const { updateContent } = useResumeStore()

const isAdvancedSection = computed(() => AdvancedSectionTypeSchema.safeParse(props.sectionType).success)
const isSummarySection = computed(() => props.sectionType === "summary")

const sectionContentsRef = ref([...props.section.contents])

watch(
  () => props.section.contents,
  (newContents) => {
    sectionContentsRef.value = [...newContents]
  },
  { immediate: true }
)

const handleAddContent = () => {
  const newContent: TAdvancedContent | TBasicContent = {
    id: `${props.section.type}-${Date.now()}`,
    ...(isAdvancedSection.value
      ? ADVANCED_SECTION_ITEM[props.section.type as (typeof AdvancedSectionTypeSchema.options)[number]]
      : BASIC_SECTION_ITEM[props.section.type as (typeof BasicSectionTypeSchema.options)[number]])
  }

  updateContent(`${props.sectionId}.contents`, [...props.section.contents, newContent])
}

const handleDeleteContent = (id: string) => {
  updateContent(
    `${props.sectionId}.contents`,
    props.section.contents.filter((content) => content.id !== id)
  )
}

const handleReorder = (_event: SortableEvent) => {
  const reorderedContents = sectionContentsRef.value.map((item) => item)
  updateContent(`${props.sectionId}.contents`, reorderedContents)
}
</script>

<template>
  <SectionFormWrapper
    :section-id="props.sectionId"
    :title="props.section.title"
    :section-type="props.sectionType"
    :is-section-visible="props.section.isSectionVisible"
    :is-title-visible="props.section.isTitleVisible"
  >
    <div class="flex flex-col gap-3">
      <VueDraggable
        v-model="sectionContentsRef"
        :handle="'.handle'"
        :disabled="props.section.contents.length < 2"
        direction="vertical"
        :animation="150"
        class="flex flex-col gap-2"
        @end="handleReorder"
      >
        <SectionFormItem
          v-for="content in props.section.contents"
          :key="content.id"
          :section-id="props.sectionId"
          :section-type="props.sectionType"
          :is-advanced-section="isAdvancedSection"
          :content="content"
          class="relative group"
          @delete="handleDeleteContent(content.id)"
        />
      </VueDraggable>
      <UButton
        v-if="!isSummarySection"
        class="flex justify-center items-center"
        variant="subtle"
        @click="handleAddContent"
      >
        <UIcon name="i-lucide-plus" />
      </UButton>
    </div>
  </SectionFormWrapper>
</template>
