<template>
  <div
    class="hide-scrollbar bg-default border-default/30 flex h-full flex-col gap-3 overflow-y-auto rounded-xl border p-4"
  >
    <div v-for="i in 6" :key="i" class="animate-pulse" :style="{ animationDelay: `${i * 100}ms` }">
      <div class="bg-muted border-muted/50 space-y-4 rounded-lg border p-2">
        <div class="bg-accented h-6 rounded" :class="i === 1 ? 'w-40' : i === 2 ? 'w-44' : i === 3 ? 'w-36' : 'w-48'" />
      </div>
    </div>
  </div>
</template>
