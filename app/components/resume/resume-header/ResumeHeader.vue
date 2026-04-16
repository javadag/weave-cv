<script setup lang="ts">
import Download from "./Download.vue"
import SaveChanges from "./SaveChanges.vue"

const saving = ref(false)

const resumeStore = useResumeStore()
const { title } = storeToRefs(resumeStore)

const titleModel = computed({
  get: () => title.value,
  set: (v: string) => resumeStore.setTitle(v)
})
</script>

<template>
  <div
    class="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-default"
  >
    <div class="flex items-center gap-2 flex-1 min-w-0">
      <UButton
        to="/dashboard"
        variant="ghost"
        color="neutral"
        size="lg"
        icon="i-lucide-arrow-left"
        class="hidden lg:flex flex-shrink-0"
      >
        <span class="hidden xl:inline">Dashboard</span>
      </UButton>
      <UInput
        v-model="titleModel"
        :minlength="3"
        :maxlength="50"
        placeholder="Resume Title"
        size="lg"
        icon="i-heroicons-document-text"
        class="w-full min-w-0"
        :ui="{
          base: 'pe-11'
        }"
      >
        <template #trailing>
          <span class="text-xs text-muted hidden sm:inline">{{ titleModel.length }}/50</span>
        </template>
      </UInput>
    </div>
    <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      <div
        class="flex items-center rounded-lg bg-elevated/50 p-1 gap-1 sm:gap-2 border border-muted shadow-sm backdrop-blur-sm"
      >
        <SaveChanges :saving="saving" :disabled="saving" @saving="saving = $event" />
        <Download :disabled="saving" />
        <!-- <Export :disabled="saving" /> -->
      </div>
    </div>
  </div>
</template>
