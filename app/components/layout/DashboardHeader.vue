<script setup lang="ts">
import LanguageSwitcher from "~/components/layout/LanguageSwitcher.vue"
import Theme from "~/components/layout/Theme.vue"
import UserDropdown from "~/components/layout/UserDropdown.vue"

const open = defineModel<boolean>("open")
const user = useSupabaseUser()
</script>

<template>
  <header class="h-16 bg-default/80 border-b border-default backdrop-blur">
    <div class="mx-auto h-full max-w-compact w-full flex justify-between items-center px-6">
      <UButton
        icon="i-lucide-panel-left"
        color="neutral"
        variant="ghost"
        :aria-label="$t('common.toggleSidebar')"
        @click="open = !open"
      />
      <div class="flex items-center gap-3">
        <UserDropdown v-if="user" />
        <LanguageSwitcher />
        <Theme />
      </div>
    </div>
  </header>
</template>
