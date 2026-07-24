<script setup lang="ts">
import ConfigsHeader from "./ConfigsHeader.vue"

interface Props {
  title: string
  icon: string
}

const props = defineProps<Props>()
</script>

<template>
  <UCollapsible
    :default-open="true"
    class="bg-default border-muted flex flex-col rounded-lg border duration-500"
    :ui="{
      content: 'p-2'
    }"
  >
    <ConfigsHeader :title="props.title" :icon="props.icon" />
    <template #content>
      <div class="divide-muted/40 divide-y *:py-2 *:first:pt-0 *:last:pb-0">
        <slot />
      </div>
    </template>
  </UCollapsible>
</template>
