import type { TCoreSectionType } from "~/utils/schemas/content.schema"
import { SECTIONS_REGISTRY, type FieldConfig } from "~/constants/sections/registry"

export type { EditorField, FieldConfig } from "~/constants/sections/registry"

export const SECTION_FIELDS_CONFIG: Record<TCoreSectionType, FieldConfig[]> = Object.fromEntries(
  Object.entries(SECTIONS_REGISTRY).map(([key, descriptor]) => [key, descriptor.fields])
) as Record<TCoreSectionType, FieldConfig[]>
