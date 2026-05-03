<script setup lang="ts">
import { CONTACT_EMAIL } from "~/constants/config"

definePageMeta({ layout: "landing" })

const { tm, rt, t } = useI18n()
useSeoMeta({
  title: () => t("seo.terms.title"),
  description: () => t("seo.terms.description")
})

interface Section {
  id: string
  title: string
  body: string
}

const sections = computed<Section[]>(() => {
  const items = (tm("termsPage.sections") as unknown as Section[]) || []
  return items.map((i) => ({
    body: rt(i.body),
    id: rt(i.id),
    title: rt(i.title)
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
      <div class="text-muted text-2sm mb-6 flex items-center gap-2.5 font-semibold tracking-[0.04em] uppercase">
        <span class="text-primary">◆</span>
        <span>{{ $t("termsPage.badge") }}</span>
        <span class="opacity-40">/</span>
        <span>{{ $t("termsPage.lastUpdated") }}</span>
      </div>
      <h1
        class="mb-6 max-w-230 text-[clamp(48px,6vw,72px)] leading-none font-bold tracking-[-0.04em] text-zinc-900 dark:text-zinc-50"
      >
        {{ $t("termsPage.title") }}
      </h1>
      <p class="text-muted max-w-170 text-xl leading-relaxed">
        {{ $t("termsPage.subtitle") }}
      </p>
    </section>
    <section class="max-w-compact mx-auto px-6 pb-14 lg:px-12">
      <div class="dark:bg-muted rounded-2xl border border-zinc-100 bg-zinc-50 px-9 py-8 dark:border-zinc-800">
        <div class="text-primary mb-3.5 text-xs font-semibold tracking-[0.08em] uppercase">
          ◆ {{ $t("termsPage.gistLabel") }}
        </div>
        <p class="text-highlighted max-w-205 text-[18px] leading-relaxed italic">
          {{ $t("termsPage.gist") }}
        </p>
      </div>
    </section>
    <section class="max-w-compact mx-auto px-6 pb-24 lg:px-12">
      <div class="grid gap-20 lg:grid-cols-[260px_1fr]">
        <aside class="lg:sticky lg:top-20 lg:self-start">
          <div class="text-highlighted mb-4 text-xs font-bold tracking-widest uppercase">
            {{ $t("termsPage.contents") }}
          </div>
          <div class="flex flex-col gap-0.5">
            <a
              v-for="(s, i) in sections"
              :key="s.id"
              :href="`#${s.id}`"
              class="toc-link text-2sm border-l-2 py-1.5 pl-3.5 leading-snug transition-colors duration-150"
              :class="
                activeSection === s.id
                  ? 'text-primary border-l-orange-600 font-semibold dark:border-l-amber-400'
                  : 'text-muted border-l-transparent hover:text-zinc-900 dark:hover:text-zinc-100'
              "
            >
              <span class="mr-2 text-[11px] opacity-60">{{ String(i + 1).padStart(2, "0") }}</span
              >{{ s.title }}
            </a>
          </div>
        </aside>
        <article class="max-w-180 text-base leading-[1.7] text-zinc-900 dark:text-zinc-50">
          <div v-for="(s, i) in sections" :id="s.id" :key="s.id" class="mb-14 scroll-mt-8">
            <div class="mb-4 flex items-baseline gap-3">
              <span class="text-primary text-2sm font-semibold tracking-[0.04em]">{{
                String(i + 1).padStart(2, "0")
              }}</span>
              <h2 class="text-[28px] font-bold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">{{ s.title }}</h2>
            </div>
            <div class="text-muted whitespace-pre-wrap">{{ s.body }}</div>
          </div>

          <div
            class="text-muted dark:bg-muted mt-8 rounded-2xl border border-zinc-100 bg-zinc-50 p-7 text-sm leading-relaxed dark:border-zinc-800"
          >
            {{ $t("termsPage.legalQuestion") }}
            <span class="text-primary">{{ CONTACT_EMAIL }}</span
            >.
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
