import { DEFAULT_CONFIGS } from "~/constants/default"
import { mergeConfigs, type DeepPartial } from "~/utils/configs/mergeConfigs"
import type { TConfigs } from "~/utils/schemas/configs/configs.schema"

export interface Template {
  id: string
  name: string
  description: string
  screenshot: string
  configs: TConfigs
}

interface TemplateSpec {
  id: string
  name: string
  description: string
  screenshot: string
  configs: DeepPartial<TConfigs>
}

// Templates declare only the fields that DIFFER from DEFAULT_CONFIGS.
// Missing keys inherit the default; arrays replace wholesale (no concat).
// New default fields auto-propagate to every template.
const TEMPLATE_SPECS: TemplateSpec[] = [
  // ─── T01: Noir Executive ───────────────────────────────────────────────────
  {
    id: "template-1",
    name: "Noir Executive",
    description: "Charcoal and gold — authoritative and refined for C-suite and senior leadership",
    screenshot: "/images/templates/1.png",
    configs: {
      general: {
        colors: {
          apply: ["headings"],
          primary: { bgColor: "#1E2328", textColor: "#F5F0E8", accentColor: "#C9A84C" },
          secondary: { bgColor: "#FAF7F2", textColor: "#1A1208", accentColor: "#C9A84C" }
        },
        typography: { fontFamily: "Cambria", fontSize: 11, lineHeight: 1.45 },
        headings: {
          variant: "underline-full",
          fontCase: "uppercase",
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#C9A84C",
          icon: { visible: false, color: "#C9A84C" }
        },
        layout: {
          columns: "2",
          dateFormat: "MMMM DD, YYYY",
          verticalMargin: 15,
          horizontalMargin: 15,
          columnsWidth: { left: 55, right: 45 },
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects"],
              right: ["educations", "skills", "languages", "certificates", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        bottomSpace: 28,
        main: {
          variant: "stacked",
          title: { fontSize: 30 },
          subtitle: { fontSize: 20 }
        },
        details: { icon: { visible: false }, separator: "pipe" }
      }
    }
  },

  // ─── T02: Frost ───────────────────────────────────────────────────────────
  {
    id: "template-2",
    name: "Frost",
    description: "Near-white monochrome with no color accents — maximum clarity, zero distraction",
    screenshot: "/images/templates/2.png",
    configs: {
      general: {
        colors: {
          apply: [],
          primary: { bgColor: "#F8FAFC", textColor: "#0F172A", accentColor: "#CBD5E1" },
          secondary: { bgColor: "#F8FAFC", textColor: "#0F172A", accentColor: "#94A3B8" }
        },
        typography: { fontFamily: "Helvetica", fontSize: 11, lineHeight: 1.45 },
        headings: {
          variant: "plain",
          fontSizeMultiplier: 1.1,
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#475569",
          icon: { visible: false, color: "#475569" }
        },
        layout: {
          columns: "1",
          verticalMargin: 18,
          horizontalMargin: 18,
          sectionGap: 10
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 22 },
          subtitle: { fontSize: 16 }
        },
        details: { icon: { visible: false }, separator: "dot" }
      }
    }
  },

  // ─── T03: Ocean ───────────────────────────────────────────────────────────
  {
    id: "template-3",
    name: "Ocean",
    description: "Deep teal sidebar with personal info on the left — sharp contrast for tech and consulting",
    screenshot: "/images/templates/3.png",
    configs: {
      general: {
        colors: {
          apply: ["name", "dates", "headings"],
          primary: { bgColor: "#0D5470", textColor: "#FFFFFF", accentColor: "#A8DADC" },
          secondary: { bgColor: "#FFFFFF", textColor: "#0A1F2A", accentColor: "#0D5470" }
        },
        typography: { fontFamily: "Open Sans", fontSize: 10, lineHeight: 1.6 },
        headings: {
          variant: "pill",
          fontCase: "uppercase",
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#0D5470",
          icon: { visible: false, color: "#0D5470" }
        },
        layout: {
          columns: "2",
          verticalMargin: 10,
          horizontalMargin: 10,
          sectionGap: 11,
          personalPosition: "left",
          columnsWidth: { left: 33, right: 67 },
          order: {
            twoCol: {
              left: ["skills", "languages", "certificates"],
              right: ["summary", "experiences", "projects", "educations", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 22 },
          subtitle: { fontSize: 15 }
        },
        details: {
          variant: "stacked",
          separator: "dot",
          icon: { type: "outlineRounded", size: 12 }
        }
      }
    }
  },

  // ─── T04: Crimson Law ─────────────────────────────────────────────────────
  {
    id: "template-4",
    name: "Crimson Law",
    description: "Deep crimson with serif typography — traditional authority for law, finance, and policy",
    screenshot: "/images/templates/4.png",
    configs: {
      general: {
        colors: {
          apply: ["headings"],
          primary: { bgColor: "#7F1D1D", textColor: "#FFFFFF", accentColor: "#FCA5A5" },
          secondary: { bgColor: "#FFFFF8", textColor: "#1A0A0A", accentColor: "#7F1D1D" }
        },
        typography: { fontFamily: "Garamond", fontSize: 12, lineHeight: 1.5 },
        headings: {
          variant: "underline",
          fontCase: "uppercase",
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#7F1D1D",
          icon: { visible: false, color: "#7F1D1D" }
        },
        layout: {
          columns: "2",
          dateFormat: "DD MMMM YYYY",
          verticalMargin: 16,
          horizontalMargin: 16,
          columnsWidth: { left: 58, right: 42 },
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects"],
              right: ["educations", "skills", "languages", "certificates", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 28 },
          subtitle: { fontSize: 18 }
        },
        details: { icon: { visible: false }, separator: "comma" }
      }
    }
  },

  // ─── T05: Sage Scholar ────────────────────────────────────────────────────
  {
    id: "template-5",
    name: "Sage Scholar",
    description: "Sage green accents with full-page single column — built for academic CVs and research roles",
    screenshot: "/images/templates/5.png",
    configs: {
      general: {
        colors: {
          apply: ["headings"],
          primary: { bgColor: "#3D6A47", textColor: "#FFFFFF", accentColor: "#C6E2CC" },
          secondary: { bgColor: "#FFFFFF", textColor: "#1A2A1E", accentColor: "#3D6A47" }
        },
        typography: { fontFamily: "Georgia", fontSize: 11, lineHeight: 1.5 },
        headings: {
          variant: "underline-full",
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#3D6A47",
          icon: { visible: false, color: "#3D6A47" }
        },
        layout: {
          columns: "1",
          dateFormat: "DD MMMM YYYY",
          verticalMargin: 16,
          horizontalMargin: 18,
          sectionGap: 13,
          order: {
            oneCol: [
              "summary",
              "educations",
              "experiences",
              "projects",
              "certificates",
              "courses",
              "awards",
              "skills",
              "languages"
            ]
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 26 },
          subtitle: { fontSize: 18 }
        },
        details: { icon: { visible: false }, separator: "comma" }
      }
    }
  },

  // ─── T06: Coral Studio ────────────────────────────────────────────────────
  {
    id: "template-6",
    name: "Coral Studio",
    description: "Warm coral energy with pill headings — vivid and expressive for design and marketing",
    screenshot: "/images/templates/6.png",
    configs: {
      general: {
        colors: {
          apply: ["name", "dates", "headings"],
          primary: { bgColor: "#E8532A", textColor: "#FFFFFF", accentColor: "#FDE8DF" },
          secondary: { bgColor: "#FFF8F5", textColor: "#1A0800", accentColor: "#E8532A" }
        },
        typography: { fontFamily: "Lato", fontSize: 10, lineHeight: 1.55 },
        headings: {
          variant: "pill",
          fontCase: "uppercase",
          icon: { size: 14 }
        },
        links: {
          underline: false,
          color: "#E8532A",
          icon: { visible: false, color: "#E8532A" }
        },
        layout: {
          columns: "2",
          dateFormat: "MMM DD, YYYY",
          verticalMargin: 10,
          horizontalMargin: 10,
          sectionGap: 11,
          columnsWidth: { left: 38, right: 62 },
          order: {
            twoCol: {
              left: ["skills", "languages", "certificates", "awards"],
              right: ["summary", "experiences", "projects", "educations", "courses"]
            }
          }
        }
      },
      personal: {
        align: "center",
        main: {
          variant: "stacked",
          title: { fontSize: 30 },
          subtitle: { fontSize: 18 }
        },
        details: {
          separator: "dot",
          icon: { type: "outlineRounded", size: 14 }
        }
      }
    }
  },

  // ─── T07: Midnight Code ───────────────────────────────────────────────────
  {
    id: "template-7",
    name: "Midnight Code",
    description: "GitHub-dark palette with monospace font — built for developers and software engineers",
    screenshot: "/images/templates/7.png",
    configs: {
      general: {
        colors: {
          apply: ["headings"],
          primary: { bgColor: "#0D1117", textColor: "#E6EDF3", accentColor: "#58A6FF" },
          secondary: { bgColor: "#161B22", textColor: "#C9D1D9", accentColor: "#58A6FF" }
        },
        typography: { fontFamily: "Space Mono", fontSize: 9, lineHeight: 1.65 },
        headings: {
          variant: "border",
          fontCase: "uppercase",
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#58A6FF",
          icon: { visible: false, color: "#58A6FF" }
        },
        layout: {
          columns: "2",
          dateFormat: "YYYY-MM-DD",
          verticalMargin: 10,
          horizontalMargin: 10,
          sectionGap: 10,
          columnsWidth: { left: 45, right: 55 },
          contentLayout: {
            listType: "square",
            indent: 4,
            title: { fontCase: "uppercase" }
          },
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects"],
              right: ["educations", "skills", "languages", "certificates", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 22 },
          subtitle: { fontSize: 14 }
        },
        details: {
          separator: "dot",
          icon: { type: "simple", size: 12 }
        }
      }
    }
  },

  // ─── T08: Amber Consult ───────────────────────────────────────────────────
  {
    id: "template-8",
    name: "Amber Consult",
    description: "Dark amber and gold for business advisory and management consulting roles",
    screenshot: "/images/templates/8.png",
    configs: {
      general: {
        colors: {
          apply: ["dates", "headings"],
          primary: { bgColor: "#92400E", textColor: "#FFFBEB", accentColor: "#FCD34D" },
          secondary: { bgColor: "#FFFBEB", textColor: "#1C1009", accentColor: "#92400E" }
        },
        typography: { fontFamily: "Source Sans Pro", fontSize: 11, lineHeight: 1.4 },
        headings: {
          variant: "vertical-border",
          fontCase: "uppercase",
          icon: { size: 14 }
        },
        links: {
          underline: true,
          color: "#92400E",
          icon: { type: "arrow", color: "#92400E" }
        },
        layout: {
          columns: "2",
          dateFormat: "DD MMM YYYY",
          verticalMargin: 13,
          horizontalMargin: 13,
          sectionGap: 11,
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects"],
              right: ["educations", "skills", "languages", "certificates", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 26 },
          subtitle: { fontSize: 17 }
        },
        details: { separator: "dot" }
      },
      experiences: { variant: "dateFirst", dateLocationVariant: "inline", titleSubtitleVariant: "inline" },
      educations: { variant: "dateFirst", dateLocationVariant: "inline", titleSubtitleVariant: "inline" }
    }
  },

  // ─── T09: Silver Side ─────────────────────────────────────────────────────
  {
    id: "template-9",
    name: "Silver Side",
    description: "Cool gray with personal info on the right sidebar — restrained and corporate",
    screenshot: "/images/templates/9.png",
    configs: {
      general: {
        colors: {
          apply: ["headings"],
          primary: { bgColor: "#374151", textColor: "#F9FAFB", accentColor: "#9CA3AF" },
          secondary: { bgColor: "#F9FAFB", textColor: "#111827", accentColor: "#374151" }
        },
        typography: { fontFamily: "Verdana", fontSize: 10, lineHeight: 1.4 },
        headings: {
          variant: "underline",
          fontCase: "uppercase",
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#374151",
          icon: { visible: false, color: "#374151" }
        },
        layout: {
          columns: "2",
          dateFormat: "DD/MM/YYYY",
          verticalMargin: 14,
          horizontalMargin: 14,
          personalPosition: "right",
          columnsWidth: { left: 62, right: 38 },
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects", "educations"],
              right: ["skills", "languages", "certificates", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 24 },
          subtitle: { fontSize: 16 }
        },
        details: {
          variant: "stacked",
          separator: "dot",
          icon: { type: "simple", size: 12 }
        }
      }
    }
  },

  // ─── T10: Violet Flow ─────────────────────────────────────────────────────
  {
    id: "template-10",
    name: "Violet Flow",
    description: "Deep violet with pill headings on a single-column layout — warm and human for HR and nonprofits",
    screenshot: "/images/templates/10.png",
    configs: {
      general: {
        colors: {
          apply: ["name", "headings"],
          primary: { bgColor: "#5B21B6", textColor: "#FFFFFF", accentColor: "#EDE9FE" },
          secondary: { bgColor: "#FAFAFA", textColor: "#1E1B4B", accentColor: "#7C3AED" }
        },
        typography: { fontFamily: "Titillium Web", fontSize: 11, lineHeight: 1.5 },
        headings: {
          variant: "pill",
          icon: { size: 14 }
        },
        links: {
          underline: true,
          color: "#7C3AED",
          icon: { type: "arrow", color: "#7C3AED" }
        },
        layout: {
          columns: "1",
          dateFormat: "MMM DD, YYYY",
          verticalMargin: 12,
          horizontalMargin: 14,
          sectionGap: 11
        }
      },
      personal: {
        align: "center",
        bottomSpace: 28,
        main: {
          variant: "stacked",
          title: { fontSize: 28 },
          subtitle: { fontSize: 18 }
        },
        details: {
          separator: "dot",
          icon: { type: "outlineRounded", size: 14 }
        }
      }
    }
  },

  // ─── T11: Steel Draft ─────────────────────────────────────────────────────
  {
    id: "template-11",
    name: "Steel Draft",
    description:
      "Steel navy with precise border headings and square bullets — structured for engineering and architecture",
    screenshot: "/images/templates/11.png",
    configs: {
      general: {
        colors: {
          apply: ["headings"],
          primary: { bgColor: "#1E3A5F", textColor: "#FFFFFF", accentColor: "#93C5FD" },
          secondary: { bgColor: "#F0F4F8", textColor: "#1E3A5F", accentColor: "#3B82F6" }
        },
        typography: { fontFamily: "Calibri", fontSize: 11, lineHeight: 1.35 },
        headings: {
          variant: "border",
          fontCase: "uppercase",
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#1E3A5F",
          icon: { visible: false, color: "#1E3A5F" }
        },
        layout: {
          columns: "2",
          dateFormat: "YYYY-MM-DD",
          verticalMargin: 12,
          horizontalMargin: 12,
          sectionGap: 10,
          contentLayout: { listType: "square", indent: 2 },
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects"],
              right: ["educations", "skills", "languages", "certificates", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 24 },
          subtitle: { fontSize: 16 }
        },
        details: {
          separator: "dot",
          icon: { type: "simple", size: 12 }
        }
      }
    }
  },

  // ─── T12: Rose Ink ────────────────────────────────────────────────────────
  {
    id: "template-12",
    name: "Rose Ink",
    description: "Hot pink with italic subtitles and underline headings — editorial and expressive for media and PR",
    screenshot: "/images/templates/12.png",
    configs: {
      general: {
        colors: {
          apply: ["headings", "name"],
          primary: { bgColor: "#BE185D", textColor: "#FFFFFF", accentColor: "#FCE7F3" },
          secondary: { bgColor: "#FFF5F8", textColor: "#1F0714", accentColor: "#BE185D" }
        },
        typography: { fontFamily: "Georgia", fontSize: 11, lineHeight: 1.5 },
        headings: {
          variant: "underline",
          fontCase: "uppercase",
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#BE185D",
          icon: { visible: false, color: "#BE185D" }
        },
        layout: {
          columns: "2",
          dateFormat: "DD MMM YYYY",
          verticalMargin: 13,
          horizontalMargin: 13,
          sectionGap: 11,
          columnsWidth: { left: 40, right: 60 },
          contentLayout: { subtitle: { fontStyle: "italic" } },
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects"],
              right: ["educations", "skills", "languages", "certificates", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 28 },
          subtitle: { fontSize: 18 }
        },
        details: { separator: "dot" }
      }
    }
  },

  // ─── T13: Terra ───────────────────────────────────────────────────────────
  {
    id: "template-13",
    name: "Terra",
    description: "Warm dark brown with generous spacing — grounded and human for nonprofits and education",
    screenshot: "/images/templates/13.png",
    configs: {
      general: {
        colors: {
          apply: ["headings"],
          primary: { bgColor: "#5C3317", textColor: "#FFFBEB", accentColor: "#D97706" },
          secondary: { bgColor: "#FFFBEB", textColor: "#1C0A00", accentColor: "#78350F" }
        },
        typography: { fontFamily: "Georgia", fontSize: 12, lineHeight: 1.6 },
        headings: {
          variant: "underline-full",
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#78350F",
          icon: { visible: false, color: "#78350F" }
        },
        layout: {
          columns: "1",
          dateFormat: "DD MMMM, YYYY",
          verticalMargin: 15,
          horizontalMargin: 18,
          sectionGap: 14
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 26 },
          subtitle: { fontSize: 18 }
        },
        details: { icon: { visible: false }, separator: "comma" }
      }
    }
  },

  // ─── T14: Emerald Health ──────────────────────────────────────────────────
  {
    id: "template-14",
    name: "Emerald Health",
    description: "Deep emerald with mint accents — clean and trusted for healthcare, biotech, and life sciences",
    screenshot: "/images/templates/14.png",
    configs: {
      general: {
        colors: {
          apply: ["headings", "dates"],
          primary: { bgColor: "#065F46", textColor: "#ECFDF5", accentColor: "#6EE7B7" },
          secondary: { bgColor: "#F0FDF4", textColor: "#042F2A", accentColor: "#059669" }
        },
        typography: { fontFamily: "Open Sans", fontSize: 11, lineHeight: 1.5 },
        headings: {
          variant: "vertical-border",
          icon: { size: 14 }
        },
        links: {
          underline: true,
          color: "#059669",
          icon: { type: "arrow", color: "#059669" }
        },
        layout: {
          columns: "2",
          dateFormat: "DD MMM YYYY",
          verticalMargin: 13,
          horizontalMargin: 13,
          sectionGap: 12,
          columnsWidth: { left: 55, right: 45 },
          order: {
            twoCol: {
              left: ["summary", "experiences", "educations"],
              right: ["skills", "projects", "languages", "certificates", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 26 },
          subtitle: { fontSize: 17 }
        },
        details: { separator: "dot" }
      }
    }
  },

  // ─── T15: Graphite Flash ──────────────────────────────────────────────────
  {
    id: "template-15",
    name: "Graphite Flash",
    description:
      "Near-black with electric yellow accents and left sidebar — bold and unconventional for senior designers",
    screenshot: "/images/templates/15.png",
    configs: {
      general: {
        colors: {
          apply: ["headings"],
          primary: { bgColor: "#18181B", textColor: "#F4F4F5", accentColor: "#EAB308" },
          secondary: { bgColor: "#27272A", textColor: "#E4E4E7", accentColor: "#EAB308" }
        },
        typography: { fontFamily: "Fira Sans", fontSize: 10, lineHeight: 1.5 },
        headings: {
          variant: "border",
          fontCase: "uppercase",
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#EAB308",
          icon: { visible: false, color: "#EAB308" }
        },
        layout: {
          columns: "2",
          dateFormat: "MMM DD, YYYY",
          verticalMargin: 10,
          horizontalMargin: 10,
          sectionGap: 10,
          personalPosition: "left",
          columnsWidth: { left: 32, right: 68 },
          order: {
            twoCol: {
              left: ["skills", "languages", "certificates"],
              right: ["summary", "experiences", "projects", "educations", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 22 },
          subtitle: { fontSize: 14 }
        },
        details: {
          variant: "stacked",
          separator: "dot",
          icon: { type: "simple", size: 12 }
        }
      }
    }
  },

  // ─── T16: Sky Connect ─────────────────────────────────────────────────────
  {
    id: "template-16",
    name: "Sky Connect",
    description:
      "Sky blue with centered header and pill headings — open and energetic for sales and business development",
    screenshot: "/images/templates/16.png",
    configs: {
      general: {
        colors: {
          apply: ["name", "dates", "headings"],
          primary: { bgColor: "#0284C7", textColor: "#FFFFFF", accentColor: "#E0F2FE" },
          secondary: { bgColor: "#F0F9FF", textColor: "#0C1E2E", accentColor: "#0284C7" }
        },
        typography: { fontFamily: "Lato", fontSize: 11, lineHeight: 1.5 },
        headings: {
          variant: "pill",
          icon: { visible: false }
        },
        links: {
          underline: true,
          color: "#0284C7",
          icon: { type: "arrow", color: "#0284C7" }
        },
        layout: {
          columns: "2",
          dateFormat: "MMM DD, YYYY",
          verticalMargin: 12,
          horizontalMargin: 12,
          sectionGap: 11,
          columnsWidth: { left: 42, right: 58 },
          order: {
            twoCol: {
              left: ["summary", "skills", "languages"],
              right: ["experiences", "projects", "educations", "certificates", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "center",
        bottomSpace: 26,
        main: {
          variant: "stacked",
          title: { fontSize: 28 },
          subtitle: { fontSize: 18 }
        },
        details: {
          separator: "dot",
          icon: { type: "outlineRounded", size: 14 }
        }
      }
    }
  },

  // ─── T17: Indigo Strategy ─────────────────────────────────────────────────
  {
    id: "template-17",
    name: "Indigo Strategy",
    description:
      "Rich indigo with personal info on the right sidebar — analytical and strategic for finance and consulting",
    screenshot: "/images/templates/17.png",
    configs: {
      general: {
        colors: {
          apply: ["headings"],
          primary: { bgColor: "#3730A3", textColor: "#EEF2FF", accentColor: "#C7D2FE" },
          secondary: { bgColor: "#EEF2FF", textColor: "#1E1B4B", accentColor: "#4F46E5" }
        },
        typography: { fontFamily: "Inter", fontSize: 11, lineHeight: 1.45 },
        headings: {
          variant: "underline",
          fontCase: "uppercase",
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#4F46E5",
          icon: { visible: false, color: "#4F46E5" }
        },
        layout: {
          columns: "2",
          dateFormat: "DD MMM YYYY",
          verticalMargin: 14,
          horizontalMargin: 14,
          sectionGap: 11,
          personalPosition: "right",
          columnsWidth: { left: 63, right: 37 },
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects", "educations"],
              right: ["skills", "languages", "certificates", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 24 },
          subtitle: { fontSize: 16 }
        },
        details: {
          variant: "stacked",
          separator: "comma",
          icon: { visible: false }
        }
      }
    }
  },

  // ─── T18: Press Print ─────────────────────────────────────────────────────
  {
    id: "template-18",
    name: "Press Print",
    description: "Pure black and white with Times New Roman — timeless, universal, and printer-perfect",
    screenshot: "/images/templates/18.png",
    configs: {
      general: {
        colors: {
          apply: ["headings"],
          primary: { bgColor: "#000000", textColor: "#FFFFFF", accentColor: "#555555" },
          secondary: { bgColor: "#FFFFFF", textColor: "#000000", accentColor: "#444444" }
        },
        typography: { fontFamily: "Times New Roman", fontSize: 11, lineHeight: 1.5 },
        headings: {
          variant: "underline-full",
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#000000",
          icon: { visible: false, color: "#000000" }
        },
        layout: {
          columns: "1",
          dateFormat: "DD MMMM YYYY",
          verticalMargin: 16,
          horizontalMargin: 20,
          sectionGap: 14
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 28 },
          subtitle: { fontSize: 20 }
        },
        details: { icon: { visible: false }, separator: "comma" }
      }
    }
  },

  // ─── T19: Sunset Brand ────────────────────────────────────────────────────
  {
    id: "template-19",
    name: "Sunset Brand",
    description:
      "Orange-red with a narrow left sidebar — fiery and directional for creative directors and brand strategists",
    screenshot: "/images/templates/19.png",
    configs: {
      general: {
        colors: {
          apply: ["name", "headings"],
          primary: { bgColor: "#C2410C", textColor: "#FFFFFF", accentColor: "#FED7AA" },
          secondary: { bgColor: "#FFF7ED", textColor: "#1C0700", accentColor: "#EA580C" }
        },
        typography: { fontFamily: "Titillium Web", fontSize: 10, lineHeight: 1.55 },
        headings: {
          variant: "pill",
          fontCase: "uppercase",
          icon: { size: 14 }
        },
        links: {
          underline: false,
          color: "#EA580C",
          icon: { visible: false, color: "#EA580C" }
        },
        layout: {
          columns: "2",
          dateFormat: "MMM DD, YYYY",
          verticalMargin: 10,
          horizontalMargin: 10,
          sectionGap: 11,
          personalPosition: "left",
          columnsWidth: { left: 30, right: 70 },
          order: {
            twoCol: {
              left: ["skills", "languages", "certificates"],
              right: ["summary", "experiences", "projects", "educations", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 22 },
          subtitle: { fontSize: 14 }
        },
        details: {
          variant: "stacked",
          separator: "dot",
          icon: { type: "outlineRounded", size: 12 }
        }
      }
    }
  },

  // ─── T20: Mint Start ──────────────────────────────────────────────────────
  {
    id: "template-20",
    name: "Mint Start",
    description:
      "Fresh teal with a centered single-column layout — inviting and clear for fresh graduates and junior roles",
    screenshot: "/images/templates/20.png",
    configs: {
      general: {
        colors: {
          apply: ["name", "dates", "headings"],
          primary: { bgColor: "#0D9488", textColor: "#F0FDFA", accentColor: "#CCFBF1" },
          secondary: { bgColor: "#F0FDFA", textColor: "#042F2E", accentColor: "#0D9488" }
        },
        typography: { fontFamily: "Inter", fontSize: 11, lineHeight: 1.55 },
        headings: {
          variant: "pill",
          icon: { size: 14 }
        },
        links: {
          underline: true,
          color: "#0D9488",
          icon: { type: "arrow", color: "#0D9488" }
        },
        layout: {
          columns: "1",
          dateFormat: "MMM DD, YYYY",
          verticalMargin: 12,
          horizontalMargin: 14,
          sectionGap: 11
        }
      },
      personal: {
        align: "center",
        bottomSpace: 28,
        main: {
          variant: "stacked",
          title: { fontSize: 28 },
          subtitle: { fontSize: 18 }
        },
        details: {
          separator: "dot",
          icon: { type: "outlineRounded", size: 14 }
        }
      }
    }
  },

  // ─── T21: Plum Authority ──────────────────────────────────────────────────
  {
    id: "template-21",
    name: "Plum Authority",
    description:
      "Deep plum with personal info on the right sidebar — distinguished and weighty for law and senior academia",
    screenshot: "/images/templates/21.png",
    configs: {
      general: {
        colors: {
          apply: ["headings"],
          primary: { bgColor: "#4A044E", textColor: "#FAF0FB", accentColor: "#D8B4FE" },
          secondary: { bgColor: "#FAF0FB", textColor: "#1A0020", accentColor: "#7E22CE" }
        },
        typography: { fontFamily: "Cambria", fontSize: 11, lineHeight: 1.5 },
        headings: {
          variant: "underline",
          fontCase: "uppercase",
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#7E22CE",
          icon: { visible: false, color: "#7E22CE" }
        },
        layout: {
          columns: "2",
          dateFormat: "MMMM DD, YYYY",
          verticalMargin: 15,
          horizontalMargin: 15,
          sectionGap: 12,
          personalPosition: "right",
          columnsWidth: { left: 62, right: 38 },
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects", "educations"],
              right: ["skills", "languages", "certificates", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 26 },
          subtitle: { fontSize: 17 }
        },
        details: {
          variant: "stacked",
          separator: "comma",
          icon: { visible: false }
        }
      }
    }
  },

  // ─── T22: Nordic ──────────────────────────────────────────────────────────
  {
    id: "template-22",
    name: "Nordic",
    description:
      "Dark blue-gray with vertical-border headings and no icon clutter — clean Scandinavian professionalism",
    screenshot: "/images/templates/22.png",
    configs: {
      general: {
        colors: {
          apply: ["headings"],
          primary: { bgColor: "#2E4057", textColor: "#F5F7FA", accentColor: "#A8B8C8" },
          secondary: { bgColor: "#F5F7FA", textColor: "#1A2635", accentColor: "#3D6080" }
        },
        typography: { fontFamily: "Calibri", fontSize: 11, lineHeight: 1.4 },
        headings: {
          variant: "vertical-border",
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#3D6080",
          icon: { visible: false, color: "#3D6080" }
        },
        layout: {
          columns: "2",
          dateFormat: "DD.MM.YYYY",
          verticalMargin: 13,
          horizontalMargin: 13,
          sectionGap: 10,
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects"],
              right: ["educations", "skills", "languages", "certificates", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 24 },
          subtitle: { fontSize: 16 }
        },
        details: {
          separator: "dot",
          icon: { type: "simple", size: 12 }
        }
      }
    }
  },

  // ─── T23: Rust Ops ────────────────────────────────────────────────────────
  {
    id: "template-23",
    name: "Rust Ops",
    description:
      "Rust orange with square bullets and border headings — grounded and pragmatic for operations and product roles",
    screenshot: "/images/templates/23.png",
    configs: {
      general: {
        colors: {
          apply: ["headings"],
          primary: { bgColor: "#9A3412", textColor: "#FFF7ED", accentColor: "#FDBA74" },
          secondary: { bgColor: "#FFF7ED", textColor: "#1C0700", accentColor: "#9A3412" }
        },
        typography: { fontFamily: "Source Sans Pro", fontSize: 10, lineHeight: 1.4 },
        headings: {
          variant: "border",
          fontCase: "uppercase",
          icon: { visible: false }
        },
        links: {
          underline: false,
          color: "#9A3412",
          icon: { visible: false, color: "#9A3412" }
        },
        layout: {
          columns: "2",
          dateFormat: "DD/MM/YYYY",
          verticalMargin: 12,
          horizontalMargin: 12,
          sectionGap: 10,
          columnsWidth: { left: 48, right: 52 },
          contentLayout: { listType: "square", indent: 2 },
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects"],
              right: ["educations", "skills", "languages", "certificates", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 24 },
          subtitle: { fontSize: 16 }
        },
        details: {
          separator: "dot",
          icon: { type: "simple", size: 12 }
        }
      }
    }
  },

  // ─── T24: Dusk Data ───────────────────────────────────────────────────────
  {
    id: "template-24",
    name: "Dusk Data",
    description:
      "Deep purple with left sidebar and date-colored accents — analytical and modern for data science and ML",
    screenshot: "/images/templates/24.png",
    configs: {
      general: {
        colors: {
          apply: ["headings", "dates"],
          primary: { bgColor: "#2D1B69", textColor: "#E8D5F5", accentColor: "#A855F7" },
          secondary: { bgColor: "#F3E8FF", textColor: "#1A0030", accentColor: "#7C3AED" }
        },
        typography: { fontFamily: "Fira Sans", fontSize: 11, lineHeight: 1.45 },
        headings: {
          variant: "vertical-border",
          fontCase: "uppercase",
          icon: { size: 14 }
        },
        links: {
          underline: true,
          color: "#7C3AED",
          icon: { type: "arrow", color: "#7C3AED" }
        },
        layout: {
          columns: "2",
          dateFormat: "YYYY-MM-DD",
          verticalMargin: 10,
          horizontalMargin: 10,
          sectionGap: 11,
          personalPosition: "left",
          columnsWidth: { left: 33, right: 67 },
          order: {
            twoCol: {
              left: ["skills", "languages", "certificates"],
              right: ["summary", "experiences", "projects", "educations", "awards", "courses"]
            }
          }
        }
      },
      personal: {
        align: "left",
        main: {
          variant: "stacked",
          title: { fontSize: 22 },
          subtitle: { fontSize: 14 }
        },
        details: {
          variant: "stacked",
          separator: "dot",
          icon: { type: "outlineRounded", size: 12 }
        }
      }
    }
  }
]

export const TEMPLATES: Template[] = TEMPLATE_SPECS.map(
  (spec: TemplateSpec): Template => ({
    id: spec.id,
    name: spec.name,
    description: spec.description,
    screenshot: spec.screenshot,
    configs: mergeConfigs<TConfigs>(DEFAULT_CONFIGS, spec.configs)
  })
)
