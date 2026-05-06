<script setup lang="ts">
import { computed } from "vue"
import GridDetails from "./GridDetails.vue"
import InlineDetails from "./InlineDetails.vue"
import StackedDetails from "./StackedDetails.vue"

interface Props {
  isPersonalOnTop: boolean
}
const props = defineProps<Props>()

const { configs } = useConfigsStore()

const personalConfigs = computed(() => configs.personal)
const detailsVariant = computed(() => personalConfigs.value.details.variant)

const layoutMode = computed(() => {
  if (!props.isPersonalOnTop) {
    return "stacked"
  }

  return detailsVariant.value
})
</script>

<template>
  <StackedDetails v-if="layoutMode === 'stacked'" />
  <GridDetails v-else-if="layoutMode === 'grid'" />
  <InlineDetails v-else />
</template>
