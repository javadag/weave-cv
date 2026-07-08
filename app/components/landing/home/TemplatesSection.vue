<script setup lang="ts">
import TemplateCarouselCard from "./TemplateCarouselCard.vue"

const SHIFT = 450

const base = ref<{ id: string; name: string; screenshot: string }[]>([])

onMounted(async () => {
  const { TEMPLATES } = await import("~/constants/templates")
  base.value = TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    screenshot: t.screenshot
  }))
})

// scrollProgress: 0 = section entering viewport from bottom
//                 0.5 = section centred in viewport
//                 1 = section exiting at top
const scrollProgress = ref(0.5)
const sectionRef = ref<HTMLElement>()

function updateProgress() {
  const el = sectionRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const viewH = window.innerHeight
  const total = viewH + rect.height
  const scrolled = viewH - rect.top
  scrollProgress.value = Math.max(0, Math.min(1, scrolled / total))
}

onMounted(() => {
  window.addEventListener("scroll", updateProgress, { passive: true })
  updateProgress()
})
onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateProgress)
})

// Row A: starts shifted right (+SHIFT), ends shifted left (-SHIFT) → right-to-left on scroll down
const offsetA = computed(() => SHIFT * (1 - 2 * scrollProgress.value))
// Row B: starts shifted left (-SHIFT), ends shifted right (+SHIFT) → left-to-right on scroll down
const offsetB = computed(() => SHIFT * (2 * scrollProgress.value - 1))
</script>

<template>
  <section ref="sectionRef" class="relative flex w-full max-w-screen flex-col items-center justify-center pt-24">
    <div class="max-w-compact mx-auto mb-10 flex w-full items-end justify-between px-6 lg:px-12">
      <div>
        <span
          class="border-primary-200 bg-primary-50 text-primary dark:border-primary/25 dark:bg-primary/10 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
        >
          {{ $t("templates.badge") }}
        </span>
        <h2 class="text-highlighted mt-5 text-4xl font-bold tracking-[-0.03em] text-balance sm:text-5xl">
          {{ $t("templates.titleLine1") }}<br />{{ $t("templates.titleLine2") }}
        </h2>
        <p class="text-dimmed mt-4 max-w-md text-base leading-relaxed">
          {{ $t("templates.subtitle") }}
        </p>
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
      <!-- Row A -->
      <div
        class="flex gap-4 transition-transform duration-80 ease-out will-change-transform sm:gap-5"
        :style="{ transform: `translate3d(${offsetA}px, 0, 0)` }"
      >
        <TemplateCarouselCard
          v-for="(t, i) in base.slice(0, 12)"
          :key="'a' + i"
          :name="t.name"
          :screenshot="t.screenshot"
        />
      </div>
      <!-- Row B -->
      <div
        class="mt-4 flex gap-4 transition-transform duration-80 ease-out will-change-transform sm:mt-5 sm:gap-5"
        :style="{ transform: `translate3d(${offsetB}px, 0, 0)` }"
      >
        <TemplateCarouselCard
          v-for="(t, i) in base.slice(12)"
          :key="'b' + i"
          :name="t.name"
          :screenshot="t.screenshot"
        />
      </div>
    </div>
  </section>
</template>
