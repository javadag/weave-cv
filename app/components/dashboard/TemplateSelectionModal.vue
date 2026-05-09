<script setup lang="ts">
import { FetchError } from "ofetch"
import { DUMMY_CORE_SECTIONS, DUMMY_PERSONAL_SECTION, DUMMY_TITLE } from "~/constants/dummyData"
import type { Template } from "~/constants/templates"
import type { TResume } from "~/types/resume.types"

const { t } = useI18n()
const modelValue = defineModel<boolean>({ default: false })
const selectedTemplate = ref<Template | null>(null)
const isCreating = ref(false)

const toast = useToast()

const emits = defineEmits<{
  created: [resume: TResume]
}>()

const handleTemplateSelect = (template: Template) => {
  selectedTemplate.value = template
}

const handleCreate = async () => {
  if (!selectedTemplate.value) return

  isCreating.value = true
  try {
    const newResume = await $fetch<TResume>("/api/resumes", {
      method: "POST",
      body: {
        title: DUMMY_TITLE,
        content: {
          personal: DUMMY_PERSONAL_SECTION,
          core: DUMMY_CORE_SECTIONS
        },
        configs: selectedTemplate.value.configs
      }
    })

    if (!newResume?.id) {
      throw new Error("Resume was created but no ID was returned")
    }

    toast.add({
      title: t("createResume.successTitle"),
      description: t("createResume.successDesc"),
      color: "success"
    })

    emits("created", newResume)

    modelValue.value = false
    selectedTemplate.value = null
  } catch (error) {
    console.error("Failed to create resume:", error)

    toast.add({
      title: t("createResume.errorTitle"),
      description: error instanceof FetchError ? error.statusMessage : t("createResume.errorUnexpected"),
      color: "error"
    })
  } finally {
    isCreating.value = false
  }
}

const handleCancel = () => {
  modelValue.value = false
  selectedTemplate.value = null
}

watch(modelValue, (isOpen) => {
  if (!isOpen) {
    selectedTemplate.value = null
  }
})
</script>

<template>
  <UModal
    v-model:open="modelValue"
    :prevent-close="isCreating"
    :ui="{
      content: 'sm:max-w-4xl flex flex-col max-h-[90dvh]'
    }"
  >
    <template #content>
      <UCard
        :ui="{
          root: 'flex flex-col flex-1 overflow-hidden',
          body: 'flex-1 overflow-hidden flex flex-col p-4'
        }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="bg-primary/10 dark:bg-primary/20 flex size-10 shrink-0 items-center justify-center rounded-full"
            >
              <UIcon name="i-lucide-file-text" class="text-primary size-5" />
            </div>
            <div>
              <h3 class="text-default text-lg font-semibold">{{ $t("createResume.modalTitle") }}</h3>
              <p class="text-muted mt-1 text-sm">{{ $t("createResume.modalSubtitle") }}</p>
            </div>
          </div>
        </template>

        <TemplateGrid
          :selected-template-id="selectedTemplate?.id"
          :disabled="isCreating"
          show-aspect-ratio
          @select="handleTemplateSelect"
        />

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="ghost" :disabled="isCreating" @click="handleCancel">
              {{ $t("common.cancel") }}
            </UButton>
            <UButton
              color="primary"
              :disabled="!selectedTemplate || isCreating"
              :loading="isCreating"
              @click="handleCreate"
            >
              {{ $t("createResume.createBtn") }}
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
