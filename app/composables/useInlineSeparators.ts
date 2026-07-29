import { nextTick, onUpdated, type Ref, type WatchSource } from "vue"

export function useInlineSeparators(containerRef: Ref<HTMLElement | undefined>, deps: WatchSource) {
  const adjust = () => {
    const container = containerRef.value
    if (!container) return

    const children = [...container.children] as HTMLElement[]
    if (children.length === 0) return

    for (const child of children) {
      if (!child.classList?.contains("separator")) {
      	continue;
      }

      child.style.visibility = "visible"
      child.style.opacity = "1"
    }

    let previousTop = children[0]!.offsetTop
    let previousEl = children[0]!

    for (let i = 1; i < children.length; i++) {
      const currentEl = children[i]!
      const currentTop = currentEl.offsetTop

      if (Math.abs(currentTop - previousTop) > 5) {
        if (previousEl.classList?.contains("separator")) {
          previousEl.style.visibility = "hidden"
          previousEl.style.opacity = "0"
        }
        if (currentEl.classList?.contains("separator")) {
          currentEl.style.visibility = "hidden"
          currentEl.style.opacity = "0"
        }
      }

      previousTop = currentTop
      previousEl = currentEl
    }
  }

  const update = () => nextTick(adjust)

  useResizeObserver(containerRef, update)
  watch(deps, update, { deep: true })
  onUpdated(update)
}
