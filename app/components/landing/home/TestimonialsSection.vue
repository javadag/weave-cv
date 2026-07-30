<script setup lang="ts">
import { motion } from "motion-v"
import { useScrollReveal } from "~/composables/useScrollReveal"

const { t, tm, rt } = useI18n()

interface Testimonial {
  quote: string
  name: string
  role: string
}

const testimonials = computed<Testimonial[]>(() => {
  const items = tm("testimonials.items") as unknown as Testimonial[]
  if (!items || !Array.isArray(items)) return []
  return items.map((i) => ({
    quote: rt(i.quote),
    name: rt(i.name),
    role: rt(i.role)
  }))
})

const badgeReveal = useScrollReveal(0, { y: 12, duration: 0.5 })
const headingReveal = useScrollReveal(0.1, { y: 24 })
const subtitleReveal = useScrollReveal(0.2, { y: 24 })

function cardReveal(i: number) {
  return useScrollReveal(0.15 + i * 0.08, { y: 32, duration: 0.5 })
}
</script>

<template>
  <section class="border-default bg-muted border-y py-20 sm:py-28">
    <div class="max-w-compact mx-auto px-6 lg:px-12">
      <div class="mb-14 text-center">
        <motion.span
          class="border-primary-200 dark:border-primary/25 bg-primary-50 dark:bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
          :initial="badgeReveal.initial.value"
          :while-in-view="badgeReveal.whileInView.value"
          :transition="badgeReveal.transition.value"
          :in-view-options="badgeReveal.inViewOptions"
        >
          {{ $t("testimonials.badge") }}
        </motion.span>
        <motion.h2
          class="text-highlighted mt-5 text-4xl font-bold tracking-[-0.03em] text-balance sm:text-5xl"
          :initial="headingReveal.initial.value"
          :while-in-view="headingReveal.whileInView.value"
          :transition="headingReveal.transition.value"
          :in-view-options="headingReveal.inViewOptions"
        >
          {{ $t("testimonials.title") }}
        </motion.h2>
        <motion.p
          class="text-muted mx-auto mt-4 max-w-100 text-lg leading-relaxed"
          :initial="subtitleReveal.initial.value"
          :while-in-view="subtitleReveal.whileInView.value"
          :transition="subtitleReveal.transition.value"
          :in-view-options="subtitleReveal.inViewOptions"
        >
          {{ $t("testimonials.subtitle") }}
        </motion.p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          v-for="(item, i) in testimonials"
          :key="i"
          class="testimonial-card border-default bg-default dark:bg-elevated rounded-2xl border p-6"
          :initial="cardReveal(i).initial.value"
          :while-in-view="cardReveal(i).whileInView.value"
          :transition="cardReveal(i).transition.value"
          :in-view-options="cardReveal(i).inViewOptions"
        >
          <svg class="text-primary/25 mb-3" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.689 11 13.213 11 15c0 1.657-1.343 3-3 3-1.308 0-2.417-.622-3.417-1.679zM14.583 17.321C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.689 21 13.213 21 15c0 1.657-1.343 3-3 3-1.308 0-2.417-.622-3.417-1.679z" />
          </svg>
          <p class="text-highlighted mb-4 text-sm leading-relaxed">{{ item.quote }}</p>
          <div class="border-default border-t pt-3">
            <div class="text-highlighted text-sm font-semibold">{{ item.name }}</div>
            <div class="text-dimmed text-xs">{{ item.role }}</div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonial-card {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;
}
.testimonial-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.1);
}
:global(.dark) .testimonial-card:hover {
  box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.5);
}
</style>
