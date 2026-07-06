<script setup lang="ts">
import CTASection from "~/components/landing/home/CTASection.vue"
import FeaturesSection from "~/components/landing/home/FeaturesSection.vue"
import HeroSection from "~/components/landing/home/HeroSection.vue"
import TemplatesSection from "~/components/landing/home/TemplatesSection.vue"

const { t } = useI18n()

definePageMeta({
  layout: "landing"
})

useSeoMeta({
  title: () => t("seo.index.title"),
  description: () => t("seo.index.description"),
  ogTitle: () => t("seo.index.title"),
  ogDescription: () => t("seo.index.description"),
  ogUrl: "/",
  twitterTitle: () => t("seo.index.title"),
  twitterDescription: () => t("seo.index.description")
})
</script>

<template>
  <HeroSection />
  <FeaturesSection />
  <ClientOnly>
    <TemplatesSection />
  </ClientOnly>
  <CTASection />
</template>
