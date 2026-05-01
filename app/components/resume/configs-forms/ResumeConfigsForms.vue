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
  <div class="hide-scrollbar bg-default flex h-full flex-col space-y-6 overflow-y-auto rounded-xl p-4">
    <div class="space-y-4">
      <h2
        class="text-default before:bg-primary flex items-center justify-start text-lg font-semibold tracking-tight before:me-2 before:inline-block before:h-6 before:w-1 before:rounded-full before:content-['']"
      >
        {{ $t("editor.configs.general") }}
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
        class="text-default before:bg-primary flex items-center justify-start text-lg font-semibold tracking-tight before:me-2 before:inline-block before:h-6 before:w-1 before:rounded-full before:content-['']"
      >
        {{ $t("editor.configs.sections") }}
      </h2>
      <div class="space-y-3">
        <PersonalDetailsControls />
        <BasicConfigs />
        <AdvancedConfigs />
      </div>
    </div>
  </div>
</template>
