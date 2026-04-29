<script setup lang="ts">
import LanguageSwitcher from "./LanguageSwitcher.vue"
import Logo from "./Logo.vue"
import Theme from "./Theme.vue"

const navLinks: { label: string; to: string }[] = []
const user = useSupabaseUser()
</script>

<template>
  <header class="sticky top-0 z-50 bg-default/80 backdrop-blur-md border-b border-default h-16">
    <div class="mx-auto h-full flex max-w-compact items-center justify-between px-6 lg:px-12">
      <div class="flex items-center gap-10">
        <Logo />
        <nav class="hidden items-center gap-7 lg:flex">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.label"
            :to="link.to"
            class="nav-link relative text-sm font-medium text-muted transition-colors duration-200 hover:text-highlighted"
            >{{ link.label }}</NuxtLink
          >
        </nav>
      </div>
      <div class="flex items-center gap-4">
        <NuxtLink
          v-if="!user"
          :to="'/login'"
          class="nav-link relative text-sm font-medium text-muted transition-colors duration-200 hover:text-highlighted"
          >{{ $t("nav.signIn") }}</NuxtLink
        >
        <NuxtLink
          v-else
          to="/dashboard"
          class="lh-btn-dashboard inline-flex items-center rounded-[10px] bg-zinc-900 dark:bg-zinc-100 px-[18px] py-2.5 text-sm font-semibold text-white dark:text-zinc-900 transition-colors duration-200 hover:bg-zinc-700 dark:hover:bg-white"
        >
          {{ $t("nav.dashboard") }}
        </NuxtLink>
        <LanguageSwitcher />
        <Theme />
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0;
  height: 1.5px;
  background: var(--ui-primary);
  transition: width 0.22s ease;
}
.nav-link:hover::after {
  width: 100%;
}
</style>
