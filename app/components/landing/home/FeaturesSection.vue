<script setup lang="ts">
import { MAX_RESUMES } from "~/constants/limits"

const { t } = useI18n()

const features = computed(() => [
  {
    icon: "i-lucide-file-text",
    title: t("features.refinedTemplatesTitle"),
    body: t("features.refinedTemplatesBody"),
    tone: "primary"
  },
  {
    icon: "i-lucide-mouse-pointer-click",
    title: t("features.dragDropTitle"),
    body: t("features.dragDropBody"),
    tone: "secondary"
  },
  {
    icon: "i-lucide-download",
    title: t("features.pixelPdfTitle"),
    body: t("features.pixelPdfBody"),
    tone: "primary"
  },
  {
    icon: "i-lucide-palette",
    title: t("features.colorTypeTitle"),
    body: t("features.colorTypeBody"),
    tone: "secondary"
  },
  {
    icon: "i-lucide-cloud",
    title: t("features.cloudSyncTitle"),
    body: t("features.cloudSyncBody", { max: MAX_RESUMES }),
    tone: "primary"
  },
  {
    icon: "i-lucide-lock",
    title: t("features.freeTitle"),
    body: t("features.freeBody"),
    tone: "secondary"
  }
])
</script>

<template>
  <section id="features" class="border-y border-default bg-muted py-20 sm:py-28">
    <div class="mx-auto max-w-compact px-6 lg:px-12">
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 700, ease: 'easeOut' } }"
        :visible-once="true"
        class="mb-16 text-center"
      >
        <span
          class="inline-flex items-center gap-1.5 rounded-full border border-primary-200 dark:border-primary/25 bg-primary-50 dark:bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
        >
          {{ $t("features.badge") }}
        </span>
        <h2 class="mt-5 text-4xl font-bold tracking-[-0.03em] text-highlighted sm:text-5xl text-balance">
          {{ $t("features.title") }}
        </h2>
        <p class="mx-auto mt-4 max-w-[600px] text-lg leading-relaxed text-muted">
          {{ $t("features.subtitle") }}
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(f, index) in features"
          :key="f.title"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut', delay: index * 80 } }"
          :visible-once="true"
          class="feat-card cursor-pointer rounded-2xl border border-default bg-default dark:bg-elevated p-7"
        >
          <div
            class="feat-icon mb-[18px] flex size-12 items-center justify-center rounded-xl text-xl font-bold text-white will-change-transform"
            :class="
              f.tone === 'primary'
                ? 'bg-gradient-to-br from-primary-500 to-primary-700'
                : 'bg-gradient-to-br from-primary-300 to-primary-400'
            "
          >
            <UIcon :name="f.icon" />
          </div>
          <h3 class="mb-2 text-lg font-bold tracking-[-0.01em] text-highlighted">{{ f.title }}</h3>
          <p class="text-sm leading-relaxed text-muted">{{ f.body }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feat-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  will-change: transform;
}
.feat-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--ui-primary) 30%, transparent);
  box-shadow: 0 20px 44px -16px rgba(28, 25, 23, 0.14);
}
:global(.dark) .feat-card:hover {
  box-shadow: 0 20px 44px -16px rgba(32, 32, 32, 0.65);
}
.feat-icon {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.feat-card:hover .feat-icon {
  transform: rotate(-6deg) scale(1.1);
}
</style>
