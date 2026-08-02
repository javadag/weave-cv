<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3"
import LinkPopover from "./LinkPopover.vue"
import ToolbarButton from "./ToolbarButton.vue"

interface Props {
  editor: Editor | null
  defaultRtl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultRtl: false
})

const linkOpen = ref(false)
const linkUrl = ref("")

const currentDirection = computed<"ltr" | "rtl">(() => {
  const e = unref(props.editor)
  if (!e) return props.defaultRtl ? "rtl" : "ltr"

  for (const type of ["paragraph", "heading", "listItem"]) {
    const dir = e.getAttributes(type).dir
    if (dir === "ltr" || dir === "rtl") return dir
  }

  return props.defaultRtl ? "rtl" : "ltr"
})

const toggleTextDirection = () => {
  const e = unref(props.editor)
  if (!e) return

  const next = currentDirection.value === "ltr" ? "rtl" : "ltr"
  e.chain().focus().setTextDirection(next).run()
}

const handleLinkAction = (action: "apply" | "clear" | "open") => {
  const e = unref(props.editor)
  if (!e) return

  switch (action) {
    case "open": {
      const linkAttrs = e.getAttributes("link")
      linkUrl.value = linkAttrs.href || ""
      linkOpen.value = true
      break
    }
    case "apply": {
      if (linkUrl.value.trim() === "") {
        e.chain().focus().extendMarkRange("link").unsetLink().run()
      } else {
        e.chain().focus().extendMarkRange("link").setLink({ href: linkUrl.value.trim() }).run()
      }
      linkOpen.value = false
      break
    }
    case "clear": {
      e.chain().focus().extendMarkRange("link").unsetLink().run()
      linkOpen.value = false
      break
    }
  }
}

const toggleBold = () => {
  props.editor?.chain().focus().toggleBold().run()
}

const toggleItalic = () => {
  props.editor?.chain().focus().toggleItalic().run()
}

const toggleStrike = () => {
  props.editor?.chain().focus().toggleStrike().run()
}

const toggleBulletList = () => {
  props.editor?.chain().focus().toggleBulletList().run()
}

const toggleOrderedList = () => {
  props.editor?.chain().focus().toggleOrderedList().run()
}

const setTextAlign = (alignment: "left" | "center" | "right" | "justify") => {
  props.editor?.chain().focus().setTextAlign(alignment).run()
}

const resetStyles = () => {
  const e = unref(props.editor)
  if (!e) return

  const { from, to } = e.state.selection
  const hasSelection = from !== to

  if (hasSelection) {
    const selectedText = e.state.doc.textBetween(from, to, " ")

    e.chain()
      .focus()
      .deleteSelection()
      .insertContent(selectedText)
      .setParagraph()
      .unsetAllMarks()
      .setTextAlign("left")
      .run()
  } else {
    e.chain().focus().setParagraph().unsetAllMarks().setTextAlign("left").run()
  }

  nextTick(() => {
    const { view } = e
    const editorElement = (view.dom.querySelector(".ProseMirror") as HTMLElement) || (view.dom as HTMLElement)

    if (!editorElement) return

    const allElements = editorElement.querySelectorAll("*")

    for (const el of allElements) {
      const htmlEl = el as HTMLElement

      if (htmlEl.hasAttribute("style")) {
        htmlEl.removeAttribute("style")
      }

      htmlEl.style.fontSize = ""
      htmlEl.style.fontFamily = ""
      htmlEl.style.fontWeight = ""
      htmlEl.style.fontStyle = ""
      htmlEl.style.color = ""
      htmlEl.style.lineHeight = ""
      htmlEl.style.letterSpacing = ""
    }

    e.chain()
      .command(({ tr }) => {
        tr.setMeta("addToHistory", false)
        return true
      })
      .run()
  })
}
</script>

<template>
  <div v-if="editor" class="bg-muted flex flex-wrap items-center gap-4 rounded-lg p-2">
    <ToolbarButton
      icon="i-lucide-bold"
      :tooltip="$t('ui.richText.bold')"
      :is-active="editor.isActive('bold')"
      :disabled="!editor.can().chain().focus().toggleBold().run()"
      @click="toggleBold"
    />
    <ToolbarButton
      icon="i-lucide-italic"
      :tooltip="$t('ui.richText.italic')"
      :is-active="editor.isActive('italic')"
      :disabled="!editor.can().chain().focus().toggleItalic().run()"
      @click="toggleItalic"
    />
    <LinkPopover
      v-model:is-open="linkOpen"
      v-model:link-url="linkUrl"
      :is-active="editor.isActive('link')"
      @action="handleLinkAction"
    />
    <ToolbarButton
      icon="i-lucide-strikethrough"
      :tooltip="$t('ui.richText.strike')"
      :is-active="editor.isActive('strike')"
      :disabled="!editor.can().chain().focus().toggleStrike().run()"
      @click="toggleStrike"
    />
    <ToolbarButton
      icon="i-lucide-list"
      :tooltip="$t('ui.richText.bulletList')"
      :is-active="editor.isActive('bulletList')"
      :disabled="!editor.can().chain().focus().toggleBulletList().run()"
      @click="toggleBulletList"
    />
    <ToolbarButton
      icon="i-lucide-list-ordered"
      :tooltip="$t('ui.richText.orderedList')"
      :is-active="editor.isActive('orderedList')"
      :disabled="!editor.can().chain().focus().toggleOrderedList().run()"
      @click="toggleOrderedList"
    />
    <div class="bg-border h-6 w-px" />
    <ToolbarButton
      icon="i-lucide-align-left"
      :tooltip="$t('ui.richText.alignLeft')"
      :is-active="editor.isActive({ textAlign: 'left' })"
      :disabled="!editor.can().chain().focus().setTextAlign('left').run()"
      @click="setTextAlign('left')"
    />
    <ToolbarButton
      icon="i-lucide-align-center"
      :tooltip="$t('ui.richText.alignCenter')"
      :is-active="editor.isActive({ textAlign: 'center' })"
      :disabled="!editor.can().chain().focus().setTextAlign('center').run()"
      @click="setTextAlign('center')"
    />
    <ToolbarButton
      icon="i-lucide-align-right"
      :tooltip="$t('ui.richText.alignRight')"
      :is-active="editor.isActive({ textAlign: 'right' })"
      :disabled="!editor.can().chain().focus().setTextAlign('right').run()"
      @click="setTextAlign('right')"
    />
    <ToolbarButton
      icon="i-lucide-align-justify"
      :tooltip="$t('ui.richText.justify')"
      :is-active="editor.isActive({ textAlign: 'justify' })"
      :disabled="!editor.can().chain().focus().setTextAlign('justify').run()"
      @click="setTextAlign('justify')"
    />
    <div class="bg-border h-6 w-px" />
    <div class="flex items-center gap-1">
      <ToolbarButton
        icon="i-lucide-arrow-left-right"
        :tooltip="
          currentDirection === 'ltr' ? $t('ui.richText.textDirectionToRtl') : $t('ui.richText.textDirectionToLtr')
        "
        :is-active="currentDirection === 'ltr'"
        @click="toggleTextDirection"
      />
      <span class="text-muted text-xs font-semibold tracking-wide uppercase">{{ currentDirection }}</span>
    </div>
    <ToolbarButton icon="i-lucide-rotate-ccw" :tooltip="$t('ui.richText.resetStyles')" @click="resetStyles" />
  </div>
</template>
