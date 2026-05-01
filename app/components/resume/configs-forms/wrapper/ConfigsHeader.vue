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
      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
    }"
    :icon="props.icon"
    variant="ghost"
    class="group text-default flex w-full items-center p-0 text-sm font-semibold shadow-none hover:bg-inherit active:bg-inherit"
    block
  >
    {{ props.title }}
  </UButton>
</template>
