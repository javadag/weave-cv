<script setup lang="ts">
import LandingFooter from "~/components/layout/LandingFooter.vue"
import LandingHeader from "~/components/layout/LandingHeader.vue"
</script>
<template>
  <div class="w-full relative grid min-h-dvh mx-auto grid-rows-[auto_1fr]">
    <LandingHeader />
    <main>
      <slot />
    </main>
    <LandingFooter />
  </div>
</template>
