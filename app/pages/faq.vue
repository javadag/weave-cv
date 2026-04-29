<script setup lang="ts">
import { CONTACT_EMAIL, MAX_RESUMES } from "~/constants/config"

definePageMeta({ layout: "landing" })

useSeoMeta({
  title: "Help & FAQ — Weave CV",
  description: "Answers to the most common questions about exporting, editing, templates, and your account."
})

const activeCat = ref("all")

interface FAQ {
  id: number
  cat: string
  q: string
  content: string
}

const faqs: FAQ[] = [
  {
    id: 1,
    cat: "export",
    q: "How do I export my résumé as a PDF?",
    content:
      "Hit the <strong>Download</strong> button at the top right of the editor, The same file is what recruiters and ATS systems will see."
  },
  {
    id: 2,
    cat: "editing",
    q: "Can I add custom sections that aren't in the template?",
    content: "Not currently. However, you can modify existing sections and add additional ones as needed."
  },
  {
    id: 3,
    cat: "editing",
    q: "How do I switch between one-column and two-column layouts?",
    content:
      "Open the <strong>Layout</strong> panel. Toggle <strong>Two columns</strong> on and choose which sections live in the sidebar. The change is non-destructive — toggle back any time without losing content."
  },
  {
    id: 4,
    cat: "templates",
    q: "Can I switch templates without re-typing everything?",
    content:
      "Yes — your content lives separately from the template. Open <strong>Templates</strong> in the toolbar, hover any template, and click <strong>Try this</strong>."
  },
  {
    id: 5,
    cat: "templates",
    q: "Are all templates ATS-friendly?",
    content:
      "Yes. Every template uses standard PDF text (not images), proper section headings, and a single linear reading order under the hood — even the two-column ones."
  },
  {
    id: 6,
    cat: "account",
    q: "How many résumés can I have on the free plan?",
    content: `Up to ${MAX_RESUMES} active résumés per account, each with unlimited revisions. There's no premium plan that unlocks more — if you need a fourth, delete one you're not using.`
  },
  {
    id: 7,
    cat: "account",
    q: "Where is my data stored, and can I delete it?",
    content:
      "Your résumés are stored on our servers in the EU (Frankfurt). You can delete any individual résumé at any time, or wipe your whole account from <strong>Settings → Account → Delete account</strong>. Deletion is permanent and immediate — we don't hold soft copies."
  },
  {
    id: 8,
    cat: "editing",
    q: "Can I work on my résumé offline?",
    content:
      "Partially. The editor caches your current document so you can keep editing without a connection — changes sync the moment you're back online. Exports require a connection (we render PDFs server-side for consistent fonts)."
  },
  {
    id: 9,
    cat: "export",
    q: "Can I export to Word (.docx) or plain text?",
    content:
      "Not yet. We deliberately ship only PDF for now — it's the only format where what you see is exactly what the recruiter gets. Word export is on the roadmap for late 2026."
  }
]

const cats = [
  { id: "all", label: "All", icon: "i-lucide-all" },
  { id: "export", label: "Exporting", icon: "i-lucide-download" },
  { id: "editing", label: "Editing", icon: "i-lucide-edit" },
  { id: "templates", label: "Templates", icon: "i-lucide-table-cells-merge" },
  { id: "account", label: "Account", icon: "i-lucide-user" }
]

const topicCards = [
  {
    icon: "i-lucide-download",
    title: "Exporting",
    body: "PDF, fonts, page breaks",
    count: "3 articles",
    cat: "export"
  },
  { icon: "i-lucide-edit", title: "Editing", body: "Sections, layout, content", count: "3 articles", cat: "editing" },
  {
    icon: "i-lucide-table-cells-merge",
    title: "Templates",
    body: "Switching, ATS, custom",
    count: "2 articles",
    cat: "templates"
  },
  {
    icon: "i-lucide-user",
    title: "Account & data",
    body: "Storage, deletion, plans",
    count: "2 articles",
    cat: "account"
  }
]

const visible = computed(() => (activeCat.value === "all" ? faqs : faqs.filter((f) => f.cat === activeCat.value)))

function catCount(id: string) {
  return id === "all" ? faqs.length : faqs.filter((f) => f.cat === id).length
}
</script>

