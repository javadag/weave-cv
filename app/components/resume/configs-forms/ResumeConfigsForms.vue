<script setup lang="ts">
import ColorsControls from "./general/ColorsControls.vue"
import HeadingsControls from "./general/HeadingsControls.vue"
import LayoutControls from "./general/LayoutControls.vue"
import LinksControls from "./general/LinksControls.vue"
import TypographyControls from "./general/TypographyControls.vue"
</script>
<template>
  <div class="hide-scrollbar bg-default flex h-full flex-col space-y-3 overflow-y-auto rounded-xl p-4">
    <LayoutControls />
    <HeadingsControls />
    <LinksControls />
    <TypographyControls />
    <ColorsControls />
  </div>
</template>
