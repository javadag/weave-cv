<script setup lang="ts">
import type { TAdvancedContent, TBasicContent, TCoreSectionType } from "~/utils/schemas/content.schema"
import Delete from "../Delete.vue"
import Visibility from "../Visibility.vue"
import SectionContentEditor from "./SectionContentEditor.vue"

interface Props {
  sectionId: string
  isAdvancedSection: boolean
  sectionType: TCoreSectionType
  content: TAdvancedContent | TBasicContent
}

const props = defineProps<Props>()
const emits = defineEmits<{
  (e: "delete"): void
}>()

const isEditing = ref(false)

const closeEditMode = () => {
  isEditing.value = false
}

const { updateContent } = useResumeStore()

const handleToggleVisibility = () => {
  updateContent(`${props.sectionId}.contents.${props.content.id}.isHidden`, !props.content.isHidden)
}
</script>

<template>
  <template v-if="isEditing">
    <SectionContentEditor
      :section-id="props.sectionId"
      :is-advanced-section="props.isAdvancedSection"
      :section-type="props.sectionType"
      :content="props.content"
      @close-edit="closeEditMode"
    />
  </template>
  <div v-else class="flex items-center gap-1">
    <UIcon name="i-lucide-grip-vertical" class="text-muted-foreground handle cursor-move" />
    <button
      type="button"
      class="flex flex-1 items-center hover:bg-accented/80 duration-150 bg-accented/50 rounded-md p-2 divide-x divide-accented [&>*]:px-2 [&>*]:text-sm"
      @click="isEditing = !isEditing"
    >
      <span class="font-bold">{{ content.title || ("location" in content ? content.location : "") || "" }}</span>
    </button>
    <Visibility
      v-if="sectionType !== 'summary'"
      :is-hidden="content.isHidden"
      :on-toggle="() => handleToggleVisibility()"
    />
    <Delete v-if="sectionType !== 'summary'" :on-delete="() => emits('delete')" tooltip="Delete" />
  </div>
</template>
