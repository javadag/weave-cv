<script setup lang="ts">
import { CONTACT_EMAIL } from "~/constants/config"

definePageMeta({ layout: "landing" })

const { rt, tm, t } = useI18n()
useSeoMeta({
  title: () => t("seo.faq.title"),
  description: () => t("seo.faq.description")
})

const activeCat = ref("all")

interface FAQ {
  id: number
  cat: string
  q: string
  content: string
}

interface Category {
  id: string
  label: string
  icon: string
}

interface TopicCard {
  icon: string
  title: string
  body: string
  count: string
  cat: string
}

const faqs = computed<FAQ[]>(() => {
  const items = tm("faqPage.items") as unknown as FAQ[]

  if (!items || !Array.isArray(items)) return []

  return items.map((i) => ({
    cat: rt(i.cat),
    content: rt(i.content),
    id: Number(rt(String(i.id))),
    q: rt(i.q)
  }))
})

const cats = computed<Category[]>(() => {
  const t = (tm("faqPage.categories") as unknown as Category[]) || []
  return t.map((i) => ({
    icon: rt(i.icon),
    id: rt(i.id),
    label: rt(i.label)
  }))
})

const topicCards = computed<TopicCard[]>(() => {
  const t = (tm("faqPage.topics") as unknown as TopicCard[]) || []
  return t.map((i) => ({
    body: rt(i.body),
    icon: rt(i.icon),
    title: rt(i.title),
    count: rt(i.count),
    cat: rt(i.cat)
  }))
})

const visible = computed(() =>
  activeCat.value === "all" ? faqs.value : faqs.value.filter((f) => f.cat === activeCat.value)
)

function catCount(id: string) {
  return id === "all" ? faqs.value.length : faqs.value.filter((f) => f.cat === id).length
}
</script>

