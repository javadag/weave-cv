<script setup lang="ts">
import { motion } from "motion-v"
import { useScrollReveal } from "~/composables/useScrollReveal"
import TemplateCarouselCard from "./TemplateCarouselCard.vue"

const SHIFT = 550

const base = ref<{ id: string; name: string; screenshot: string }[]>([])

onMounted(async () => {
  const { TEMPLATES } = await import("~/constants/templates")
  base.value = TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    screenshot: t.screenshot
  }))
})

const sectionRef = ref<HTMLElement>()
const { scrollY } = useScroll()

const sectionProgress = useTransform(scrollY, () => {
  const el = sectionRef.value
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  const viewH = window.innerHeight
  return Math.max(0, Math.min(1, (viewH - rect.top) / (viewH + rect.height)))
})

const smoothProgress = useSpring(sectionProgress, { stiffness: 70, damping: 20 })

const offsetA = useTransform(smoothProgress, [0, 0.5, 1], [SHIFT, 0, -SHIFT])
const offsetB = useTransform(smoothProgress, [0, 0.5, 1], [-SHIFT, 0, SHIFT])

const badgeReveal = useScrollReveal(0, { y: 12, duration: 0.5 })
const headingReveal = useScrollReveal(0.1, { y: 24 })
const subtitleReveal = useScrollReveal(0.2, { y: 24 })
</script>

<template>
  <section ref="sectionRef" class="relative flex w-full max-w-screen flex-col items-center justify-center pt-24">
    <div class="max-w-compact mx-auto mb-10 flex w-full items-end justify-between px-6 lg:px-12">
      <div>
        <motion.span
          class="border-primary-200 bg-primary-50 text-primary dark:border-primary/25 dark:bg-primary/10 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
          :initial="badgeReveal.initial.value"
          :whileInView="badgeReveal.whileInView.value"
          :transition="badgeReveal.transition.value"
          :inViewOptions="badgeReveal.inViewOptions"
        >
          {{ $t("templates.badge") }}
        </motion.span>
        <motion.h2
          class="text-highlighted mt-5 text-4xl font-bold tracking-[-0.03em] text-balance sm:text-5xl"
          :initial="headingReveal.initial.value"
          :whileInView="headingReveal.whileInView.value"
          :transition="headingReveal.transition.value"
          :inViewOptions="headingReveal.inViewOptions"
        >
          {{ $t("templates.titleLine1") }}<br />{{ $t("templates.titleLine2") }}
        </motion.h2>
        <motion.p
          class="text-dimmed mt-4 max-w-md text-base leading-relaxed"
          :initial="subtitleReveal.initial.value"
          :whileInView="subtitleReveal.whileInView.value"
          :transition="subtitleReveal.transition.value"
          :inViewOptions="subtitleReveal.inViewOptions"
        >
          {{ $t("templates.subtitle") }}
        </motion.p>
      </div>
    </div>
    <div
      class="relative flex w-full flex-col items-center justify-center overflow-hidden pb-24"
      style="transform: translateZ(0)"
    >
      <div
        class="absolute top-0 bottom-0 left-0 z-10 w-10 sm:w-20 lg:w-30"
        style="background: linear-gradient(90deg, var(--ui-bg), transparent)"
      />
      <div
        class="absolute top-0 right-0 bottom-0 z-10 w-10 sm:w-20 lg:w-30"
        style="background: linear-gradient(270deg, var(--ui-bg), transparent)"
      />
      <motion.div
        class="flex gap-4 will-change-transform sm:gap-5"
        :style="{ x: offsetA }"
      >
        <TemplateCarouselCard
          v-for="(t, i) in base.slice(0, 12)"
          :key="'a' + i"
          :name="t.name"
          :screenshot="t.screenshot"
        />
      </motion.div>
      <motion.div
        class="mt-4 flex gap-4 will-change-transform sm:mt-5 sm:gap-5"
        :style="{ x: offsetB }"
      >
        <TemplateCarouselCard
          v-for="(t, i) in base.slice(12)"
          :key="'b' + i"
          :name="t.name"
          :screenshot="t.screenshot"
        />
      </motion.div>
    </div>
  </section>
</template>
