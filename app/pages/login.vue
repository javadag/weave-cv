<script setup lang="ts">
import GitHubSignIn from "~/components/auth/GitHubSignIn.vue"
import GoogleSignIn from "~/components/auth/GoogleSignIn.vue"

const { t } = useI18n()

useSeoMeta({
  title: () => t("seo.login.title"),
  description: () => t("seo.login.description"),
  ogTitle: () => t("seo.login.title"),
  ogDescription: () => t("seo.login.description"),
  ogUrl: "/login",
  twitterTitle: () => t("seo.login.title"),
  twitterDescription: () => t("seo.login.description")
})

const user = useSupabaseUser()

if (user.value) {
  navigateTo("/dashboard")
}

const supabase = useSupabaseClient()

const formState = reactive({
  email: "",
  password: ""
})

const loading = ref(false)
const error = ref("")

const signInWithPassword = async () => {
  if (!formState.email) {
    error.value = t("auth.login.errorEmail")
    return
  }
  if (!formState.password) {
    error.value = t("auth.login.errorPassword")
    return
  }

  loading.value = true
  error.value = ""

  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: formState.email,
      password: formState.password
    })

    if (signInError) {
      error.value = signInError.message
    } else {
      await navigateTo("/dashboard")
    }
  } catch {
    error.value = t("auth.login.errorUnexpected")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="relative w-full max-w-md">
      <div class="mb-8 text-center">
        <h1 class="text-toned mb-2 text-3xl font-bold">{{ $t("auth.login.title") }}</h1>
        <p class="text-muted">{{ $t("auth.login.subtitle") }}</p>
      </div>
      <UCard class="bg-default/70 shadow-2xl">
        <UForm :state="formState" class="space-y-3" @submit="signInWithPassword">
          <UAlert
            v-if="error"
            color="error"
            variant="soft"
            :title="$t('userDropdown.errorTitle')"
            :description="error"
          />

          <UFormField :label="$t('auth.login.emailLabel')" name="email" required>
            <UInput
              v-model="formState.email"
              type="email"
              :placeholder="$t('auth.login.emailPlaceholder')"
              size="lg"
              class="w-full"
              :disabled="loading"
            />
          </UFormField>

          <UFormField :label="$t('auth.login.passwordLabel')" name="password" required>
            <UInput
              v-model="formState.password"
              type="password"
              :placeholder="$t('auth.login.passwordPlaceholder')"
              size="lg"
              class="w-full"
              :disabled="loading"
            />
          </UFormField>
          <div class="flex justify-end">
            <ULink class="text-muted hover:text-primary text-xs transition-colors" to="/forgot-password">
              {{ $t("auth.login.forgotPassword") }}
            </ULink>
          </div>
          <UButton type="submit" color="primary" size="lg" block :loading="loading">
            {{ loading ? $t("auth.login.signingIn") : $t("auth.login.signInBtn") }}
          </UButton>
          <div
            class="after:border-muted relative flex items-center justify-center after:absolute after:inset-0 after:top-1/2 after:z-[-1] after:border-t after:content-['']"
          >
            <span class="bg-default text-muted relative flex justify-center px-2 text-sm">{{
              $t("auth.login.orContinueWith")
            }}</span>
          </div>
          <GoogleSignIn />
          <GitHubSignIn @error="(msg: string) => (error = msg)" />
        </UForm>
      </UCard>
      <p class="text-muted mt-8 text-center text-sm">
        {{ $t("auth.login.noAccount") }}
        <ULink class="text-primary font-medium" to="/register"> {{ $t("auth.login.signUpFree") }} </ULink>
      </p>
    </div>
  </div>
</template>
