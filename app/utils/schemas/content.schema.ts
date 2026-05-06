import { z } from "zod"
import { ADVANCED_SECTION_TYPES, BASIC_SECTION_TYPES, OTHER_SECTION_TYPES } from "~/constants/sectionTypes"

export const DETAILS_CATALOG = {
  core: {
    email: {
      label: "Email",
      icon: "mail",
      urlTemplate: "mailto:{value}"
    },
    phone: {
      label: "Phone",
      icon: "phone",
      urlTemplate: "tel:{value}"
    },
    location: {
      label: "Location",
      icon: "map-pin"
    },
    nationality: {
      label: "Nationality",
      icon: "globe"
    },
    date_of_birth: {
      label: "Date of Birth",
      icon: "calendar"
    }
  },
  professional: {
    linkedin: {
      label: "LinkedIn",
      icon: "linkedin"
    },
    github: {
      label: "GitHub",
      icon: "github"
    },
    gitlab: {
      label: "GitLab",
      icon: "git-branch"
    },
    website: {
      label: "Website",
      icon: "globe"
    },
    stackoverflow: {
      label: "Stack Overflow",
      icon: "code"
    },
    medium: {
      label: "Medium",
      icon: "book"
    },
    slack: {
      label: "Slack",
      icon: "message-square"
    }
  },
  social: {
    twitter: {
      label: "X / Twitter",
      icon: "twitter"
    },
    instagram: {
      label: "Instagram",
      icon: "camera"
    },
    facebook: {
      label: "Facebook",
      icon: "users"
    },
    reddit: {
      label: "Reddit",
      icon: "circle-user"
    },
    telegram: {
      label: "Telegram",
      icon: "send"
    },
    discord: {
      label: "Discord",
      icon: "message-circle"
    },
    whatsapp: {
      label: "WhatsApp",
      icon: "phone"
    },
    mastodon: {
      label: "Mastodon",
      icon: "globe"
    }
  },
  creative: {
    dribbble: {
      label: "Dribbble",
      icon: "palette"
    },
    behance: {
      label: "Behance",
      icon: "palette"
    },
    figma: {
      label: "Figma",
      icon: "palette"
    }
  },
  media: {
    youtube: {
      label: "YouTube",
      icon: "play-circle"
    },
    spotify: {
      label: "Spotify",
      icon: "music"
    },
    twitch: {
      label: "Twitch",
      icon: "video"
    },
    tiktok: {
      label: "TikTok",
      icon: "music"
    }
  },
  finance: {
    paypal: {
      label: "PayPal",
      icon: "credit-card"
    },
    bitcoin: {
      label: "Bitcoin",
      icon: "circle-dollar-sign"
    },
    ethereum: {
      label: "Ethereum",
      icon: "circle-dollar-sign"
    }
  }
} as const

type DetailKeyFromCatalog<T> =
  T extends Record<string, infer U> ? (U extends Record<string, unknown> ? keyof U : never) : never

export type DetailKey = DetailKeyFromCatalog<typeof DETAILS_CATALOG>

// Extract all detail keys startDate DETAILS_CATALOG automatically
const DETAIL_KEYS = Object.values(DETAILS_CATALOG).flatMap((category) => Object.keys(category)) as [
  DetailKey,
  ...DetailKey[]
]

export type TPersonalContent = z.infer<typeof PersonalContentSchema>
export type TBasicContent = z.infer<typeof BasicContentSchema>
export type TAdvancedContent = z.infer<typeof AdvancedContentSchema>
export type TAdvancedContentInput = z.input<typeof AdvancedContentSchema>

export type TCoreSectionType = z.infer<typeof CoreSectionTypeSchema>
export type TSectionType = z.infer<typeof SectionTypeSchema>
export type TAdvancedSectionType = z.infer<typeof AdvancedSectionTypeSchema>
export type TBasicSectionType = z.infer<typeof BasicSectionTypeSchema>

export const AdvancedSectionTypeSchema = z.enum(ADVANCED_SECTION_TYPES)
export const BasicSectionTypeSchema = z.enum(BASIC_SECTION_TYPES)
export const OtherSectionTypeSchema = z.enum(OTHER_SECTION_TYPES)

export const CoreSectionTypeSchema = z.union([AdvancedSectionTypeSchema, BasicSectionTypeSchema])
export const SectionTypeSchema = z.union([CoreSectionTypeSchema, OtherSectionTypeSchema])

export const PersonalContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  photo: z
    .object({
      url: z.string().default("")
    })
    .default({ url: "" }),
  details: z.array(
    z.object({
      value: z.string(),
      isHidden: z.boolean(),
      type: z.enum(DETAIL_KEYS),
      url: z.url().optional()
    })
  )
})

const BasicContentSchema = z.object({
  id: z.string(),
  isHidden: z.boolean(),
  title: z.string(),
  description: z.string(),
  url: z.url().optional()
})
export const SubRoleSchema = z.object({
  title: z.string().default(""),
  startDate: z.string().nullable().default(null),
  endDate: z.string().nullable().default(null),
  present: z.boolean().default(false),
  showDateDay: z.boolean().default(true)
})

export type TSubRole = z.infer<typeof SubRoleSchema>

const AdvancedContentSchema = z.object({
  id: z.string(),
  isHidden: z.boolean(),
  subtitle: z.string(),
  title: z.string(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  present: z.boolean().optional(),
  showDateDay: z.boolean().default(true),
  location: z.string().optional(),
  description: z.string(),
  url: z.url().optional(),
  subRoles: z.array(SubRoleSchema).default([])
})

const BaseSectionFields = z.object({
  isSectionVisible: z.boolean(),
  isTitleVisible: z.boolean(),
  title: z.string()
})

const CoreSectionSchema = z.discriminatedUnion("type", [
  BaseSectionFields.extend({
    type: z.literal("summary"),
    contents: z.array(BasicContentSchema)
  }),
  BaseSectionFields.extend({
    type: z.literal("awards"),
    contents: z.array(AdvancedContentSchema)
  }),
  BaseSectionFields.extend({
    type: z.literal("experiences"),
    contents: z.array(AdvancedContentSchema)
  }),
  BaseSectionFields.extend({
    type: z.literal("educations"),
    contents: z.array(AdvancedContentSchema)
  }),
  BaseSectionFields.extend({
    type: z.literal("projects"),
    contents: z.array(AdvancedContentSchema)
  }),
  BaseSectionFields.extend({
    type: z.literal("skills"),
    contents: z.array(BasicContentSchema)
  }),
  BaseSectionFields.extend({
    type: z.literal("languages"),
    contents: z.array(BasicContentSchema)
  }),
  BaseSectionFields.extend({
    type: z.literal("certificates"),
    contents: z.array(BasicContentSchema)
  }),
  BaseSectionFields.extend({
    type: z.literal("courses"),
    contents: z.array(AdvancedContentSchema)
  }),
  BaseSectionFields.extend({
    type: z.literal("custom"),
    contents: z.array(BasicContentSchema)
  })
])

export type TCoreSection = z.infer<typeof CoreSectionSchema>
export const CoreSectionsSchema = z.record(z.string(), CoreSectionSchema)
export type TCoreSections = z.infer<typeof CoreSectionsSchema>
