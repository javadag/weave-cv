<script setup lang="ts">
import { CONTACT_EMAIL } from "~/constants/config"

definePageMeta({ layout: "landing" })

useSeoMeta({
  title: "About — Weave CV",
  description: "One person, one idea: résumé tools shouldn't paywall the unemployed."
})

const team = [
  {
    name: "Javad Aghebati",
    role: "Design & front-end",
    loc: "127.0.0.1",
    bio: "Spent five years in the tech industry. I'm a front-end developer, and a lifelong learner.",
    initials: "JA",
    gh: "javadag"
  }
]

const whyFree = [
  {
    n: "01",
    t: "It's cheap to run.",
    b: "A résumé builder is a glorified PDF renderer. The infrastructure runs on free or low-cost hardware. we cover it ourselves."
  },
  {
    n: "02",
    t: "No VC, no growth pressure.",
    b: "We took zero outside money. There's no board meeting where someone asks why I don't have a Pro tier. answer to no one but the people using the product."
  },
  {
    n: "03",
    t: "Built with a free-software mindset.",
    b: "Weave CV doesn't need to pay my salary. It just needs to keep working."
  }
]

const trustStats = [
  { k: "Data hosting", v: "EU only", d: "Hetzner, Frankfurt" },
  { k: "Trackers", v: "Zero", d: "No analytics, no ads, ever" },
  { k: "Active since", v: "2025", d: "Quietly shipping every month" }
]

const contacts = [{ l: "General", e: `${CONTACT_EMAIL}`, d: "Anything and everything" }]
</script>

