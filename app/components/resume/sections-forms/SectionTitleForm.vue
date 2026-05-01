<script setup lang="ts">
import type { TCoreSectionType } from "~/utils/schemas/content.schema"
import Delete from "./Delete.vue"
import InlineEditor from "./InlineEditor.vue"
import Visibility from "./Visibility.vue"

interface Props {
  sectionId: string
  sectionTitle: string
  sectionType?: TCoreSectionType
  isTitleEditable: boolean
  isSectionHideable: boolean
  isSectionVisible: boolean
  isTitleVisible: boolean
}

const props = defineProps<Props>()

const { updateContent, removeSection } = useResumeStore()

const handleUpdate = (path: string, value: unknown) => {
  updateContent(path, value)
}

const handleDelete = () => {
  removeSection(props.sectionId)
}
</script>

<template>
  <div class="border-muted mb-3 flex items-center justify-between gap-3 border-b pb-2">
    <div class="flex min-w-0 flex-1 items-center gap-2">
      <div v-if="props.isTitleEditable" class="flex min-w-0 flex-1 items-center gap-2">
        <InlineEditor
          class="min-w-0 flex-1 text-sm font-medium"
          :is-visible="props.isTitleVisible"
          :value="props.sectionTitle"
          :section-id="props.sectionId"
          :section-type="sectionType"
          :on-update="(value) => handleUpdate(`${props.sectionId}.title`, value)"
        />
        <Visibility
          :is-hidden="!props.isTitleVisible"
          :tooltip="props.isTitleVisible ? $t('editor.form.hideTitle') : $t('editor.form.showTitle')"
          :on-toggle="() => updateContent(`${props.sectionId}.isTitleVisible`, !props.isTitleVisible)"
        />
      </div>
      <span v-else class="text-sm font-medium">{{ props.sectionTitle }}</span>
    </div>
    <div v-if="props.isSectionHideable" class="flex shrink-0 items-center gap-2">
      <Visibility
        :is-hidden="!props.isSectionVisible"
        :tooltip="props.isSectionVisible ? $t('editor.form.hideSection') : $t('editor.form.showSection')"
        :on-toggle="() => updateContent(`${props.sectionId}.isSectionVisible`, !props.isSectionVisible)"
      />
      <Delete :on-delete="() => handleDelete()" :tooltip="$t('editor.form.deleteSection')" />
    </div>
  </div>
</template>
