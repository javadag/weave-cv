<script setup lang="ts">
import TextInput from "~/components/ui/TextInput.vue"
import type { TPersonalContent } from "~/utils/schemas/content.schema"

interface Props {
  title: TPersonalContent["title"]
  subtitle: TPersonalContent["subtitle"]
}

const props = defineProps<Props>()

const { updatePersonal } = useResumeStore()

const titleModel = computed({
  get: () => props.title,
  set: (v: string) => updatePersonal("title", v)
})

const subtitleModel = computed({
  get: () => props.subtitle,
  set: (v: string) => updatePersonal("subtitle", v)
})
</script>

<template>
  <div class="space-y-3 pt-3">
    <div class="flex items-end gap-2">
      <TextInput
        v-model="titleModel"
        :label="$t('editor.form.titleLabel')"
        :placeholder="$t('editor.form.enterTitle')"
      />
    </div>
    <div class="flex items-end gap-2">
      <TextInput
        v-model="subtitleModel"
        :label="$t('editor.form.subtitleLabel')"
        :placeholder="$t('editor.form.enterSubtitle')"
      />
    </div>
  </div>
</template>
