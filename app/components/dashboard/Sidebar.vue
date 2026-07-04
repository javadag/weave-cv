<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"
import { MAX_RESUMES } from "~/constants/config"
import Logo from "../layout/Logo.vue"

const open = defineModel<boolean>("open", { default: false })

const { t } = useI18n()
const { isRtl } = useLocaleInfo()
const { count } = useResumeCount()
const supabase = useSupabaseClient()
const router = useRouter()
const toast = useToast()

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    toast.add({ title: t("userDropdown.loggedOut"), description: t("userDropdown.loggedOutDesc"), color: "success" })
    await router.push("/")
  } catch (error) {
    console.error("Logout error:", error)
    toast.add({ title: t("userDropdown.errorTitle"), description: t("userDropdown.errorDesc"), color: "error" })
  }
}

const navItems = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: t("sidebar.myResumes"),
      icon: "i-lucide-file-text",
      to: "/dashboard",
      exact: true,
      badge: `${count.value}/${MAX_RESUMES}`
    },
    { label: t("sidebar.profile"), icon: "i-lucide-user", to: "/dashboard/profile" },
    { label: t("sidebar.settings"), icon: "i-lucide-settings", to: "/dashboard/settings" }
  ],
  [{ label: t("sidebar.account"), icon: "i-lucide-shield", to: "/dashboard/account" }]
])
</script>

<template>
  <USidebar
    v-model:open="open"
    collapsible="offcanvas"
    :side="isRtl ? 'right' : 'left'"
    :ui="{
      container: 'h-full border-e',
      body: 'py-4'
    }"
  >
    <template #header>
      <Logo />
      <UButton
        class="ms-auto me-0 sm:hidden"
        color="neutral"
        variant="ghost"
        icon="i-lucide-x"
        :aria-label="$t('common.toggleSidebar')"
        @click="
          () => {
            open = !open
          }
        "
      />
    </template>
    <UNavigationMenu orientation="vertical" :items="navItems" class="w-full" />
    <template #footer>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-log-out"
        :label="$t('sidebar.logOut')"
        class="w-full justify-start"
        @click="handleLogout"
      />
    </template>
  </USidebar>
</template>
