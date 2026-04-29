<script setup lang="ts">
import type { TResume } from "~/types/resume.types"
import TemplateSelectionModal from "./TemplateSelectionModal.vue"

interface Props {
  disabled?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  created: [resume: TResume]
}>()

const isModalOpen = ref(false)

const handleModalOpen = () => {
  isModalOpen.value = true
}

const handleResumeCreated = (resume: TResume) => {
  emit("created", resume)
}
</script>

<template>
  <div>
    <UButton
      :ui="{
        leadingIcon: 'size-4'
      }"
      color="primary"
      icon="i-lucide-plus"
      :disabled="disabled"
      @click="handleModalOpen"
    >
      <slot>{{ $t("createResume.button") }}</slot>
    </UButton>
    <TemplateSelectionModal v-model="isModalOpen" @created="handleResumeCreated" />
  </div>
</template>
