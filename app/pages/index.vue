<script setup lang="ts">
import CTASection from "~/components/landing/home/CTASection.vue"
import FeaturesSection from "~/components/landing/home/FeaturesSection.vue"
import HeroSection from "~/components/landing/home/HeroSection.vue"
import TemplatesSection from "~/components/landing/home/TemplatesSection.vue"

definePageMeta({
  layout: "landing"
})

useHead({
  title: "Weave CV - Create Professional Resumes",
  meta: [
    {
      name: "description",
      content: "Create professional resumes with ease. Build, edit, and download your resume in minutes with Weave CV."
    },
    {
      property: "og:title",
      content: "Weave CV - Create Professional Resumes"
    },
    {
      property: "og:description",
      content: "Create professional resumes with ease. Build, edit, and download your resume in minutes with Weave CV."
    },
    {
      property: "og:url",
      content: "/"
    },
    {
      name: "twitter:title",
      content: "Weave CV - Create Professional Resumes"
    },
    {
      name: "twitter:description",
      content: "Create professional resumes with ease. Build, edit, and download your resume in minutes with Weave CV."
    }
  ]
})
</script>

<template>
  <HeroSection />
  <FeaturesSection />
  <TemplatesSection />
  <CTASection />
</template>
