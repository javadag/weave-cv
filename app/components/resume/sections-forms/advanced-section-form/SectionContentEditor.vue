<script setup lang="ts">
import DatePicker from "~/components/ui/DatePicker.vue"
import RichTextEditor from "~/components/ui/rich-text/RichTextEditor.vue"
import TextInput from "~/components/ui/TextInput.vue"
import ToggleInput from "~/components/ui/ToggleInput.vue"
import { SECTION_FIELDS_CONFIG, type EditorField } from "~/constants/sectionFields"
import type { TAdvancedContent, TBasicContent, TCoreSectionType, TSubRole } from "~/utils/schemas/content.schema"

interface Props {
  sectionId: string
  isAdvancedSection: boolean
  sectionType: TCoreSectionType
  content: TAdvancedContent | TBasicContent
}
const props = defineProps<Props>()
const emit = defineEmits(["closeEdit"])

const { updateContent } = useResumeStore()
const { language } = useLocaleInfo()

const advancedContent = computed(() =>
  props.isAdvancedSection ? (props.content as TAdvancedContent) : null
)

const subRoles = computed(() => advancedContent.value?.subRoles ?? [])

const subRolePath = (index: number, field: keyof TSubRole) =>
  `${props.sectionId}.contents.${props.content.id}.subRoles.${index}.${field}`

const addSubRole = () => {
  const updated: TSubRole[] = [
    ...subRoles.value,
    { title: "", subtitle: "", startDate: null, endDate: null, present: false, showDateDay: true }
  ]
  updateContent(`${props.sectionId}.contents.${props.content.id}.subRoles`, updated)
}

const removeSubRole = (index: number) => {
  const updated = subRoles.value.filter((_, i) => i !== index)
  updateContent(`${props.sectionId}.contents.${props.content.id}.subRoles`, updated)
}

const sectionFieldsConfig = computed(() => SECTION_FIELDS_CONFIG[props.sectionType])

const getFieldConfig = (field: EditorField) => {
  return sectionFieldsConfig.value.find((config) => config.field === field)!
}

const hasField = (field: EditorField) => {
  return sectionFieldsConfig.value.some((config) => config.field === field)
}

const handleFieldUpdate = (field: EditorField, value: unknown) => {
  updateContent(`${props.sectionId}.contents.${props.content.id}.${field}`, value)
}

const getStringFieldValue = (field: "title" | "subtitle" | "description" | "url" | "location"): string => {
  const content = props.content
  if (field === "title" && "title" in content) {
    return content.title
  }
  if (field === "subtitle" && "subtitle" in content) {
    return content.subtitle
  }
  if (field === "description" && "description" in content) {
    return content.description
  }
  if (field === "url" && "url" in content) {
    return content.url ?? ""
  }
  if (field === "location" && "location" in content) {
    return content.location ?? ""
  }
  return ""
}

const getDateFieldValue = (field: "startDate" | "endDate"): string | null => {
  if (!props.isAdvancedSection) return null
  const content = props.content as TAdvancedContent
  if (field === "startDate") {
    return content.startDate ?? null
  }
  return content.endDate ?? null
}

const getBooleanFieldValue = (field: "present" | "showDateDay"): boolean => {
  if (!props.isAdvancedSection) {
    return field === "showDateDay"
  }

  const content = props.content as TAdvancedContent
  if (field === "present") {
    return content.present ?? false
  }
  return content.showDateDay ?? true
}

const handleDateUpdate = (field: "startDate" | "endDate", value: string | null) => {
  handleFieldUpdate(field, value)
}

const clearDate = (field: "startDate" | "endDate") => {
  handleFieldUpdate(field, null)
}

const handleDone = () => {
  emit("closeEdit")
}

const isSummary = computed(() => props.sectionType === "summary")
</script>

