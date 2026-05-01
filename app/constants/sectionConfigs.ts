import type { TCoreSectionType } from "~/utils/schemas/content.schema"
import { SECTIONS_REGISTRY, type SectionConfigOption } from "~/constants/sections/registry"

export type { SectionConfigOption } from "~/constants/sections/registry"

export const SECTION_CONFIGS_CONFIG: Record<TCoreSectionType, SectionConfigOption[]> = Object.fromEntries(
  Object.entries(SECTIONS_REGISTRY).map(([key, descriptor]) => [key, descriptor.configOptions])
) as Record<TCoreSectionType, SectionConfigOption[]>

export const SECTION_DISPLAY_CONFIG: Record<TCoreSectionType, { label: string; icon: string }> = Object.fromEntries(
  Object.entries(SECTIONS_REGISTRY).map(([key, descriptor]) => [
    key,
    { label: descriptor.label, icon: descriptor.icon }
  ])
) as Record<TCoreSectionType, { label: string; icon: string }>
