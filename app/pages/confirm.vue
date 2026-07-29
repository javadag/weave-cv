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

const hashParams = computed(() => {
  const hash = route.hash
  if (!hash) return {}
  return Object.fromEntries(new URLSearchParams(route.hash))
})

const errorDescription = computed(
  () => (hashParams.value.error_description as string) || (hashParams.value.error as string) || ""
)
const hasError = computed(() => Boolean(errorDescription.value))

// Email passed from register page — means user just signed up and needs to confirm
const pendingEmail = route.query.email as string | undefined

const isProcessingCode = computed(() => Boolean(route.query.code))

const resendCooldown = ref(0)
const resendSuccess = ref(false)
const resendError = ref("")

const { pause: pauseCooldown, resume: resumeCooldown } = useIntervalFn(
  () => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) pauseCooldown()
  },
  1000,
  { immediate: false }
)

const resendEmail = async () => {
  if (!pendingEmail || resendCooldown.value > 0) return
  resendSuccess.value = false
  resendError.value = ""
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: pendingEmail,
    options: { emailRedirectTo: `${location.origin}/confirm` }
  })
  if (error) {
    resendError.value = error.message
    return
  }
  resendSuccess.value = true
  resendCooldown.value = 60
  resumeCooldown()
}

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
      <UCard class="bg-default/70 shadow-2xl">
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
        <template v-else-if="pendingEmail && !isProcessingCode">
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

          <div class="mt-5 flex flex-col gap-2">
            <UAlert v-if="resendSuccess" color="success" variant="soft" :description="$t('confirmPage.resendSent')" />
            <UAlert v-if="resendError" color="error" variant="soft" :description="resendError" />
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              block
              :disabled="resendCooldown > 0"
              @click="resendEmail"
            >
              {{
                resendCooldown > 0
                  ? $t("confirmPage.resendCooldown", { seconds: resendCooldown })
                  : $t("confirmPage.resendBtn")
              }}
            </UButton>
          </div>

          <p class="text-muted mt-6 text-xs">
            {{ $t("confirmPage.wrongEmail") }}
            <ULink to="/register" class="text-primary font-medium">{{ $t("confirmPage.signUpAgain") }}</ULink>
          </p>
        </template>

        <!-- Verifying email link / OAuth code being exchanged by @nuxtjs/supabase -->
        <template v-else-if="isProcessingCode">
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
      </UCard>
    </div>
  </div>
</template>
