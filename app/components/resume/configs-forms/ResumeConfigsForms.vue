<script setup lang="ts">
import ColorsControls from "./general/ColorsControls.vue"
import HeadingsControls from "./general/HeadingsControls.vue"
import LayoutControls from "./general/LayoutControls.vue"
import LinksControls from "./general/LinksControls.vue"
import TypographyControls from "./general/TypographyControls.vue"
import AdvancedConfigs from "./sections/AdvancedConfigs.vue"
import BasicConfigs from "./sections/BasicConfigs.vue"
import PersonalDetailsControls from "./sections/PersonalDetailsControls.vue"
</script>
<template>
  <div class="flex flex-col hide-scrollbar overflow-y-auto h-full rounded-xl bg-default p-4 space-y-6">
    <div class="space-y-4">
      <h2
        class="text-lg flex justify-start items-center font-semibold text-default tracking-tight before:content-[''] before:w-1 before:h-6 before:bg-primary before:rounded-full before:me-2 before:inline-block"
      >
        {{ $t('editor.configs.general') }}
      </h2>
      <div class="space-y-3">
        <LayoutControls />
        <HeadingsControls />
        <LinksControls />
        <TypographyControls />
        <ColorsControls />
      </div>
    </div>

    <div class="space-y-4">
      <h2
        class="text-lg flex justify-start items-center font-semibold text-default tracking-tight before:content-[''] before:w-1 before:h-6 before:bg-primary before:rounded-full before:me-2 before:inline-block"
      >
        {{ $t('editor.configs.sections') }}
      </h2>
      <div class="space-y-3">
        <PersonalDetailsControls />
        <BasicConfigs />
        <AdvancedConfigs />
      </div>
    </div>
  </div>
</template>
