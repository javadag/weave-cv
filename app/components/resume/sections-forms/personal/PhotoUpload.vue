<script setup lang="ts">
const resumeStore = useResumeStore()
const { personal } = storeToRefs(resumeStore)
const { updatePersonal } = resumeStore

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)

const photoUrl = computed(() => personal.value?.photo?.url ?? "")
const photoShape = computed(() => configs.value.personal.photo.shape)

const fileInput = ref<HTMLInputElement | null>(null)

const triggerUpload = () => fileInput.value?.click()

const onFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.addEventListener("load", (e) => {
    const dataUrl = e.target?.result as string
    updatePersonal("photo", { url: dataUrl })
  })
  reader.readAsDataURL(file)
  if (fileInput.value) fileInput.value.value = ""
}

const removePhoto = () => {
  updatePersonal("photo", { url: "" })
}

const previewStyles = computed(() => ({
  width: "56px",
  height: "56px",
  objectFit: "cover" as const,
  borderRadius: photoShape.value === "circle" ? "50%" : photoShape.value === "rounded" ? "10px" : "4px",
  flexShrink: 0
}))
</script>

<template>
  <div class="border-muted flex items-center gap-3 rounded-lg border border-dashed p-3">
    <img v-if="photoUrl" :src="photoUrl" :style="previewStyles" alt="Profile photo" />
    <div
      v-else
      class="bg-elevated flex shrink-0 items-center justify-center rounded-lg"
      style="width: 56px; height: 56px"
    >
      <UIcon name="i-lucide-user" class="text-muted text-2xl" />
    </div>
    <div class="flex flex-1 flex-col gap-1.5">
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
      <UButton size="sm" variant="outline" @click="triggerUpload">
        {{ $t("editor.form.uploadPhoto") }}
      </UButton>
      <UButton v-if="photoUrl" size="sm" color="error" variant="ghost" @click="removePhoto">
        {{ $t("editor.form.removePhoto") }}
      </UButton>
    </div>
  </div>
</template>
