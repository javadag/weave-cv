import { z } from "zod"
import { FONT_OPTIONS } from "~/constants/fonts"
import { PAPER_SIZES, type TPaperSize } from "~/constants/papers"
import { DateFormat, FontCase, FontStyle, FontWeight, LinkIconType, ListType, PersonalPosition } from "../shared.schema"

export type TLayout = z.infer<typeof LayoutSchema>
export type TColors = z.infer<typeof ColorsSchema>

export const ContentLayoutSchema = z.object({
  title: z.object({
    fontSizeMultiplier: z.number().min(1).max(2).default(1.1),
    fontWeight: FontWeight.default("bold"),
    fontCase: FontCase.default("inherit"),
    fontStyle: FontStyle.default("normal")
  }),
  subtitle: z.object({
    fontSizeMultiplier: z.number().min(1).max(2).default(1),
    fontWeight: FontWeight.default("normal"),
    fontCase: FontCase.default("inherit"),
    fontStyle: FontStyle.default("normal")
  }),
  listType: ListType.default("disc"),
  indent: z.number().min(0).max(16).default(0),
  contentFirstWidth: z.object({
    left: z.number().min(25).max(75).default(70),
    right: z.number().min(25).max(75).default(30)
  }),
  dateFirstWidth: z.object({
    left: z.number().min(25).max(75).default(30),
    right: z.number().min(25).max(75).default(70)
  })
})

export const LayoutSchema = z.object({
  dateFormat: DateFormat.default("DD.MM.YYYY"),
  rtl: z.boolean().default(false),
  language: z.string().default("en"),
  size: z.enum(Object.keys(PAPER_SIZES) as [TPaperSize, ...TPaperSize[]]).default("A4"),
  verticalMargin: z.number().min(5).max(30).default(12),
  horizontalMargin: z.number().min(5).max(30).default(12),
  sectionGap: z.number().min(2).max(50).default(12),
  columns: z.enum(["1", "2"]),
  personalPosition: PersonalPosition.default("top"),
  contentLayout: ContentLayoutSchema,
  columnsWidth: z.object({
    left: z.number().min(25).max(75).default(50),
    right: z.number().min(25).max(75).default(50)
  }),
  order: z.object({
    twoCol: z.object({
      left: z.array(z.string()).default(() => ["summary", "experiences", "languages", "certificates", "courses"]),
      right: z.array(z.string()).default(() => ["educations", "projects", "skills", "awards"])
    }),
    oneCol: z
      .array(z.string())
      .default(() => [
        "summary",
        "experiences",
        "educations",
        "projects",
        "skills",
        "languages",
        "certificates",
        "courses",
        "awards"
      ])
  })
})

export const HeadingsSchema = z.object({
  fontSizeMultiplier: z.number().min(1).max(2).default(1.2),
  fontWeight: FontWeight.default("bold"),
  fontCase: z.enum(["inherit", "uppercase", "lowercase"]).default("inherit"),
  variant: z
    .enum(["plain", "underline", "underline-full", "pill", "border", "vertical-border"])
    .default("vertical-border"),
  icon: z.object({
    visible: z.boolean().default(true),
    size: z.number().min(8).max(32).default(16),
    custom: z
      .record(z.string(), z.string().optional())
      .optional()
      .default(() => ({}))
  })
})

export const LinksSchema = z.object({
  underline: z.boolean().default(true),
  color: z.string().default("#9C9B82"),
  icon: z.object({
    visible: z.boolean().default(true),
    type: LinkIconType.default("arrow"),
    color: z.string().default("#9C9B82")
  })
})

export const TypographySchema = z.object({
  fontFamily: z.enum(FONT_OPTIONS.map((option) => option.value)).default("sourcesanspro"),
  fontSize: z.number().min(6).max(24).default(12),
  lineHeight: z.number().min(1).max(2).default(1.1)
})

export const ApplyableColorItems = z.enum(["name", "dates", "headings"])
export type TApplyableColorItems = z.infer<typeof ApplyableColorItems>
const ColorsSchema = z.object({
  apply: z.array(ApplyableColorItems).default((): TApplyableColorItems[] => ["name", "dates", "headings"]),
  primary: z.object({
    textColor: z.string().default("#E3E3E3"),
    bgColor: z.string().default("#283247"),
    accentColor: z.string().default("#B6BD6C")
  }),
  secondary: z.object({
    textColor: z.string().default("#070707"),
    bgColor: z.string().default("#F7F7F7"),
    accentColor: z.string().default("#9C9B82")
  })
})

export const GeneralSchema = z.object({
  layout: LayoutSchema,
  headings: HeadingsSchema,
  links: LinksSchema,
  typography: TypographySchema,
  colors: ColorsSchema
})
