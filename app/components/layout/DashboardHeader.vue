<script setup lang="ts">
import LanguageSwitcher from "~/components/layout/LanguageSwitcher.vue"
import Theme from "~/components/layout/Theme.vue"
import UserDropdown from "~/components/layout/UserDropdown.vue"

const open = defineModel<boolean>("open")
const user = useSupabaseUser()
const { isRtl } = useLocaleInfo()
</script>

<template>
  <header class="bg-default/80 border-default h-16 border-b backdrop-blur">
    <div class="max-w-compact mx-auto flex h-full w-full items-center justify-between px-6">
      <UButton
        :icon="isRtl ? 'i-lucide-panel-right' : 'i-lucide-panel-left'"
        color="neutral"
        class="lg:invisible"
        variant="ghost"
        :aria-label="$t('common.toggleSidebar')"
        @click="
          () => {
            open = !open
          }
        "
      />
      <div class="flex items-center gap-3">
        <UserDropdown v-if="user" />
        <LanguageSwitcher />
        <Theme />
      </div>
    </div>
  </header>
</template>
