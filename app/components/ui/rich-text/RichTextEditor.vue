<script setup lang="ts">
import { TextAlign } from "@tiptap/extension-text-align"
import Toolbar from "./Toolbar.vue"

interface Props {
  content: string
  rtl?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  rtl: false
})
const emit = defineEmits<{
  (e: "update:content", content: string): void
}>()

const editor = useEditor({
  content: props.content,
  onUpdate: ({ editor }) => {
    emit("update:content", editor.getHTML())
  },
  extensions: [
    TiptapStarterKit,
    TiptapLink.configure({
      autolink: true,
      openOnClick: false,
      linkOnPaste: true,
      HTMLAttributes: {
        class: "underline underline-offset-2 text-blue-600"
      }
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"]
    })
  ]
})

onBeforeUnmount(() => {
  unref(editor)?.destroy()
})
</script>

<template>
  <div class="flex flex-col gap-2" :dir="props.rtl ? 'rtl' : 'ltr'">
    <Toolbar :editor="editor || null" />
    <TiptapEditorContent :editor="editor" class="bg-muted rounded-lg p-3" />
  </div>
</template>
