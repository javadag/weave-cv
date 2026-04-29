<script setup lang="ts">
defineProps<{
  name: string
  screenshot: string
}>()
</script>

<template>
  <div
    class="group shrink-0 w-44 sm:w-60 lg:w-80 rounded-2xl overflow-hidden border border-default bg-[var(--ui-bg)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-none transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_48px_-20px_rgba(28,25,23,0.18)] dark:hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.7)]"
  >
    <div class="relative aspect-[77/100] overflow-hidden bg-[var(--ui-bg-canvas,#f5f5f4)]">
      <img
        :src="screenshot"
        :alt="name"
        class="block h-full w-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        loading="lazy"
        draggable="false"
      />
      <div
        class="absolute inset-0 flex items-end justify-center pb-5 opacity-0 transition-opacity duration-[250ms] group-hover:opacity-100"
        style="background: linear-gradient(180deg, transparent 50%, rgba(28, 25, 23, 0.55) 100%)"
      >
        <span class="rounded-full bg-white px-4 py-2 text-[13px] font-bold text-primary shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          {{ $t("templates.useTemplate") }}
        </span>
      </div>
    </div>
    <div class="flex items-center justify-between px-4 py-[14px]">
      <span class="text-[15px] font-semibold text-highlighted">{{ name }}</span>
      <span class="text-[13px] font-semibold text-dimmed transition-colors duration-200 group-hover:text-primary">{{ $t("templates.use") }}</span>
    </div>
  </div>
</template>
