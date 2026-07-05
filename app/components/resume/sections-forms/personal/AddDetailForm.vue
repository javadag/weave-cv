<script setup lang="ts">
import { capitalize } from "vue"
import { DETAILS_CATALOG } from "~/utils/schemas/content.schema"

interface DetailConfig {
  label: string
  icon: string
  urlTemplate?: string
}

const { personal, updatePersonal } = useResumeStore()

const isAddingDetail = ref(false)
const form = reactive({
  type: "core" as keyof typeof DETAILS_CATALOG,
  key: "",
  value: ""
})

const categoryOptions = computed(() =>
  Object.keys(DETAILS_CATALOG).map((key) => ({
    label: capitalize(key),
    value: key
  }))
)

const detailOptions = computed(() => {
  const catalog = DETAILS_CATALOG[form.type]
  return Object.entries(catalog).map(([key, config]) => ({
    label: config.label,
    value: key
  }))
})

const currentConfig = computed<DetailConfig>(() => {
  const catalog = DETAILS_CATALOG[form.type]
  return catalog[form.key as keyof typeof catalog]
})

watch(
  () => form.type,
  (newType) => {
    const catalog = DETAILS_CATALOG[newType]
    const firstKey = Object.keys(catalog)[0]
    form.key = firstKey || ""
  },
  { immediate: true }
)

const addDetail = () => {
  if (!form.value.trim() || !form.key || !currentConfig.value) return

  const { label, icon, urlTemplate } = currentConfig.value
  const url = urlTemplate ? urlTemplate.replace("{value}", form.value) : undefined

  const newDetail = {
    value: form.value,
    isHidden: false,
    type: form.key,
    label: label || "",
    icon: icon || "",
    url
  }

  updatePersonal("details", [...(personal?.details ?? []), newDetail])
  closeForm()
}

const closeForm = () => {
  isAddingDetail.value = false
  resetForm()
}

const resetForm = () => {
  form.value = ""
  form.type = "core"
  form.key = ""
}
</script>

<template>
  <div class="flex items-center justify-between">
    <span class="text-default text-sm font-medium">{{ $t("editor.form.contactDetails") }}</span>
    <UButton
      variant="ghost"
      :disabled="isAddingDetail"
      size="sm"
      icon="i-lucide-plus"
      @click="
        () => {
          isAddingDetail = true
        }
      "
    >
      {{ $t("editor.form.addDetail") }}
    </UButton>
  </div>
  <div v-if="isAddingDetail" class="border-muted space-y-3 rounded-lg border p-3">
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-1.5">
        <span class="text-muted text-sm font-medium">{{ $t("editor.form.category") }}</span>
        <USelect v-model="form.type" :items="categoryOptions" :placeholder="$t('editor.form.category')" />
      </div>
      <div class="flex flex-col gap-1.5">
        <span class="text-muted text-sm font-medium">{{ $t("editor.form.detailType") }}</span>
        <USelect v-model="form.key" :items="detailOptions" :placeholder="$t('editor.form.detailType')" />
      </div>
    </div>
    <UInput v-model="form.value" class="w-full" :placeholder="$t('editor.form.enterValue')" @keyup.enter="addDetail" />
    <div class="flex gap-2">
      <UButton size="sm" @click="addDetail">{{ $t("editor.form.add") }}</UButton>
      <UButton variant="ghost" size="sm" @click="closeForm">{{ $t("common.cancel") }}</UButton>
    </div>
  </div>
</template>
