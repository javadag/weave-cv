<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t("seo.register.title"),
  description: () => t("seo.register.description"),
  ogTitle: () => t("seo.register.title"),
  ogDescription: () => t("seo.register.description"),
  ogUrl: "/register",
  twitterTitle: () => t("seo.register.title"),
  twitterDescription: () => t("seo.register.description"),
  robots: {
    nofollow: true,
    noindex: true
  }
})

const supabase = useSupabaseClient()

const formState = reactive({
  email: "",
  password: "",
  confirmPassword: ""
})

const loading = ref(false)
const error = ref("")

const signUpWithPassword = async () => {
  if (!formState.email) {
    error.value = t("auth.register.errorEmail")
    return
  }
  if (!formState.password) {
    error.value = t("auth.register.errorPassword")
    return
  }
  if (!formState.confirmPassword) {
    error.value = t("auth.register.errorConfirm")
    return
  }
  if (formState.password !== formState.confirmPassword) {
    error.value = t("auth.register.errorMatch")
    return
  }

  loading.value = true
  error.value = ""

  try {
    const { error: signUpError } = await supabase.auth.signUp({
      email: formState.email,
      password: formState.password,
      options: {
        emailRedirectTo: `${globalThis.location.origin}/confirm`
      }
    })

    if (signUpError) {
      error.value = signUpError.message
    } else {
      await navigateTo(`/confirm?email=${encodeURIComponent(formState.email)}`)
    }
  } catch {
    error.value = t("auth.register.errorUnexpected")
  } finally {
    loading.value = false
  }
}

const signUpWithGoogle = async () => {
  const { error: googleError } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${globalThis.location.origin}/dashboard`
    }
  })

  if (googleError) {
    error.value = googleError.message
    console.error("Google sign-up error:", googleError.message)
  }
}

const signUpWithGithub = async () => {
  const { error: githubError } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${globalThis.location.origin}/dashboard`
    }
  })

  if (githubError) {
    error.value = githubError.message
    console.error("GitHub sign-up error:", githubError.message)
  }
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="relative w-full max-w-md">
      <div class="mb-8 text-center">
        <h1 class="text-toned mb-2 text-3xl font-bold">{{ $t("auth.register.title") }}</h1>
        <p class="text-muted">{{ $t("auth.register.subtitle") }}</p>
      </div>
      <UCard class="bg-default/70 shadow-2xl">
        <UForm :state="formState" class="space-y-3" @submit="signUpWithPassword">
          <UAlert
            v-if="error"
            color="error"
            variant="soft"
            :title="$t('userDropdown.errorTitle')"
            :description="error"
          />

          <UFormField :label="$t('auth.register.emailLabel')" name="email" required>
            <UInput
              v-model="formState.email"
              type="email"
              :placeholder="$t('auth.register.emailPlaceholder')"
              size="lg"
              class="w-full"
              :disabled="loading"
            />
          </UFormField>

          <UFormField :label="$t('auth.register.passwordLabel')" name="password" required>
            <UInput
              v-model="formState.password"
              type="password"
              :placeholder="$t('auth.register.passwordPlaceholder')"
              size="lg"
              class="w-full"
              :disabled="loading"
            />
          </UFormField>

          <UFormField :label="$t('auth.register.confirmPasswordLabel')" name="confirmPassword" required>
            <UInput
              v-model="formState.confirmPassword"
              type="password"
              :placeholder="$t('auth.register.confirmPasswordPlaceholder')"
              size="lg"
              class="w-full"
              :disabled="loading"
            />
          </UFormField>
          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            class="cursor-pointer"
            :loading="loading"
            :disabled="!formState.email || !formState.password || !formState.confirmPassword"
          >
            {{ loading ? $t("auth.register.creating") : $t("auth.register.createBtn") }}
          </UButton>
          <div
            class="after:border-muted relative flex items-center justify-center after:absolute after:inset-0 after:top-1/2 after:z-[-1] after:border-t after:content-['']"
          >
            <span class="text-muted relative flex justify-center px-2 text-sm">{{
              $t("auth.register.orContinueWith")
            }}</span>
          </div>
          <UButton color="neutral" variant="outline" size="lg" block @click="signUpWithGoogle">
            <span
              class="text-inverted flex size-5 items-center justify-center rounded-sm bg-linear-to-r from-blue-500 to-red-500 text-xs font-bold"
              >G</span
            >
            {{ $t("auth.register.withGoogle") }}
          </UButton>
          <UButton color="neutral" variant="outline" size="lg" block @click="signUpWithGithub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"
              />
            </svg>
            {{ $t("auth.register.withGithub") }}
          </UButton>
        </UForm>
      </UCard>
      <p class="text-muted mt-8 text-center text-sm">
        {{ $t("auth.register.haveAccount") }}
        <ULink class="text-primary font-medium" to="/login"> {{ $t("auth.register.signInHere") }} </ULink>
      </p>
    </div>
  </div>
</template>
