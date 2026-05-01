<script setup lang="ts">
import LandingFooter from "~/components/layout/LandingFooter.vue"
import LandingHeader from "~/components/layout/LandingHeader.vue"
</script>
<template>
  <div class="relative mx-auto grid min-h-dvh w-full grid-rows-[auto_1fr]">
    <LandingHeader />
    <main>
      <slot />
    </main>
    <LandingFooter />
  </div>
</template>
