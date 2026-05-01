<script setup lang="ts">
const { t } = useI18n()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()
const toast = useToast()

const userEmail = computed(() => user.value?.email || "")
const userInitials = computed(() => {
  if (!userEmail.value) return "U"
  const emailPart = userEmail.value.split("@")[0]
  if (!emailPart) return "U"
  return emailPart
    .split(/[.\-_]/)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
})

const userAvatar = computed(() => user.value?.user_metadata?.avatar_url || null)

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    toast.add({
      title: t("userDropdown.loggedOut"),
      description: t("userDropdown.loggedOutDesc"),
      color: "success"
    })

    await router.push("/")
  } catch (error) {
    console.error("Logout error:", error)
    toast.add({
      title: t("userDropdown.errorTitle"),
      description: t("userDropdown.errorDesc"),
      color: "error"
    })
  }
}

const menuItems = computed(() => [
  {
    label: t("userDropdown.dashboard"),
    icon: "i-lucide-layout-dashboard",
    onSelect: () => router.push("/dashboard")
  },
  {
    label: t("userDropdown.logout"),
    icon: "i-lucide-log-out",
    onSelect: handleLogout
  }
])
</script>

<template>
  <UDropdownMenu v-if="user" :items="menuItems" :popper="{ placement: 'bottom-end' }">
    <UButton color="neutral" variant="ghost" size="sm" class="border-muted gap-2 rounded-full border px-1.5">
      <UAvatar v-if="userAvatar" :src="userAvatar" :alt="userEmail" size="xs" class="ring-default/20 ring-2" />
      <UAvatar v-else :alt="userEmail" size="xs" class="ring-default/20 bg-primary text-primary-foreground ring-2">
        {{ userInitials }}
      </UAvatar>
      <span class="hidden text-[13px] font-medium sm:inline">{{ userEmail }}</span>
      <UIcon name="i-lucide-chevron-down" class="text-muted h-4 w-4" />
    </UButton>
  </UDropdownMenu>
</template>
