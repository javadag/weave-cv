<script setup lang="ts">
import { motion } from "motion-v"
import { useScrollReveal } from "~/composables/useScrollReveal"

const { tm, rt } = useI18n()

interface Tip {
  icon: string
  title: string
  body: string
}

const tips = computed<Tip[]>(() => {
  const items = tm("resumeTips.tips") as unknown as Tip[]
  if (!items || !Array.isArray(items)) return []
  return items.map((i) => ({
    icon: rt(i.icon),
    title: rt(i.title),
    body: rt(i.body)
  }))
})

const headingReveal = useScrollReveal(0, { y: 24 })
const subtitleReveal = useScrollReveal(0.1, { y: 24 })

function tipReveal(i: number) {
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
          {{ $t("resumeTips.title") }}
        </motion.h2>
        <motion.p
          class="text-muted mx-auto mt-4 max-w-100 text-lg leading-relaxed"
          :initial="subtitleReveal.initial.value"
          :while-in-view="subtitleReveal.whileInView.value"
          :transition="subtitleReveal.transition.value"
          :in-view-options="subtitleReveal.inViewOptions"
        >
          {{ $t("resumeTips.subtitle") }}
        </motion.p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <motion.div
          v-for="(tip, i) in tips"
          :key="i"
          class="tip-card border-default bg-muted flex gap-5 rounded-2xl border p-6"
          :initial="tipReveal(i).initial.value"
          :while-in-view="tipReveal(i).whileInView.value"
          :transition="tipReveal(i).transition.value"
          :in-view-options="tipReveal(i).inViewOptions"
        >
          <div
            class="bg-primary-50 dark:bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl text-lg"
          >
            <UIcon :name="tip.icon" />
          </div>
          <div>
            <h3 class="text-highlighted mb-1.5 text-base font-bold">{{ tip.title }}</h3>
            <p class="text-muted text-sm leading-relaxed">{{ tip.body }}</p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tip-card {
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.25s ease;
}
.tip-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--ui-primary) 25%, transparent);
}
</style>
