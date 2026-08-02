<script setup lang="ts">
const emit = defineEmits<{ (e: "saving", isSaving: boolean): void }>()

const toast = useToast()
const { t } = useI18n()
const route = useRoute()
const id = computed(() => route.params.id as string)

const { isDirty, isSaving, lastSavedAt, isOnline, hasPendingOfflineChanges, save } = useAutosave(id)

// Reactive "saved X ago" label
const lastSavedRef = ref(new Date())
const savedAgo = useTimeAgo(lastSavedRef)
const savedAtLabel = computed(() => (lastSavedAt.value ? savedAgo.value : null))
watch(lastSavedAt, (d) => {
  if (d) lastSavedRef.value = d
})

const handleManualSave = async () => {
  emit("saving", true)
  const success = await save()
  emit("saving", false)

  if (success) {
    toast.add({ title: t("editor.header.savedTitle"), description: t("editor.header.savedDesc"), color: "success" })
  } else if (isOnline.value) {
    toast.add({ title: t("common.error"), description: t("editor.header.saveErrorDesc"), color: "error" })
  } else {
    toast.add({ title: t("editor.header.offline"), description: t("editor.header.offlineDesc"), color: "warning" })
  }
}
</script>

<template>
  <div v-if="!isOnline" class="hidden items-center gap-1.5 px-2 sm:flex">
    <UIcon name="i-lucide-wifi-off" class="h-3.5 w-3.5 shrink-0 text-orange-400" />
    <span class="text-xs whitespace-nowrap text-orange-400">
      {{ hasPendingOfflineChanges ? $t("editor.header.changesQueued") : $t("editor.header.offline") }}
    </span>
  </div>
  <span
    v-else-if="isDirty && !isSaving"
    class="text-amber-500 hidden items-center gap-1 px-2 text-xs whitespace-nowrap sm:flex"
  >
    <UIcon name="i-lucide-cloud-upload" class="h-3.5 w-3.5 shrink-0" />
    {{ $t("editor.header.unsavedChanges") }}
  </span>
  <span v-else-if="savedAtLabel && !isSaving" class="text-muted hidden px-2 text-xs whitespace-nowrap sm:inline">
    {{ savedAtLabel }}
  </span>

  <UButton
    :loading="isSaving"
    :disabled="isSaving"
    color="neutral"
    variant="ghost"
    icon="i-lucide-save"
    :ui="{
      leadingIcon: 'size-4'
    }"
    :class="[isSaving ? 'cursor-not-allowed opacity-70' : '']"
    @click="handleManualSave"
  >
    <span class="hidden sm:inline">{{ isSaving ? $t("editor.header.saving") : $t("editor.header.saveChanges") }}</span>
    <span class="sm:hidden">{{ isSaving ? $t("editor.header.saving") : $t("editor.header.save") }}</span>
  </UButton>
</template>
