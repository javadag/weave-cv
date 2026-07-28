export function useSpringValue(initial = 0, config?: { stiffness?: number; damping?: number; precision?: number }) {
  const stiffness = config?.stiffness ?? 180
  const damping = config?.damping ?? 20
  const precision = config?.precision ?? 0.01

  const value = ref(initial)
  let target = initial
  let velocity = 0
  let rafId: number | null = null

  function tick() {
    const displacement = value.value - target
    const springForce = -stiffness * displacement
    const dampingForce = -damping * velocity
    const acceleration = springForce + dampingForce

    velocity += acceleration * 0.006
    value.value += velocity * 0.006

    if (Math.abs(velocity) < precision && Math.abs(displacement) < precision) {
      value.value = target
      velocity = 0
      rafId = null
      return
    }

    rafId = requestAnimationFrame(tick)
  }

  function to(newTarget: number) {
    target = newTarget
    if (rafId == null) rafId = requestAnimationFrame(tick)
  }

  onUnmounted(() => {
    if (rafId != null) cancelAnimationFrame(rafId)
  })

  return { value, to }
}
