<script setup lang="ts">
import { defineAsyncComponent } from "vue"

const RichTextEditor = defineAsyncComponent(() => import("~/components/ui/rich-text/RichTextEditor.vue"))

interface Props {
  content: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: "update:content", content: string): void
}>()

const { configs } = storeToRefs(useConfigsStore())
const rtl = computed(() => configs.value.general.layout.rtl)

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

  <div v-else class="bg-accented/50 space-y-1 rounded-lg p-2">
    <div class="flex items-center justify-between">
      <h3 class="text-default text-sm font-medium">{{ $t("editor.form.editContent") }}</h3>
      <UButton variant="ghost" size="sm" color="neutral" @click="stopEditing">{{ $t("editor.form.close") }}</UButton>
    </div>
    <RichTextEditor :content="content" :rtl="rtl" @update:content="handleUpdate" />
  </div>
</template>
