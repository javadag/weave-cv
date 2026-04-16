import { z } from "zod"
import {
  AdvancedSectionVariant,
  FontWeight,
  IconStyle,
  Separator,
  Side,
  Variant,
  VariantSimple
} from "../shared.schema"

export type TBasicSectionConfigs = z.infer<typeof BasicSectionConfigsSchema>
export type TAdvancedSectionConfigs = z.infer<typeof AdvancedSectionConfigsSchema>
export type TPersonalConfigs = z.infer<typeof PersonalConfigsSchema>

const AdvancedSectionConfigsSchema = z.object({
  variant: AdvancedSectionVariant,
  separator: Separator,
  titleSubtitleVariant: VariantSimple,
  dateLocationVariant: VariantSimple,
  subTitleFirst: z.boolean()
})

const BasicSectionConfigsSchema = z.object({
  variant: Variant,
  grids: z.number().min(1).max(4),
  titleStyle: z.enum(["colon", "bracket", "dash", "none"]),
  separator: Separator
})

export const PersonalConfigsSchema = z.object({
  variant: VariantSimple,
  align: z.enum(["left", "center", "right"]),
  bottomSpace: z.number().min(0).max(100),
  main: z.object({
    variant: VariantSimple,
    title: z.object({
      fontSize: z.number().min(12).max(48),
      fontWeight: FontWeight
    }),
    subtitle: z.object({
      fontSize: z.number().min(12).max(48),
      fontWeight: FontWeight
    }),
    bottomSpace: z.number().min(0).max(100)
  }),
  details: z.object({
    underline: z.boolean(),
    color: z.string(),
    variant: Variant,
    separator: Separator,
    icon: z.object({
      visible: z.boolean(),
      align: Side,
      type: IconStyle,
      size: z.number().min(8).max(64)
    })
  })
})

export const SectionsConfigsSchema = z.object({
  personal: PersonalConfigsSchema,
  summary: BasicSectionConfigsSchema,
  awards: AdvancedSectionConfigsSchema,
  experiences: AdvancedSectionConfigsSchema,
  skills: BasicSectionConfigsSchema,
  certificates: BasicSectionConfigsSchema,
  educations: AdvancedSectionConfigsSchema,
  projects: AdvancedSectionConfigsSchema,
  languages: BasicSectionConfigsSchema,
  courses: AdvancedSectionConfigsSchema
})