<template>
  <div class="relative overflow-hidden">
    <div
      class="pointer-events-none absolute -top-60 -right-48 h-180 w-180 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.16),transparent_70%)] blur-[20px] dark:bg-[radial-gradient(circle,rgba(245,158,11,0.10),transparent_70%)]"
    />
    <section class="max-w-compact relative mx-auto px-6 pt-18 pb-14 lg:px-12">
      <div class="text-muted text-2sm mb-6 flex items-center gap-2.5 font-semibold tracking-[0.04em] uppercase">
        <span class="text-primary">◆</span>
        <span>{{ $t("faqPage.badge") }}</span>
      </div>
      <Motion
        is="h1"
        :initial="{ opacity: 0, y: 14 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut' } }"
        class="text-highlighted mb-6 max-w-230 text-[clamp(48px,6vw,72px)] leading-none font-bold tracking-[-0.04em] rtl:leading-snug"
      >
        {{ $t("faqPage.title") }}<br />
        <span class="text-dimmed font-semibold">{{ $t("faqPage.subtitle") }}</span>
      </Motion>
      <p class="text-muted max-w-2xl text-xl leading-relaxed">
        {{ $t("faqPage.description") }}
      </p>
    </section>
    <section class="max-w-compact mx-auto px-6 pb-14 lg:px-12">
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <button
          v-for="c in topicCards"
          :key="c.cat"
          class="dark:bg-elevated rounded-2xl border border-zinc-100 bg-white p-6 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-[transform,border-color,box-shadow] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.75 hover:border-orange-500/25 hover:shadow-[0_16px_40px_-16px_rgba(28,25,23,0.12)] dark:border-zinc-800 dark:shadow-none dark:hover:border-amber-400/30 dark:hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)]"
          @click="activeCat = c.cat"
        >
          <div
            class="mb-3.5 flex size-10 items-center justify-center rounded-[10px] bg-linear-to-br from-orange-500 to-orange-700 text-[18px] font-bold text-white dark:from-amber-400 dark:to-amber-600"
          >
            <UIcon :name="c.icon" />
          </div>
          <div class="mb-1 text-[17px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{{ c.title }}</div>
          <div class="text-muted mb-3 text-sm leading-snug">{{ c.body }}</div>
          <div class="text-xs tracking-[0.04em] text-zinc-400 dark:text-zinc-500">{{ c.count }} →</div>
        </button>
      </div>
    </section>
    <section class="max-w-compact mx-auto px-6 pb-24 lg:px-12">
      <div class="grid gap-16 lg:grid-cols-[220px_1fr]">
        <aside class="lg:sticky lg:top-8 lg:self-start">
          <div class="text-highlighted mb-4 text-xs font-bold tracking-widest uppercase">
            {{ $t("faqPage.browse") }}
          </div>
          <div class="flex flex-col gap-1">
            <button
              v-for="c in cats"
              :key="c.id"
              class="toc-link flex items-center gap-2.5 border-l-2 py-1.5 pl-3.5 text-sm transition-colors duration-150"
              :class="
                activeCat === c.id
                  ? 'text-primary border-l-orange-600 font-semibold dark:border-l-amber-400'
                  : 'text-muted border-l-transparent hover:text-zinc-900 dark:hover:text-zinc-100'
              "
              @click="activeCat = c.id"
            >
              <span class="text-2sm opacity-70"><UIcon :name="c.icon" /></span>
              {{ c.label }}
              <span class="ml-auto text-xs text-zinc-400 dark:text-zinc-500">{{ catCount(c.id) }}</span>
            </button>
          </div>
          <div class="dark:bg-muted mt-10 rounded-2xl border border-zinc-100 bg-zinc-50 p-5 dark:border-zinc-800">
            <div class="text-highlighted mb-1.5 text-sm font-bold">{{ $t("faqPage.stillStuck") }}</div>
            <div class="text-muted text-2sm mb-3.5 leading-relaxed">{{ $t("faqPage.stillStuckDesc") }}</div>
            <ULink
              :href="`mailto:${CONTACT_EMAIL}`"
              class="text-primary text-2sm inline-flex items-center gap-1.5 font-semibold"
            >
              {{ CONTACT_EMAIL }} →
            </ULink>
          </div>
        </aside>
        <div>
          <div class="mb-6 flex items-baseline justify-between">
            <h2 class="text-[32px] font-bold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
              {{ activeCat === "all" ? $t("faqPage.allQuestions") : cats.find((c) => c.id === activeCat)?.label }}
            </h2>
            <span class="text-2sm text-zinc-400 dark:text-zinc-500">
              {{ visible.length }} {{ visible.length === 1 ? $t("faqPage.article") : $t("faqPage.articles") }}
            </span>
          </div>
          <div class="flex flex-col gap-3">
            <UAccordion
              trailing-icon="i-lucide-arrow-down"
              :items="visible"
              class="flex flex-col gap-4"
              :ui="{
                item: 'border last:border-b border-zinc-100 dark:border-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none transition-colors duration-200 hover:border-orange-500/20 dark:hover:border-amber-400/25 rounded-2xl bg-default dark:bg-elevated overflow-hidden',
                trigger: 'px-6'
              }"
            >
              <template #content="{ item }">
                <div class="text-muted pr-4 pb-5 pl-18 text-[15px] leading-relaxed">{{ item.content }}</div>
              </template>
              <template #leading="{ item }">
                <div class="flex w-full items-center gap-4 py-2 text-left">
                  <span class="text-muted min-w-8 text-xs">0{{ item.id }}</span>
                  <div class="text-highlighted text-[17px] font-semibold tracking-[-0.005em]">
                    {{ item.q }}
                  </div>
                </div>
              </template>
              <template #trailing>
                <div
                  class="text-muted flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-base font-bold transition-all duration-200 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-linear-to-br group-data-[state=open]:from-orange-500 group-data-[state=open]:to-orange-700 group-data-[state=open]:text-white dark:bg-zinc-800 group-data-[state=open]:dark:from-amber-400 group-data-[state=open]:dark:to-amber-600"
                >
                  +
                </div>
              </template>
            </UAccordion>
          </div>
        </div>
      </div>
    </section>
    <section class="max-w-compact mx-auto px-6 pb-24 lg:px-12">
      <div
        class="dark:bg-muted flex flex-wrap items-center justify-between gap-8 rounded-[20px] border border-zinc-100 bg-zinc-50 px-14 py-12 dark:border-zinc-800"
      >
        <div>
          <div class="text-primary mb-2.5 text-xs font-semibold tracking-[0.08em] uppercase">
            ◆ {{ $t("faqPage.stillStuck").toUpperCase() }}
          </div>
          <h3 class="mb-2 text-[32px] font-bold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
            {{ $t("faqPage.emailUs") }}
          </h3>
          <p class="text-muted max-w-120 text-base leading-relaxed">
            {{ $t("faqPage.emailDesc") }}
          </p>
        </div>
        <NuxtLink
          target="_blank"
          rel="noopener noreferrer"
          :href="`mailto:${CONTACT_EMAIL}`"
          class="inline-flex items-center gap-2 rounded-xl bg-linear-to-br from-orange-500 to-orange-700 px-7 py-4 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(234,88,12,0.5)] transition-transform duration-150 hover:-translate-y-px dark:from-amber-400 dark:to-amber-600 dark:shadow-none"
        >
          ✉ {{ CONTACT_EMAIL }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
