export function useScrollReveal(delay = 0, options?: { y?: number; duration?: number }) {
  const y = options?.y ?? 24
  const duration = options?.duration ?? 0.55
  const prefersReduced = useReducedMotion()

  const initial = computed(() => (prefersReduced.value ? {} : { opacity: 0, y }))
  const whileInView = computed(() => (prefersReduced.value ? {} : { opacity: 1, y: 0 }))
  const transition = computed(() =>
    prefersReduced.value ? { duration: 0 } : { duration, delay, ease: [0.25, 0.4, 0.25, 1] }
  )

  const inViewOptions = {
    once: true,
    margin: "-80px"
  } as const

  return { initial, whileInView, transition, inViewOptions }
}
