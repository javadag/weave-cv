<script setup lang="ts">
interface Props {
  isResponsive?: boolean
}
defineProps<Props>()
</script>

<template>
  <div
    class="resumePage bg-default border-muted h-full w-full rounded-sm border shadow-lg"
    :class="{ absolute: isResponsive }"
  >
    <div class="animate-pulse space-y-6 p-8">
      <div class="border-accented space-y-3 border-b pb-4">
        <div class="bg-accented h-9 w-2/3 rounded"></div>
        <div class="bg-accented h-4 w-1/2 rounded"></div>
        <div class="mt-3 flex gap-4">
          <div class="bg-accented h-3.5 w-28 rounded"></div>
          <div class="bg-accented h-3.5 w-28 rounded"></div>
          <div class="bg-accented h-3.5 w-28 rounded"></div>
        </div>
      </div>

      <div class="space-y-3">
        <div class="bg-elevated border-accented h-6 w-1/4 rounded border-b-2"></div>
        <div class="space-y-2 pl-2">
          <div class="bg-accented h-4 w-full rounded"></div>
          <div class="bg-accented h-4 w-5/6 rounded"></div>
          <div class="bg-accented h-4 w-4/6 rounded"></div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="bg-elevated border-accented h-6 w-1/3 rounded border-b-2"></div>
        <div class="space-y-4 pl-2">
          <div class="space-y-2">
            <div class="flex items-start justify-between">
              <div class="bg-accented h-5 w-1/3 rounded"></div>
              <div class="bg-accented h-3.5 w-24 rounded"></div>
            </div>
            <div class="bg-accented h-3.5 w-1/4 rounded"></div>
            <div class="space-y-1.5">
              <div class="bg-accented h-3 w-full rounded"></div>
              <div class="bg-accented h-3 w-5/6 rounded"></div>
              <div class="bg-accented h-3 w-4/6 rounded"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-start justify-between">
              <div class="bg-accented h-5 w-1/3 rounded"></div>
              <div class="bg-accented h-3.5 w-24 rounded"></div>
            </div>
            <div class="bg-accented h-3.5 w-1/4 rounded"></div>
            <div class="space-y-1.5">
              <div class="bg-accented h-3 w-full rounded"></div>
              <div class="bg-accented h-3 w-4/6 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div class="bg-elevated border-accented h-6 w-1/4 rounded border-b-2"></div>
        <div class="space-y-2 pl-2">
          <div class="flex flex-wrap gap-3">
            <div class="bg-accented h-7 w-20 rounded-full"></div>
            <div class="bg-accented h-7 w-20 rounded-full"></div>
            <div class="bg-accented h-7 w-20 rounded-full"></div>
            <div class="bg-accented h-7 w-20 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
