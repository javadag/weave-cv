<script setup lang="ts">
import { motion, useMotionValue, useSpring } from "motion-v"

const prefersReducedMotion = useReducedMotion()

const inViewOptionsPreview = { once: false, margin: "-100px" } as const

const previewRef = ref<HTMLElement>()

const cursorOnPreview = ref(false)
const cursorRelX = ref(0)
const cursorRelY = ref(0)

const maxTilt = 5
const rawRotateX = useMotionValue(0)
const rawRotateY = useMotionValue(0)
const tiltRotateX = useSpring(rawRotateX, { stiffness: 100, damping: 22 })
const tiltRotateY = useSpring(rawRotateY, { stiffness: 100, damping: 22 })

const lightHighlightBg = computed(() => {
  if (!cursorOnPreview.value || prefersReducedMotion.value) return {}
  const lx = 50 - cursorRelX.value * 15
  const ly = 50 - cursorRelY.value * 15
  return {
    background: `radial-gradient(500px circle at ${lx}% ${ly}%, rgba(255,255,255,0.06) 0%, rgba(234,136,12,0.03) 40%, transparent 70%)`
  }
})

const badgeWrapperStyle = computed(() => {
  if (prefersReducedMotion.value || !cursorOnPreview.value) {
    return { transform: "translate(0px, 0px)", transition: "transform 0.5s cubic-bezier(0.25, 0.4, 0.25, 1)" }
  }
  return {
    transform: `translate(${cursorRelX.value * -6}px, ${cursorRelY.value * -6}px)`,
    transition: "transform 0.15s ease-out"
  }
})
const badgeWrapperStyle2 = computed(() => {
  if (prefersReducedMotion.value || !cursorOnPreview.value) {
    return { transform: "translate(0px, 0px)", transition: "transform 0.5s cubic-bezier(0.25, 0.4, 0.25, 1)" }
  }
  return {
    transform: `translate(${cursorRelX.value * -4}px, ${cursorRelY.value * -4}px)`,
    transition: "transform 0.15s ease-out"
  }
})

function handlePointerMove(e: PointerEvent) {
  if (!previewRef.value) return
  const rect = previewRef.value.getBoundingClientRect()
  const rx = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1))
  const ry = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1))
  cursorRelX.value = rx
  cursorRelY.value = ry
  cursorOnPreview.value = true

  if (!prefersReducedMotion.value) {
    rawRotateY.set(rx * maxTilt)
    rawRotateX.set(-ry * maxTilt)
  }
}
function handlePointerLeave() {
  cursorOnPreview.value = false
  rawRotateX.set(0)
  rawRotateY.set(0)
}

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

const pulseAnimate = computed(() => (prefersReducedMotion.value ? {} : { opacity: [1, 0.65, 1], scale: [1, 1.25, 1] }))
const pulseTransition = { duration: 2.4, repeat: Infinity, ease: "easeInOut" }

const floatAnimate4s = computed(() => (prefersReducedMotion.value ? {} : { y: [0, -6, 0] }))
const floatTransition4s = { duration: 4, repeat: Infinity, ease: "easeInOut" }

const floatAnimate5_5s = computed(() => (prefersReducedMotion.value ? {} : { y: [0, -6, 0] }))
const floatTransition5_5s = { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }
</script>