<template>
  <div class="relative overflow-hidden">
    <div
      class="pointer-events-none absolute -right-48 -top-60 h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.16),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(245,158,11,0.10),transparent_70%)] blur-[20px]"
    />
    <div
      class="pointer-events-none absolute -left-72 top-80 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(254,215,170,0.32),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(234,88,12,0.06),transparent_70%)] blur-[20px]"
    />
    <section class="relative mx-auto max-w-compact px-6 pb-16 pt-24 lg:px-12">
      <div
        class="animate-fade-up mb-6 flex items-center gap-2.5 font-mono text-[13px] font-semibold uppercase tracking-[0.04em] text-muted"
      >
        <span class="text-primary">◆</span>
        <span>About / Trust</span>
      </div>
      <h1
        class="animate-fade-up mb-8 max-w-[1100px] text-[clamp(48px,7vw,88px)] font-bold leading-[0.98] tracking-[-0.045em] text-highlighted"
      >
        One person, one idea:
        <span class="bg-gradient-to-br from-brand-gradient-from to-brand-gradient-to bg-clip-text text-transparent">
          résumé tools shouldn't paywall the unemployed.
        </span>
      </h1>
      <p class="max-w-[720px] text-xl leading-relaxed text-muted">
        I built Weave CV in evenings and weekends because every other résumé builder we tried wanted $20/month from
        people who, by definition, were between paychecks. So made one that's free, forever.
      </p>
    </section>
    <section class="mx-auto max-w-compact px-6 pb-20 lg:px-12">
      <div class="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-primary">◆ WHO BUILT IT</div>
      <div class="grid gap-6 lg:grid-cols-2">
        <div
          v-for="p in team"
          :key="p.name"
          class="flex gap-6 rounded-[20px] border border-zinc-100 dark:border-zinc-800 bg-default dark:bg-elevated) p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none"
        >
          <div
            class="flex size-[88px] shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-primary-500 to-primary-700 text-3xl font-bold tracking-tight text-white shadow-[0_8px_24px_-8px_rgba(234,88,12,0.4)] dark:shadow-none font-serif"
          >
            {{ p.initials }}
          </div>
          <div class="flex-1">
            <div class="mb-1 flex items-baseline gap-2.5">
              <h3 class="text-[22px] font-bold tracking-[-0.015em] text-zinc-900 dark:text-zinc-50">{{ p.name }}</h3>
              <span class="font-mono text-[13px] text-muted">· {{ p.loc }}</span>
            </div>
            <div class="mb-3.5 text-sm font-semibold text-primary">{{ p.role }}</div>
            <p class="text-[15px] leading-relaxed text-muted">{{ p.bio }}</p>
            <div class="mt-4 flex gap-2.5 font-mono text-xs text-toned">
              <NuxtLink
                :href="`https://github.com/${p.gh}`"
                target="_blank"
                rel="noopener"
                class="relative transition-colors duration-200 text-default after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-primary-600 dark:after:bg-primary-400 after:transition-[width] after:duration-[220ms] hover:after:w-full"
                >github.com/{{ p.gh }}</NuxtLink
              >
              <span class="opacity-40">·</span>
              <NuxtLink
                :href="`mailto:${CONTACT_EMAIL}`"
                class="relative transition-colors duration-200 text-default after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-primary-600 dark:after:bg-primary-400 after:transition-[width] after:duration-[220ms] hover:after:w-full"
                >{{ CONTACT_EMAIL }}</NuxtLink
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="border-y border-default bg-muted">
      <div class="mx-auto max-w-compact px-6 py-24 lg:px-12">
        <div class="grid gap-20 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div class="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-primary">
              ◆ WHY IT'S FREE
            </div>
            <h2 class="max-w-[380px] text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-highlighted">
              Because charging job seekers feels gross.
            </h2>
          </div>
          <div class="flex flex-col gap-7">
            <div v-for="item in whyFree" :key="item.n" class="flex gap-6">
              <span class="min-w-[32px] font-mono text-sm font-semibold text-primary">{{ item.n }}</span>
              <div class="flex-1">
                <h3 class="mb-1.5 text-xl font-bold tracking-[-0.01em] text-highlighted">
                  {{ item.t }}
                </h3>
                <p class="text-base leading-relaxed text-muted">{{ item.b }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="mx-auto max-w-compact px-6 py-20 lg:px-12">
      <div class="flex flex-wrap gap-5 w-full">
        <div
          v-for="s in trustStats"
          :key="s.k"
          class="rounded-2xl border flex-1 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-elevated p-6"
        >
          <div class="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
            {{ s.k }}
          </div>
          <div class="mb-2 font-serif text-[36px] font-bold leading-none tracking-[-0.025em] text-highlighted">
            {{ s.v }}
          </div>
          <div class="text-[13px] leading-relaxed text-muted">{{ s.d }}</div>
        </div>
      </div>
    </section>
    <section class="mx-auto max-w-compact px-6 pb-28 lg:px-12">
      <div
        class="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary-700 to-primary-500 dark:from-primary-600 dark:to-primary-400 p-[72px_56px] shadow-[0_40px_80px_-30px_rgba(234,88,12,0.45)] dark:shadow-[0_40px_80px_-30px_rgba(245,158,11,0.3)]"
      >
        <div class="pointer-events-none absolute inset-0 opacity-[0.08] bg-grid-white" />

        <div class="relative grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div class="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-white/85">
              ◆ GET IN TOUCH
            </div>
            <h2 class="mb-4 text-[clamp(40px,5vw,56px)] font-bold leading-[1.0] tracking-[-0.035em] text-white">
              Say hello.
            </h2>
            <p class="max-w-[420px] text-lg leading-relaxed text-white/90">
              Bug reports, feature ideas, complaints, compliments — anything. We read every email and reply within 48
              hours.
            </p>
          </div>
          <div class="flex flex-col gap-3.5">
            <a
              v-for="c in contacts"
              :key="c.l"
              :href="`mailto:${c.e}`"
              class="flex items-center justify-between gap-4 rounded-xl border border-white/20 bg-white/12 px-5 py-4 backdrop-blur-sm transition-colors duration-150 hover:bg-white/20"
            >
              <div>
                <div class="mb-1 text-xs font-semibold uppercase tracking-[0.05em] text-white/70">{{ c.l }}</div>
                <div class="text-[13px] text-white/85">{{ c.d }}</div>
              </div>
              <div class="shrink-0 font-mono text-sm font-semibold text-white">{{ c.e }}</div>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
