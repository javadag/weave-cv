<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: () => t("seo.forgotPassword.title"),
  meta: [{ name: "robots", content: "noindex, nofollow" }]
})

const user = useSupabaseUser()
if (user.value) navigateTo("/dashboard")
const supabase = useSupabaseClient()
const email = ref("")
const loading = ref(false)
const error = ref("")
const sent = ref(false)

const submit = async () => {
  if (!email.value) {
    error.value = t("forgotPassword.errorEmail")
    return
  }
  loading.value = true
  error.value = ""

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${globalThis.location.origin}/reset-password`
  })

  loading.value = false
  if (resetError) {
    error.value = resetError.message
  } else {
    sent.value = true
  }
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="relative w-full max-w-md">
      <div class="mb-8 text-center">
        <h1 class="text-toned mb-2 text-3xl font-bold">{{ $t("forgotPassword.title") }}</h1>
        <p class="text-muted">{{ $t("forgotPassword.subtitle") }}</p>
      </div>

      <UCard class="bg-default/70 shadow-2xl">
        <!-- Sent confirmation -->
        <template v-if="sent">
          <div class="py-4 text-center">
            <div class="mb-4 flex justify-center">
              <span class="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-full">
                <UIcon name="i-lucide-mail-check" class="size-7" />
              </span>
            </div>
            <h2 class="text-highlighted mb-2 text-lg font-semibold">{{ $t("forgotPassword.sentTitle") }}</h2>
            <p class="text-muted mb-1 text-sm">{{ $t("forgotPassword.sentLinkTo") }}</p>
            <p class="text-highlighted mb-4 font-medium">{{ email }}</p>
            <p class="text-muted text-sm">{{ $t("forgotPassword.sentHint") }}</p>
          </div>
        </template>

        <!-- Email form -->
        <template v-else>
          <UForm :state="{ email }" class="space-y-3" @submit="submit">
            <UAlert v-if="error" color="error" variant="soft" :title="$t('common.error')" :description="error" />
            <UFormField :label="$t('forgotPassword.emailLabel')" name="email" required>
              <UInput
                v-model="email"
                type="email"
                :placeholder="$t('forgotPassword.emailPlaceholder')"
                size="lg"
                class="w-full"
                :disabled="loading"
              />
            </UFormField>
            <UButton type="submit" color="primary" size="lg" block :loading="loading">
              {{ loading ? $t("forgotPassword.sending") : $t("forgotPassword.submitBtn") }}
            </UButton>
          </UForm>
        </template>
      </UCard>

      <p class="text-muted mt-8 text-center text-sm">
        {{ $t("forgotPassword.remembered") }}
        <ULink class="text-primary font-medium" to="/login">{{ $t("forgotPassword.signIn") }}</ULink>
      </p>
    </div>
  </div>
</template>
