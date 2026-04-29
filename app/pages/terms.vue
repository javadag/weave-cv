<script setup lang="ts">
import { CONTACT_EMAIL } from "~/constants/config"

definePageMeta({ layout: "landing" })

useSeoMeta({ title: "Terms of Service — Weave CV", description: "The rules of the road for using Weave CV." })

const sections = [
  {
    id: "agreement",
    title: "The agreement",
    body: `<p>By creating an account or using Weave CV, you agree to these Terms of Service. If you don't agree, please don't use the service. We tried to keep the legalese to a minimum.</p>`
  },
  {
    id: "service",
    title: "What the service is",
    body: `<p>Weave CV is a web-based résumé builder. You write content, choose a template, and export a PDF. The service is offered <strong>free of charge</strong> for personal use, with no premium tier.</p>
<p>We reserve the right to limit, suspend, or shut down the service. If we shut it down, we'll give you at least 60 days' notice and a tool to export everything.</p>`
  },
  {
    id: "account",
    title: "Your account",
    body: `<p>You're responsible for keeping your password safe. One person, one account — don't share credentials with others. You must be at least 16 years old to use Weave CV (or the minimum age in your jurisdiction, whichever is higher).</p>
<p>We may suspend accounts that abuse the service — see <strong>Acceptable Use</strong> below — but we'll always tell you why and give you a way to export your data first.</p>`
  },
  {
    id: "content",
    title: "Your content",
    body: `<p><strong>You own your résumé content.</strong> Full stop. We claim no rights over what you create. The only license you grant us is the technical one we need to display, store, and export your content on your behalf.</p>
<p>If you delete a résumé or your account, that license ends immediately and we delete the content.</p>`
  },
  {
    id: "use",
    title: "Acceptable use",
    body: `<p>Don't use Weave CV to:</p>
<ul>
  <li>Create fraudulent résumés or impersonate someone else.</li>
  <li>Upload illegal content, malware, or anything that infringes someone else's rights.</li>
  <li>Probe, scrape, or attempt to break the service or other users' accounts.</li>
  <li>Resell, sublicense, or repackage Weave CV as your own product.</li>
</ul>`
  },
  {
    id: "ip",
    title: "Our intellectual property",
    body: `<p>The Weave CV name, logo, and brand assets are ours.</p>
<p>Templates are released under <strong>CC BY 4.0</strong>: free to use and modify, including commercially, with attribution.</p>`
  },
  {
    id: "availability",
    title: "Service availability",
    body: `<p>We aim for 99.5% uptime but do not guarantee it. The service is provided <strong>"as is"</strong> without warranties of any kind. We're a small team running a free product — please plan accordingly and keep local PDF copies of important résumés.</p>`
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: `<p>To the maximum extent permitted by law, Weave CV is not liable for indirect, incidental, or consequential damages arising from your use of the service — including lost job opportunities, lost data, or lost time.</p>
<p>Under no circumstances will we be liable for any loss, damage, or injury that results from a third-party's use of Weave CV.</p>`
  },
  {
    id: "termination",
    title: "Termination",
    body: `<p>You can delete your account any time from <code>Settings → Account → Delete account</code>. Deletion is immediate and irreversible.</p>
<p>We may terminate accounts that violate these terms, with notice unless the violation is severe (e.g. fraud, abuse). On termination, your access ends and your data is deleted within 30 days.</p>`
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: `<p>We may update these terms occasionally. Material changes are emailed to all users at least 30 days before they take effect. If you keep using Weave CV after the change date, you're accepting the new terms.</p>`
  }
]

const activeSection = ref(sections[0]?.id)

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
    const el = document.querySelector(`#${s.id}`)
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
        class="mb-6 max-w-[920px] text-[clamp(48px,6vw,72px)] font-bold leading-[1.0] tracking-[-0.04em] text-zinc-900 dark:text-zinc-50"
      >
        Terms of Service
      </h1>
      <p class="max-w-[680px] text-xl leading-relaxed text-muted">
        The rules of the road for using Weave CV. We've kept the legalese to a minimum and the principles fair.
      </p>
    </section>
    <section class="mx-auto max-w-compact px-6 pb-14 lg:px-12">
      <div class="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-(--ui-bg-muted) px-9 py-8">
        <div class="mb-3.5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-primary">◆ THE GIST</div>
        <p class="max-w-[820px] font-serif text-[18px] italic leading-relaxed text-highlighted">
          "You own your content. We host it. The service is free, provided as-is, and either party can walk away at any
          time. Don't do anything illegal or abusive with it. That's pretty much it."
        </p>
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
                  ? 'border-l-orange-600 dark:border-l-amber-400 font-semibold text-primary'
                  : 'border-l-transparent text-muted hover:text-zinc-900 dark:hover:text-zinc-100'
              "
            >
              <span class="mr-2 font-mono text-[11px] opacity-60">{{ String(i + 1).padStart(2, "0") }}</span
              >{{ s.title }}
            </a>
          </div>
        </aside>
        <article class="max-w-[720px] text-base leading-[1.7] text-zinc-900 dark:text-zinc-50">
          <div v-for="(s, i) in sections" :id="s.id" :key="s.id" class="mb-14 scroll-mt-8">
            <div class="mb-4 flex items-baseline gap-3">
              <span class="font-mono text-[13px] font-semibold tracking-[0.04em] text-primary">{{
                String(i + 1).padStart(2, "0")
              }}</span>
              <h2 class="text-[28px] font-bold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">{{ s.title }}</h2>
            </div>
            <div class="prose-legal text-muted" v-html="s.body" />
          </div>

          <div
            class="mt-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-(--ui-bg-muted) p-7 text-sm leading-relaxed text-muted"
          >
            Got a legal question? Email
            <span class="font-mono text-primary">{{ CONTACT_EMAIL }}</span
            >. For everything else, <span class="font-mono text-primary">{{ CONTACT_EMAIL }}</span> is faster.
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
