<script setup lang="ts">
defineProps<{
  name: string
  screenshot: string
}>()
</script>

<template>
  <div
    class="group border-default hover:border-primary/30 bg-default w-44 shrink-0 overflow-hidden rounded-2xl border shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(28,25,23,0.18)] sm:w-48 lg:w-56 dark:shadow-none dark:hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.7)]"
  >
    <div class="relative aspect-77/100 overflow-hidden bg-(--ui-bg-canvas,#f5f5f4)">
      <div
        class="pointer-events-none absolute inset-0 z-10 bg-linear-to-br from-white/0 via-white/0 to-white/0 opacity-0 transition-opacity duration-500 group-hover:from-white/5 group-hover:via-white/8 group-hover:to-white/0 group-hover:opacity-100"
      />
      <NuxtImg
        :src="screenshot"
        :alt="name"
        class="block size-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        format="webp"
        draggable="false"
      />
    </div>
    <div class="flex items-center justify-between px-4 py-3.5">
      <span class="text-highlighted text-[15px] font-semibold">{{ name }}</span>
    </div>
  </div>
</template>
