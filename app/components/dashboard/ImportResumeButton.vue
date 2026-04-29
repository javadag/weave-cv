<script setup lang="ts">
import { FetchError } from "ofetch"
import type { TResume } from "~/types/resume.types"
import { extractTextFromPdf } from "~/utils/pdfImport/extractText"

interface Props {
  disabled?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  created: [resume: TResume]
}>()

const { t } = useI18n()
const jsonInputRef = ref<HTMLInputElement | null>(null)
const pdfInputRef = ref<HTMLInputElement | null>(null)
const isImporting = ref(false)
const toast = useToast()

const items = computed(() => [
  [
    {
      label: t("importResume.fromJson"),
      icon: "i-lucide-file-code",
      onSelect: () => jsonInputRef.value?.click()
    },
    {
      label: t("importResume.fromPdf"),
      icon: "i-lucide-file-text",
      description: t("importResume.pdfDesc"),
      onSelect: () => pdfInputRef.value?.click()
    }
  ]
])

async function createResume(body: { title: string; content: unknown; configs: unknown }): Promise<TResume> {
  const resume = await $fetch<TResume>("/api/resumes", { method: "POST", body })
  if (!resume?.id) throw new Error("Resume was created but no ID was returned")
  return resume
}

function handleError(error: unknown) {
  console.error("Failed to import resume:", error)
  toast.add({
    title: t("importResume.failedTitle"),
    description:
      error instanceof FetchError
        ? error.statusMessage
        : error instanceof Error
          ? error.message
          : t("importResume.errorUnexpected"),
    color: "error"
  })
}

const handleJsonChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  isImporting.value = true
  try {
    const text = await file.text()
    const data = JSON.parse(text)

    if (!data.title || !data.content || !data.configs) {
      throw new Error(t("importResume.errorInvalidJson"))
    }

    const resume = await createResume({ title: data.title, content: data.content, configs: data.configs })
    toast.add({
      title: t("importResume.successTitle"),
      description: t("importResume.jsonSuccessDesc", { title: data.title }),
      color: "success"
    })
    emit("created", resume)
  } catch (error) {
    handleError(error)
  } finally {
    isImporting.value = false
    if (jsonInputRef.value) jsonInputRef.value.value = ""
  }
}

const handlePdfChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  isImporting.value = true
  try {
    const text = await extractTextFromPdf(file)

    if (!text.trim()) {
      throw new Error(t("importResume.errorPdfNoText"))
    }

    const parsed = await $fetch<{ title: string; content: unknown; configs: unknown }>("/api/ai/parse-resume", {
      method: "POST",
      body: { text }
    })

    const resume = await createResume(parsed)
    toast.add({
      title: t("importResume.successTitle"),
      description: t("importResume.pdfSuccessDesc"),
      color: "success"
    })
    emit("created", resume)
  } catch (error) {
    handleError(error)
  } finally {
    isImporting.value = false
    if (pdfInputRef.value) pdfInputRef.value.value = ""
  }
}
</script>

<template>
  <div>
    <input ref="jsonInputRef" type="file" accept=".json" class="hidden" @change="handleJsonChange" />
    <input ref="pdfInputRef" type="file" accept=".pdf" class="hidden" @change="handlePdfChange" />

    <UDropdownMenu :items="items" :disabled="disabled || isImporting">
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-upload"
        :ui="{
          leadingIcon: 'size-4'
        }"
        trailing-icon="i-lucide-chevron-down"
        :disabled="disabled || isImporting"
        :loading="isImporting"
      >
        {{ $t("importResume.button") }}
      </UButton>
    </UDropdownMenu>
  </div>
</template>
