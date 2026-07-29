<script setup lang="ts">
import { FetchError } from "ofetch"

interface Props {
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const modelValue = defineModel<boolean>({ default: false })

const loading = ref(false)
const toast = useToast()
const resumeStore = useResumeStore()
const { title, core, personal } = storeToRefs(resumeStore)
const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const handlePdfExport = async () => {
  if (props.disabled || loading.value) return
  loading.value = true

  const element = document.querySelector("#resumePages") as HTMLElement | null
  if (!element) {
    console.error("Resume preview not found")
    loading.value = false
    return
  }

  try {
    const clonedElement = element.cloneNode(true) as HTMLElement
    clonedElement.classList.remove("resumePage")

    const html = clonedElement.outerHTML
    const format = configs.value.general.layout.size
    const fontFamily = configs.value.general.typography.fontFamily

    const response = await $fetch<Blob>("/api/pdf", {
      method: "POST",
      body: {
        html,
        format,
        fontFamily
      },
      responseType: "blob"
    })

    const blob = new Blob([response], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${title.value || "resume"}.pdf`
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)

    modelValue.value = false
  } catch (error) {
    console.error("Error generating PDF:", error)
    toast.add({
      title: "PDF export failed",
      description:
        error instanceof FetchError
          ? error.statusMessage
          : error instanceof Error
            ? error.message
            : "Could not generate PDF. Please try again.",
      color: "error"
    })
  } finally {
    loading.value = false
  }
}

const handleJsonExport = () => {
  if (props.disabled || loading.value) return

  try {
    const exportData = {
      title: title.value,
      configs: configs.value,
      content: {
        personal: personal.value,
        core: core.value
      }
    }

    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${title.value || "resume"}-export.json`
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)

    modelValue.value = false
  } catch (error) {
    console.error("Error exporting data:", error)
  }
}

const handleCancel = () => {
  modelValue.value = false
}
</script>

<template>
  <UModal
    v-model:open="modelValue"
    :ui="{
      content: 'sm:max-w-lg'
    }"
  >
    <template #content>
      <UCard
        :ui="{
          body: 'p-4 sm:p-6'
        }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="bg-primary/10 dark:bg-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            >
              <UIcon name="i-lucide-file-down" class="text-primary size-5" />
            </div>
            <div>
              <h3 class="text-default text-lg font-semibold">{{ $t("editor.export.title") }}</h3>
              <p class="text-muted mt-1 text-sm">{{ $t("editor.export.subtitle") }}</p>
            </div>
          </div>
        </template>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            :disabled="props.disabled || loading"
            class="border-muted hover:border-primary/40 hover:bg-primary/5 flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            @click="handlePdfExport"
          >
            <div
              class="bg-primary/10 dark:bg-primary/20 flex h-14 w-14 items-center justify-center rounded-full"
            >
              <UIcon
                :name="loading ? 'i-lucide-loader-2' : 'i-lucide-file-text'"
                class="text-primary size-6"
                :class="{ 'animate-spin': loading }"
              />
            </div>
            <div>
              <p class="text-default font-medium">{{ $t("editor.export.pdfOption") }}</p>
              <p class="text-muted mt-1 text-sm">{{ $t("editor.export.pdfDesc") }}</p>
            </div>
          </button>

          <button
            :disabled="props.disabled || loading"
            class="border-muted hover:border-primary/40 hover:bg-primary/5 flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            @click="handleJsonExport"
          >
            <div
              class="bg-primary/10 dark:bg-primary/20 flex h-14 w-14 items-center justify-center rounded-full"
            >
              <UIcon name="i-lucide-brackets" class="text-primary size-6" />
            </div>
            <div>
              <p class="text-default font-medium">{{ $t("editor.export.jsonOption") }}</p>
              <p class="text-muted mt-1 text-sm">{{ $t("editor.export.jsonDesc") }}</p>
            </div>
          </button>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton color="neutral" variant="ghost" @click="handleCancel">{{ $t("common.cancel") }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
