<script setup lang="ts">
import { PAPER_SIZES } from "~/constants/papers"
import { TEMPLATES, type Template } from "~/constants/templates"

defineProps<{
  selectedTemplateId?: string | null
  disabled?: boolean
  showAspectRatio?: boolean
}>()

const emit = defineEmits<{
  select: [template: Template]
}>()
</script>

<template>
  <div class="grid grid-cols-1 items-start justify-start gap-4 overflow-y-auto md:grid-cols-2">
    <button
      v-for="template in TEMPLATES"
      :key="template.id"
      type="button"
      :disabled="disabled"
      :style="showAspectRatio ? { aspectRatio: `${PAPER_SIZES['A4'].w / PAPER_SIZES['A4'].h}` } : undefined"
      :class="[
        'group relative flex flex-col items-center justify-between rounded-lg border-2 p-4 text-left transition-all duration-200 hover:shadow-lg',
        selectedTemplateId === template.id
          ? 'border-primary bg-primary/5 ring-primary/20 ring-2'
          : 'border-default/20 hover:border-primary/40 bg-default/50',
        disabled && 'cursor-not-allowed opacity-50'
      ]"
      @click="emit('select', template)"
    >
      <NuxtImg
        v-if="template.screenshot"
        :src="template.screenshot"
        alt="Template Screenshot"
        class="size-full object-cover"
      />
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
            v-if="selectedTemplateId === template.id"
            name="i-lucide-check-circle"
            class="text-primary h-4 w-4"
          />
        </div>
        <p class="text-muted line-clamp-2 text-sm">{{ template.description }}</p>
      </div>
    </button>
  </div>
</template>
