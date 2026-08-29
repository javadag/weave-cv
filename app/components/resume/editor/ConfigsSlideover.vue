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
  <USlideover
    v-model:open="modelValue"
    side="bottom"
    :title="$t('editor.slideover.style')"
    :ui="{
      content: 'max-h-[75vh] sm:max-h-[85vh] rounded-t-2xl',
      body: 'p-0 sm:p-0'
    }"
  >
    <template #body>
      <ResumeConfigsForms />
    </template>
  </USlideover>
</template>
