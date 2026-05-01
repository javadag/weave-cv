<script setup lang="ts">
defineProps<{
  name: string
  screenshot: string
}>()
</script>

<template>
  <div
    class="group border-default hover:border-primary/30 bg-default w-44 shrink-0 overflow-hidden rounded-2xl border shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[transform,box-shadow,border-color] duration-1000 hover:shadow-[0_24px_48px_-20px_rgba(28,25,23,0.18)] sm:w-60 lg:w-80 dark:shadow-none dark:hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.7)]"
  >
    <div class="relative aspect-77/100 overflow-hidden bg-(--ui-bg-canvas,#f5f5f4)">
      <img
        :src="screenshot"
        :alt="name"
        class="block h-full w-full object-cover object-top"
        loading="lazy"
        draggable="false"
      />
    </div>
    <div class="flex items-center justify-between px-4 py-3.5">
      <span class="text-highlighted text-[15px] font-semibold">{{ name }}</span>
    </div>
  </div>
</template>
