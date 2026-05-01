<script setup lang="ts">
const modelValue = defineModel<boolean>({ default: false })
const isDeleting = ref(false)

const { t } = useI18n()
const supabase = useSupabaseClient()
const router = useRouter()
const toast = useToast()

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await $fetch("/api/account", { method: "DELETE" })
    await supabase.auth.signOut()
    toast.add({
      title: t("deleteAccountModal.successTitle"),
      description: t("deleteAccountModal.successDesc"),
      color: "success"
    })
    modelValue.value = false
    await router.push("/")
  } catch (error) {
    console.error("Failed to delete account:", error)
    toast.add({
      title: t("deleteAccountModal.errorTitle"),
      description: t("deleteAccountModal.errorDesc"),
      color: "error"
    })
  } finally {
    isDeleting.value = false
  }
}

const handleCancel = () => {
  if (!isDeleting.value) modelValue.value = false
}
</script>

<template>
  <UModal v-model:open="modelValue" :prevent-close="isDeleting">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="bg-error/10 flex size-10 shrink-0 items-center justify-center rounded-full">
              <UIcon name="i-lucide-alert-triangle" class="text-error size-5" />
            </div>
            <div>
              <h3 class="text-default text-lg font-semibold">{{ $t("deleteAccountModal.title") }}</h3>
              <p class="text-muted mt-0.5 text-sm">{{ $t("deleteAccountModal.subtitle") }}</p>
            </div>
          </div>
        </template>
        <p class="text-default text-sm">
          {{ $t("deleteAccountModal.messagePart1") }}
          <strong>{{ $t("deleteAccountModal.messageStrong") }}</strong>
          {{ $t("deleteAccountModal.messagePart2") }}
        </p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="ghost" :disabled="isDeleting" @click="handleCancel">{{
              $t("common.cancel")
            }}</UButton>
            <UButton color="error" :loading="isDeleting" @click="handleDelete">{{
              $t("deleteAccountModal.title")
            }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
