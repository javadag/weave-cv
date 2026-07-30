<script setup lang="ts">
import FAQSection from "~/components/landing/home/FAQSection.vue"
import FeaturesSection from "~/components/landing/home/FeaturesSection.vue"
import HeroSection from "~/components/landing/home/HeroSection.vue"
import HowItWorksSection from "~/components/landing/home/HowItWorksSection.vue"
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
  <HowItWorksSection />
  <ClientOnly>
    <TemplatesSection />
  </ClientOnly>
  <!-- <TestimonialsSection /> -->
  <FAQSection />
</template>
