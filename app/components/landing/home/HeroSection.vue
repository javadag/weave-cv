<script setup lang="ts">
import { motion } from "motion-v"
import { APP_VERSION } from "~/constants/config"

const { t } = useI18n()

const prefersReducedMotion = useReducedMotion()

const inViewOptionsPreview = { once: false, margin: "-100px" } as const

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
const sidebarSections = [
  "✶ Personal",
  "☰ Summary",
  "◐ Experience",
  "◇ Education",
  "☆ Skills",
  "◑ Projects",
  "⌗ Languages"
]
const skillChips = ["Figma", "Design systems", "Prototyping", "User research"]

const configItems = [
  { icon: "🎨", label: "Color", value: "Orange" },
  { icon: "Aa", label: "Font", value: "Inter" },
  { icon: "↔", label: "Spacing", value: "Compact" },
  { icon: "📄", label: "Paper", value: "A4" },
  { icon: "◧", label: "Layout", value: "Sidebar" },
  { icon: "T", label: "Size", value: "11pt" },
  { icon: "▬", label: "Margins", value: "Narrow" },
  { icon: "⊕", label: "Icons", value: "On" }
]

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.25, 0.4, 0.25, 1] }
})

const pulseAnimate = computed(() => (prefersReducedMotion.value ? {} : { opacity: [1, 0.65, 1], scale: [1, 1.25, 1] }))
const pulseTransition = { duration: 2.4, repeat: Infinity, ease: "easeInOut" }

const floatAnimate4s = computed(() => (prefersReducedMotion.value ? {} : { y: [0, -6, 0] }))
const floatTransition4s = { duration: 4, repeat: Infinity, ease: "easeInOut" }

const floatAnimate5_5s = computed(() => (prefersReducedMotion.value ? {} : { y: [0, -6, 0] }))
const floatTransition5_5s = { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }
</script>

