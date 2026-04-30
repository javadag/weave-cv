<script setup lang="ts">
import RichTextEditor from "~/components/ui/rich-text/RichTextEditor.vue"

interface Props {
  content: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: "update:content", content: string): void
}>()

const content = ref(props.content)
const isEditing = ref(false)

const handleUpdate = (newContent: string) => {
  content.value = newContent
  emit("update:content", newContent)
}

const startEditing = () => {
  isEditing.value = true
}

const stopEditing = () => {
  isEditing.value = false
}
</script>

<template>
  <UButton v-if="!isEditing" variant="ghost" class="w-full" @click="startEditing">
    <div class="line-clamp-2" v-html="props.content || $t('editor.form.clickToAdd')"></div>
  </UButton>

  <div v-else class="space-y-1 bg-accented/50 p-2 rounded-lg">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium text-default">{{ $t('editor.form.editContent') }}</h3>
      <UButton variant="ghost" size="sm" color="neutral" @click="stopEditing">{{ $t('editor.form.close') }}</UButton>
    </div>
    <RichTextEditor :content="content" @update:content="handleUpdate" />
  </div>
</template>
