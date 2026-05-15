<script setup lang="ts">
import FeedbackFab from "~/components/feedback/FeedbackFab.vue"
import LanguageSwitcher from "~/components/layout/LanguageSwitcher.vue"
import Logo from "~/components/layout/Logo.vue"
import Theme from "~/components/layout/Theme.vue"
import UserDropdown from "~/components/layout/UserDropdown.vue"

const AUTH_PAGES = new Set(["/login", "/reset-password", "/forgot-password", "/register", "/confirm-email"])

const user = useSupabaseUser()
const route = useRoute()

const isAuthPage = computed(() => AUTH_PAGES.has(route.path))
</script>
<template>
  <div
    class="relative mx-auto grid min-h-dvh w-full grid-rows-[auto_1fr] after:absolute after:top-0 after:z-[-2] after:size-full after:bg-[radial-gradient(#ddd_1px,#efefef_1px)] after:bg-size-[16px_16px] after:content-[''] dark:after:bg-[radial-gradient(#3b3b3b_1px,#222226_1px)] dark:after:bg-size-[20px_20px]"
  >
    <header class="border-default bg-default/80 h-16 border-b backdrop-blur-md">
      <div class="max-w-compact mx-auto flex h-full items-center justify-between px-6 lg:px-12">
        <Logo />
        <div class="flex items-center gap-3">
          <UserDropdown v-if="user && !isAuthPage" />
          <LanguageSwitcher />
          <Theme />
        </div>
      </div>
    </header>
    <main class="max-w-compact mx-auto w-full px-3 py-4 sm:px-5 md:px-8 [&>div]:h-full">
      <slot />
    </main>
    <FeedbackFab />
  </div>
</template>
