<script setup lang="ts">
import type { TResume } from "~/types/resume.types"

interface Props {
  resume: TResume
}

const props = defineProps<Props>()

const { t } = useI18n()
const modelValue = defineModel<boolean>({ default: false })
const isDeleting = ref(false)

const toast = useToast()

const emits = defineEmits<{
  deleted: [id: string]
}>()

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await $fetch(`/api/resumes/${props.resume.id}`, {
      method: "DELETE"
    })
    emits("deleted", props.resume.id)
    modelValue.value = false
  } catch (error) {
    console.error("Failed to delete resume:", error)
    toast.add({
      title: t("deleteResumeModal.errorTitle"),
      description: t("deleteResumeModal.errorDesc"),
      color: "error"
    })
  } finally {
    isDeleting.value = false
  }
}

const handleCancel = () => {
  modelValue.value = false
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
              <h3 class="text-lg font-semibold text-default">{{ $t("deleteResumeModal.title") }}</h3>
              <p class="text-sm text-muted mt-1">{{ $t("deleteResumeModal.subtitle") }}</p>
            </div>
          </div>
        </template>
        <p class="text-sm text-default">
          {{ $t("deleteResumeModal.messagePart1") }} <strong>{{ resume.title }}</strong>{{ $t("deleteResumeModal.messagePart2") }}
        </p>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="ghost" :disabled="isDeleting" @click="handleCancel"> {{ $t("common.cancel") }} </UButton>
            <UButton color="error" :loading="isDeleting" @click="handleDelete"> {{ $t("common.delete") }} </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
