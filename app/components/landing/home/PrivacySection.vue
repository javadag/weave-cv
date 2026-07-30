<script setup lang="ts">
import { motion } from "motion-v"
import { useScrollReveal } from "~/composables/useScrollReveal"

const { t } = useI18n()

const points = computed(() => [
  {
    icon: "i-lucide-shield-off",
    title: t("privacy.noSellingTitle"),
    body: t("privacy.noSellingBody"),
    color: "rose"
  },
  {
    icon: "i-lucide-brain",
    title: t("privacy.noAiTitle"),
    body: t("privacy.noAiBody"),
    color: "amber"
  },
  {
    icon: "i-lucide-trash-2",
    title: t("privacy.deleteTitle"),
    body: t("privacy.deleteBody"),
    color: "emerald"
  },
  {
    icon: "i-lucide-map-pin",
    title: t("privacy.hostingTitle"),
    body: t("privacy.hostingBody"),
    color: "sky"
  }
])

const colorMap: Record<string, string> = {
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"
}

const headingReveal = useScrollReveal(0, { y: 24 })
const subtitleReveal = useScrollReveal(0.1, { y: 24 })

function cardReveal(i: number) {
  return useScrollReveal(0.15 + i * 0.08, { y: 32, duration: 0.5 })
}
</script>

<template>
  <section class="bg-default py-20 sm:py-28">
    <div class="max-w-compact mx-auto px-6 lg:px-12">
      <div class="mb-14 text-center">
        <motion.h2
          class="text-highlighted text-4xl font-bold tracking-[-0.03em] text-balance sm:text-5xl"
          :initial="headingReveal.initial.value"
          :while-in-view="headingReveal.whileInView.value"
          :transition="headingReveal.transition.value"
          :in-view-options="headingReveal.inViewOptions"
        >
          {{ $t("privacy.title") }}
        </motion.h2>
        <motion.p
          class="text-muted mx-auto mt-4 max-w-100 text-lg leading-relaxed"
          :initial="subtitleReveal.initial.value"
          :while-in-view="subtitleReveal.whileInView.value"
          :transition="subtitleReveal.transition.value"
          :in-view-options="subtitleReveal.inViewOptions"
        >
          {{ $t("privacy.subtitle") }}
        </motion.p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          v-for="(point, i) in points"
          :key="point.title"
          class="privacy-card border-default bg-muted rounded-2xl border p-6"
          :initial="cardReveal(i).initial.value"
          :while-in-view="cardReveal(i).whileInView.value"
          :transition="cardReveal(i).transition.value"
          :in-view-options="cardReveal(i).inViewOptions"
        >
          <div
            class="mb-4 flex size-11 items-center justify-center rounded-xl text-lg"
            :class="colorMap[point.color]"
          >
            <UIcon :name="point.icon" />
          </div>
          <h3 class="text-highlighted mb-1.5 text-base font-bold">{{ point.title }}</h3>
          <p class="text-muted text-sm leading-relaxed">{{ point.body }}</p>
        </motion.div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.privacy-card {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.privacy-card:hover {
  transform: translateY(-2px);
}
</style>