<template>
  <div class="relative overflow-hidden">
    <div
      class="pointer-events-none absolute -right-48 -top-60 h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.16),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(245,158,11,0.10),transparent_70%)] blur-[20px]"
    />
    <section class="relative mx-auto max-w-compact px-6 pb-14 pt-18 lg:px-12">
      <div
        class="mb-6 flex items-center gap-2.5 font-mono text-[13px] font-semibold uppercase tracking-[0.04em] text-muted"
      >
        <span class="text-primary">◆</span>
        <span>Help center</span>
      </div>
      <h1
        class="mb-6 max-w-[920px] text-[clamp(48px,6vw,72px)] font-bold leading-[1.0] tracking-[-0.04em] text-highlighted"
      >
        Stuck on something?<br />
        <span class="font-semibold text-dimmed">Start here.</span>
      </h1>
      <p class="max-w-2xl text-xl leading-relaxed text-muted">
        Ten questions cover almost everything. If you can&#8217;t find what you need, email us — a real human reads
        every message.
      </p>
    </section>
    <section class="mx-auto max-w-compact px-6 pb-14 lg:px-12">
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <button
          v-for="c in topicCards"
          :key="c.cat"
          class="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-(--ui-bg-elevated) p-6 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none transition-[transform,border-color,box-shadow] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] hover:border-orange-500/25 hover:shadow-[0_16px_40px_-16px_rgba(28,25,23,0.12)] dark:hover:border-amber-400/30 dark:hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)]"
          @click="activeCat = c.cat"
        >
          <div
            class="mb-3.5 flex size-10 items-center justify-center rounded-[10px] bg-gradient-to-br from-orange-500 to-orange-700 dark:from-amber-400 dark:to-amber-600 text-[18px] text-white font-bold"
          >
            <UIcon :name="c.icon" />
          </div>
          <div class="mb-1 text-[17px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{{ c.title }}</div>
          <div class="mb-3 text-sm leading-snug text-muted">{{ c.body }}</div>
          <div class="font-mono text-xs tracking-[0.04em] text-zinc-400 dark:text-zinc-500">{{ c.count }} →</div>
        </button>
      </div>
    </section>
    <section class="mx-auto max-w-compact px-6 pb-24 lg:px-12">
      <div class="grid gap-16 lg:grid-cols-[220px_1fr]">
        <aside class="lg:sticky lg:top-8 lg:self-start">
          <div class="mb-4 font-mono text-xs font-bold uppercase tracking-[0.1em] text-highlighted">Browse</div>
          <div class="flex flex-col gap-1">
            <button
              v-for="c in cats"
              :key="c.id"
              class="toc-link flex items-center gap-2.5 border-l-2 py-1.5 pl-3.5 text-sm transition-colors duration-150"
              :class="
                activeCat === c.id
                  ? 'border-l-orange-600 dark:border-l-amber-400 font-semibold text-primary'
                  : 'border-l-transparent text-muted hover:text-zinc-900 dark:hover:text-zinc-100'
              "
              @click="activeCat = c.id"
            >
              <span class="text-[13px] opacity-70"><UIcon :name="c.icon" /></span>
              {{ c.label }}
              <span class="ml-auto font-mono text-xs text-zinc-400 dark:text-zinc-500">{{ catCount(c.id) }}</span>
            </button>
          </div>
          <div
            class="mt-10 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-(--ui-bg-muted) p-5"
          >
            <div class="mb-1.5 text-sm font-bold text-highlighted">Still stuck?</div>
            <div class="mb-3.5 text-[13px] leading-relaxed text-muted">We answer every email within 48 hours.</div>
            <ULink
              :href="`mailto:${CONTACT_EMAIL}`"
              class="inline-flex items-center gap-1.5 font-mono text-[13px] font-semibold text-primary"
            >
              {{ CONTACT_EMAIL }} →
            </ULink>
          </div>
        </aside>
        <div>
          <div class="mb-6 flex items-baseline justify-between">
            <h2 class="text-[32px] font-bold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
              {{ activeCat === "all" ? "All questions" : cats.find((c) => c.id === activeCat)?.label }}
            </h2>
            <span class="font-mono text-[13px] text-zinc-400 dark:text-zinc-500">
              {{ visible.length }} {{ visible.length === 1 ? "article" : "articles" }}
            </span>
          </div>
          <div class="flex flex-col gap-3">
            <UAccordion
              trailing-icon="i-lucide-arrow-down"
              :items="visible"
              class="gap-4 flex flex-col"
              :ui="{
                item: 'border last:border-b border-zinc-100 dark:border-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none transition-colors duration-200 hover:border-orange-500/20 dark:hover:border-amber-400/25 rounded-2xl bg-default dark:bg-elevated overflow-hidden',
                trigger: 'px-6'
              }"
            >
              <template #content="{ item }">
                <div class="pl-[72px] pr-4 pb-5 text-[15px] leading-relaxed text-muted" v-html="item.content" />
              </template>
              <template #leading="{ item }">
                <div class="flex w-full items-center gap-4 py-2 text-left">
                  <span class="min-w-8 font-mono text-xs text-muted">0{{ item.id }}</span>
                  <div class="flex-1 text-[17px] font-semibold tracking-[-0.005em] text-highlighted">
                    {{ item.q }}
                  </div>
                </div>
              </template>
              <template #trailing>
                <div
                  class="flex size-7 flex-shrink-0 items-center justify-center rounded-lg text-base font-bold transition-all duration-200 bg-zinc-100 dark:bg-zinc-800 text-muted group-data-[state=open]:rotate-45 group-data-[state=open]:from-orange-500 group-data-[state=open]:to-orange-700 group-data-[state=open]:dark:from-amber-400 group-data-[state=open]:dark:to-amber-600 group-data-[state=open]:text-white group-data-[state=open]:bg-gradient-to-br"
                >
                  +
                </div>
              </template>
            </UAccordion>
          </div>
        </div>
      </div>
    </section>
    <section class="mx-auto max-w-compact px-6 pb-24 lg:px-12">
      <div
        class="flex flex-wrap items-center justify-between gap-8 rounded-[20px] border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-(--ui-bg-muted) px-14 py-12"
      >
        <div>
          <div class="mb-2.5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            ◆ STILL STUCK?
          </div>
          <h3 class="mb-2 text-[32px] font-bold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
            Email us. A human will reply.
          </h3>
          <p class="max-w-[480px] text-base leading-relaxed text-muted">
            ~48h average response. Bug reports, feature ideas, or just a hello — all welcome.
          </p>
        </div>
        <NuxtLink
          target="_blank"
          rel="noopener noreferrer"
          :href="`mailto:${CONTACT_EMAIL}`"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 dark:from-amber-400 dark:to-amber-600 px-7 py-4 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(234,88,12,0.5)] dark:shadow-none transition-transform duration-150 hover:-translate-y-px"
        >
          ✉ {{ CONTACT_EMAIL }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
