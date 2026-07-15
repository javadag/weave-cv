<template>
  <div class="grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="i in 6"
      :key="i"
      class="bg-default border-default animate-pulse overflow-hidden rounded-xl border shadow-sm"
    >
      <!-- Card header: title + menu icon -->
      <div class="border-default flex items-center justify-between border-b px-4 py-3">
        <div class="bg-elevated h-5 w-2/3 rounded" />
        <div class="bg-elevated size-6 rounded" />
      </div>

      <!-- Card body -->
      <div class="flex min-h-65 flex-col gap-3 p-3">
        <!-- Mini preview -->
        <div class="flex flex-1 flex-col overflow-hidden rounded-lg">
          <!-- Preview header (primary bg area) -->
          <div class="bg-muted/50 flex flex-col gap-1.5 px-4 py-3">
            <div class="bg-elevated h-4 w-1/2 rounded" />
            <div class="bg-accented/70 h-3 w-1/3 rounded" />
            <div class="bg-accented/50 mt-0.5 h-2.5 w-2/3 rounded" />
          </div>
          <!-- Preview content (secondary bg area) -->
          <div class="bg-muted/20 flex flex-1 flex-col gap-2.5 p-3">
            <!-- Section 1 -->
            <div class="flex flex-col gap-1">
              <div class="bg-accented/60 h-2 w-1/4 rounded" />
              <div class="bg-accented/40 h-2.5 w-3/4 rounded" />
              <div class="bg-accented/40 h-2.5 w-1/2 rounded" />
            </div>
            <!-- Section 2 -->
            <div class="flex flex-col gap-1">
              <div class="bg-accented/60 h-2 w-1/3 rounded" />
              <div class="bg-accented/40 h-2.5 w-4/5 rounded" />
              <div class="bg-accented/40 h-2.5 w-3/5 rounded" />
            </div>
          </div>
        </div>

        <!-- Dates row -->
        <div class="flex items-center justify-between">
          <div class="bg-elevated h-3 w-1/3 rounded" />
          <div class="bg-elevated h-3 w-1/4 rounded" />
        </div>
      </div>
    </div>
  </div>
</template>
