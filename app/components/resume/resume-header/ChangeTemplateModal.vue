<script setup lang="ts">
import { PAPER_SIZES } from "~/constants/papers"
import { TEMPLATES, type Template } from "~/constants/templates"

const modelValue = defineModel<boolean>({ default: false })
const selectedTemplate = ref<Template | null>(null)

const configsStore = useConfigsStore()
const toast = useToast()

const handleTemplateSelect = (template: Template) => {
  selectedTemplate.value = template
}

const handleApply = () => {
  if (!selectedTemplate.value) return
  configsStore.setConfigs(selectedTemplate.value.configs)
  toast.add({
    title: "Template Applied",
    description: `"${selectedTemplate.value.name}" has been applied — your content is preserved`,
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
              class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center"
            >
              <UIcon name="i-lucide-layout-template" class="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-default">Change Template</h3>
              <p class="text-sm text-muted mt-1">Pick a new style — your content will be preserved</p>
            </div>
          </div>
        </template>

        <div class="py-2">
          <div class="flex flex-wrap items-start max-h-[700px] overflow-scroll justify-start gap-4">
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
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-default/20 hover:border-primary/40 bg-default/50'
              ]"
              @click="handleTemplateSelect(template)"
            >
              <div v-if="template.screenshot">
                <img :src="template.screenshot" alt="Template Screenshot" class="w-full h-full object-cover" />
              </div>
              <div
                v-else
                class="size-full rounded-md mb-3 flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5"
              >
                <div class="text-center">
                  <UIcon name="i-lucide-layout-template" class="w-8 h-8 text-primary/60 mx-auto mb-2" />
                  <p class="text-xs text-primary/60 font-medium">{{ template.name }}</p>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <h4 class="font-semibold text-default">{{ template.name }}</h4>
                  <UIcon
                    v-if="selectedTemplate?.id === template.id"
                    name="i-lucide-check-circle"
                    class="w-4 h-4 text-primary"
                  />
                </div>
                <p class="text-sm text-muted line-clamp-2">{{ template.description }}</p>
              </div>
            </button>
          </div>
          <div v-if="!selectedTemplate" class="mt-4 p-3 rounded-lg bg-muted/50 border border-default/20">
            <p class="text-sm text-muted text-center">Select a template to apply</p>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="ghost" @click="handleCancel">Cancel</UButton>
            <UButton color="primary" :disabled="!selectedTemplate" @click="handleApply"> Apply Template </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
