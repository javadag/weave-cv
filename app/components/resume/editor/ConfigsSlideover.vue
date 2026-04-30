<script setup lang="ts">
import ResumeConfigsForms from "../configs-forms/ResumeConfigsForms.vue"

interface Props {
  open: boolean
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
  <USlideover v-model:open="modelValue" side="right" :title="$t('editor.slideover.settings')">
    <template #body>
      <ResumeConfigsForms />
    </template>
  </USlideover>
</template>
