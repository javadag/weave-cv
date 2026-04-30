<script setup lang="ts">
interface Props {
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const downloading = ref(false)
const resumeStore = useResumeStore()
const { title } = storeToRefs(resumeStore)
const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const handleDownload = async () => {
  if (props.disabled || downloading.value) return

  downloading.value = true

  const element = document.querySelector("#resumePages") as HTMLElement | null
  if (!element) {
    console.error("Resume preview not found")
    downloading.value = false
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
    const url = globalThis.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${title.value || "resume"}.pdf`
    document.body.append(link)
    link.click()
    link.remove()
    globalThis.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error generating PDF:", error)
  } finally {
    downloading.value = false
  }
}
</script>

<template>
  <UButton
    :disabled="props.disabled || downloading"
    color="neutral"
    variant="ghost"
    :loading="downloading"
    size="lg"
    :icon="downloading ? 'i-lucide-loader-2' : 'i-lucide-download'"
    :ui="{
      leadingIcon: 'group-data-[state=loading]:animate-spin'
    }"
    :class="[!props.disabled && !downloading && 'hover:bg-elevated/50 hover:shadow-sm']"
    @click="handleDownload"
  >
    <span class="hidden sm:inline">{{ downloading ? $t('editor.header.generating') : $t('editor.header.downloadPdf') }}</span>
    <span class="sm:hidden">{{ downloading ? '...' : $t('editor.header.download') }}</span>
  </UButton>
</template>
