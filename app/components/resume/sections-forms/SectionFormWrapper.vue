<script setup lang="ts">
import { capitalize } from "vue"
import type { TCoreSectionType } from "~/utils/schemas/content.schema"
import Delete from "./Delete.vue"
import SectionHeader from "./SectionHeader.vue"
import Visibility from "./Visibility.vue"

const props = withDefaults(
  defineProps<{
    title: string
    sectionId: string
    sectionType?: TCoreSectionType
    isSectionHideable?: boolean
    isSectionVisible?: boolean
    isTitleVisible?: boolean
    isTitleEditable?: boolean
    showSettings?: boolean
  }>(),
  {
    isTitleEditable: true,
    isSectionHideable: true,
    sectionType: undefined,
    showSettings: false
  }
)

const { t } = useI18n()
const { updateContent, removeSection } = useResumeStore()
const handleDelete = () => {
  removeSection(props.sectionId)
}

const tabItems = computed(() => [
  { label: t("editor.form.content"), slot: "content" },
  { label: t("editor.settings"), slot: "settings" }
])
</script>

<template>
  <UCollapsible
    class="group bg-default border-muted grid rounded-lg border"
    :ui="{
      content: 'p-2'
    }"
  >
    <UButton
      trailing-icon="i-lucide-chevron-down"
      :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 size-4 transition-transform duration-200'
      }"
      variant="ghost"
      class="group text-default bg-muted border-muted hover:bg-muted active:bg-muted flex h-10 w-full items-center justify-between rounded-lg p-2 text-sm font-semibold data-[state=open]:rounded-b-none data-[state=open]:border-b"
      block
    >
      <div class="flex w-full items-center justify-between">
        {{ props.title || capitalize(props.sectionId.split("-")[0] ?? "Section") }}
        <div
          v-if="props.isSectionHideable"
          class="flex shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Visibility
            size="xs"
            :is-hidden="!props.isSectionVisible"
            :tooltip="props.isSectionVisible ? $t('editor.form.hideSection') : $t('editor.form.showSection')"
            :on-toggle="() => updateContent(`${props.sectionId}.isSectionVisible`, !props.isSectionVisible)"
          />
          <Delete size="xs" :on-delete="() => handleDelete()" :tooltip="$t('editor.form.deleteSection')" />
        </div>
      </div>
    </UButton>
    <template #content>
      <SectionHeader
        v-if="props.isTitleEditable || props.isSectionHideable"
        :section-id="props.sectionId"
        :section-title="props.title"
        :section-type="props.sectionType"
        :is-title-editable="props.isTitleEditable"
        :is-section-hideable="props.isSectionHideable"
        :is-section-visible="props.isSectionVisible"
        :is-title-visible="props.isTitleVisible"
      />
      <template v-if="props.showSettings">
        <UTabs :items="tabItems" size="sm" class="mt-1">
          <template #content>
            <slot />
          </template>
          <template #settings>
            <slot name="settings" />
          </template>
        </UTabs>
      </template>
      <template v-else>
        <slot />
      </template>
    </template>
  </UCollapsible>
</template>
