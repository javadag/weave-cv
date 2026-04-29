<script setup lang="ts">
import { APP_VERSION, CONTACT_EMAIL } from "~/constants/config"

const { t } = useI18n()
const currentYear = new Date().getFullYear()

const footerCols = computed(() => [
  {
    h: t("footer.colProduct"),
    items: [{ label: t("footer.linkFeatures"), to: "/#features" }]
  },
  {
    h: t("footer.colResources"),
    items: [
      { label: t("footer.linkHelpFaq"), to: "/faq" },
      { label: t("footer.linkChangelog"), to: "/changelog" }
    ]
  },
  {
    h: t("footer.colCompany"),
    items: [
      { label: t("footer.linkAbout"), to: "/about" },
      { label: t("footer.linkContact"), href: `mailto:${CONTACT_EMAIL}` }
    ]
  },
  {
    h: t("footer.colLegal"),
    items: [
      { label: t("footer.linkPrivacy"), to: "/privacy" },
      { label: t("footer.linkTerms"), to: "/terms" }
    ]
  }
])

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/javadag",
    path: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"
  },
  {
    label: "X",
    href: "https://x.com",
    path: "M14.7 10.7L21 3.5h-1.7l-5.4 6.2-4.3-6.2H4l6.6 9.4L4 20.5h1.7l5.7-6.6 4.6 6.6H21M6.4 4.7h2.5L18.5 19.3H16"
  }
]
</script>
<template>
  <footer class="border-t border-default bg-default">
    <div class="mx-auto max-w-compact px-6 pb-8 pt-16 lg:px-12">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
        <div>
          <NuxtLink to="/" class="flex items-center gap-2.5">
            <NuxtImg src="/images/logo.webp" alt="Weave CV" width="144" height="48" format="webp" class="h-9 w-auto" />
          </NuxtLink>
          <p class="mt-4 max-w-[280px] text-sm leading-relaxed text-muted">
            {{ $t("footer.tagline") }}
          </p>
          <div class="mt-5 flex gap-2">
            <a
              v-for="s in socials"
              :key="s.label"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-social flex size-9 items-center justify-center rounded-lg border border-muted text-muted transition-colors duration-200 hover:border-accented hover:text-highlighted"
              :aria-label="s.label"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path :d="s.path" />
              </svg>
            </a>
          </div>
        </div>
        <div v-for="col in footerCols" :key="col.h">
          <div class="mb-4 text-xs font-bold uppercase tracking-widest text-highlighted">
            {{ col.h }}
          </div>
          <div class="flex flex-col gap-2.5">
            <template v-for="item in col.items" :key="item.label">
              <NuxtLink
                v-if="item.to"
                :to="item.to"
                class="footer-link text-sm text-muted hover:text-highlighted transition-colors duration-200"
                >{{ item.label }}</NuxtLink
              >
              <a
                v-else
                :href="item.href"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-link text-sm text-muted hover:text-highlighted transition-colors duration-200"
                >{{ item.label }}</a
              >
            </template>
          </div>
        </div>
      </div>
      <div
        class="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-default pt-7 text-xs text-muted"
      >
        <div class="flex flex-wrap items-center gap-4">
          <span>{{ $t("footer.copyright", { year: currentYear }) }}</span>
          <NuxtLink
            to="/changelog"
            class="footer-link inline-flex items-center gap-1.5 rounded-md border border-default bg-elevated px-2 py-0.5 font-mono text-[11px] text-muted transition-colors duration-200 hover:border-accented hover:text-highlighted"
          >
            v{{ APP_VERSION }}
          </NuxtLink>
        </div>
        <i18n-t keypath="footer.madeWith" tag="div" class="flex items-center gap-1">
          <template #heart>
            <span class="mx-0.5 text-primary">♥</span>
          </template>
        </i18n-t>
      </div>
    </div>
  </footer>
</template>
