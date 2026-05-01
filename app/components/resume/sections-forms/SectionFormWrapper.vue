<script setup lang="ts">
import { capitalize } from "vue"
import type { TCoreSectionType } from "~/utils/schemas/content.schema"
import SectionTitleForm from "./SectionTitleForm.vue"

const props = withDefaults(
  defineProps<{
    title: string
    sectionId: string
    sectionType?: TCoreSectionType
    isSectionHideable?: boolean
    isSectionVisible?: boolean
    isTitleVisible?: boolean
    isTitleEditable?: boolean
  }>(),
  {
    isTitleEditable: true,
    isSectionHideable: true,
    sectionType: undefined
  }
)
</script>

<template>
  <UCollapsible class="group bg-muted border-muted/50 grid gap-2 rounded-lg border p-2">
    <UButton
      trailing-icon="i-lucide-chevron-down"
      :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
      }"
      variant="ghost"
      class="group text-default flex w-full items-center p-0 text-base font-semibold hover:bg-inherit active:bg-inherit"
      block
    >
      {{ props.title || capitalize(props.sectionId.split("-")[0] ?? "Section") }}
    </UButton>
    <template #content>
      <SectionTitleForm
        v-if="props.isTitleEditable || props.isSectionHideable"
        :section-id="props.sectionId"
        :section-title="props.title"
        :section-type="props.sectionType"
        :is-title-editable="props.isTitleEditable"
        :is-section-hideable="props.isSectionHideable"
        :is-section-visible="props.isSectionVisible"
        :is-title-visible="props.isTitleVisible"
      />
      <slot />
    </template>
  </UCollapsible>
</template>
