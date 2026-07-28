export function useScrollReveal(
  delay = 0,
  options?: { y?: number; x?: number; duration?: number; direction?: "up" | "left" | "right" | "scale" }
) {
  const direction = options?.direction ?? "up"
  const y = options?.y ?? 24
  const x = options?.x ?? 30
  const duration = options?.duration ?? 0.55
  const prefersReduced = useReducedMotion()

  const initial = computed(() => {
    if (prefersReduced.value) return {}
    switch (direction) {
      case "left": return { opacity: 0, x: -x }
      case "right": return { opacity: 0, x }
      case "scale": return { opacity: 0, scale: 0.92 }
      default: return { opacity: 0, y }
    }
  })

  const whileInView = computed(() => {
    if (prefersReduced.value) return {}
    switch (direction) {
      case "left":
      case "right": return { opacity: 1, x: 0 }
      case "scale": return { opacity: 1, scale: 1 }
      default: return { opacity: 1, y: 0 }
    }
  })

  const transition = computed(() =>
    prefersReduced.value
      ? { duration: 0 }
      : { type: "spring" as const, bounce: 0.3, delay }
  )

  const inViewOptions = {
    once: true,
    margin: "-80px"
  } as const

  return { initial, whileInView, transition, inViewOptions }
}
