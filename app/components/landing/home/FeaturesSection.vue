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

const badgeReveal = useScrollReveal(0, { y: 12, duration: 0.5 })
const headingReveal = useScrollReveal(0.1, { y: 24 })
const subtitleReveal = useScrollReveal(0.2, { y: 24 })

function cardReveal(i: number) {
  return useScrollReveal(0.15 + i * 0.08, { y: 36, duration: 0.5 })
}
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
          :initial="headingReveal.initial.value"
          :whileInView="headingReveal.whileInView.value"
          :transition="headingReveal.transition.value"
          :inViewOptions="headingReveal.inViewOptions"
        >
          {{ $t("features.title") }}
        </motion.h2>
        <motion.p
          class="text-muted mx-auto mt-4 max-w-150 text-lg leading-relaxed"
          :initial="subtitleReveal.initial.value"
          :whileInView="subtitleReveal.whileInView.value"
          :transition="subtitleReveal.transition.value"
          :inViewOptions="subtitleReveal.inViewOptions"
        >
          {{ $t("features.subtitle") }}
        </motion.p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          v-for="(f, i) in features"
          :key="f.title"
          class="feat-card border-default bg-default dark:bg-elevated cursor-pointer rounded-2xl border p-7"
          :initial="cardReveal(i).initial.value"
          :whileInView="cardReveal(i).whileInView.value"
          :transition="cardReveal(i).transition.value"
          :inViewOptions="cardReveal(i).inViewOptions"
        >
          <div
            class="feat-icon mb-4.5 flex size-12 items-center justify-center rounded-xl text-xl font-bold text-white will-change-transform"
            :class="
              f.tone === 'primary'
                ? 'from-primary-500 to-primary-700 bg-linear-to-br'
                : 'from-primary-300 to-primary-400 bg-linear-to-br'
            "
          >
            <UIcon :name="f.icon" />
          </div>
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
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  will-change: transform;
}
.feat-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--ui-primary) 30%, transparent);
  box-shadow: 0 20px 44px -16px rgba(28, 25, 23, 0.14);
}
:global(.dark) .feat-card:hover {
  box-shadow: 0 20px 44px -16px rgba(32, 32, 32, 0.65);
}
.feat-icon {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.feat-card:hover .feat-icon {
  transform: rotate(-6deg) scale(1.1);
}
</style>
