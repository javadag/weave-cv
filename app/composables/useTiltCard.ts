export function useTiltCard(maxDeg = 5) {
  const elRef = ref<HTMLElement | null>(null)
  const tiltX = useSpringValue(0, { stiffness: 220, damping: 22 })
  const tiltY = useSpringValue(0, { stiffness: 220, damping: 22 })

  const prefersReduced = useReducedMotion()
  const isTouchDevice = !import.meta.server && !window.matchMedia("(hover: hover)").matches

  const style = computed(() => {
    if (prefersReduced.value || isTouchDevice) return {}
    return {
      transform: `perspective(800px) rotateX(${tiltX.value.value}deg) rotateY(${tiltY.value.value}deg)`,
      transformStyle: "preserve-3d" as const
    }
  })

  function onMove(e: MouseEvent) {
    if (prefersReduced.value || isTouchDevice) return
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    tiltX.to((0.5 - py) * maxDeg * 2)
    tiltY.to((px - 0.5) * maxDeg * 2)
  }

  function onLeave() {
    if (prefersReduced.value || isTouchDevice) return
    tiltX.to(0)
    tiltY.to(0)
  }

  return { ref: elRef, style, onMove, onLeave }
}
