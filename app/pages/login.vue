<script setup lang="ts">
import GitHubSignIn from "~/components/auth/GitHubSignIn.vue"
import GoogleSignIn from "~/components/auth/GoogleSignIn.vue"

const { t } = useI18n()

useHead({
  title: "Sign In - Weave CV",
  meta: [
    {
      name: "description",
      content: "Sign in to your Weave CV account to access and manage your resumes."
    },
    {
      property: "og:title",
      content: "Sign In - Weave CV"
    },
    {
      property: "og:description",
      content: "Sign in to your Weave CV account to access and manage your resumes."
    },
    {
      property: "og:url",
      content: "/login"
    },
    {
      name: "robots",
      content: "noindex, nofollow"
    }
  ]
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
      await navigateTo("/confirm")
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
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-toned mb-2">{{ $t("auth.login.title") }}</h1>
        <p class="text-muted">{{ $t("auth.login.subtitle") }}</p>
      </div>
      <UCard class="bg-default/70 shadow-2xl">
        <UForm :state="formState" class="space-y-3" @submit="signInWithPassword">
          <UAlert v-if="error" color="error" variant="soft" :title="$t('userDropdown.errorTitle')" :description="error" />

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
            <ULink class="text-xs text-muted hover:text-primary transition-colors" to="/forgot-password">
              {{ $t("auth.login.forgotPassword") }}
            </ULink>
          </div>
          <UButton type="submit" color="primary" size="lg" block :loading="loading">
            {{ loading ? $t("auth.login.signingIn") : $t("auth.login.signInBtn") }}
          </UButton>
          <div
            class="relative flex justify-center after:z-[-1] items-center after:content-[''] after:absolute after:top-1/2 after:inset-0 after:border-t after:border-muted"
          >
            <span class="px-2 relative flex justify-center text-sm bg-default text-muted">{{ $t("auth.login.orContinueWith") }}</span>
          </div>
          <GoogleSignIn />
          <GitHubSignIn @error="(msg: string) => (error = msg)" />
        </UForm>
      </UCard>
      <p class="text-center mt-8 text-sm text-muted">
        {{ $t("auth.login.noAccount") }}
        <ULink class="font-medium text-primary" to="/register"> {{ $t("auth.login.signUpFree") }} </ULink>
      </p>
    </div>
  </div>
</template>
