<script setup lang="ts">
import { motion } from "motion-v"
import { useScrollReveal } from "~/composables/useScrollReveal"

const { t } = useI18n()

const steps = computed(() => [
  {
    num: "01",
    title: t("howItWorks.step1Title"),
    body: t("howItWorks.step1Body"),
    icon: "i-lucide-layout-template"
  },
  {
    num: "02",
    title: t("howItWorks.step2Title"),
    body: t("howItWorks.step2Body"),
    icon: "i-lucide-pen-line"
  },
  {
    num: "03",
    title: t("howItWorks.step3Title"),
    body: t("howItWorks.step3Body"),
    icon: "i-lucide-download"
  }
])

const badgeReveal = useScrollReveal(0, { y: 12, duration: 0.5 })
const headingReveal = useScrollReveal(0.1, { y: 24 })
const subtitleReveal = useScrollReveal(0.2, { y: 24 })

function stepReveal(i: number) {
  return useScrollReveal(0.15 + i * 0.12, { y: 36, duration: 0.5 })
}
</script>

<template>
  <section class="bg-default py-20 sm:py-28">
    <div class="max-w-compact mx-auto px-6 lg:px-12">
      <div class="mb-16 text-center">
        <motion.span
          class="border-primary-200 dark:border-primary/25 bg-primary-50 dark:bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
          :initial="badgeReveal.initial.value"
          :while-in-view="badgeReveal.whileInView.value"
          :transition="badgeReveal.transition.value"
          :in-view-options="badgeReveal.inViewOptions"
        >
          {{ $t("howItWorks.badge") }}
        </motion.span>
        <motion.h2
          class="text-highlighted mt-5 text-4xl font-bold tracking-[-0.03em] text-balance sm:text-5xl"
          :initial="headingReveal.initial.value"
          :while-in-view="headingReveal.whileInView.value"
          :transition="headingReveal.transition.value"
          :in-view-options="headingReveal.inViewOptions"
        >
          {{ $t("howItWorks.title") }}
        </motion.h2>
        <motion.p
          class="text-muted mx-auto mt-4 max-w-120 text-lg leading-relaxed"
          :initial="subtitleReveal.initial.value"
          :while-in-view="subtitleReveal.whileInView.value"
          :transition="subtitleReveal.transition.value"
          :in-view-options="subtitleReveal.inViewOptions"
        >
          {{ $t("howItWorks.subtitle") }}
        </motion.p>
      </div>

      <div class="grid gap-8 sm:grid-cols-3">
        <motion.div
          v-for="(step, i) in steps"
          :key="step.num"
          class="step-card relative text-center"
          :initial="stepReveal(i).initial.value"
          :while-in-view="stepReveal(i).whileInView.value"
          :transition="stepReveal(i).transition.value"
          :in-view-options="stepReveal(i).inViewOptions"
        >
          <div
            class="text-primary/20 dark:text-primary/15 mx-auto mb-5 text-6xl font-black tracking-tighter select-none"
          >
            {{ step.num }}
          </div>
          <div
            class="bg-primary-50 dark:bg-primary/10 text-primary mx-auto mb-4 flex size-12 items-center justify-center rounded-xl"
          >
            <UIcon :name="step.icon" class="text-xl" />
          </div>
          <h3 class="text-highlighted mb-2 text-lg font-bold">{{ step.title }}</h3>
          <p class="text-muted mx-auto max-w-64 text-sm leading-relaxed">{{ step.body }}</p>
          <div
            v-if="i < steps.length - 1"
            class="border-default absolute top-12 -right-4 hidden w-8 border-t sm:block lg:w-12"
          />
        </motion.div>
      </div>
    </div>
  </section>
</template>
