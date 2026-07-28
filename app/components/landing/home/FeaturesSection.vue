<script setup lang="ts">
import { motion } from "motion-v"
import { useScrollReveal } from "~/composables/useScrollReveal"

const { t } = useI18n()

const features = computed(() => [
  {
    icon: "i-lucide-file-text",
    title: t("features.refinedTemplatesTitle"),
    body: t("features.refinedTemplatesBody"),
    tone: "primary"
  },
  {
    icon: "i-lucide-mouse-pointer-click",
    title: t("features.dragDropTitle"),
    body: t("features.dragDropBody"),
    tone: "secondary"
  },
  {
    icon: "i-lucide-download",
    title: t("features.pixelPdfTitle"),
    body: t("features.pixelPdfBody"),
    tone: "primary"
  },
  {
    icon: "i-lucide-palette",
    title: t("features.colorTypeTitle"),
    body: t("features.colorTypeBody"),
    tone: "secondary"
  },
  {
    icon: "i-lucide-cloud",
    title: t("features.cloudSyncTitle"),
    body: t("features.cloudSyncBody"),
    tone: "primary"
  },
  {
    icon: "i-lucide-lock",
    title: t("features.freeTitle"),
    body: t("features.freeBody"),
    tone: "secondary"
  }
])

// --- Directional reveals per card (alternating left/right/scale) ---
const directions = ["left", "right", "scale", "left", "right", "scale"] as const
const reveals = directions.map((dir, i) =>
  useScrollReveal(0.15 + i * 0.08, { direction: dir })
)
function getReveal(i: number) { return reveals[i]! }

// --- Card tilt ---
const tilts = Array.from({ length: 6 }, () => useTiltCard(3))
function getTilt(i: number) { return tilts[i]! }
function setTiltRef(index: number, el: HTMLElement | null) {
  tilts[index]!.ref.value = el
}

// --- Icon bounce on hover ---
const prefersReducedMotion = useReducedMotion()
const iconScale = computed(() => (prefersReducedMotion.value ? {} : { scale: [1, 1.2, 1] }))
const iconTransition = { type: "spring" as const, bounce: 0.5 }

// --- Section heading word-by-word ---
const headingText = computed(() => t("features.title"))
const headingWords = computed(() =>
  headingText.value.split(/\s+/).map((word, i) => ({
    word,
    transition: { type: "spring" as const, bounce: 0.4, delay: 0.1 + i * 0.06 }
  }))
)

// --- Badge reveal ---
const badgeReveal = useScrollReveal(0, { y: 12, duration: 0.5 })
</script>

<template>
  <section id="features" class="border-default bg-muted border-y py-20 sm:py-28">
    <div class="max-w-compact mx-auto px-6 lg:px-12">
      <div class="mb-16 text-center">
        <motion.span
          class="border-primary-200 dark:border-primary/25 bg-primary-50 dark:bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
          :initial="badgeReveal.initial.value"
          :whileInView="badgeReveal.whileInView.value"
          :transition="badgeReveal.transition.value"
          :inViewOptions="badgeReveal.inViewOptions"
        >
          {{ $t("features.badge") }}
        </motion.span>
        <motion.h2
          class="text-highlighted mt-5 text-4xl font-bold tracking-[-0.03em] text-balance sm:text-5xl"
        >
          <motion.span
            v-for="(w, i) in headingWords"
            :key="i"
            class="inline-block"
            :initial="{ opacity: 0, y: 24 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="w.transition"
            :inViewOptions="{ once: true, margin: '-80px' }"
          >{{ w.word }}&nbsp;</motion.span>
        </motion.h2>
        <motion.p
          class="text-muted mx-auto mt-4 max-w-150 text-lg leading-relaxed"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ type: 'spring', bounce: 0.3, delay: 0.2 }"
          :inViewOptions="{ once: true, margin: '-80px' }"
        >
          {{ $t("features.subtitle") }}
        </motion.p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          v-for="(f, i) in features"
          :key="f.title"
          :ref="(el: any) => setTiltRef(i, el as HTMLElement)"
          class="feat-card border-default bg-default dark:bg-elevated cursor-pointer rounded-2xl border p-7"
          :initial="getReveal(i).initial.value"
          :whileInView="getReveal(i).whileInView.value"
          :transition="getReveal(i).transition.value"
          :inViewOptions="getReveal(i).inViewOptions"
          :style="getTilt(i).style.value"
          @mousemove="getTilt(i).onMove"
          @mouseleave="getTilt(i).onLeave"
        >
          <motion.div
            class="feat-icon mb-4.5 flex size-12 items-center justify-center rounded-xl text-xl font-bold text-white will-change-transform"
            :class="
              f.tone === 'primary'
                ? 'from-primary-500 to-primary-700 bg-linear-to-br'
                : 'from-primary-300 to-primary-400 bg-linear-to-br'
            "
            :while-hover="iconScale"
            :transition="iconTransition"
          >
            <UIcon :name="f.icon" />
          </motion.div>
          <h3 class="text-highlighted mb-2 text-lg font-bold tracking-[-0.01em]">{{ f.title }}</h3>
          <p class="text-muted text-sm leading-relaxed">{{ f.body }}</p>
        </motion.div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feat-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  will-change: transform;
}
.feat-card:hover {
  border-color: color-mix(in srgb, var(--ui-primary) 30%, transparent);
  box-shadow: 0 20px 44px -16px rgba(28, 25, 23, 0.14);
}
:global(.dark) .feat-card:hover {
  box-shadow: 0 20px 44px -16px rgba(32, 32, 32, 0.65);
}
</style>
