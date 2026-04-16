<script setup lang="ts">
import Theme from "~/components/layout/Theme.vue"
import UserDropdown from "~/components/layout/UserDropdown.vue"

const route = useRoute()
const isLandingPage = computed(() => route.path === "/")
const user = useSupabaseUser()
</script>
<template>
  <div
    class="w-full relative grid min-h-dvh mx-auto grid-rows-[auto_1fr] after:content-[''] after:absolute after:top-0 after:z-[-2] after:size-full after:bg-[radial-gradient(#ddd_1px,#efefef_1px)] after:[background-size:16px_16px] dark:after:bg-[radial-gradient(#3b3b3b_1px,#222226_1px)] dark:after:[background-size:20px_20px]"
  >
    <header class="h-16 bg-default/80 border-b border-default/30">
      <div class="mx-auto max-w-[1600px] h-full flex justify-between py-2 px-4 items-center">
        <NuxtLink to="/" class="flex h-full w-fit">
          <NuxtImg src="/images/logo.webp" alt="Logo" loading="eager" format="webp" />
        </NuxtLink>
        <div class="flex items-center gap-3">
          <UserDropdown v-if="user" />
          <UButton
            href="https://github.com/javadag/weave-cv"
            target="_blank"
            rel="noopener noreferrer"
            variant="link"
            icon="i-lucide-github"
            size="md"
          />
          <Theme />
        </div>
      </div>
    </header>
    <main
      :class="['w-full mx-auto [&>div]:h-full', !isLandingPage && 'max-w-[1600px] py-4 px-3 sm:px-5 md:px-8 lg:px-10']"
    >
      <slot />
    </main>
  </div>
</template>
