<script setup lang="ts">
import { CONTACT_EMAIL } from "~/constants/config"

definePageMeta({ layout: "landing" })

const { tm, rt, t } = useI18n()
useSeoMeta({
  title: () => t("seo.privacy.title"),
  description: () => t("seo.privacy.description")
})

interface Section {
  id: string
  title: string
  body: string
}

interface TldrItem {
  k: string
  v: string
}

const sections = computed<Section[]>(() => {
  const items = (tm("privacyPage.sections") as unknown as Section[]) || []
  return items.map((i) => ({
    ...i,
    body: rt(i.body),
    title: rt(i.title),
    id: rt(i.id)
  }))
})

const tldr = computed<TldrItem[]>(() => {
  const items = (tm("privacyPage.tldr") as unknown as TldrItem[]) || []
  return items.map((i) => ({
    ...i,
    k: rt(i.k),
    v: rt(i.v)
  }))
})

const activeSection = ref<string>("")

watch(
  sections,
  (newSections) => {
    if (activeSection.value === "" && newSections && newSections.length > 0) {
      activeSection.value = newSections[0]?.id || ""
    }
  },
  { immediate: true }
)

watch(
  sections,
  async (newSections) => {
    await nextTick()

    if (!newSections || newSections.length === 0) return

    if (!globalThis.IntersectionObserver) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) activeSection.value = e.target.id
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    )
    observer.disconnect()
    for (const s of newSections) {
      const el = document.querySelector(`#${s.id}`)
      if (el) observer.observe(el)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="relative overflow-clip">
    <div
      class="pointer-events-none absolute -top-60 -right-48 h-180 w-180 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.16),transparent_70%)] blur-[20px] dark:bg-[radial-gradient(circle,rgba(245,158,11,0.10),transparent_70%)]"
    />
    <section class="max-w-compact relative mx-auto px-6 pt-18 pb-14 lg:px-12">
      <div class="text-muted mb-6 flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.04em] uppercase">
        <span class="text-primary">◆</span>
        <span>{{ $t("privacyPage.badge") }}</span>
        <span class="opacity-40">/</span>
        <span>{{ $t("privacyPage.lastUpdated") }}</span>
      </div>
      <h1 class="text-highlighted mb-6 max-w-230 text-[clamp(48px,6vw,72px)] leading-none font-bold tracking-[-0.04em]">
        {{ $t("privacyPage.title") }}
      </h1>
      <p class="text-muted max-w-170 text-xl leading-relaxed">
        {{ $t("privacyPage.subtitle") }}
      </p>
    </section>
    <section class="max-w-compact mx-auto px-6 pb-14 lg:px-12">
      <div
        class="border-primary-200/60 dark:border-primary-400/20 bg-primary-50/60 dark:bg-primary-400/8 grid grid-cols-2 gap-6 rounded-2xl border px-8 py-7 lg:grid-cols-4"
      >
        <div v-for="item in tldr" :key="item.k">
          <div class="mb-2 flex items-center gap-2">
            <span class="text-primary text-sm">✓</span>
            <span class="text-highlighted text-sm font-bold">{{ item.k }}</span>
          </div>
          <p class="text-muted text-[13px] leading-relaxed">{{ item.v }}</p>
        </div>
      </div>
    </section>
    <section class="max-w-compact mx-auto px-6 pb-24 lg:px-12">
      <div class="grid gap-20 lg:grid-cols-[260px_1fr]">
        <aside class="lg:sticky lg:top-20 lg:self-start">
          <div class="text-highlighted mb-4 text-xs font-bold tracking-widest uppercase">
            {{ $t("privacyPage.contents") }}
          </div>
          <div class="flex flex-col gap-0.5">
            <a
              v-for="(s, i) in sections"
              :key="s.id"
              :href="`#${s.id}`"
              class="toc-link border-l-2 py-1.5 pl-3.5 text-[13px] leading-snug transition-colors duration-150"
              :class="
                activeSection === s.id
                  ? 'border-l-primary text-primary font-semibold'
                  : 'text-muted hover:text-highlighted border-l-transparent'
              "
            >
              <span class="me-2 text-[11px] opacity-60">{{ String(i + 1).padStart(2, "0") }}</span
              >{{ s.title }}
            </a>
          </div>
        </aside>
        <article class="text-highlighted max-w-180 text-base leading-[1.7]">
          <div v-for="(s, i) in sections" :id="s.id" :key="s.id" class="mb-14 scroll-mt-8">
            <div class="mb-4 flex items-baseline gap-3">
              <span class="text-primary text-[13px] font-semibold tracking-[0.04em]">{{
                String(i + 1).padStart(2, "0")
              }}</span>
              <h2 class="text-highlighted text-[28px] font-bold tracking-[-0.02em]">{{ s.title }}</h2>
            </div>
            <div class="text-muted whitespace-pre-wrap">{{ s.body }}</div>
          </div>

          <div
            class="text-muted dark:bg-muted mt-8 rounded-2xl border border-zinc-100 bg-zinc-50 p-7 text-sm leading-relaxed dark:border-zinc-800"
          >
            {{ $t("privacyPage.legalQuestion") }}
            <span class="text-primary">{{ CONTACT_EMAIL }}</span> — we read everything.
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
