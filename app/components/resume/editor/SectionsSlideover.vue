<script setup lang="ts">
import ResumeSectionsForms from "~/components/resume/sections-forms/ResumeSectionsForms.vue"

interface Props {
  open: boolean
  loading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  "update:open": [value: boolean]
}>()

const modelValue = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value)
})
</script>

<template>
  <USlideover v-model:open="modelValue" :title="$t('editor.slideover.sections')" side="right">
    <template #body>
      <ResumeSectionsForms :loading="loading" />
    </template>
  </USlideover>
</template>
