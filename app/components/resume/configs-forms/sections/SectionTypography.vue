<script setup lang="ts">
import { capitalize } from "vue"
import type z from "zod"
import type { $ZodTypeInternals } from "zod/v4/core"
import NumberInput from "~/components/ui/NumberInput.vue"
import SelectItem from "~/components/ui/SelectItem.vue"
import { extractNumberConstraintsFromPath } from "~/utils/schemas/schemaExtractors"
import { FontCase, FontStyle, FontWeight } from "~/utils/schemas/shared.schema"
import ConfigWrapper from "../wrapper/ConfigWrapper.vue"

interface Props {
  title?: string
  baseKey: string
  exclude?: ("fontSize" | "fontWeight" | "fontCase" | "fontStyle")[]
  schema?: z.ZodObject<Record<string, z.ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>>>
}

const props = defineProps<Props>()

const configsStore = useConfigsStore()
const { configs } = storeToRefs(configsStore)
const { updateConfig } = configsStore

const fontSizeFieldName = props.schema && "fontSizeMultiplier" in props.schema.shape ? "fontSizeMultiplier" : "fontSize"

const fontSizeConstraints = props.schema ? extractNumberConstraintsFromPath(props.schema, fontSizeFieldName) : undefined

const fontStyleOptions = FontStyle.options.map((option) => ({ label: capitalize(option), value: option }))
const fontWeightOptions = FontWeight.options.map((option) => ({ label: capitalize(option), value: option }))
const fontCaseOptions = FontCase.options.map((option) => ({ label: capitalize(option), value: option }))

function onUpdate(suffix: string, value: unknown) {
  updateConfig(`${props.baseKey}.${suffix}`, value)
}

function getNested(path: string): unknown {
  let node: unknown = configs.value
  const parts = path.split(".")
  for (const key of parts) {
    if (node && typeof node === "object" && key in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }
  return node
}

function getValue(field: string): unknown {
  const target = getNested(props.baseKey)
  if (target && typeof target === "object" && field in (target as Record<string, unknown>)) {
    return (target as Record<string, unknown>)[field]
  }
  return undefined
}

function getNumber(field: string): number {
  const value = getValue(field)
  return typeof value === "number" ? value : 12
}

function getString(field: string): string {
  const value = getValue(field)
  return typeof value === "string" ? value : ""
}
</script>

<template>
  <ConfigWrapper :title="props.title ?? ''" variant="grid">
    <NumberInput
      v-if="!props.exclude?.includes('fontSize')"
      :model-value="getNumber(fontSizeFieldName)"
      :label="
        fontSizeFieldName === 'fontSizeMultiplier'
          ? $t('editor.configs.fontSizeMultiplier')
          : $t('editor.configs.fontSize')
      "
      label-variant="stacked"
      :min="fontSizeConstraints?.min"
      :max="fontSizeConstraints?.max"
      :step="fontSizeFieldName === 'fontSizeMultiplier' ? 0.1 : 1"
      @update:model-value="(value) => onUpdate(fontSizeFieldName, value)"
    />
    <SelectItem
      v-if="!props.exclude?.includes('fontWeight')"
      :model-value="getString('fontWeight')"
      :label="$t('editor.configs.fontWeight')"
      label-variant="stacked"
      :options="fontWeightOptions"
      @update:model-value="(value) => onUpdate('fontWeight', value)"
    />
    <SelectItem
      v-if="!props.exclude?.includes('fontCase')"
      :model-value="getString('fontCase')"
      :label="$t('editor.configs.fontCase')"
      label-variant="stacked"
      :options="fontCaseOptions"
      @update:model-value="(value) => onUpdate('fontCase', value)"
    />
    <SelectItem
      v-if="!props.exclude?.includes('fontStyle')"
      :model-value="getString('fontStyle')"
      :label="$t('editor.configs.fontStyle')"
      label-variant="stacked"
      :options="fontStyleOptions"
      @update:model-value="(value) => onUpdate('fontStyle', value)"
    />
  </ConfigWrapper>
</template>
