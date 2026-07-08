<script setup lang="ts">
const { t } = useI18n()
const quickStats = computed(() => [t("cta.stat1"), t("cta.stat2"), t("cta.stat3")])
</script>

<template>
  <section class="bg-default px-6 pb-20 sm:pb-28 lg:px-12">
    <div class="max-w-compact mx-auto">
      <div
        class="from-primary-700 to-primary-500 dark:from-primary-600 dark:to-primary-400 relative overflow-hidden rounded-3xl bg-linear-to-br px-8 py-20 text-center shadow-[0_40px_80px_-30px_rgba(234,88,12,0.45)] transition-transform duration-500 hover:scale-[100.4%] sm:px-14 sm:py-24 dark:shadow-[0_40px_80px_-30px_rgba(245,158,11,0.3)]"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(255,255,255,0.22),transparent_45%),radial-gradient(circle_at_82%_75%,rgba(255,255,255,0.14),transparent_45%)]"
        />
        <div class="bg-grid-white pointer-events-none absolute inset-0 opacity-[0.08]" />
        <div
          class="cta-float-l pointer-events-none absolute top-10 left-10 hidden items-center gap-2.5 rounded-xl bg-white/95 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.15)] sm:flex"
        >
          <div class="flex size-7 items-center justify-center rounded-md bg-emerald-500 text-sm font-bold text-white">
            ✓
          </div>
          <div class="text-left">
            <div class="text-xs font-bold text-slate-900">{{ $t("cta.resumeExported") }}</div>
            <div class="text-[10px] text-slate-500">sara-chen.pdf · 142 KB</div>
          </div>
        </div>
        <div
          class="cta-float-r pointer-events-none absolute right-12 bottom-6 hidden items-center gap-2.5 rounded-xl bg-white/95 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.15)] sm:flex"
        >
          <div class="bg-primary-700 flex size-7 items-center justify-center rounded-md text-sm font-bold text-white">
            ★
          </div>
          <div class="text-left">
            <div class="text-xs font-bold text-slate-900">{{ $t("cta.atsScore") }}</div>
            <div class="text-[10px] text-slate-500">{{ $t("cta.keywords") }}</div>
          </div>
        </div>
        <div class="relative">
          <span
            class="mb-6 inline-flex items-center gap-1.5 rounded-full bg-white/18 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-sm"
          >
            <span class="cta-pulse inline-block size-1.5 rounded-full bg-white" />
            {{ $t("cta.badge") }}
          </span>
          <h2
            class="mt-0 text-4xl leading-none font-extrabold tracking-[-0.035em] text-balance text-white sm:text-5xl lg:text-[4rem]"
          >
            {{ $t("cta.titleLine1") }}<br />{{ $t("cta.titleLine2") }}
          </h2>
          <p class="mx-auto mt-5 max-w-130 text-lg leading-relaxed text-white/90">
            {{ $t("cta.subtitle") }}
          </p>
          <div class="mt-10 flex flex-wrap justify-center gap-3">
            <NuxtLink
              to="/dashboard"
              class="cta-btn-primary cta-btn-pulse text-primary-700 inline-flex items-center gap-2 rounded-xl bg-white px-9 py-4.5 text-base font-bold no-underline shadow-[0_12px_32px_-8px_rgba(0,0,0,0.25)]"
            >
              <span>✦</span> {{ $t("cta.buildBtn") }}
            </NuxtLink>
          </div>
          <div class="mt-7 flex flex-wrap justify-center gap-6 text-sm font-medium text-white/90">
            <span v-for="s in quickStats" :key="s">{{ s }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-btn-primary {
  transition:
    transform 0.18s ease,
    filter 0.18s ease;
}
.cta-btn-primary:hover {
  transform: translateY(-1px);
  filter: brightness(1.03);
}
.cta-btn-pulse {
  animation: cta-btn-glow 3s ease-in-out infinite;
}
@keyframes cta-btn-glow {
  0%,
  100% {
    box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.2);
  }
  50% {
    box-shadow: 0 12px 40px -4px rgba(0, 0, 0, 0.35);
  }
}
.cta-float-l {
  animation: cta-float-left 5s ease-in-out infinite;
}
.cta-float-r {
  animation: cta-float-right 5s ease-in-out infinite;
  animation-delay: 1s;
}
.cta-pulse {
  animation: landing-pulse 2.4s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .cta-float-l,
  .cta-float-r,
  .cta-pulse {
    animation: none;
  }
}
</style>
