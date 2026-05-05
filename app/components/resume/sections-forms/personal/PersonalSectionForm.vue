<script setup lang="ts">
import type { TPersonalContent } from "~/utils/schemas/content.schema"
import SectionFormWrapper from "../SectionFormWrapper.vue"
import AddDetailForm from "./AddDetailForm.vue"
import DetailList from "./DetailList.vue"
import PersonalTitle from "./PersonalTitle.vue"
import PhotoUpload from "./PhotoUpload.vue"

interface Props {
  section: TPersonalContent
}
const props = defineProps<Props>()
</script>
<template>
  <SectionFormWrapper
    :section-id="'personal'"
    :title="$t('editor.form.personalInfo')"
    :is-title-editable="false"
    :is-section-hideable="false"
  >
    <PhotoUpload />
    <PersonalTitle :title="props.section.title" :subtitle="props.section.subtitle" />
    <div class="mt-3 space-y-1">
      <AddDetailForm />
      <DetailList />
    </div>
  </SectionFormWrapper>
</template>
