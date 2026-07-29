<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()
const user = useSupabaseUser()

const modelValue = defineModel<boolean>({ default: false })

const TYPE_OPTIONS = computed(() => [
  { label: t("feedback.typeBug"), value: "bug" as const },
  { label: t("feedback.typeFeedback"), value: "feedback" as const },
  { label: t("feedback.typeFeature"), value: "feature" as const }
])

const type = ref<"bug" | "feedback" | "feature">("bug")
const email = ref("")
const message = ref("")
const website = ref("")
const isSending = ref(false)

watch(modelValue, (open) => {
  if (!open) {
  	return;
  }

  type.value = "bug"
  email.value = user.value?.email ?? ""
  message.value = ""
  website.value = ""
})

const canSubmit = computed(() => message.value.trim().length >= 5 && !isSending.value)

const handleSubmit = async () => {
  if (!canSubmit.value) return
  isSending.value = true
  try {
    await $fetch("/api/feedback", {
      method: "POST",
      body: {
        type: type.value,
        message: message.value.trim(),
        email: email.value.trim() || undefined,
        website: website.value,
        url: globalThis.window === undefined ? undefined : location.href,
        userAgent: typeof navigator === "undefined" ? undefined : navigator.userAgent
      }
    })
    toast.add({
      title: t("feedback.successTitle"),
      description: t("feedback.successDesc"),
      color: "success"
    })
    modelValue.value = false
  } catch (error) {
    console.error("Feedback submission failed:", error)
    toast.add({
      title: t("feedback.errorTitle"),
      description: t("feedback.errorDesc"),
      color: "error"
    })
  } finally {
    isSending.value = false
  }
}

const handleCancel = () => {
  if (isSending.value) return
  modelValue.value = false
}
</script>

<template>
  <UModal v-model:open="modelValue" :prevent-close="isSending">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20"
            >
              <UIcon name="i-lucide-message-circle-warning" class="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 class="text-default text-lg font-semibold">{{ $t("feedback.title") }}</h3>
              <p class="text-muted mt-1 text-sm">{{ $t("feedback.subtitle") }}</p>
            </div>
          </div>
        </template>

        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <div>
            <label class="text-default mb-1 block text-sm font-medium">{{ $t("feedback.typeLabel") }}</label>
            <USelect v-model="type" :items="TYPE_OPTIONS" value-key="value" class="w-full" />
          </div>

          <div>
            <label class="text-default mb-1 block text-sm font-medium">{{ $t("feedback.emailLabel") }}</label>
            <UInput v-model="email" type="email" :placeholder="$t('feedback.emailHint')" class="w-full" />
          </div>

          <div>
            <label class="text-default mb-1 block text-sm font-medium">{{ $t("feedback.messageLabel") }}</label>
            <UTextarea
              v-model="message"
              :rows="6"
              :maxlength="5000"
              :placeholder="$t('feedback.messagePlaceholder')"
              class="w-full"
              required
            />
            <p class="text-muted mt-1 text-end text-xs">{{ message.length }}/5000</p>
          </div>

          <input
            v-model="website"
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
            class="pointer-events-none absolute -left-2499.75 h-0 w-0 opacity-0"
          />
        </form>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="ghost" :disabled="isSending" @click="handleCancel">
              {{ $t("common.cancel") }}
            </UButton>
            <UButton color="primary" :loading="isSending" :disabled="!canSubmit" @click="handleSubmit">
              {{ $t("feedback.submit") }}
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
