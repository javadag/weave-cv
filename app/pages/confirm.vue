<script setup lang="ts">
import { CONTACT_EMAIL } from "~/constants/config"

const { t } = useI18n()

useHead({
  title: () => t("seo.confirm.title"),
  meta: [{ name: "robots", content: "noindex, nofollow" }]
})

const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const errorDescription = ref<string>((route.query.error_description as string) || (route.query.error as string) || "")

// Email passed from register page — means user just signed up and needs to confirm
const pendingEmail = route.query.email as string | undefined

// Detected on mount — what kind of link the user clicked
const hashType = ref<"signup" | "recovery" | null>(null)

onMounted(async () => {
  // PKCE flow: Supabase sends ?code= for email confirmation / OAuth callback
  const code = route.query.code as string | undefined
  if (code) {
    hashType.value = "signup"
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) errorDescription.value = error.message
    return
  }

  // Legacy implicit flow: hash-based token from older Supabase projects
  const hash = globalThis.location.hash
  if (!hash) return
  const p = new URLSearchParams(hash.slice(1))

  const hashError = p.get("error_description") || p.get("error") || ""
  if (hashError) {
    errorDescription.value = hashError
    return
  }

  if (p.get("access_token") || p.get("type") === "signup") {
    hashType.value = "signup"
    // supabase-js processes the token; watch(user) below redirects to dashboard
  }
})

const hasError = computed(() => Boolean(errorDescription.value))

// Redirect to dashboard once session is established (signup confirmation or OAuth)
watch(
  user,
  () => {
    if (user.value && !hasError.value) {
      navigateTo("/dashboard")
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center px-6">
    <div class="w-full max-w-md text-center">
      <!-- Error state -->
      <template v-if="hasError">
        <UAlert
          color="error"
          variant="soft"
          :title="$t('confirmPage.errorTitle')"
          :description="errorDescription"
          class="mb-5 text-left"
        />
        <div class="flex flex-col gap-2">
          <UButton to="/login" color="primary" size="lg" block>{{ $t("confirmPage.tryAgain") }}</UButton>
          <UButton :to="`mailto:${CONTACT_EMAIL}`" color="neutral" variant="ghost" size="lg" block>
            {{ $t("confirmPage.contactSupport") }}
          </UButton>
        </div>
      </template>

      <!-- Check inbox — user just registered, hasn't clicked the link yet -->
      <template v-else-if="pendingEmail && !hashType">
        <div class="mb-5 flex justify-center">
          <span class="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-full">
            <UIcon name="i-lucide-mail" class="size-7" />
          </span>
        </div>
        <h1 class="text-highlighted mb-2 text-2xl font-bold">{{ $t("confirmPage.checkInbox") }}</h1>
        <p class="text-muted mb-1 text-sm">{{ $t("confirmPage.sentLinkTo") }}</p>
        <p class="text-highlighted mb-6 font-medium">{{ pendingEmail }}</p>
        <p class="text-muted text-sm">
          {{ $t("confirmPage.clickLinkHint") }}
        </p>
        <p class="text-muted mt-6 text-xs">
          {{ $t("confirmPage.wrongEmail") }}
          <ULink to="/register" class="text-primary font-medium">{{ $t("confirmPage.signUpAgain") }}</ULink>
        </p>
      </template>

      <!-- Verifying email link (hash token being processed by supabase-js) -->
      <template v-else-if="hashType === 'signup'">
        <div class="mb-4 flex justify-center">
          <span
            class="text-primary inline-block size-8 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        </div>
        <h1 class="text-highlighted mb-2 text-xl font-semibold">{{ $t("confirmPage.verifyingEmail") }}</h1>
        <p class="text-muted text-sm">{{ $t("confirmPage.redirecting") }}</p>
      </template>

      <!-- OAuth / generic waiting state -->
      <template v-else>
        <div class="mb-4 flex justify-center">
          <span
            class="text-primary inline-block size-8 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        </div>
        <p class="text-muted text-sm">{{ $t("confirmPage.completing") }}</p>
      </template>
    </div>
  </div>
</template>
