export function useSelfResizeObserver(callback: (height: number) => void) {
  const elementRef = useTemplateRef<HTMLElement>("elementRef")

  const height = ref<number>(0)
  let resizeObserver: ResizeObserver | null = null

  const updateHeight = (entries?: ResizeObserverEntry[]) => {
    if (!(elementRef.value && entries && entries.length > 0)) {
      return
    }

    const entry = entries[0]
    if (entry) {
      const borderBox = entry.borderBoxSize?.[0]
      const contentBox = entry.contentBoxSize?.[0]

      const rawHeight = borderBox?.blockSize ?? contentBox?.blockSize ?? 0
      const totalHeight = Math.round(rawHeight * 100) / 100

      height.value = totalHeight
      callback(totalHeight)
    }
  }

  onMounted(() => {
    if (!elementRef.value) {
      return
    }

    resizeObserver = new ResizeObserver((entries) => {
      updateHeight(entries)
    })
    resizeObserver.observe(elementRef.value, { box: "border-box" })
  })

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  })

  watch(elementRef, (newElement) => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }

    if (newElement) {
      resizeObserver = new ResizeObserver((entries) => {
        updateHeight(entries)
      })
      resizeObserver.observe(newElement, { box: "border-box" })
    }
  })

  return {
    elementRef,
    updateHeight
  }
}
