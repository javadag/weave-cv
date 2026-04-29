<script setup lang="ts">
const modelValue = defineModel<boolean>({ default: false })
const isDeleting = ref(false)

const supabase = useSupabaseClient()
const router = useRouter()
const toast = useToast()

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await $fetch("/api/user", { method: "DELETE" })
    await supabase.auth.signOut()
    await router.push("/")
    toast.add({
      title: "Account deleted",
      description: "Your account and all data have been permanently deleted.",
      color: "success"
    })
  } catch {
    toast.add({
      title: "Failed to delete account",
      description: "Please try again or contact support.",
      color: "error"
    })
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <UModal v-model:open="modelValue" :prevent-close="isDeleting">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center"
            >
              <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-default">Delete Account</h3>
              <p class="text-sm text-muted mt-1">This action cannot be undone</p>
            </div>
          </div>
        </template>
        <p class="text-sm text-default">
          Are you sure you want to permanently delete your account? This will remove
          <strong>all your resumes and data</strong> and you will not be able to recover them.
        </p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="ghost" :disabled="isDeleting" @click="modelValue = false">
              Cancel
            </UButton>
            <UButton color="error" :loading="isDeleting" @click="handleDelete"> Delete Account </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
