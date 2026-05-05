<script setup lang="ts">
import { FetchError } from "ofetch"
import { DUMMY_CORE_SECTIONS, DUMMY_PERSONAL_SECTION, DUMMY_TITLE } from "~/constants/dummyData"
import { PAPER_SIZES } from "~/constants/papers"
import { TEMPLATES, type Template } from "~/constants/templates"
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
    class="max-w-compact"
    :ui="{
      content: 'sm:max-w-4xl'
    }"
  >
    <template #content>
      <UCard>
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
        <div>
          <div class="grid max-h-175 grid-cols-1 items-start justify-start gap-4 overflow-scroll md:grid-cols-2">
            <button
              v-for="template in TEMPLATES"
              :key="template.id"
              type="button"
              :disabled="isCreating"
              :style="{
                aspectRatio: `${PAPER_SIZES['A4'].w / PAPER_SIZES['A4'].h}`,
                width: `${PAPER_SIZES['A4'].w * 0.5}mm`
              }"
              :class="[
                'group relative flex flex-col items-center justify-between rounded-lg border-2 p-4 text-left transition-all duration-200 hover:shadow-lg',
                selectedTemplate?.id === template.id
                  ? 'border-primary bg-primary/5 ring-primary/20 ring-2'
                  : 'border-default/20 hover:border-primary/40 bg-default/50',
                isCreating && 'cursor-not-allowed opacity-50'
              ]"
              @click="handleTemplateSelect(template)"
            >
              <div v-if="template.screenshot">
                <NuxtImg :src="template.screenshot" alt="Template Screenshot" class="h-full w-full object-cover" />
              </div>
              <div
                v-else
                class="from-primary/20 to-primary/5 mb-3 flex size-full items-center justify-center overflow-hidden rounded-md bg-linear-to-br"
              >
                <div class="text-center">
                  <UIcon name="i-lucide-layout-template" class="text-primary/60 mx-auto mb-2 h-8 w-8" />
                  <p class="text-primary/60 text-xs font-medium">{{ template.name }}</p>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <h4 class="text-default font-semibold">{{ template.name }}</h4>
                  <UIcon
                    v-if="selectedTemplate?.id === template.id"
                    name="i-lucide-check-circle"
                    class="text-primary h-4 w-4"
                  />
                </div>
                <p class="text-muted line-clamp-2 text-sm">{{ template.description }}</p>
              </div>
            </button>
          </div>
          <div v-if="!selectedTemplate" class="bg-muted/50 border-default/20 mt-4 rounded-lg border p-3">
            <p class="text-muted text-center text-sm">{{ $t("createResume.selectHint") }}</p>
          </div>
        </div>
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
