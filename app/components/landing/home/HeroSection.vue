<script setup lang="ts">
import { motion, useSpring, useTransform } from "motion-v"
import { APP_VERSION } from "~/constants/config"
import HeroPreview from "./HeroPreview.vue"

const { t } = useI18n()

const prefersReducedMotion = useReducedMotion()

const heroRef = ref<HTMLElement>()

const { scrollY } = useScroll()
const heroProgress = useTransform(scrollY, () => {
  const el = heroRef.value
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  const viewH = window.innerHeight
  return Math.max(0, Math.min(1, (viewH - rect.top) / (viewH + rect.height)))
})

const smoothProgress = useSpring(heroProgress, { stiffness: 60, damping: 18 })
const blobTopY = useTransform(smoothProgress, [0, 0.5, 1], [40, 0, -40])
const blobBottomY = useTransform(smoothProgress, [0, 0.5, 1], [-30, 0, 30])

const trustBadges = computed(() => [
  t("hero.trustNoCreditCard"),
  t("hero.trustUnlimitedResumes"),
  t("hero.trustCloudSync")
])

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.25, 0.4, 0.25, 1] }
})

const pulseAnimate = computed(() => (prefersReducedMotion.value ? {} : { opacity: [1, 0.65, 1], scale: [1, 1.25, 1] }))
const pulseTransition = { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
</script>

<template>
  <section ref="heroRef" class="bg-default relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden">
    <motion.div
      class="pointer-events-none absolute -top-60 -right-48 size-180 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-primary-400)_18%,transparent),transparent_70%)] blur-2xl"
      :initial="{ opacity: 0, scale: 0.8 }"
      :animate="{ opacity: 1, scale: 1 }"
      :transition="{ duration: 1.2, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }"
      :style="{ y: blobTopY }"
    />
    <motion.div
      class="pointer-events-none absolute top-60 -left-48 size-150 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-primary-200)_36%,transparent),transparent_70%)] blur-2xl dark:bg-[radial-gradient(circle,color-mix(in_srgb,var(--ui-primary)_6%,transparent),transparent_70%)]"
      :initial="{ opacity: 0, scale: 0.8 }"
      :animate="{ opacity: 1, scale: 1 }"
      :transition="{ duration: 1.2, delay: 0.25, ease: [0.25, 0.4, 0.25, 1] }"
      :style="{ y: blobBottomY }"
    />
    <div class="max-w-compact relative mx-auto w-full px-6 lg:px-12">
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="flex flex-col">
          <motion.span
            class="border-primary-200 dark:border-primary/25 bg-primary-50 dark:bg-primary/10 text-primary inline-flex w-max items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
            v-bind="fadeUp(0.1)"
          >
            <motion.span
              class="bg-primary inline-block size-1.5 rounded-full"
              :animate="pulseAnimate"
              :transition="pulseTransition"
            />
            {{ APP_VERSION }}
          </motion.span>
          <motion.h1
            class="text-highlighted mt-5 text-[3.5rem] leading-[1.05] font-bold tracking-[-0.04em] text-balance lg:text-[4.5rem] rtl:leading-tight"
            v-bind="fadeUp(0.2)"
          >
            {{ $t("hero.titleStart") }}
            <span class="from-brand-gradient-from to-brand-gradient-to bg-linear-to-br bg-clip-text text-transparent">
              {{ $t("hero.titleHighlight") }}
            </span>
          </motion.h1>
          <motion.p class="text-muted mt-5 max-w-135 text-lg leading-relaxed" v-bind="fadeUp(0.35)">
            {{ $t("hero.subtitle") }}
          </motion.p>
          <motion.div class="mt-8 flex flex-wrap gap-3" v-bind="fadeUp(0.5)">
            <NuxtLink
              to="/dashboard"
              class="hero-btn-primary from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600 inline-flex items-center gap-2 rounded-xl bg-linear-to-br px-6 py-3.5 text-[15px] font-semibold text-white no-underline shadow-[0_8px_24px_-8px_rgba(234,88,12,0.5)] dark:shadow-none"
            >
              <span>✦</span> {{ $t("hero.buildBtn") }}
            </NuxtLink>
            <NuxtLink
              to="/#templates"
              class="hero-btn-outline border-primary/20 text-primary hover:bg-primary/5 inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-[15px] font-semibold no-underline transition-colors"
            >
              {{ $t("hero.browseBtn") }}
            </NuxtLink>
          </motion.div>
          <div class="text-muted mt-7 flex flex-wrap gap-6 text-sm">
            <motion.div
              v-for="(b, i) in trustBadges"
              :key="b"
              class="flex items-center gap-1.5"
              :initial="{ opacity: 0, y: 16 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.45, delay: 0.65 + i * 0.1, ease: [0.25, 0.4, 0.25, 1] }"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#EA580C" fill-opacity="0.15" />
                <path
                  d="M8 12.5L11 15.5L16 9.5"
                  stroke="#EA580C"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {{ b }}
            </motion.div>
          </div>
        </div>
        <HeroPreview />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-btn-primary {
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    filter 0.18s ease;
}
.hero-btn-primary:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}
</style>
