<script setup lang="ts">
import type { TPersonalContent, DetailKey } from "~/utils/schemas/content.schema"
import { DETAILS_CATALOG } from "~/utils/schemas/content.schema"
import Delete from "../Delete.vue"
import Visibility from "../Visibility.vue"

type DetailConfig = { label: string; icon: string; urlTemplate?: string }

interface Props {
  detail: TPersonalContent["details"][0]
  index: number
}

const props = defineProps<Props>()
const { personal, updatePersonal } = useResumeStore()

const getDetailConfig = (): DetailConfig | null => {
  const type = props.detail.type
  for (const category of Object.values(DETAILS_CATALOG)) {
    if (type in category) {
      return (category as Partial<Record<DetailKey, DetailConfig>>)[type] ?? null
    }
  }
  return null
}

const updateDetails = (updater: (details: TPersonalContent["details"]) => TPersonalContent["details"]) => {
  const updatedDetails = updater([...personal!.details])
  updatePersonal("details", updatedDetails)
}

const handleValueUpdate = (value: string) => {
  updateDetails((details) => {
    const detail = details[props.index]
    if (detail) {
      detail.value = value
    }
    return details
  })
}

const handleUrlUpdate = (url: string) => {
  updateDetails((details) => {
    const detail = details[props.index]
    if (detail) {
      const config = getDetailConfig()
      let finalUrl = url || undefined

      if (finalUrl && config?.urlTemplate) {
        const prefix = config.urlTemplate.split("{value}")[0]
        if (prefix && !finalUrl.startsWith(prefix) && !finalUrl.includes("://")) {
          finalUrl = config.urlTemplate.replace("{value}", finalUrl)
        }
      }

      detail.url = finalUrl
    }
    return details
  })
}

const handleToggleVisibility = () => {
  updateDetails((details) => {
    const detail = details[props.index]
    if (detail) {
      detail.isHidden = !detail.isHidden
    }
    return details
  })
}

const handleRemove = () => {
  updateDetails((details) => details.filter((_, i) => i !== props.index))
}
</script>

<template>
  <div class="border-muted/40 space-y-2 rounded-md border p-2">
    <div class="flex items-center gap-2">
      <UInput
        :model-value="detail.value"
        :ui="{ leadingIcon: 'size-4' }"
        class="flex-1"
        :placeholder="$t('editor.form.valueLabel')"
        @update:model-value="handleValueUpdate"
      />
      <Visibility :is-hidden="detail.isHidden" @toggle="handleToggleVisibility" />
      <Delete :on-delete="handleRemove" />
    </div>
    <UInput
      :model-value="detail.url || ''"
      :placeholder="$t('editor.form.urlOptional')"
      class="w-full"
      @update:model-value="handleUrlUpdate"
    />
  </div>
</template>
