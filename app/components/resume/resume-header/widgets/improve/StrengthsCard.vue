<script setup lang="ts">
interface Props {
  strengths: string[]
  weaknesses: string[]
}

const props = defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="rounded-xl border border-muted p-4">
      <div class="text-default mb-2 flex items-center gap-2 text-sm font-semibold">
        <UIcon name="i-lucide-thumbs-up" class="text-green-500 size-4" />
        {{ $t("editor.improve.strengths") }}
      </div>
      <ul class="space-y-1.5">
        <li v-for="item in props.strengths" :key="item" class="text-muted flex items-start gap-2 text-sm">
          <span class="text-green-500 mt-0.5">•</span>
          <span>{{ item }}</span>
        </li>
        <li v-if="props.strengths.length === 0" class="text-muted text-sm italic">{{ $t("editor.improve.none") }}</li>
      </ul>
    </div>
    <div class="rounded-xl border border-muted p-4">
      <div class="text-default mb-2 flex items-center gap-2 text-sm font-semibold">
        <UIcon name="i-lucide-thumbs-down" class="text-amber-500 size-4" />
        {{ $t("editor.improve.weaknesses") }}
      </div>
      <ul class="space-y-1.5">
        <li v-for="item in props.weaknesses" :key="item" class="text-muted flex items-start gap-2 text-sm">
          <span class="text-amber-500 mt-0.5">•</span>
          <span>{{ item }}</span>
        </li>
        <li v-if="props.weaknesses.length === 0" class="text-muted text-sm italic">{{ $t("editor.improve.none") }}</li>
      </ul>
    </div>
  </div>
</template>