<template>
  <div class="bg-accented/40 border-primary/30 flex w-full flex-col gap-4 rounded-lg border p-3">
    <div v-if="!isSummary" class="flex items-center justify-between gap-2">
      <span class="line-clamp-1 text-sm font-semibold">
        {{ $t("editor.form.edit") }}
        {{
          content.title ||
          ("subtitle" in content && content.subtitle) ||
          ("location" in content ? content.location : "") ||
          ""
        }}
      </span>
      <UButton size="sm" variant="soft" color="primary" :leading-icon="'i-lucide-check'" @click="handleDone" />
    </div>
    <div class="space-y-3">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextInput
          v-if="hasField('title')"
          :model-value="getStringFieldValue('title')"
          :label="$t(getFieldConfig('title').label)"
          :placeholder="$t(getFieldConfig('title').placeholder || '')"
          @update:model-value="(value) => handleFieldUpdate('title', value)"
        />
        <TextInput
          v-if="hasField('subtitle')"
          :model-value="getStringFieldValue('subtitle')"
          :label="$t(getFieldConfig('subtitle').label)"
          :placeholder="$t(getFieldConfig('subtitle').placeholder || '')"
          @update:model-value="(value) => handleFieldUpdate('subtitle', value)"
        />
      </div>
      <div v-if="hasField('startDate') || hasField('endDate')" class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div v-if="hasField('startDate')" class="flex flex-col gap-1">
          <DatePicker
            :model-value="getDateFieldValue('startDate')"
            :label="$t(getFieldConfig('startDate').label)"
            :placeholder="$t(getFieldConfig('startDate').placeholder || '')"
            :locale="language"
            @update:model-value="(value) => handleDateUpdate('startDate', value)"
          />
          <UButton
            v-if="getDateFieldValue('startDate')"
            size="xs"
            variant="ghost"
            color="neutral"
            class="self-start"
            @click="clearDate('startDate')"
          >
            {{ $t("editor.form.clearDate") }}
          </UButton>
        </div>
        <div v-if="hasField('endDate') || hasField('present')" class="flex flex-col gap-1">
          <DatePicker
            v-if="hasField('endDate')"
            :model-value="getDateFieldValue('endDate')"
            :label="$t(getFieldConfig('endDate').label)"
            :disabled="getBooleanFieldValue('present')"
            :placeholder="$t(getFieldConfig('endDate').placeholder || '')"
            :locale="language"
            @update:model-value="(value) => handleDateUpdate('endDate', value)"
          />
          <div class="flex flex-col gap-1">
            <UButton
              v-if="hasField('endDate') && getDateFieldValue('endDate')"
              size="xs"
              variant="ghost"
              color="neutral"
              class="self-start"
              :disabled="getBooleanFieldValue('present')"
              @click="clearDate('endDate')"
            >
              {{ $t("editor.form.clearDate") }}
            </UButton>
            <ToggleInput
              v-if="hasField('present')"
              :model-value="getBooleanFieldValue('present')"
              :label="$t(getFieldConfig('present').label)"
              :style="'start'"
              class="py-1"
              @update:model-value="(value) => handleFieldUpdate('present', value)"
            />
          </div>
        </div>
      </div>
      <ToggleInput
        v-if="props.isAdvancedSection && hasField('showDateDay')"
        :model-value="getBooleanFieldValue('showDateDay')"
        :label="$t(getFieldConfig('showDateDay').label)"
        :style="'start'"
        @update:model-value="(value) => handleFieldUpdate('showDateDay', value)"
      />
      <TextInput
        v-if="hasField('location')"
        :model-value="getStringFieldValue('location')"
        :label="$t(getFieldConfig('location').label)"
        :placeholder="$t(getFieldConfig('location').placeholder || '')"
        @update:model-value="(value) => handleFieldUpdate('location', value)"
      />
      <TextInput
        v-if="hasField('url')"
        :model-value="getStringFieldValue('url')"
        :label="$t(getFieldConfig('url').label)"
        :placeholder="$t(getFieldConfig('url').placeholder || '')"
        type="url"
        @update:model-value="(value) => handleFieldUpdate('url', value)"
      />
      <RichTextEditor
        v-if="hasField('description')"
        :content="getStringFieldValue('description')"
        :label="$t(getFieldConfig('description').label)"
        :placeholder="$t(getFieldConfig('description').placeholder || '')"
        @update:content="(htmlContent) => handleFieldUpdate('description', htmlContent)"
      />

      <div v-if="hasField('subRoles')" class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">{{ $t("editor.form.additionalRoles") }}</span>
          <UButton size="xs" variant="soft" color="primary" leading-icon="i-lucide-plus" @click="addSubRole">
            {{ $t("editor.form.addRole") }}
          </UButton>
        </div>
        <div
          v-for="(subRole, index) in subRoles"
          :key="index"
          class="bg-accented/20 border-primary/20 flex flex-col gap-3 rounded-md border p-3"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="text-muted text-xs">{{ $t("editor.form.roleLabel", { n: index + 1 }) }}</span>
            <UButton
              size="xs"
              variant="ghost"
              color="error"
              leading-icon="i-lucide-trash-2"
              @click="removeSubRole(index)"
            />
          </div>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <TextInput
              :model-value="subRole.title"
              :label="$t('editor.form.jobTitle')"
              :placeholder="$t('editor.form.jobTitlePlaceholder')"
              @update:model-value="(value) => updateContent(subRolePath(index, 'title'), value)"
            />
            <TextInput
              :model-value="subRole.subtitle"
              :label="$t('editor.form.subtitleLabel')"
              :placeholder="$t('editor.form.subtitlePlaceholder')"
              @update:model-value="(value) => updateContent(subRolePath(index, 'subtitle'), value)"
            />
          </div>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div class="flex flex-col gap-1">
              <DatePicker
                :model-value="subRole.startDate"
                :label="$t('editor.form.startDate')"
                :locale="language"
                @update:model-value="(value) => updateContent(subRolePath(index, 'startDate'), value)"
              />
              <UButton
                v-if="subRole.startDate"
                size="xs"
                variant="ghost"
                color="neutral"
                class="self-start"
                @click="updateContent(subRolePath(index, 'startDate'), null)"
              >
                {{ $t("editor.form.clearDate") }}
              </UButton>
            </div>
            <div class="flex flex-col gap-1">
              <DatePicker
                :model-value="subRole.endDate"
                :label="$t('editor.form.endDate')"
                :disabled="subRole.present"
                :locale="language"
                @update:model-value="(value) => updateContent(subRolePath(index, 'endDate'), value)"
              />
              <UButton
                v-if="subRole.endDate"
                size="xs"
                variant="ghost"
                color="neutral"
                class="self-start"
                :disabled="subRole.present"
                @click="updateContent(subRolePath(index, 'endDate'), null)"
              >
                {{ $t("editor.form.clearDate") }}
              </UButton>
              <ToggleInput
                :model-value="subRole.present"
                :label="$t('editor.form.present')"
                :style="'start'"
                class="py-1"
                @update:model-value="(value) => updateContent(subRolePath(index, 'present'), value)"
              />
            </div>
          </div>
          <ToggleInput
            :model-value="subRole.showDateDay"
            :label="$t('editor.form.fullDate')"
            :style="'start'"
            class="py-1"
            @update:model-value="(value) => updateContent(subRolePath(index, 'showDateDay'), value)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
