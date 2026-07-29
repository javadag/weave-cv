<script setup lang="ts">
definePageMeta({ layout: "dashboard" })

const { t } = useI18n()
const user = useSupabaseUser()

useHead({
  title: () => t("seo.dashboardProfile.title"),
  meta: [{ name: "robots", content: "noindex, nofollow" }]
})

const userEmail = computed(() => user.value?.email || "")
const fullName = computed(
  () => user.value?.user_metadata?.full_name || user.value?.user_metadata?.name || userEmail.value.split("@", 1)[0] || ""
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
      <h1 class="text-default text-2xl font-bold tracking-tight">{{ $t("dashboard.profile.title") }}</h1>
      <p class="text-muted mt-1 text-sm">{{ $t("dashboard.profile.subtitle") }}</p>
    </div>

    <UCard>
      <div class="flex flex-wrap items-center gap-6">
        <UAvatar v-if="userAvatar" :src="userAvatar" :alt="userEmail" size="3xl" class="ring-default/20 ring-2" />
        <UAvatar
          v-else
          :alt="userEmail"
          size="3xl"
          class="ring-default/20 bg-primary text-primary-foreground text-xl font-semibold ring-2"
        >
          {{ userInitials }}
        </UAvatar>
        <div class="grid min-w-60 flex-1 grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <div v-for="f in fields" :key="f.label">
            <div class="text-dimmed mb-1 text-[11px] font-semibold tracking-[0.06em] uppercase">{{ f.label }}</div>
            <div class="text-default text-base font-medium break-all">{{ f.value }}</div>
          </div>
        </div>
      </div>
    </UCard>

    <div class="text-dimmed mt-3 flex items-center gap-1.5 text-xs">
      <UIcon name="i-lucide-lock" class="size-3.5" />
      {{ $t("dashboard.profile.readOnlyNote") }}
    </div>
  </div>
</template>