<template>
  <section ref="heroRef" class="bg-default relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden">
    <!-- Background decorative blobs -->
    <motion.div
      class="pointer-events-none absolute -top-60 -right-48 size-180 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-primary-400)_18%,transparent),transparent_70%)] blur-2xl"
      :initial="{ opacity: 0, scale: 0.8 }"
      :animate="{ opacity: 1, scale: 1 }"
      :transition="{ duration: 1.2, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }"
      :style="{ y: blobTopY }"
    />
    <motion.div
      class="pointer-events-none absolute top-60 -left-72 size-150 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-primary-200)_36%,transparent),transparent_70%)] blur-2xl dark:bg-[radial-gradient(circle,color-mix(in_srgb,var(--ui-primary)_6%,transparent),transparent_70%)]"
      :initial="{ opacity: 0, scale: 0.8 }"
      :animate="{ opacity: 1, scale: 1 }"
      :transition="{ duration: 1.2, delay: 0.25, ease: [0.25, 0.4, 0.25, 1] }"
      :style="{ y: blobBottomY }"
    />

    <!-- Dot grid pattern -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
      style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 24px 24px"
    />

    <div class="max-w-compact relative mx-auto w-full px-6 lg:px-12">
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <!-- Left column -->
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

        <!-- Right column — Editor preview -->
        <motion.div
          dir="ltr"
          class="hero-preview border-default relative overflow-hidden rounded-2xl border shadow-[0_50px_100px_-30px_rgba(28,25,23,0.22)] dark:shadow-[0_50px_100px_-30px_rgba(0,0,0,0.7)]"
          :initial="{ opacity: 0, x: 48, scale: 0.94 }"
          :while-in-view="{ opacity: 1, x: 0, scale: 1 }"
          :in-view-options="inViewOptionsPreview"
          :transition="{ duration: 0.7, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }"
        >
          <!-- Browser chrome bar -->
          <div class="border-default bg-muted flex items-center gap-2 border-b px-4 py-3">
            <div class="flex gap-1.5">
              <div class="size-2.75 rounded-full bg-[#FF5F57]" />
              <div class="size-2.75 rounded-full bg-[#FEBC2E]" />
              <div class="size-2.75 rounded-full bg-[#28C840]" />
            </div>
            <div class="text-dimmed flex-1 text-center text-[11px]">weave-cv.app/editor/sara-chen</div>
          </div>

          <!-- Editor body: sidebar + resume + config -->
          <div class="grid h-120 grid-cols-[140px_1fr_120px] lg:h-135">
            <!-- Sections sidebar -->
            <div class="border-default bg-muted border-r p-3 text-xs">
              <motion.div
                class="text-dimmed mb-2.5 text-[10px] font-semibold tracking-widest uppercase"
                :initial="{ opacity: 0, x: -12 }"
                :animate="{ opacity: 1, x: 0 }"
                :transition="{ duration: 0.35, delay: 0.55 }"
              >
                {{ $t("hero.sections") }}
              </motion.div>
              <motion.div
                v-for="(sec, i) in sidebarSections"
                :key="sec"
                class="mb-1 cursor-pointer rounded-md px-2.5 py-2 transition-colors duration-150"
                :class="
                  i === 2
                    ? 'bg-primary-50 dark:bg-primary/15 text-primary font-semibold'
                    : 'text-toned hover:bg-primary-50 dark:hover:bg-primary/10'
                "
                :initial="{ opacity: 0, x: -14 }"
                :animate="{ opacity: 1, x: 0 }"
                :transition="{ duration: 0.32, delay: 0.6 + i * 0.05, ease: 'easeOut' }"
              >
                {{ sec }}
              </motion.div>
              <motion.div
                class="text-primary mt-3 cursor-pointer px-2.5 py-2 text-xs font-semibold"
                :initial="{ opacity: 0, x: -12 }"
                :animate="{ opacity: 1, x: 0 }"
                :transition="{ duration: 0.35, delay: 1.0 }"
              >
                {{ $t("hero.addSection") }}
              </motion.div>
            </div>

            <!-- Resume preview -->
            <motion.div
              class="bg-elevated dark:bg-default flex items-center justify-center p-5"
              :initial="{ opacity: 0, scale: 0.93 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ duration: 0.5, delay: 0.5, ease: 'easeOut' }"
            >
              <div
                class="flex aspect-[0.77] w-full max-w-75 flex-col gap-2.5 rounded-sm bg-white p-5 text-gray-800 shadow-sm"
              >
                <div>
                  <div class="text-[18px] font-bold tracking-[-0.02em] text-slate-950">Sara Chen</div>
                  <div class="mt-0.5 text-[9px] text-slate-500">Senior Product Designer</div>
                  <div class="mt-1.5 flex gap-1.5 text-[7px] text-slate-400">
                    <span>sara.chen@mail.com</span><span>·</span><span>San Francisco</span>
                  </div>
                </div>
                <div class="h-px bg-slate-200" />
                <div>
                  <div class="text-primary-600 mb-1.25 text-[7px] font-bold tracking-widest">EXPERIENCE</div>
                  <div class="mb-1.5">
                    <div class="flex justify-between">
                      <div class="text-[8.5px] font-bold text-slate-950">Senior Designer · Linear</div>
                      <div class="text-[7px] text-slate-500">2023 — Now</div>
                    </div>
                    <div class="mt-0.75 h-0.75 w-[88%] rounded-[1px] bg-slate-100" />
                    <div class="mt-0.5 h-0.75 w-[72%] rounded-[1px] bg-slate-100" />
                  </div>
                  <div>
                    <div class="flex justify-between">
                      <div class="text-[8.5px] font-bold text-slate-950">Product Designer · Stripe</div>
                      <div class="text-[7px] text-slate-500">2020 — 2023</div>
                    </div>
                    <div class="mt-0.75 h-0.75 w-[90%] rounded-[1px] bg-slate-100" />
                    <div class="mt-0.5 h-0.75 w-[65%] rounded-[1px] bg-slate-100" />
                  </div>
                </div>
                <div>
                  <div class="text-primary-600 mb-1.25 text-[7px] font-bold tracking-widest">EDUCATION</div>
                  <div class="flex justify-between">
                    <div class="text-[8.5px] font-bold text-slate-950">BFA, Visual Design · RISD</div>
                    <div class="text-[7px] text-slate-500">2016 — 2020</div>
                  </div>
                </div>
                <div>
                  <div class="text-primary-600 mb-1.25 text-[7px] font-bold tracking-widest">SKILLS</div>
                  <div class="flex flex-wrap gap-0.75">
                    <span
                      v-for="s in skillChips"
                      :key="s"
                      class="rounded-[3px] bg-slate-100 px-1.5 py-0.5 text-[6.5px] text-slate-950"
                      >{{ s }}</span
                    >
                  </div>
                </div>
              </div>
            </motion.div>

            <!-- Config sidebar -->
            <motion.div
              class="border-default bg-muted flex flex-col overflow-hidden border-l text-xs"
              :initial="{ opacity: 0, x: 14 }"
              :animate="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.4, delay: 0.7, ease: 'easeOut' }"
            >
              <div class="text-dimmed shrink-0 px-3 pt-3 pb-2 text-[10px] font-semibold tracking-widest uppercase">
                Config
              </div>
              <div class="overflow-y-auto px-3 pb-3">
                <div v-for="(item, i) in configItems" :key="item.label" class="mb-1.5 last:mb-0">
                  <motion.div
                    class="text-dimmed mb-0.75 text-[9px] font-medium"
                    :initial="{ opacity: 0, x: 8 }"
                    :animate="{ opacity: 1, x: 0 }"
                    :transition="{ duration: 0.3, delay: 0.8 + i * 0.06 }"
                  >
                    {{ item.label }}
                  </motion.div>
                  <motion.div
                    class="bg-elevated dark:bg-default text-toned flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px]"
                    :initial="{ opacity: 0, x: 8 }"
                    :animate="{ opacity: 1, x: 0 }"
                    :transition="{ duration: 0.3, delay: 0.85 + i * 0.06 }"
                  >
                    <span class="text-[11px]">{{ item.icon }}</span>
                    <span>{{ item.value }}</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          <!-- Floating badges on preview -->
          <motion.div
            class="absolute right-5 bottom-5"
            :initial="{ opacity: 0, y: 12, scale: 0.85 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :transition="{ duration: 0.45, delay: 1.2, ease: 'easeOut' }"
          >
            <motion.div
              class="border-muted bg-default dark:bg-elevated flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs shadow-lg"
              :animate="floatAnimate4s"
              :transition="floatTransition4s"
            >
              <motion.span
                class="inline-block size-2 rounded-full bg-emerald-500"
                :animate="pulseAnimate"
                :transition="pulseTransition"
              />
              <span dir="auto" class="text-highlighted font-semibold">{{ $t("hero.savedAgo") }}</span>
            </motion.div>
          </motion.div>
          <motion.div
            class="absolute top-14 right-5"
            :initial="{ opacity: 0, y: 12, scale: 0.85 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :transition="{ duration: 0.45, delay: 1.35, ease: 'easeOut' }"
          >
            <motion.div
              dir="auto"
              class="border-muted bg-default dark:bg-elevated text-highlighted flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-semibold shadow-lg"
              :animate="floatAnimate5_5s"
              :transition="floatTransition5_5s"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#10B981" fill-opacity="0.2" />
                <path
                  d="M8 12.5L11 15.5L16 9.5"
                  stroke="#10B981"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {{ $t("hero.atsCheck") }}
            </motion.div>
          </motion.div>
        </motion.div>
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
.hero-preview {
  transition: box-shadow 0.4s ease;
}
.hero-preview:hover {
  box-shadow: 0 60px 120px -30px color-mix(in srgb, var(--ui-primary) 20%, transparent);
}
</style>
