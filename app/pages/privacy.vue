<script setup lang="ts">
import { CONTACT_EMAIL } from "~/constants/config"

definePageMeta({ layout: "landing" })

useSeoMeta({
  title: "Privacy Policy — Weave CV",
  description: "What we collect, what we don't, and what you can do about it."
})

const sections = [
  {
    id: "overview",
    title: "Overview",
    body: `<p>This Privacy Policy explains what data Weave CV collects, how we use it, and what choices you have. We wrote it in plain English on purpose — if anything is unclear, email <code>${CONTACT_EMAIL}</code> and we'll rewrite it.</p>
<p>The short version: <strong>we only collect what we need to make the product work</strong>, we never sell your data, we never train AI models on it, and you can delete everything at any time.</p>`
  },
  {
    id: "collected",
    title: "What we collect",
    body: `<p>We collect three categories of data:</p>
<ul>
  <li><strong>Account data</strong> — your email address and a hashed password, or a Google/GitHub OAuth identifier if you sign in that way.</li>
  <li><strong>Résumé content</strong> — everything you type into the editor (work history, education, skills, contact details).</li>
  <li><strong>Usage data</strong> — anonymized page views, error logs, and which template you used. We do not use third-party analytics; this is collected by our own server.</li>
</ul>
<p>We do <strong>not</strong> collect: precise location, contacts, browser history, advertising identifiers, or any data from cookies beyond the one session cookie that keeps you logged in.</p>`
  },
  {
    id: "use",
    title: "How we use it",
    body: `<p>Your account data lets you log in. Your résumé content is rendered into the editor and exported as PDFs when you ask for one. Usage data helps us fix bugs and decide what to build next.</p>
<p><strong>We do not</strong> use your résumé content to train machine-learning models, share it with partners, sell it to recruiters, or surface it in search.</p>`
  },
  {
    id: "rights",
    title: "Your rights",
    body: `<p>Under the GDPR (and equivalent laws elsewhere), you have the right to:</p>
<ul>
  <li><strong>Rectify</strong> — edit anything in the editor, any time.</li>
  <li><strong>Delete</strong> — wipe individual résumés or your whole account from <code>Settings → Account</code>. Deletion is immediate and permanent.</li>
  <li><strong>Object</strong> — opt out of any non-essential processing by emailing us.</li>
</ul>`
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: `<p>Active résumés are kept until you delete them. Account data is kept until you delete your account.</p>
<p>If you don't log in for 24 months, we send you a reminder email. If you don't respond within 30 days, we delete the account.</p>`
  },
  {
    id: "cookies",
    title: "Cookies & tracking",
    body: `<p>We use exactly one cookie: <code>weave_session</code>, a first-party session token that keeps you signed in. It expires after 30 days of inactivity.</p>
<p>No advertising cookies, no third-party trackers, no fingerprinting, no Google Analytics.</p>`
  }
]

const activeSection = ref(sections[0]?.id)

const tldr = [
  { k: "No selling", v: "We don't sell or rent your data — full stop." },
  { k: "No AI training", v: "Your résumé never trains a model." },
  { k: "EU hosting", v: "Encrypted at rest in Frankfurt, Germany." },
  { k: "One-click delete", v: "Wipe your account permanently any time." }
]

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) activeSection.value = e.target.id
      }
    },
    { rootMargin: "-30% 0px -60% 0px" }
  )
  for (const s of sections) {
    const el = document.querySelector(s.id)
    if (el) observer.observe(el)
  }
})
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
        <span>Legal</span>
        <span class="opacity-40">/</span>
        <span>Last updated April 12, 2026</span>
      </div>
      <h1
        class="mb-6 max-w-[920px] text-[clamp(48px,6vw,72px)] font-bold leading-[1.0] tracking-[-0.04em] text-highlighted"
      >
        Privacy Policy
      </h1>
      <p class="max-w-[680px] text-xl leading-relaxed text-muted">
        What we collect, what we don't, and what you can do about it. No dark patterns, no hidden defaults.
      </p>
    </section>
    <section class="mx-auto max-w-compact px-6 pb-14 lg:px-12">
      <div
        class="grid grid-cols-2 gap-6 rounded-2xl border border-primary-200/60 dark:border-primary-400/20 bg-primary-50/60 dark:bg-primary-400/[0.08] px-8 py-7 lg:grid-cols-4"
      >
        <div v-for="item in tldr" :key="item.k">
          <div class="mb-2 flex items-center gap-2">
            <span class="text-sm text-primary">✓</span>
            <span class="text-sm font-bold text-highlighted">{{ item.k }}</span>
          </div>
          <p class="text-[13px] leading-relaxed text-muted">{{ item.v }}</p>
        </div>
      </div>
    </section>
    <section class="mx-auto max-w-compact px-6 pb-24 lg:px-12">
      <div class="grid gap-20 lg:grid-cols-[260px_1fr]">
        <aside class="lg:sticky lg:top-8 lg:self-start">
          <div class="mb-4 font-mono text-xs font-bold uppercase tracking-[0.1em] text-highlighted">Contents</div>
          <div class="flex flex-col gap-0.5">
            <a
              v-for="(s, i) in sections"
              :key="s.id"
              :href="`#${s.id}`"
              class="toc-link border-l-2 py-1.5 pl-3.5 text-[13px] leading-snug transition-colors duration-150"
              :class="
                activeSection === s.id
                  ? 'border-l-primary font-semibold text-primary'
                  : 'border-l-transparent text-muted hover:text-highlighted'
              "
            >
              <span class="mr-2 font-mono text-[11px] opacity-60">{{ String(i + 1).padStart(2, "0") }}</span
              >{{ s.title }}
            </a>
          </div>
        </aside>
        <article class="max-w-[720px] text-base leading-[1.7] text-highlighted">
          <div v-for="(s, i) in sections" :id="s.id" :key="s.id" class="mb-14 scroll-mt-8">
            <div class="mb-4 flex items-baseline gap-3">
              <span class="font-mono text-[13px] font-semibold tracking-[0.04em] text-primary">{{
                String(i + 1).padStart(2, "0")
              }}</span>
              <h2 class="text-[28px] font-bold tracking-[-0.02em] text-highlighted">{{ s.title }}</h2>
            </div>
            <div class="prose-legal text-muted" v-html="s.body" />
          </div>

          <div
            class="mt-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-(--ui-bg-muted) p-7 text-sm leading-relaxed text-muted"
          >
            Questions about this policy? Email
            <span class="font-mono text-primary">{{ CONTACT_EMAIL }}</span> — we read everything.
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
