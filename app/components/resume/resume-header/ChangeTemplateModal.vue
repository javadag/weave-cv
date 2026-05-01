<script setup lang="ts">
import { PAPER_SIZES } from "~/constants/papers"
import { TEMPLATES, type Template } from "~/constants/templates"
import { reconcileSectionsOrder } from "~/utils/configs/reconcileSectionsOrder"

const modelValue = defineModel<boolean>({ default: false })
const selectedTemplate = ref<Template | null>(null)

const configsStore = useConfigsStore()
const resumeStore = useResumeStore()
const toast = useToast()
const { t } = useI18n()

const handleTemplateSelect = (template: Template) => {
  selectedTemplate.value = template
}

const handleApply = () => {
  if (!selectedTemplate.value) return
  const templateConfigs = selectedTemplate.value.configs
  const reconciledOrder = reconcileSectionsOrder(
    templateConfigs.general.layout.order,
    configsStore.configs.general.layout.order,
    Object.keys(resumeStore.core ?? {})
  )
  configsStore.setConfigs({
    ...templateConfigs,
    general: {
      ...templateConfigs.general,
      layout: {
        ...templateConfigs.general.layout,
        order: reconciledOrder
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
  <UModal v-model:open="modelValue" class="max-w-compact">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="bg-primary/10 dark:bg-primary/20 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
            >
              <UIcon name="i-lucide-layout-template" class="text-primary h-5 w-5" />
            </div>
            <div>
              <h3 class="text-default text-lg font-semibold">{{ $t("editor.template.title") }}</h3>
              <p class="text-muted mt-1 text-sm">{{ $t("editor.template.subtitle") }}</p>
            </div>
          </div>
        </template>

        <div class="py-2">
          <div class="flex max-h-175 flex-wrap items-start justify-start gap-4 overflow-scroll">
            <button
              v-for="template in TEMPLATES"
              :key="template.id"
              type="button"
              :style="{
                aspectRatio: `${PAPER_SIZES['A4'].w / PAPER_SIZES['A4'].h}`,
                width: `${PAPER_SIZES['A4'].w * 0.5}mm`
              }"
              :class="[
                'group relative flex flex-col items-center justify-between rounded-lg border-2 p-4 text-left transition-all duration-200 hover:shadow-lg',
                selectedTemplate?.id === template.id
                  ? 'border-primary bg-primary/5 ring-primary/20 ring-2'
                  : 'border-default/20 hover:border-primary/40 bg-default/50'
              ]"
              @click="handleTemplateSelect(template)"
            >
              <div v-if="template.screenshot">
                <img :src="template.screenshot" alt="Template Screenshot" class="h-full w-full object-cover" />
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
            <p class="text-muted text-center text-sm">{{ $t("editor.template.selectHint") }}</p>
          </div>
        </div>

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
