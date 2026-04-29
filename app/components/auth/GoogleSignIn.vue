<script setup lang="ts">
const emit = defineEmits<{
  error: [message: string]
}>()

const supabase = useSupabaseClient()

const signInWithGoogle = async () => {
  const { error: googleError } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${globalThis.location.origin}/confirm`
    }
  })

  if (googleError) {
    emit("error", googleError?.message || "An unexpected error occurred")
    console.error("Google sign-in error:", googleError?.message || "An unexpected error occurred")
  }
}
</script>
<template>
  <UButton color="neutral" variant="outline" size="lg" block @click="signInWithGoogle">
    <span
      class="text-xs size-5 bg-gradient-to-r from-blue-500 to-red-500 rounded-sm flex items-center justify-center font-bold text-inverted"
      >G</span
    >
    {{ $t("common.withGoogle") }}
  </UButton>
</template>
