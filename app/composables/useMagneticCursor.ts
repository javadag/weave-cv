export function useMagneticCursor(strength = 10) {
  const elRef = ref<HTMLElement | null>(null)
  const x = useSpringValue(0, { stiffness: 200, damping: 18 })
  const y = useSpringValue(0, { stiffness: 200, damping: 18 })

  const prefersReduced = useReducedMotion()
  const isTouchDevice = !import.meta.server && !window.matchMedia("(hover: hover)").matches

  const style = computed(() => {
    if (prefersReduced.value || isTouchDevice) return {}
    return { transform: `translate(${x.value.value}px, ${y.value.value}px)` }
  })

  function onEnter(e: MouseEvent) {
    if (prefersReduced.value || isTouchDevice) return
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    x.to(dx * strength)
    y.to(dy * strength)
  }

  function onMove(e: MouseEvent) {
    if (prefersReduced.value || isTouchDevice) return
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    x.to(dx * strength)
    y.to(dy * strength)
  }

  function onLeave() {
    if (prefersReduced.value || isTouchDevice) return
    x.to(0)
    y.to(0)
  }

  return { ref: elRef, style, onEnter, onLeave, onMove }
}
