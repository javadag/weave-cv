<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    <div v-for="i in 6" :key="i" class="animate-pulse">
      <div class="bg-accented h-48 rounded-lg p-6">
        <div class="bg-muted mb-4 h-4 w-3/4 rounded"></div>
        <div class="bg-muted mb-2 h-3 w-1/2 rounded"></div>
        <div class="bg-muted h-3 w-2/3 rounded"></div>
      </div>
    </div>
  </div>
</template>
