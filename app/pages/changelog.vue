<script setup lang="ts">
import { marked } from "marked"
import changelogContent from "~~/CHANGELOG.md?raw"

const { t } = useI18n()

definePageMeta({
  layout: "landing"
})

useSeoMeta({
  title: () => t("seo.changelog.title"),
  description: () => t("seo.changelog.description"),
  ogTitle: () => t("seo.changelog.title"),
  ogDescription: () => t("seo.changelog.description"),
  ogUrl: "/changelog",
  twitterTitle: () => t("seo.changelog.title"),
  twitterDescription: () => t("seo.changelog.description")
})

const html = computed(() => marked.parse(changelogContent, { gfm: true, breaks: false, async: false }) as string)
</script>

<template>
  <main class="bg-default py-20 sm:py-28">
    <div class="mx-auto max-w-3xl px-6 lg:px-8">
      <header
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }"
        :visible-once="true"
        class="mb-12"
      >
        <span
          class="border-primary-200 dark:border-primary/25 bg-primary-50 dark:bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
        >
          Changelog
        </span>
        <h1 class="text-highlighted mt-5 text-4xl font-bold tracking-[-0.03em] text-balance sm:text-5xl">
          What's new in Weave CV
        </h1>
        <p class="text-dimmed mt-4 max-w-xl text-base leading-relaxed">
          Every feature, fix, and refinement we've shipped. Generated from our git history — see something missing? Let
          us know.
        </p>
      </header>

      <article
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut', delay: 100 } }"
        :visible-once="true"
        class="changelog-prose"
        v-html="html"
      />
    </div>
  </main>
</template>

<style scoped>
.changelog-prose {
  color: var(--ui-text);
  font-size: 15px;
  line-height: 1.65;
}

/* Hide the top-level "# Changelog" header — we render our own */
.changelog-prose :deep(h1) {
  display: none;
}

/* Version headers */
.changelog-prose :deep(h2) {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ui-text-highlighted);
  margin: 56px 0 4px;
  padding-top: 24px;
  border-top: 1px solid var(--ui-border);
}
.changelog-prose :deep(h2:first-of-type) {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}

/* Section labels: 🚀 Enhancements, 🩹 Fixes, 🏡 Chore, ❤️ Contributors */
.changelog-prose :deep(h3) {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ui-text-dimmed);
  margin: 28px 0 12px;
}

.changelog-prose :deep(ul) {
  list-style: none;
  padding-left: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.changelog-prose :deep(li) {
  position: relative;
  padding: 12px 16px;
  border-radius: 10px;
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border);
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}
.changelog-prose :deep(li:hover) {
  border-color: color-mix(in srgb, var(--ui-primary) 30%, transparent);
}

/* Commit hash links */
.changelog-prose :deep(a) {
  color: var(--ui-text-dimmed);
  font-family: ui-monospace, "JetBrains Mono", "Menlo", monospace;
  font-size: 12px;
  padding: 1px 6px;
  margin-left: 4px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--ui-border) 50%, transparent);
  text-decoration: none;
  transition:
    color 0.15s ease,
    background 0.15s ease;
}
.changelog-prose :deep(a:hover) {
  color: var(--ui-primary);
  background: color-mix(in srgb, var(--ui-primary) 12%, transparent);
}

/* Paragraphs (e.g., "compare changes" lines) */
.changelog-prose :deep(p) {
  color: var(--ui-text-dimmed);
  font-size: 13px;
  margin: 4px 0 0;
}

.changelog-prose :deep(code) {
  font-family: ui-monospace, "JetBrains Mono", monospace;
  font-size: 13px;
  padding: 1px 6px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--ui-border) 50%, transparent);
}
</style>
