<script setup lang="ts">
import { CONTACT_EMAIL } from "~/constants/config"

useHead({
  title: "Set New Password - Weave CV",
  meta: [{ name: "robots", content: "noindex, nofollow" }]
})

const { t } = useI18n()
const route = useRoute()
const supabase = useSupabaseClient()

const status = ref<"initializing" | "ready" | "error">("initializing")
const errorDescription = ref<string>("")

const formState = reactive({ password: "", confirmPassword: "" })
const loading = ref(false)
const formError = ref("")

let authListener: ReturnType<typeof supabase.auth.onAuthStateChange> | null = null

onMounted(() => {
  // Snapshot before the listener clears it via router.replace
  const arrivedWithCode = !!route.query.code

  // @nuxtjs/supabase exchanges the PKCE code in a plugin before the component
  // mounts, so PASSWORD_RECOVERY may have already fired. onAuthStateChange
  // immediately fires INITIAL_SESSION with the already-established session —
  // treat that as the recovery signal when we know we arrived with a code.
  authListener = supabase.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY" || (event === "INITIAL_SESSION" && session && arrivedWithCode)) {
      status.value = "ready"
    }
  })

  const queryError = (route.query.error_description as string) || (route.query.error as string) || ""
  if (queryError) {
    errorDescription.value = queryError
    status.value = "error"
    return
  }

  if (arrivedWithCode) {
    return
  }

  // No code and no error — user navigated here directly
  navigateTo("/forgot-password")
})

onUnmounted(() => {
  authListener?.data.subscription.unsubscribe()
})

const submit = async () => {
  if (!formState.password) {
    formError.value = t("resetPassword.errorEmpty")
    return
  }
  if (formState.password.length < 8) {
    formError.value = t("resetPassword.errorShort")
    return
  }
  if (formState.password !== formState.confirmPassword) {
    formError.value = t("resetPassword.errorMatch")
    return
  }

  loading.value = true
  formError.value = ""

  const { error: updateError } = await supabase.auth.updateUser({
    password: formState.password
  })

  loading.value = false
  if (updateError) {
    formError.value = updateError.message
  } else {
    await navigateTo("/dashboard")
  }
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="relative w-full max-w-md">
      <template v-if="status === 'error'">
        <div class="mb-8 text-center">
          <h1 class="mb-2 text-3xl font-bold text-toned">{{ $t("resetPassword.expiredTitle") }}</h1>
          <p class="text-muted">{{ $t("resetPassword.expiredSubtitle") }}</p>
        </div>
        <UCard class="bg-default/70 shadow-2xl">
          <div class="space-y-3">
            <UAlert color="error" variant="soft" :title="$t('resetPassword.invalidAlertTitle')" :description="errorDescription" />
            <UButton to="/forgot-password" color="primary" size="lg" block>{{ $t("resetPassword.requestNewLink") }}</UButton>
            <UButton :to="`mailto:${CONTACT_EMAIL}`" color="neutral" variant="ghost" size="lg" block>
              {{ $t("resetPassword.contactSupport") }}
            </UButton>
          </div>
        </UCard>
      </template>

      <template v-else-if="status === 'initializing'">
        <div class="text-center">
          <div class="mb-4 flex justify-center">
            <span
              class="inline-block size-8 animate-spin rounded-full border-2 border-current border-t-transparent text-primary"
            />
          </div>
          <h1 class="mb-2 text-xl font-semibold text-highlighted">{{ $t("resetPassword.verifying") }}</h1>
          <p class="text-sm text-muted">{{ $t("resetPassword.redirecting") }}</p>
        </div>
      </template>

      <template v-else>
        <div class="mb-8 text-center">
          <h1 class="mb-2 text-3xl font-bold text-toned">{{ $t("resetPassword.title") }}</h1>
          <p class="text-muted">{{ $t("resetPassword.subtitle") }}</p>
        </div>
        <UCard class="bg-default/70 shadow-2xl">
          <UForm :state="formState" class="space-y-3" @submit="submit">
            <UAlert v-if="formError" color="error" variant="soft" :title="$t('common.error')" :description="formError" />
            <UFormField :label="$t('resetPassword.passwordLabel')" name="password" required>
              <UInput
                v-model="formState.password"
                type="password"
                :placeholder="$t('resetPassword.passwordPlaceholder')"
                size="lg"
                class="w-full"
                :disabled="loading"
              />
            </UFormField>
            <UFormField :label="$t('resetPassword.confirmPasswordLabel')" name="confirmPassword" required>
              <UInput
                v-model="formState.confirmPassword"
                type="password"
                :placeholder="$t('resetPassword.confirmPasswordPlaceholder')"
                size="lg"
                class="w-full"
                :disabled="loading"
              />
            </UFormField>
            <UButton type="submit" color="primary" size="lg" block :loading="loading">
              {{ loading ? $t("resetPassword.saving") : $t("resetPassword.submitBtn") }}
            </UButton>
          </UForm>
        </UCard>
      </template>
    </div>
  </div>
</template>
