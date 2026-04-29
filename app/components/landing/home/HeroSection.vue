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
  <section class="relative overflow-hidden bg-default py-16 lg:py-20">
    <div
      class="pointer-events-none absolute -top-60 -right-48 size-[720px] rounded-full blur-2xl bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-primary-400)_18%,transparent),transparent_70%)]"
    />
    <div
      class="pointer-events-none absolute top-60 -left-72 size-[600px] rounded-full blur-2xl bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-primary-200)_36%,transparent),transparent_70%)] dark:bg-[radial-gradient(circle,color-mix(in_srgb,var(--ui-primary)_6%,transparent),transparent_70%)]"
    />
    <div class="relative mx-auto max-w-compact px-6 lg:px-12">
      <div class="grid items-center gap-14 lg:grid-cols-2">
        <div class="flex flex-col">
          <div
            v-motion
            :initial="{ opacity: 0, y: 14 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut' } }"
          >
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-primary-200 dark:border-primary/25 bg-primary-50 dark:bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
            >
              <span class="animate-landing-pulse inline-block size-1.5 rounded-full bg-primary" />
              {{ $t("hero.badge", { version: APP_VERSION }) }}
            </span>
          </div>
          <h1
            v-motion
            :initial="{ opacity: 0, y: 14 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut', delay: 80 } }"
            class="mt-6 text-[3.5rem] font-bold leading-[1.05] tracking-[-0.04em] text-highlighted lg:text-[4.5rem] text-balance"
          >
            {{ $t("hero.titleStart") }}
            <span class="bg-gradient-to-br from-brand-gradient-from to-brand-gradient-to bg-clip-text text-transparent">
              {{ $t("hero.titleHighlight") }}
            </span>
          </h1>
          <p
            v-motion
            :initial="{ opacity: 0, y: 14 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut', delay: 160 } }"
            class="mt-6 max-w-[540px] text-lg leading-relaxed text-muted"
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
              class="hero-btn-primary inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(234,88,12,0.5)] dark:shadow-none no-underline"
            >
              <span>✦</span> {{ $t("hero.buildBtn") }}
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              class="inline-flex items-center rounded-xl border border-muted bg-muted px-6 py-3.5 text-[15px] font-semibold text-highlighted no-underline transition-colors duration-200 hover:bg-elevated hover:border-accented"
            >
              {{ $t("hero.browseBtn") }}
            </NuxtLink>
          </div>
          <div
            v-motion
            :initial="{ opacity: 0, y: 14 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut', delay: 320 } }"
            class="mt-9 flex flex-wrap gap-6 text-sm text-muted"
          >
            <div v-for="t in trustBadges" :key="t" class="flex items-center gap-1.5">
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
              {{ t }}
            </div>
          </div>
        </div>
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.97, y: 8 }"
          :enter="{ opacity: 1, scale: 1, y: 0, transition: { duration: 800, ease: 'easeOut', delay: 100 } }"
          class="hero-preview relative overflow-hidden rounded-2xl border border-default shadow-[0_50px_100px_-30px_rgba(28,25,23,0.22)] dark:shadow-[0_50px_100px_-30px_rgba(0,0,0,0.7)]"
        >
          <div class="flex items-center gap-2 border-b border-default bg-muted px-4 py-3">
            <div class="flex gap-1.5">
              <div class="size-[11px] rounded-full bg-[#FF5F57]" />
              <div class="size-[11px] rounded-full bg-[#FEBC2E]" />
              <div class="size-[11px] rounded-full bg-[#28C840]" />
            </div>
            <div class="flex-1 text-center text-[11px] text-dimmed">weave-cv.app/editor/sara-chen</div>
          </div>
          <div class="grid h-[480px] grid-cols-[160px_1fr] lg:h-[540px]">
            <div class="border-r border-default bg-muted p-3 text-xs">
              <div class="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-dimmed">
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
              <div class="mt-4 cursor-pointer px-2.5 py-2 text-xs font-semibold text-primary">
                {{ $t("hero.addSection") }}
              </div>
            </div>
            <div class="flex items-center justify-center bg-elevated dark:bg-default p-5">
              <div
                class="flex w-full max-w-[300px] flex-col gap-2.5 rounded-sm bg-white p-5 shadow-sm aspect-[0.77] font-sans text-gray-800"
              >
                <div>
                  <div class="text-[18px] font-bold tracking-[-0.02em] text-slate-950">Sara Chen</div>
                  <div class="text-[9px] text-slate-500 mt-0.5">Senior Product Designer</div>
                  <div class="flex gap-1.5 mt-1.5 text-[7px] text-slate-400">
                    <span>sara.chen@mail.com</span><span>·</span><span>San Francisco</span>
                  </div>
                </div>
                <div class="h-px bg-slate-200" />
                <div>
                  <div class="text-[7px] font-bold text-primary-600 tracking-[0.1em] mb-[5px]">EXPERIENCE</div>
                  <div class="mb-1.5">
                    <div class="flex justify-between">
                      <div class="text-[8.5px] font-bold text-slate-950">Senior Designer · Linear</div>
                      <div class="text-[7px] text-slate-500">2023 — Now</div>
                    </div>
                    <div class="mt-[3px] h-[3px] bg-slate-100 rounded-[1px] w-[88%]" />
                    <div class="mt-0.5 h-[3px] bg-slate-100 rounded-[1px] w-[72%]" />
                  </div>
                  <div>
                    <div class="flex justify-between">
                      <div class="text-[8.5px] font-bold text-slate-950">Product Designer · Stripe</div>
                      <div class="text-[7px] text-slate-500">2020 — 2023</div>
                    </div>
                    <div class="mt-[3px] h-[3px] bg-slate-100 rounded-[1px] w-[90%]" />
                    <div class="mt-0.5 h-[3px] bg-slate-100 rounded-[1px] w-[65%]" />
                  </div>
                </div>
                <div>
                  <div class="text-[7px] font-bold text-primary-600 tracking-[0.1em] mb-[5px]">EDUCATION</div>
                  <div class="flex justify-between">
                    <div class="text-[8.5px] font-bold text-slate-950">BFA, Visual Design · RISD</div>
                    <div class="text-[7px] text-slate-500">2016 — 2020</div>
                  </div>
                </div>
                <div>
                  <div class="text-[7px] font-bold text-primary-600 tracking-[0.1em] mb-[5px]">SKILLS</div>
                  <div class="flex flex-wrap gap-[3px]">
                    <span
                      v-for="s in skillChips"
                      :key="s"
                      class="text-[6.5px] px-1.5 py-0.5 bg-slate-100 text-slate-950 rounded-[3px]"
                      >{{ s }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="animate-landing-float absolute bottom-5 right-5 flex items-center gap-2 rounded-xl border border-muted bg-default dark:bg-elevated px-3.5 py-2.5 text-xs shadow-lg"
          >
            <span class="animate-landing-pulse inline-block size-2 rounded-full bg-emerald-500" />
            <span class="font-semibold text-highlighted">{{ $t("hero.savedAgo") }}</span>
          </div>
          <div
            class="absolute right-5 top-14 flex items-center gap-1.5 rounded-xl border border-muted bg-default dark:bg-elevated px-3 py-2 text-[11px] font-semibold text-highlighted shadow-lg"
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
