<script setup lang="ts">
const emit = defineEmits<{
  error: [message: string]
}>()

const supabase = useSupabaseClient()

const signInWithGithub = async () => {
  const { error: githubError } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${location.origin}/confirm`
    }
  })

  if (githubError) {
    emit("error", githubError?.message || "An unexpected error occurred")
    console.error("GitHub sign-in error:", githubError?.message || "An unexpected error occurred")
  }
}
</script>
<template>
  <UButton color="neutral" variant="outline" size="lg" block @click="signInWithGithub">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"
      />
    </svg>
    {{ $t("common.withGithub") }}
  </UButton>
</template>
