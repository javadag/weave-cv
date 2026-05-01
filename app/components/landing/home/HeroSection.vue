<script setup lang="ts">
import { APP_VERSION, MAX_RESUMES } from "~/constants/config"

const { t } = useI18n()

const trustBadges = computed(() => [
  t("hero.trustNoCreditCard"),
  t("hero.trustFreeResumes", { max: MAX_RESUMES }),
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
</script>

<template>
  <section class="bg-default relative overflow-hidden py-16 lg:py-20">
    <div
      class="pointer-events-none absolute -top-60 -right-48 size-180 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-primary-400)_18%,transparent),transparent_70%)] blur-2xl"
    />
    <div
      class="pointer-events-none absolute top-60 -left-72 size-150 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-primary-200)_36%,transparent),transparent_70%)] blur-2xl dark:bg-[radial-gradient(circle,color-mix(in_srgb,var(--ui-primary)_6%,transparent),transparent_70%)]"
    />
    <div class="max-w-compact relative mx-auto px-6 lg:px-12">
      <div class="grid items-center gap-14 lg:grid-cols-2">
        <div class="flex flex-col">
          <div
            v-motion
            :initial="{ opacity: 0, y: 14 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut' } }"
          >
            <span
              class="border-primary-200 dark:border-primary/25 bg-primary-50 dark:bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
            >
              <span class="animate-landing-pulse bg-primary inline-block size-1.5 rounded-full" />
              {{ APP_VERSION }}
            </span>
          </div>
          <h1
            v-motion
            :initial="{ opacity: 0, y: 14 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut', delay: 80 } }"
            class="text-highlighted mt-6 text-[3.5rem] leading-[1.05] font-bold tracking-[-0.04em] text-balance lg:text-[4.5rem] rtl:leading-tight"
          >
            {{ $t("hero.titleStart") }}
            <span class="from-brand-gradient-from to-brand-gradient-to bg-linear-to-br bg-clip-text text-transparent">
              {{ $t("hero.titleHighlight") }}
            </span>
          </h1>
          <p
            v-motion
            :initial="{ opacity: 0, y: 14 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut', delay: 160 } }"
            class="text-muted mt-6 max-w-135 text-lg leading-relaxed"
          >
            {{ $t("hero.subtitle") }}
          </p>
          <div
            v-motion
            :initial="{ opacity: 0, y: 14 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut', delay: 240 } }"
            class="mt-9 flex flex-wrap gap-3"
          >
            <NuxtLink
              to="/dashboard"
              class="hero-btn-primary from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600 inline-flex items-center gap-2 rounded-xl bg-linear-to-br px-6 py-3.5 text-[15px] font-semibold text-white no-underline shadow-[0_8px_24px_-8px_rgba(234,88,12,0.5)] dark:shadow-none"
            >
              <span>✦</span> {{ $t("hero.buildBtn") }}
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              class="border-muted bg-muted text-highlighted hover:bg-elevated hover:border-accented inline-flex items-center rounded-xl border px-6 py-3.5 text-[15px] font-semibold no-underline transition-colors duration-200"
            >
              {{ $t("hero.browseBtn") }}
            </NuxtLink>
          </div>
          <div
            v-motion
            :initial="{ opacity: 0, y: 14 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut', delay: 320 } }"
            class="text-muted mt-9 flex flex-wrap gap-6 text-sm"
          >
            <div v-for="b in trustBadges" :key="b" class="flex items-center gap-1.5">
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
            </div>
          </div>
        </div>
        <div
          v-motion
          dir="ltr"
          :initial="{ opacity: 0, scale: 0.97, y: 8 }"
          :enter="{ opacity: 1, scale: 1, y: 0, transition: { duration: 800, ease: 'easeOut', delay: 100 } }"
          class="hero-preview border-default relative overflow-hidden rounded-2xl border shadow-[0_50px_100px_-30px_rgba(28,25,23,0.22)] dark:shadow-[0_50px_100px_-30px_rgba(0,0,0,0.7)]"
        >
          <div class="border-default bg-muted flex items-center gap-2 border-b px-4 py-3">
            <div class="flex gap-1.5">
              <div class="size-2.75 rounded-full bg-[#FF5F57]" />
              <div class="size-2.75 rounded-full bg-[#FEBC2E]" />
              <div class="size-2.75 rounded-full bg-[#28C840]" />
            </div>
            <div class="text-dimmed flex-1 text-center text-[11px]">weave-cv.app/editor/sara-chen</div>
          </div>
          <div class="grid h-120 grid-cols-[160px_1fr] lg:h-135">
            <div class="border-default bg-muted border-r p-3 text-xs">
              <div class="text-dimmed mb-2.5 text-[10px] font-semibold tracking-widest uppercase">
                {{ $t("hero.sections") }}
              </div>
              <div
                v-for="(sec, i) in sidebarSections"
                :key="sec"
                class="mb-1 cursor-pointer rounded-md px-2.5 py-2 transition-colors duration-150"
                :class="
                  i === 2
                    ? 'bg-primary-50 dark:bg-primary/15 text-primary font-semibold'
                    : 'text-toned hover:bg-primary-50 dark:hover:bg-primary/10'
                "
              >
                {{ sec }}
              </div>
              <div class="text-primary mt-4 cursor-pointer px-2.5 py-2 text-xs font-semibold">
                {{ $t("hero.addSection") }}
              </div>
            </div>
            <div class="bg-elevated dark:bg-default flex items-center justify-center p-5">
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
            </div>
          </div>
          <div
            class="animate-landing-float border-muted bg-default dark:bg-elevated absolute right-5 bottom-5 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs shadow-lg"
          >
            <span class="animate-landing-pulse inline-block size-2 rounded-full bg-emerald-500" />
            <span dir="auto" class="text-highlighted font-semibold">{{ $t("hero.savedAgo") }}</span>
          </div>
          <div
            dir="auto"
            class="border-muted bg-default dark:bg-elevated text-highlighted absolute top-14 right-5 flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-semibold shadow-lg"
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
          </div>
        </div>
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
