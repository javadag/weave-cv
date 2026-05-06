<script setup lang="ts">
interface Props {
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const exporting = ref(false)
const resumeStore = useResumeStore()
const { title, core, personal } = storeToRefs(resumeStore)
const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const handleExport = () => {
  if (props.disabled || exporting.value) return

  exporting.value = true

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
    const url = globalThis.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${title.value || "resume"}-export.json`
    document.body.append(link)
    link.click()
    link.remove()
    globalThis.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error exporting data:", error)
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <UButton
    :disabled="props.disabled || exporting"
    color="neutral"
    variant="ghost"
    size="lg"
    :icon="exporting ? 'i-lucide-loader-2' : 'i-lucide-file-code'"
    :class="[
      !props.disabled && !exporting && 'hover:bg-elevated/50 hover:shadow-sm',
      exporting && '[&_svg]:animate-spin',
      (props.disabled || exporting) && 'cursor-not-allowed opacity-50'
    ]"
    @click="handleExport"
  >
    <span class="hidden sm:inline">{{ exporting ? "Exporting..." : "Export JSON" }}</span>
    <span class="sm:hidden">{{ exporting ? "..." : "Export" }}</span>
  </UButton>
</template>
