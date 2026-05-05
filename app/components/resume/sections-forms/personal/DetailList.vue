<script setup lang="ts">
import DetailItem from "./DetailItem.vue"

const resumeStore = useResumeStore()
const { personal } = storeToRefs(resumeStore)

const details = computed(() => personal.value?.details || [])
</script>

<template>
  <div class="space-y-2">
    <DetailItem v-for="(detail, index) in details" :key="index" :detail="detail" :index="index" />
  </div>
</template>
