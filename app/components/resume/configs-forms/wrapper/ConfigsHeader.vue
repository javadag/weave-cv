<script setup lang="ts">
interface Props {
  title: string
  icon: string
}

const props = defineProps<Props>()
</script>

<template>
  <UButton
    trailing-icon="i-lucide-chevron-down"
    :ui="{
      trailingIcon: 'group-data-[state=open]:rotate-180 size-4 transition-transform duration-200',
      leadingIcon: 'size-4'
    }"
    :icon="props.icon"
    variant="ghost"
    class="group text-default bg-muted border-muted hover:bg-muted active:bg-muted flex w-full items-center justify-between rounded-lg p-2 text-sm font-semibold data-[state=open]:rounded-b-none data-[state=open]:border-b"
    block
  >
    {{ props.title }}
  </UButton>
</template>
