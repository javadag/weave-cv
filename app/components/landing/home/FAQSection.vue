<script setup lang="ts">
import { motion } from "motion-v"
import { useScrollReveal } from "~/composables/useScrollReveal"

const { tm, rt } = useI18n()

interface FaqItem {
  q: string
  a: string
}

const faqItems = computed<FaqItem[]>(() => {
  const items = tm("landingFaq.items") as unknown as FaqItem[]
  if (!items || !Array.isArray(items)) return []
  return items.map((i) => ({
    q: rt(i.q),
    a: rt(i.a)
  }))
})

const openIndex = ref<number | null>(null)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}

const headingReveal = useScrollReveal(0, { y: 24 })

function itemReveal(i: number) {
  return useScrollReveal(0.08 + i * 0.05, { y: 20, duration: 0.45 })
}
</script>

<template>
  <section class="border-default bg-muted border-y py-20 sm:py-28">
    <div class="max-w-compact mx-auto px-6 lg:px-12">
      <div class="mb-14 text-center">
        <motion.h2
          class="text-highlighted text-4xl font-bold tracking-[-0.03em] text-balance sm:text-5xl"
          :initial="headingReveal.initial.value"
          :while-in-view="headingReveal.whileInView.value"
          :transition="headingReveal.transition.value"
          :in-view-options="headingReveal.inViewOptions"
        >
          {{ $t("landingFaq.title") }}
        </motion.h2>
      </div>

      <div class="divide-default mx-auto max-w-160 divide-y">
        <motion.div
          v-for="(item, i) in faqItems"
          :key="i"
          :initial="itemReveal(i).initial.value"
          :while-in-view="itemReveal(i).whileInView.value"
          :transition="itemReveal(i).transition.value"
          :in-view-options="itemReveal(i).inViewOptions"
        >
          <button class="flex w-full items-center justify-between gap-4 py-5 text-left" @click="toggle(i)">
            <span class="text-highlighted text-base font-semibold">{{ item.q }}</span>
            <UIcon
              name="i-lucide-chevron-down"
              class="text-muted shrink-0 text-lg transition-transform duration-200"
              :class="{ 'rotate-180': openIndex === i }"
            />
          </button>
          <div
            class="overflow-hidden transition-all duration-300"
            :class="openIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'"
          >
            <p class="text-muted pb-5 text-sm leading-relaxed">{{ item.a }}</p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
</template>
