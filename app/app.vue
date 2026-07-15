<script setup lang="ts">
const head = useLocaleHead({ seo: true })

useHead(() => ({
  htmlAttrs: {
    lang: head.value.htmlAttrs?.lang,
    dir: head.value.htmlAttrs?.dir as "ltr" | "rtl"
  },
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Weave CV",
        url: "https://weavecv.app",
        description: "Create professional resumes with ease. Build, edit, and download your resume in minutes.",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web Browser",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "AI-powered job matching",
          "Live PDF preview",
          "24 professional templates",
          "PDF export",
          "PDF import",
          "JSON import/export",
          "RTL support"
        ]
      })
    }
  ]
}))
</script>

<template>
  <UApp :dir="(head.htmlAttrs?.dir as 'ltr' | 'rtl') || 'ltr'">
    <NuxtLoadingIndicator color="var(--ui-primary)" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
