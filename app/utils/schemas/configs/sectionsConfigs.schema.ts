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
  variant: VariantSimple.default("stacked"),
  align: z.enum(["left", "center", "right"]).default("center"),
  bottomSpace: z.number().min(0).max(100).default(32),
  photo: z.object({
    visible: z.boolean().default(true),
    position: z.enum(["left", "right", "top"]).default("left"),
    shape: z.enum(["circle", "rounded", "square"]).default("circle"),
    size: z.number().min(40).max(200).default(80),
    border: z.object({
      width: z.number().min(0).max(10).default(0),
      color: z.string().default("#000000")
    }).default({ width: 0, color: "#000000" })
  }).default({ visible: true, position: "left", shape: "circle", size: 80, border: { width: 0, color: "#000000" } }),
  main: z.object({
    variant: VariantSimple.default("inline"),
    title: z.object({
      fontSize: z.number().min(12).max(48).default(26),
      fontWeight: FontWeight.default("bold")
    }),
    subtitle: z.object({
      fontSize: z.number().min(12).max(48).default(24),
      fontWeight: FontWeight.default("normal")
    }),
    bottomSpace: z.number().min(0).max(100).default(18)
  }),
  details: z.object({
    underline: z.boolean().default(false),
    color: z.string().default(""),
    variant: Variant.default("inline"),
    separator: Separator.default("pipe"),
    icon: z.object({
      visible: z.boolean().default(true),
      align: Side.default("left"),
      type: IconStyle.default("filledSquare"),
      size: z.number().min(8).max(64).default(16)
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
