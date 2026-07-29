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
  subTitleFirst: z.boolean(),
  linkInTitle: z.boolean().default(true)
})

const BasicSectionConfigsSchema = z.object({
  variant: Variant,
  grids: z.number().min(1).max(4),
  titleStyle: z.enum(["colon", "bracket", "dash", "none"]),
  separator: Separator
})

const BorderSchema = z.object({
  width: z.number().min(0).max(10).default(0),
  color: z.string().default("#000000")
}).default({ width: 0, color: "#000000" })

const PhotoSchema = z.object({
  visible: z.boolean().default(true),
  position: z.enum(["left", "right", "top"]).default("left"),
  shape: z.enum(["circle", "rounded", "square"]).default("circle"),
  size: z.number().min(40).max(200).default(100),
  border: BorderSchema
}).default({ visible: true, position: "left", shape: "circle", size: 80, border: { width: 0, color: "#000000" } })

const MainTitleSchema = z.object({
  fontSize: z.number().min(12).max(48).default(26),
  fontWeight: FontWeight.default("bold")
})

const MainSubtitleSchema = z.object({
  fontSize: z.number().min(12).max(48).default(24),
  fontWeight: FontWeight.default("normal")
})

const MainSchema = z.object({
  variant: VariantSimple.default("inline"),
  title: MainTitleSchema,
  subtitle: MainSubtitleSchema,
  bottomSpace: z.number().min(0).max(100).default(18)
})

const DetailsIconSchema = z.object({
  visible: z.boolean().default(true),
  align: Side.default("left"),
  type: IconStyle.default("filledSquare"),
  size: z.number().min(8).max(64).default(16)
})

const DetailsSchema = z.object({
  underline: z.boolean().default(false),
  color: z.string().default(""),
  variant: Variant.default("inline"),
  separator: Separator.default("pipe"),
  icon: DetailsIconSchema
})

export const PersonalConfigsSchema = z.object({
  variant: VariantSimple.default("stacked"),
  align: z.enum(["left", "center", "right"]).default("center"),
  bottomSpace: z.number().min(0).max(100).default(32),
  photo: PhotoSchema,
  main: MainSchema,
  details: DetailsSchema
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
  courses: AdvancedSectionConfigsSchema,
  custom: BasicSectionConfigsSchema
})