<template>
  <div ref="previewRef" class="tilt-scene" @pointermove="handlePointerMove" @pointerleave="handlePointerLeave">
    <motion.div
      dir="ltr"
      class="hero-preview tilt-card border-default relative overflow-hidden rounded-2xl border shadow-[0_50px_100px_-30px_rgba(28,25,23,0.22)] dark:shadow-[0_50px_100px_-30px_rgba(0,0,0,0.7)]"
      :initial="{ opacity: 0, x: 48, scale: 0.94 }"
      :while-in-view="{ opacity: 1, x: 0, scale: 1 }"
      :in-view-options="inViewOptionsPreview"
      :transition="{ duration: 0.7, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }"
      :style="prefersReducedMotion ? {} : { rotateX: tiltRotateX, rotateY: tiltRotateY }"
    >
      <div
        class="light-highlight pointer-events-none absolute inset-0 z-10"
        :class="{ 'light-highlight--on': cursorOnPreview && !prefersReducedMotion }"
        :style="lightHighlightBg"
      />
      <div class="border-default bg-muted relative z-2 flex items-center gap-2 border-b px-4 py-3">
        <div class="flex gap-1.5">
          <div class="size-2.75 rounded-full bg-[#FF5F57]" />
          <div class="size-2.75 rounded-full bg-[#FEBC2E]" />
          <div class="size-2.75 rounded-full bg-[#28C840]" />
        </div>
        <div class="text-dimmed flex-1 text-center text-[11px]">weave-cv.app/editor/sara-chen</div>
      </div>
      <div class="grid h-80 grid-cols-1 sm:grid-cols-[140px_1fr_120px] sm:h-120 lg:h-135">
        <div class="border-default bg-muted hidden border-r p-3 text-xs sm:block">
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
        <motion.div
          class="bg-elevated dark:bg-default flex items-center justify-center p-5"
          :initial="{ opacity: 0, scale: 0.93 }"
          :animate="{ opacity: 1, scale: 1 }"
          :transition="{ duration: 0.5, delay: 0.5, ease: 'easeOut' }"
        >
          <div
            class="flex aspect-[0.77] w-full max-w-55 sm:max-w-75 flex-col gap-2.5 rounded-sm bg-white p-3.5 sm:p-5 text-gray-800 shadow-sm"
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
        <motion.div
          class="border-default bg-muted hidden flex-col overflow-hidden border-l text-xs sm:flex"
          :initial="{ opacity: 0, x: 14 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.4, delay: 0.7, ease: 'easeOut' }"
        >
          <div class="text-dimmed shrink-0 px-3 pt-3 pb-2 text-[10px] font-semibold tracking-widest uppercase">
            Config
          </div>
          <div class="overflow-y-auto px-3 pb-3">
            <div
              v-for="(item, i) in configItems"
              :key="item.label"
              class="config-row group hover:bg-primary-50/60 dark:hover:bg-primary/10 mb-1.5 cursor-pointer rounded-md px-1.5 py-1 transition-all duration-200 last:mb-0 hover:scale-103"
            >
              <motion.div
                class="text-dimmed mb-0.75 text-[9px] font-medium"
                :initial="{ opacity: 0, x: 8 }"
                :animate="{ opacity: 1, x: 0 }"
                :transition="{ duration: 0.3, delay: 0.8 + i * 0.06 }"
              >
                {{ item.label }}
              </motion.div>
              <motion.div
                class="bg-elevated dark:bg-default text-toned group-hover:text-primary flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] transition-colors duration-200"
                :initial="{ opacity: 0, x: 8 }"
                :animate="{ opacity: 1, x: 0 }"
                :transition="{ duration: 0.3, delay: 0.85 + i * 0.06 }"
              >
                <span class="text-[11px] transition-transform duration-200 group-hover:scale-125">
                  {{ item.icon }}
                </span>
                <span>{{ item.value }}</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      <div class="badge-wrapper absolute right-5 bottom-5 z-3" :style="badgeWrapperStyle">
        <motion.div
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
      </div>
      <div class="badge-wrapper absolute top-14 right-5 z-3" :style="badgeWrapperStyle2">
        <motion.div
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
      </div>
    </motion.div>
  </div>
</template>

<style scoped>
.tilt-scene {
  perspective: 1200px;
}

.hero-preview {
  transition: box-shadow 0.4s ease;
}
.hero-preview:hover {
  box-shadow: 0 60px 120px -30px color-mix(in srgb, var(--ui-primary) 20%, transparent);
}

.light-highlight {
  mix-blend-mode: overlay;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s ease;
}
.light-highlight--on {
  opacity: 1;
  transition: opacity 0.15s ease;
}

.badge-wrapper {
  will-change: transform;
}

.config-row {
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}
.hover\:scale-103:hover {
  transform: scale(1.03);
}

@media (prefers-reduced-motion: reduce) {
  .tilt-scene {
    perspective: none;
  }
  .tilt-card {
    transform: none !important;
  }
  .light-highlight {
    display: none;
  }
}
</style>
