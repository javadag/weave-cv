<script setup lang="ts">
interface Props {
  keywords: string[]
}

const props = defineProps<Props>()
</script>

<template>
  <div v-if="props.keywords.length > 0" class="rounded-xl border border-muted p-4">
    <div class="text-default mb-2 flex items-center gap-2 text-sm font-semibold">
      <UIcon name="i-lucide-key-round" class="text-primary size-4" />
      {{ $t("editor.improve.missingKeywords") }}
    </div>
    <div class="flex flex-wrap gap-1.5">
      <span
        v-for="kw in props.keywords"
        :key="kw"
        class="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      >
        {{ kw }}
      </span>
    </div>
  </div>
</template>