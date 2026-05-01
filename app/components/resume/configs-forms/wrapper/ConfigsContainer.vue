<script setup lang="ts">
import ConfigsHeader from "./ConfigsHeader.vue"

interface Props {
  title: string
  icon: string
}

const props = defineProps<Props>()

const isOpen = ref(false)
</script>

<template>
  <UCollapsible
    v-model:is-open="isOpen"
    class="bg-muted border-default/10 data-[state=open]:ring-primary/30 flex flex-col gap-3 rounded-lg border p-2 duration-500 data-[state=open]:ring-2"
  >
    <ConfigsHeader :title="props.title" :icon="props.icon" />
    <template #content>
      <div class="divide-muted/40 divide-y pt-1 [&>*]:py-2">
        <slot />
      </div>
    </template>
  </UCollapsible>
</template>
