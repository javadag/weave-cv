<script setup lang="ts">
import LanguageSwitcher from "~/components/layout/LanguageSwitcher.vue"
import Logo from "~/components/layout/Logo.vue"
import Theme from "~/components/layout/Theme.vue"
import UserDropdown from "~/components/layout/UserDropdown.vue"

const user = useSupabaseUser()
</script>
<template>
  <div
    class="w-full relative grid min-h-dvh mx-auto grid-rows-[auto_1fr] after:content-[''] after:absolute after:top-0 after:z-[-2] after:size-full after:bg-[radial-gradient(#ddd_1px,#efefef_1px)] after:[background-size:16px_16px] dark:after:bg-[radial-gradient(#3b3b3b_1px,#222226_1px)] dark:after:[background-size:20px_20px]"
  >
    <header class="backdrop-blur-md border-b border-default bg-default/80">
      <div class="mx-auto max-w-compact px-6 py-3 lg:px-12 h-full flex justify-between items-center">
        <Logo />
        <div class="flex items-center gap-3">
          <UserDropdown v-if="user" />
          <LanguageSwitcher />
          <Theme />
        </div>
      </div>
    </header>
    <main class="w-full mx-auto [&>div]:h-full max-w-compact py-4 px-3 sm:px-5 md:px-8 lg:px-10">
      <slot />
    </main>
  </div>
</template>
