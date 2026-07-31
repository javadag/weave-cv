interface UndoRedo {
  canUndo: Ref<boolean>
  canRedo: Ref<boolean>
  undo: () => void
  redo: () => void
}

export function useEditorKeyboardShortcuts(undoRedo?: UndoRedo) {
  const { t } = useI18n()

  const toast = useToast()
  const route = useRoute()
  const id = computed(() => route.params.id as string)
  const { save } = useAutosave(id)

  const handleKeydown = (e: KeyboardEvent) => {
    const isMod = e.metaKey || e.ctrlKey
    if (!isMod) return

    // Don't intercept when focus is inside an editable element
    // — let Tiptap/inputs handle their own undo/redo
    const target = e.target as HTMLElement | null
    if (!target) return
    const isEditable = target.isContentEditable
    const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA"
    if (isEditable || isInput) return

    // Ctrl/Cmd + S → Save
    if (e.key === "s") {
      e.preventDefault()
      void (async () => {
        const success = await save()
        if (success) {
          toast.add({
            title: t("editor.header.savedTitle"),
            description: t("editor.header.savedDesc"),
            color: "success"
          })
        }
      })()
      return
    }

    // Ctrl/Cmd + Z (without Shift) → Undo
    if (!e.shiftKey && e.key === "z") {
      e.preventDefault()
      undoRedo?.undo()
      return
    }

    // Ctrl/Cmd + Shift + Z  OR  Ctrl/Cmd + Y → Redo
    if ((e.shiftKey && e.key === "z") || e.key === "y") {
      e.preventDefault()
      undoRedo?.redo()
      return
    }
  }

  onMounted(() => {
    addEventListener("keydown", handleKeydown)
  })

  onUnmounted(() => {
    removeEventListener("keydown", handleKeydown)
  })
}
