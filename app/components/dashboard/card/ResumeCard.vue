<script setup lang="ts">
import DeleteResumeModal from "~/components/dashboard/card/DeleteResumeModal.vue"
import type { TResume } from "~/types/resume.types"
import ResumeCardContent from "./ResumeCardContent.vue"

interface Props {
  resume: TResume
  disableDuplicate?: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
  refresh: []
}>()

const { t } = useI18n()
const isDeleteModalOpen = ref(false)
const isDuplicating = ref(false)
const toast = useToast()

const refreshData = () => {
  emits("refresh")
}

const handleDeleteClick = () => {
  isDeleteModalOpen.value = true
}

const handleDuplicateClick = async () => {
  if (isDuplicating.value) return

  isDuplicating.value = true

  try {
    await $fetch(`/api/resumes/${props.resume.id}/duplicate`, {
      method: "POST"
    })

    toast.add({
      title: t("resumeCard.duplicateSuccessTitle"),
      description: t("resumeCard.duplicateSuccessDesc"),
      color: "success"
    })

    refreshData()
  } catch (error) {
    console.error("Failed to duplicate resume:", error)

    toast.add({
      title: t("resumeCard.duplicateErrorTitle"),
      description: t("resumeCard.duplicateErrorDesc"),
      color: "error"
    })
  } finally {
    isDuplicating.value = false
  }
}
</script>

<template>
  <UCard
    data-testid="resume-card"
    class="relative flex flex-col transition-shadow duration-200 hover:shadow-lg"
    :ui="{
      header: 'sm:px-4 py-3',
      body: 'sm:p-3 flex-1'
    }"
  >
    <div
      v-if="isDuplicating"
      class="bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px]"
    >
      <UIcon name="i-lucide-loader-2" class="text-primary size-8 animate-spin" />
    </div>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-default truncate text-sm font-semibold sm:text-base md:text-lg">
          {{ resume.title }}
        </h3>
        <UDropdownMenu
          :items="[
            [
              {
                label: isDuplicating ? $t('resumeCard.duplicating') : $t('resumeCard.duplicate'),
                icon: 'i-lucide-copy',
                disabled: isDuplicating || disableDuplicate,
                onSelect: () => handleDuplicateClick()
              },
              {
                label: $t('resumeCard.delete'),
                icon: 'i-lucide-trash',
                onSelect: () => handleDeleteClick()
              }
            ]
          ]"
          size="sm"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-ellipsis-vertical"
            size="sm"
            :loading="isDuplicating"
          />
        </UDropdownMenu>
      </div>
    </template>
    <ResumeCardContent :resume="resume" />
  </UCard>
  <DeleteResumeModal v-model="isDeleteModalOpen" :resume="resume" @deleted="refreshData" />
</template>
