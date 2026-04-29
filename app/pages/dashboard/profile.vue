<script setup lang="ts">
definePageMeta({ layout: "dashboard" })

useHead({
  title: "Profile - Weave CV",
  meta: [{ name: "robots", content: "noindex, nofollow" }]
})

const { t } = useI18n()
const user = useSupabaseUser()

const userEmail = computed(() => user.value?.email || "")
const fullName = computed(
  () => user.value?.user_metadata?.full_name || user.value?.user_metadata?.name || userEmail.value.split("@")[0] || ""
)

const userInitials = computed(() => {
  const name = fullName.value.trim()
  if (!name) return "U"
  return name
    .split(/\s+/)
    .map((p: string) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
})

const userAvatar = computed(() => user.value?.user_metadata?.avatar_url || null)

const fields = computed(() => [
  { label: t("dashboard.profile.fieldFullName"), value: fullName.value },
  { label: t("dashboard.profile.fieldEmail"), value: userEmail.value }
])
</script>

<template>
  <div class="max-w-6xl">
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight text-default">{{ $t("dashboard.profile.title") }}</h1>
      <p class="text-muted text-sm mt-1">{{ $t("dashboard.profile.subtitle") }}</p>
    </div>

    <UCard>
      <div class="flex items-center gap-6 flex-wrap">
        <UAvatar v-if="userAvatar" :src="userAvatar" :alt="userEmail" size="3xl" class="ring-2 ring-default/20" />
        <UAvatar
          v-else
          :alt="userEmail"
          size="3xl"
          class="ring-2 ring-default/20 bg-primary text-primary-foreground text-xl font-semibold"
        >
          {{ userInitials }}
        </UAvatar>
        <div class="flex-1 min-w-[240px] grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div v-for="f in fields" :key="f.label">
            <div class="text-[11px] uppercase tracking-[0.06em] text-dimmed font-semibold mb-1">{{ f.label }}</div>
            <div class="text-base font-medium text-default break-all">{{ f.value }}</div>
          </div>
        </div>
      </div>
    </UCard>

    <div class="mt-3 text-xs text-dimmed flex items-center gap-1.5">
      <UIcon name="i-lucide-lock" class="size-3.5" />
      {{ $t("dashboard.profile.readOnlyNote") }}
    </div>
  </div>
</template>
