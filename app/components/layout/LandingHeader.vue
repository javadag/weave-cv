<script setup lang="ts">
import LanguageSwitcher from "./LanguageSwitcher.vue"
import Logo from "./Logo.vue"
import Theme from "./Theme.vue"

const navLinks: { label: string; to: string }[] = []
const user = useSupabaseUser()
</script>

<template>
  <header class="bg-default/80 border-default sticky top-0 z-50 h-16 border-b backdrop-blur-md">
    <div class="max-w-compact mx-auto flex h-full items-center justify-between px-6 lg:px-12">
      <div class="flex items-center gap-10">
        <Logo />
        <nav class="hidden items-center gap-7 lg:flex">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.label"
            :to="link.to"
            class="nav-link text-muted hover:text-highlighted relative text-sm font-medium transition-colors duration-200"
            >{{ link.label }}</NuxtLink
          >
        </nav>
      </div>
      <div class="flex items-center gap-1.5 md:gap-4">
        <NuxtLink
          v-if="!user"
          :to="'/login'"
          class="nav-link text-muted hover:text-highlighted relative text-sm font-medium transition-colors duration-200"
          >{{ $t("nav.signIn") }}</NuxtLink
        >
        <NuxtLink
          v-else
          to="/dashboard"
          class="lh-btn-dashboard inline-flex items-center rounded-[10px] bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700 md:px-4.5 md:py-2.5 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
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
