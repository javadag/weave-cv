<script setup lang="ts">
import type { Template } from "~/constants/templates"
import { loadFont, preloadFont } from "~/utils/preview/core/fontUtils"

const modelValue = defineModel<boolean>({ default: false })
const selectedTemplate = ref<Template | null>(null)

const configsStore = useConfigsStore()
const toast = useToast()
const { t } = useI18n()

const handleTemplateSelect = (template: Template) => {
  selectedTemplate.value = template
}

const handleApply = async () => {
  if (!selectedTemplate.value) return
  const templateConfigs = selectedTemplate.value.configs
  const newFont = templateConfigs.general?.typography?.fontFamily
  if (newFont) {
    loadFont(newFont)
    await preloadFont(newFont)
  }
  const currentLayout = configsStore.configs.general.layout
  configsStore.setConfigs({
    ...templateConfigs,
    general: {
      ...templateConfigs.general,
      layout: {
        ...templateConfigs.general.layout,
        rtl: currentLayout.rtl,
        language: currentLayout.language,
        dateFormat: currentLayout.dateFormat,
        size: currentLayout.size,
        order: currentLayout.order
      }
    }
  })
  toast.add({
    title: t("editor.template.appliedTitle"),
    description: t("editor.template.appliedDesc", { name: selectedTemplate.value.name }),
    color: "success"
  })
  modelValue.value = false
  selectedTemplate.value = null
}

const handleCancel = () => {
  modelValue.value = false
  selectedTemplate.value = null
}

watch(modelValue, (isOpen) => {
  if (!isOpen) selectedTemplate.value = null
})
</script>

<template>
  <UModal
    v-model:open="modelValue"
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
              class="bg-primary/10 dark:bg-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            >
              <UIcon name="i-lucide-layout-template" class="text-primary size-5" />
            </div>
            <div>
              <h3 class="text-default text-lg font-semibold">{{ $t("editor.template.title") }}</h3>
              <p class="text-muted mt-1 text-sm">{{ $t("editor.template.subtitle") }}</p>
            </div>
          </div>
        </template>

        <TemplateGrid
          :selected-template-id="selectedTemplate?.id"
          @select="handleTemplateSelect"
        />

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="ghost" @click="handleCancel">{{ $t("common.cancel") }}</UButton>
            <UButton color="primary" :disabled="!selectedTemplate" @click="handleApply">{{
              $t("editor.template.applyBtn")
            }}</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
