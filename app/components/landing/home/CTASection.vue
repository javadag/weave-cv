<script setup lang="ts">
import { motion } from "motion-v"
import { useScrollReveal } from "~/composables/useScrollReveal"

const { t } = useI18n()
const quickStats = computed(() => [t("cta.stat1"), t("cta.stat2"), t("cta.stat3")])

const prefersReducedMotion = useReducedMotion()

const pulseAnimate = computed(() =>
  prefersReducedMotion.value ? {} : { opacity: [1, 0.65, 1], scale: [1, 1.25, 1] }
)
const pulseTransition = { duration: 2.4, repeat: Infinity, ease: "easeInOut" }

// --- Floating notifications (spring bounce) ---
const { value: floatLeftVal, to: floatLeftTo } = useSpringValue(0, { stiffness: 120, damping: 14 })
const { value: floatRightVal, to: floatRightTo } = useSpringValue(0, { stiffness: 120, damping: 14 })

function animateFloat(setter: (v: number) => void, amplitude: number, phaseOffset: number) {
  let startTime: number | null = null
  let running = true
  function step(time: number) {
    if (!running) return
    if (startTime == null) startTime = time - phaseOffset * 1000
    const elapsed = (time - startTime) / 1000
    setter(Math.sin(elapsed * Math.PI * 0.5) * amplitude)
    requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
  return () => { running = false }
}

const stopFloats: Array<() => void> = []

onMounted(() => {
  if (!prefersReducedMotion.value) {
    stopFloats.push(animateFloat(floatLeftTo, 10, 0))
    stopFloats.push(animateFloat(floatRightTo, 10, 1))
  }
})

onUnmounted(() => {
  for (const stop of stopFloats) stop()
})

// --- Magnetic CTA button ---
const ctaButton = useMagneticCursor(12)

// --- Reveal animations ---
const badgeReveal = useScrollReveal(0, { y: 12, duration: 0.5 })
const headingReveal = useScrollReveal(0.1, { direction: "scale" })
const subtitleReveal = useScrollReveal(0.25, { y: 24 })
const btnReveal = useScrollReveal(0.4, { y: 24, duration: 0.5 })
const cardReveal = useScrollReveal(0, { direction: "scale" })

// --- Stats alternating reveals ---
const stat0 = useScrollReveal(0.55, { direction: "left" })
const stat1 = useScrollReveal(0.65, { direction: "right" })
const stat2 = useScrollReveal(0.75, { direction: "left" })
const statReveals = [stat0, stat1, stat2]
function getStatReveal(i: number) { return statReveals[i]! }

// --- Button glow (shadow + scale pulse) ---
const btnGlowAnimate = {
  boxShadow: [
    "0 12px 32px -8px rgba(0,0,0,0.2)",
    "0 12px 40px -4px rgba(0,0,0,0.35)",
    "0 12px 32px -8px rgba(0,0,0,0.2)"
  ],
  scale: [1, 1.02, 1]
}
const btnGlowTransition = { duration: 3, repeat: Infinity, ease: "easeInOut" }
</script>

<template>
  <section class="bg-default px-6 pb-20 sm:pb-28 lg:px-12">
    <div class="max-w-compact mx-auto">
      <motion.div
        class="from-primary-700 to-primary-500 dark:from-primary-600 dark:to-primary-400 relative overflow-hidden rounded-3xl bg-linear-to-br px-8 py-20 text-center shadow-[0_40px_80px_-30px_rgba(234,88,12,0.45)] sm:px-14 sm:py-24 dark:shadow-[0_40px_80px_-30px_rgba(245,158,11,0.3)]"
        :initial="cardReveal.initial.value"
        :whileInView="cardReveal.whileInView.value"
        :transition="cardReveal.transition.value"
        :inViewOptions="cardReveal.inViewOptions"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(255,255,255,0.22),transparent_45%),radial-gradient(circle_at_82%_75%,rgba(255,255,255,0.14),transparent_45%)]"
        />
        <div class="bg-grid-white pointer-events-none absolute inset-0 opacity-[0.08]" />
        <motion.div
          class="pointer-events-none absolute top-10 left-10 hidden sm:flex"
          :initial="{ opacity: 0, x: -30 }"
          :whileInView="{ opacity: 1, x: 0 }"
          :inViewOptions="{ once: true, margin: '-80px' }"
          :transition="{ type: 'spring', bounce: 0.4, delay: 0.5 }"
        >
          <motion.div
            class="flex items-center gap-2.5 rounded-xl bg-white/95 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.15)]"
            :style="{ y: floatLeftVal + 'px' }"
          >
            <div class="flex size-7 items-center justify-center rounded-md bg-emerald-500 text-sm font-bold text-white">
              ✓
            </div>
            <div class="text-left">
              <div class="text-xs font-bold text-slate-900">{{ $t("cta.resumeExported") }}</div>
              <div class="text-[10px] text-slate-500">sara-chen.pdf · 142 KB</div>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          class="pointer-events-none absolute right-12 bottom-6 hidden sm:flex"
          :initial="{ opacity: 0, x: 30 }"
          :whileInView="{ opacity: 1, x: 0 }"
          :inViewOptions="{ once: true, margin: '-80px' }"
          :transition="{ type: 'spring', bounce: 0.4, delay: 0.7 }"
        >
          <motion.div
            class="flex items-center gap-2.5 rounded-xl bg-white/95 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.15)]"
            :style="{ y: floatRightVal + 'px' }"
          >
            <div class="bg-primary-700 flex size-7 items-center justify-center rounded-md text-sm font-bold text-white">
              ★
            </div>
            <div class="text-left">
              <div class="text-xs font-bold text-slate-900">{{ $t("cta.atsScore") }}</div>
              <div class="text-[10px] text-slate-500">{{ $t("cta.keywords") }}</div>
            </div>
          </motion.div>
        </motion.div>
        <div class="relative">
          <motion.span
            class="mb-6 inline-flex items-center gap-1.5 rounded-full bg-white/18 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-sm"
            :initial="badgeReveal.initial.value"
            :whileInView="badgeReveal.whileInView.value"
            :transition="badgeReveal.transition.value"
            :inViewOptions="badgeReveal.inViewOptions"
          >
            <motion.span
              class="inline-block size-1.5 rounded-full bg-white"
              :animate="pulseAnimate"
              :transition="pulseTransition"
            />
            {{ $t("cta.badge") }}
          </motion.span>
          <motion.h2
            class="mt-0 text-4xl leading-none font-extrabold tracking-[-0.035em] text-balance text-white sm:text-5xl lg:text-[4rem]"
            :initial="headingReveal.initial.value"
            :whileInView="headingReveal.whileInView.value"
            :transition="headingReveal.transition.value"
            :inViewOptions="headingReveal.inViewOptions"
          >
            {{ $t("cta.titleLine1") }}<br />{{ $t("cta.titleLine2") }}
          </motion.h2>
          <motion.p
            class="mx-auto mt-5 max-w-130 text-lg leading-relaxed text-white/90"
            :initial="subtitleReveal.initial.value"
            :whileInView="subtitleReveal.whileInView.value"
            :transition="subtitleReveal.transition.value"
            :inViewOptions="subtitleReveal.inViewOptions"
          >
            {{ $t("cta.subtitle") }}
          </motion.p>
          <motion.div
            class="mt-10 flex flex-wrap justify-center gap-3"
            :initial="btnReveal.initial.value"
            :whileInView="btnReveal.whileInView.value"
            :transition="btnReveal.transition.value"
            :inViewOptions="btnReveal.inViewOptions"
          >
            <motion.div
              :animate="btnGlowAnimate"
              :transition="btnGlowTransition"
              class="inline-flex"
            >
              <div
                ref="ctaButton.ref"
                :style="ctaButton.style.value"
                @mouseenter="ctaButton.onEnter"
                @mouseleave="ctaButton.onLeave"
                @mousemove="ctaButton.onMove"
              >
                <NuxtLink
                  to="/dashboard"
                  class="text-primary-700 inline-flex items-center gap-2 rounded-xl bg-white px-9 py-4.5 text-base font-bold no-underline shadow-[0_12px_32px_-8px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:translate-y-[-1px] hover:brightness-105"
                >
                  <span>✦</span> {{ $t("cta.buildBtn") }}
                </NuxtLink>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            class="mt-7 flex flex-wrap justify-center gap-6 text-sm font-medium text-white/90"
          >
            <motion.span
              v-for="(s, i) in quickStats"
              :key="s"
              :initial="getStatReveal(i).initial.value"
              :whileInView="getStatReveal(i).whileInView.value"
              :transition="getStatReveal(i).transition.value"
              :inViewOptions="getStatReveal(i).inViewOptions"
            >{{ s }}</motion.span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
</template>

<style scoped>
</style>
