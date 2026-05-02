<script setup lang="ts">
import ColorsControls from "./general/ColorsControls.vue"
import HeadingsControls from "./general/HeadingsControls.vue"
import LayoutControls from "./general/LayoutControls.vue"
import LinksControls from "./general/LinksControls.vue"
import TypographyControls from "./general/TypographyControls.vue"
import AdvancedConfigs from "./sections/AdvancedConfigs.vue"
import BasicConfigs from "./sections/BasicConfigs.vue"
import PersonalDetailsControls from "./sections/PersonalDetailsControls.vue"

const { t } = useI18n()

const head = useLocaleHead()
</script>
<template>
  <div class="hide-scrollbar bg-default flex h-full flex-col space-y-6 overflow-y-auto rounded-xl p-4">
    <UTabs
      :items="[
        {
          label: $t('editor.configs.general'),
          slot: 'general'
        },
        {
          label: t('editor.configs.sections'),
          slot: 'sections'
        }
      ]"
      :dir="head.htmlAttrs?.dir"
    >
      <template #general>
        <div class="space-y-3">
          <LayoutControls />
          <HeadingsControls />
          <LinksControls />
          <TypographyControls />
          <ColorsControls />
        </div>
      </template>
      <template #sections>
        <div class="space-y-3">
          <PersonalDetailsControls />
          <BasicConfigs />
          <AdvancedConfigs />
        </div>
      </template>
    </UTabs>
  </div>
</template>
