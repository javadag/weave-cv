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
  {
    id: "template-1",
    name: "Modern Professional",
    description: "A clean and modern design perfect for tech and creative roles",
    screenshot: "/images/templates/1.png",
    configs: {
      general: {
        links: {
          icon: { color: "#C7CEDF" },
          color: "#87A1DA"
        },
        colors: {
          primary: { bgColor: "#949FC0", textColor: "#FFFFFF", accentColor: "#EBF3FF" },
          secondary: { bgColor: "#FFFFFF", textColor: "#373C42", accentColor: "#AAC3F8" }
        },
        layout: {
          order: {
            oneCol: [
              "summary",
              "experiences",
              "educations",
              "skills",
              "projects",
              "languages",
              "certificates",
              "courses",
              "awards"
            ]
          },
          contentLayout: {
            title: { fontSizeMultiplier: 1 }
          }
        },
        typography: { fontSize: 11, fontFamily: "inter", lineHeight: 1.5 }
      },
      personal: {
        main: {
          title: { fontSize: 28 },
          subtitle: { fontSize: 20 }
        },
        details: {
          icon: { size: 14 }
        }
      }
    }
  },
  {
    id: "template-2",
    name: "Classic Executive",
    description: "Traditional and authoritative layout ideal for corporate and executive positions",
    screenshot: "/images/templates/2.png",
    configs: {
      general: {
        layout: {
          dateFormat: "MMMM DD, YYYY",
          verticalMargin: 15,
          horizontalMargin: 15,
          columns: "2",
          sectionGap: 14,
          columnsWidth: { left: 55, right: 45 },
          contentLayout: {
            indent: 2,
            title: { fontSizeMultiplier: 1.15 },
            contentFirstWidth: { left: 65, right: 35 },
            dateFirstWidth: { left: 35, right: 65 }
          },
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects"],
              right: ["educations", "skills", "languages", "certificates", "awards", "courses"]
            }
          }
        },
        headings: {
          fontSizeMultiplier: 1.3,
          fontCase: "uppercase",
          variant: "underline",
          icon: { visible: false }
        },
        links: {
          color: "#2C3E50",
          icon: { type: "chain", visible: false, color: "#2C3E50" }
        },
        typography: { fontFamily: "timesnewroman", lineHeight: 1.2, fontSize: 11 },
        colors: {
          apply: ["headings"],
          primary: { textColor: "#FFFFFF", bgColor: "#2C3E50", accentColor: "#34495E" },
          secondary: { textColor: "#2C3E50", bgColor: "#FFFFFF", accentColor: "#34495E" }
        }
      },
      summary: { separator: "none", titleStyle: "none" },
      awards: {
        variant: "dateFirst",
        separator: "comma",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      },
      personal: {
        align: "left",
        bottomSpace: 24,
        main: {
          variant: "stacked",
          bottomSpace: 12,
          title: { fontSize: 28 },
          subtitle: { fontSize: 20 }
        },
        details: {
          icon: { visible: false, type: "simple", size: 14 }
        }
      },
      experiences: {
        variant: "dateFirst",
        separator: "comma",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      },
      skills: { variant: "stacked", separator: "comma", grids: 2 },
      certificates: { separator: "comma", titleStyle: "colon" },
      projects: { dateLocationVariant: "inline", titleSubtitleVariant: "inline", separator: "comma" },
      educations: {
        variant: "dateFirst",
        separator: "comma",
        titleSubtitleVariant: "inline",
        dateLocationVariant: "inline"
      },
      languages: { variant: "inline", separator: "comma", grids: 2 },
      courses: {
        variant: "dateFirst",
        separator: "comma",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      }
    }
  },
  {
    id: "template-3",
    name: "Creative Portfolio",
    description: "Eye-catching design for creative professionals and designers",
    screenshot: "/images/templates/3.png",
    configs: {
      awards: { subTitleFirst: true },
      skills: { grids: 3, variant: "grid", separator: "dot", titleStyle: "bracket" },
      courses: { subTitleFirst: true },
      general: {
        links: {
          icon: { color: "#8B5CF6" },
          color: "#8B5CF6",
          underline: false
        },
        colors: {
          apply: ["dates", "headings", "name"],
          primary: { bgColor: "#8B5CF6", textColor: "#FFFFFF", accentColor: "#EBE7FA" },
          secondary: { bgColor: "#FFFFFF", textColor: "#1F2937", accentColor: "#8B5CF6" }
        },
        layout: {
          order: {
            oneCol: [
              "summary",
              "experiences",
              "projects",
              "educations",
              "skills",
              "languages",
              "awards",
              "certificates",
              "courses"
            ],
            twoCol: {
              left: ["summary", "experiences", "projects"],
              right: ["educations", "skills", "languages", "awards", "certificates", "courses"]
            }
          },
          columns: "2",
          dateFormat: "MMM DD, YYYY",
          sectionGap: 13,
          columnsWidth: { left: 45, right: 55 },
          contentLayout: {
            title: { fontCase: "capitalize", fontSizeMultiplier: 1.2 },
            indent: 4,
            listType: "circle",
            subtitle: { fontStyle: "italic", fontSizeMultiplier: 1.05 },
            dateFirstWidth: { left: 25, right: 75 },
            contentFirstWidth: { left: 75, right: 25 }
          },
          verticalMargin: 10,
          horizontalMargin: 10
        },
        headings: {
          icon: { size: 18 },
          variant: "pill",
          fontCase: "uppercase"
        },
        typography: { fontSize: 11, fontFamily: "lato", lineHeight: 1.5 }
      },
      personal: {
        main: {
          title: { fontSize: 32 },
          variant: "stacked",
          subtitle: { fontSize: 22 },
          bottomSpace: 16
        },
        details: {
          icon: { size: 18, type: "outlineRounded" },
          separator: "dot"
        },
        bottomSpace: 28
      },
      projects: { variant: "contentFirst", subTitleFirst: true },
      languages: { grids: 3, variant: "inline", separator: "dot", titleStyle: "bracket" },
      educations: { variant: "contentFirst", subTitleFirst: true },
      experiences: { variant: "contentFirst", subTitleFirst: true },
      certificates: { separator: "slash" }
    }
  },
  {
    id: "template-4",
    name: "Minimalist",
    description: "Clean, simple design with unified colors - maximum readability and elegance",
    screenshot: "/images/templates/4.png",
    configs: {
      awards: {
        variant: "stacked",
        separator: "none",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      },
      courses: {
        variant: "stacked",
        separator: "none",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      },
      general: {
        links: {
          icon: { color: "#000000", visible: false },
          color: "#000000",
          underline: false
        },
        colors: {
          apply: [],
          primary: { bgColor: "#FFFFFF", textColor: "#1F2937", accentColor: "#6B7280" },
          secondary: { bgColor: "#FFFFFF", textColor: "#1F2937", accentColor: "#6B7280" }
        },
        layout: {
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects"],
              right: ["educations", "skills", "languages", "certificates"]
            }
          },
          dateFormat: "YYYY-MM-DD",
          sectionGap: 9,
          contentLayout: { listType: "none" },
          verticalMargin: 15,
          horizontalMargin: 18
        },
        headings: {
          icon: { visible: false },
          variant: "plain",
          fontSizeMultiplier: 1.15
        },
        typography: { fontSize: 11, fontFamily: "helvetica", lineHeight: 1.5 }
      },
      summary: { separator: "none", titleStyle: "none" },
      personal: {
        main: {
          title: { fontSize: 24 },
          variant: "stacked",
          subtitle: { fontSize: 18 },
          bottomSpace: 20
        },
        align: "left",
        details: {
          icon: { size: 14, type: "simple", visible: false }
        },
        bottomSpace: 6
      },
      projects: {
        variant: "stacked",
        separator: "none",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      },
      languages: { grids: 4, variant: "inline" },
      educations: { separator: "none", dateLocationVariant: "inline", titleSubtitleVariant: "inline" },
      experiences: { separator: "none", dateLocationVariant: "inline", titleSubtitleVariant: "inline" },
      certificates: { titleStyle: "colon" }
    }
  },
  {
    id: "template-5",
    name: "Bold Modern",
    description: "Striking design with bold colors and modern layout for standout applications",
    screenshot: "/images/templates/5.png",
    configs: {
      awards: { variant: "dateFirst", separator: "dash" },
      skills: { grids: 2, variant: "grid", separator: "dot", titleStyle: "bracket" },
      courses: { variant: "dateFirst", separator: "dash" },
      general: {
        links: {
          icon: { color: "#DC2626" },
          color: "#DC2626"
        },
        colors: {
          primary: { bgColor: "#DC2626", textColor: "#FFFFFF", accentColor: "#F4E69E" },
          secondary: { bgColor: "#F3F4F6", textColor: "#1F2937", accentColor: "#DC2626" }
        },
        layout: {
          order: {
            twoCol: {
              left: ["summary", "skills", "languages"],
              right: ["experiences", "educations", "projects", "certificates", "awards", "courses"]
            }
          },
          columns: "2",
          dateFormat: "MM/DD/YYYY",
          columnsWidth: { left: 40, right: 60 },
          contentLayout: {
            title: { fontCase: "uppercase", fontSizeMultiplier: 1.25 },
            indent: 6,
            listType: "square",
            subtitle: { fontCase: "uppercase", fontWeight: "bold" },
            dateFirstWidth: { left: 35, right: 65 },
            contentFirstWidth: { left: 65, right: 35 }
          },
          verticalMargin: 8,
          horizontalMargin: 8
        },
        headings: {
          icon: { size: 18 },
          variant: "border",
          fontCase: "uppercase",
          fontSizeMultiplier: 1.5
        },
        typography: { fontSize: 10, fontFamily: "firasans", lineHeight: 1.4 }
      },
      personal: {
        main: {
          title: { fontSize: 32 },
          variant: "stacked",
          subtitle: { fontSize: 20, fontWeight: "bold" },
          bottomSpace: 12
        },
        align: "left",
        details: {
          icon: { size: 18, type: "filledRounded" },
          separator: "slash"
        },
        bottomSpace: 20
      },
      projects: { separator: "dash" },
      languages: { grids: 2, variant: "grid", separator: "slash", titleStyle: "bracket" },
      educations: { variant: "dateFirst", separator: "dash" },
      experiences: { variant: "dateFirst", separator: "dash" },
      certificates: { separator: "slash" }
    }
  },
  {
    id: "template-6",
    name: "Academic Traditional",
    description: "Classic, formal design perfect for academic and research positions",
    screenshot: "/images/templates/6.png",
    configs: {
      general: {
        layout: {
          dateFormat: "YYYY-MM-DD",
          verticalMargin: 20,
          horizontalMargin: 20,
          sectionGap: 16,
          contentLayout: {
            indent: 3,
            subtitle: { fontStyle: "italic" },
            contentFirstWidth: { left: 75, right: 25 },
            dateFirstWidth: { left: 25, right: 75 }
          },
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects"],
              right: ["educations", "skills", "languages", "certificates", "awards", "courses"]
            },
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
        },
        headings: {
          fontSizeMultiplier: 1.25,
          variant: "underline-full",
          icon: { visible: false }
        },
        links: {
          color: "#1A5490",
          icon: { type: "chain", visible: false, color: "#1A5490" }
        },
        typography: { fontFamily: "garamond", lineHeight: 1.4, fontSize: 11 },
        colors: {
          apply: ["headings"],
          primary: { textColor: "#FFFFFF", bgColor: "#1A5490", accentColor: "#2E7D32" },
          secondary: { textColor: "#212121", bgColor: "#FFFFFF", accentColor: "#1A5490" }
        }
      },
      summary: { separator: "none", titleStyle: "none" },
      awards: {
        variant: "dateFirst",
        separator: "comma",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      },
      personal: {
        bottomSpace: 28,
        main: {
          variant: "stacked",
          bottomSpace: 14,
          subtitle: { fontSize: 19 }
        },
        details: {
          separator: "comma",
          icon: { visible: false, type: "simple", size: 14 }
        }
      },
      experiences: {
        variant: "dateFirst",
        separator: "comma",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      },
      skills: { separator: "comma", grids: 3 },
      certificates: { separator: "comma", titleStyle: "colon" },
      projects: { dateLocationVariant: "inline", titleSubtitleVariant: "inline", separator: "comma" },
      educations: {
        variant: "dateFirst",
        separator: "comma",
        titleSubtitleVariant: "inline",
        dateLocationVariant: "inline"
      },
      languages: { variant: "inline", separator: "comma", grids: 3 },
      courses: {
        variant: "dateFirst",
        separator: "comma",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      }
    }
  },
  {
    id: "template-7",
    name: "Tech Startup",
    description: "Vibrant and dynamic design with personal info on the left sidebar - perfect for tech startups",
    screenshot: "/images/templates/7.png",
    configs: {
      awards: {
        variant: "dateFirst",
        separator: "dash",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      },
      skills: { grids: 2, variant: "grid", separator: "dot", titleStyle: "bracket" },
      courses: {
        variant: "dateFirst",
        separator: "dash",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      },
      general: {
        links: {
          icon: { color: "#10B981" },
          color: "#10B981",
          underline: false
        },
        colors: {
          apply: ["dates", "headings"],
          primary: { bgColor: "#10B981", textColor: "#FFFFFF", accentColor: "#F7F7F7" },
          secondary: { bgColor: "#F9FAFB", textColor: "#111827", accentColor: "#10B981" }
        },
        layout: {
          order: {
            oneCol: [
              "summary",
              "experiences",
              "projects",
              "educations",
              "skills",
              "languages",
              "certificates",
              "courses",
              "awards"
            ],
            twoCol: {
              left: ["skills", "languages", "certificates"],
              right: ["summary", "experiences", "projects", "educations", "awards", "courses"]
            }
          },
          columns: "2",
          dateFormat: "MMM DD, YYYY",
          sectionGap: 14,
          columnsWidth: { left: 35, right: 65 },
          contentLayout: {
            title: { fontSizeMultiplier: 1.15 },
            indent: 3,
            listType: "circle",
            dateFirstWidth: { left: 28, right: 72 },
            contentFirstWidth: { left: 72, right: 28 }
          },
          verticalMargin: 10,
          horizontalMargin: 10,
          personalPosition: "left"
        },
        headings: {
          icon: { size: 14 },
          variant: "pill",
          fontCase: "uppercase",
          fontSizeMultiplier: 1.35
        },
        typography: { fontSize: 10, fontFamily: "opensans", lineHeight: 1.6 }
      },
      summary: { separator: "none", titleStyle: "none" },
      personal: {
        main: {
          title: { fontSize: 24 },
          variant: "stacked",
          subtitle: { fontSize: 16 },
          bottomSpace: 10
        },
        align: "left",
        details: {
          icon: { size: 12, type: "outlineRounded" },
          variant: "stacked",
          separator: "slash"
        },
        bottomSpace: 22
      },
      projects: { separator: "dash", dateLocationVariant: "inline", titleSubtitleVariant: "inline" },
      languages: { grids: 2, variant: "grid", separator: "dot", titleStyle: "bracket" },
      educations: {
        variant: "dateFirst",
        separator: "dash",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      },
      experiences: {
        variant: "dateFirst",
        separator: "dash",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      },
      certificates: { separator: "slash", titleStyle: "colon" }
    }
  },
  {
    id: "template-8",
    name: "Elegant Professional",
    description: "Sophisticated design with personal info on the right sidebar - ideal for executives",
    screenshot: "/images/templates/8.png",
    configs: {
      general: {
        layout: {
          dateFormat: "MMMM DD, YYYY",
          verticalMargin: 16,
          horizontalMargin: 16,
          columns: "2",
          sectionGap: 16,
          columnsWidth: { left: 60, right: 40 },
          personalPosition: "right",
          contentLayout: {
            indent: 4,
            subtitle: { fontStyle: "italic" },
            title: { fontSizeMultiplier: 1.12 },
            contentFirstWidth: { left: 68, right: 32 },
            dateFirstWidth: { left: 32, right: 68 }
          },
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects"],
              right: ["educations", "skills", "languages", "certificates", "awards", "courses"]
            }
          }
        },
        headings: {
          fontSizeMultiplier: 1.28,
          fontCase: "uppercase",
          variant: "underline-full",
          icon: { visible: false }
        },
        links: {
          color: "#7C3AED",
          icon: { type: "chain", visible: false, color: "#7C3AED" }
        },
        typography: { fontFamily: "georgia", lineHeight: 1.5, fontSize: 11 },
        colors: {
          apply: ["headings"],
          primary: { textColor: "#FFFFFF", bgColor: "#7C3AED", accentColor: "#A78BFA" },
          secondary: { textColor: "#1F2937", bgColor: "#FFFFFF", accentColor: "#7C3AED" }
        }
      },
      summary: { separator: "none", titleStyle: "none" },
      awards: {
        variant: "dateFirst",
        separator: "comma",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      },
      personal: {
        align: "left",
        bottomSpace: 30,
        main: {
          variant: "stacked",
          bottomSpace: 14,
          subtitle: { fontSize: 18 }
        },
        details: {
          variant: "stacked",
          icon: { visible: false, type: "simple", size: 14 }
        }
      },
      experiences: {
        variant: "dateFirst",
        separator: "comma",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      },
      skills: { separator: "comma", grids: 3 },
      certificates: { separator: "comma", titleStyle: "colon" },
      projects: { dateLocationVariant: "inline", titleSubtitleVariant: "inline", separator: "comma" },
      educations: {
        variant: "dateFirst",
        separator: "comma",
        titleSubtitleVariant: "inline",
        dateLocationVariant: "inline"
      },
      languages: { variant: "inline", separator: "comma", grids: 3 },
      courses: {
        variant: "dateFirst",
        separator: "comma",
        dateLocationVariant: "inline",
        titleSubtitleVariant: "inline"
      }
    }
  },
  {
    id: "template-9",
    name: "Compact Dense",
    description: "Information-dense layout with unified color scheme - maximizing content efficiently",
    screenshot: "/images/templates/9.png",
    configs: {
      general: {
        layout: {
          dateFormat: "YYYY-MM-DD",
          verticalMargin: 10,
          columns: "2",
          sectionGap: 10,
          columnsWidth: { left: 48, right: 52 },
          contentLayout: {
            listType: "square",
            indent: 2,
            title: { fontSizeMultiplier: 1.08 }
          },
          order: {
            twoCol: {
              left: ["summary", "experiences", "projects", "awards"],
              right: ["educations", "skills", "languages", "certificates", "courses"]
            }
          }
        },
        headings: {
          fontSizeMultiplier: 1.18,
          fontCase: "uppercase",
          variant: "border",
          icon: { size: 12 }
        },
        links: {
          underline: false,
          color: "#059669",
          icon: { color: "#059669" }
        },
        typography: { fontFamily: "calibri", lineHeight: 1.3, fontSize: 9 },
        colors: {
          primary: { textColor: "#1F2937", bgColor: "#F3F4F6", accentColor: "#059669" },
          secondary: { textColor: "#1F2937", bgColor: "#F3F4F6", accentColor: "#059669" }
        }
      },
      awards: { variant: "dateFirst", dateLocationVariant: "inline", titleSubtitleVariant: "inline" },
      personal: {
        align: "left",
        bottomSpace: 16,
        main: {
          bottomSpace: 8,
          title: { fontSize: 22 },
          subtitle: { fontSize: 16 }
        },
        details: {
          icon: { size: 10 }
        }
      },
      experiences: { variant: "dateFirst", dateLocationVariant: "inline", titleSubtitleVariant: "inline" },
      skills: { variant: "grid", grids: 3 },
      projects: { dateLocationVariant: "inline", titleSubtitleVariant: "inline" },
      educations: { variant: "dateFirst", titleSubtitleVariant: "inline", dateLocationVariant: "inline" },
      languages: { variant: "grid", grids: 3 },
      courses: { variant: "dateFirst", dateLocationVariant: "inline", titleSubtitleVariant: "inline" }
    }
  },
  {
    id: "template-10",
    name: "Colorful Creative",
    description: "Bright and vibrant design perfect for creative industries and artistic roles",
    screenshot: "/images/templates/10.png",
    configs: {
      awards: { separator: "dot", subTitleFirst: true },
      skills: { grids: 2, variant: "grid", separator: "dot", titleStyle: "bracket" },
      courses: { separator: "dot", subTitleFirst: true },
      general: {
        links: {
          icon: { color: "#EC4899" },
          color: "#EC4899",
          underline: false
        },
        colors: {
          primary: { bgColor: "#EC4899", textColor: "#FFFFFF", accentColor: "#EDEDED" },
          secondary: { bgColor: "#FEF3C7", textColor: "#1F2937", accentColor: "#EC4899" }
        },
        layout: {
          order: {
            oneCol: [
              "summary",
              "experiences",
              "projects",
              "educations",
              "skills",
              "languages",
              "certificates",
              "courses",
              "awards"
            ],
            twoCol: {
              left: ["summary", "skills", "languages", "certificates"],
              right: ["experiences", "projects", "educations", "awards", "courses"]
            }
          },
          columns: "2",
          dateFormat: "MMM DD, YYYY",
          columnsWidth: { left: 35, right: 65 },
          contentLayout: {
            title: { fontCase: "capitalize", fontSizeMultiplier: 1.25 },
            indent: 5,
            listType: "circle",
            subtitle: { fontCase: "capitalize", fontStyle: "italic", fontSizeMultiplier: 1.05 },
            dateFirstWidth: { left: 22, right: 78 },
            contentFirstWidth: { left: 78, right: 22 }
          },
          verticalMargin: 8,
          horizontalMargin: 8
        },
        headings: {
          variant: "pill",
          fontCase: "uppercase",
          fontSizeMultiplier: 1.45
        },
        typography: { fontSize: 10, fontFamily: "titilliumweb", lineHeight: 1.5 }
      },
      summary: { separator: "dot", titleStyle: "bracket" },
      personal: {
        main: {
          title: { fontSize: 34 },
          variant: "stacked",
          bottomSpace: 12
        },
        details: {
          icon: { type: "outlineRounded" },
          separator: "dot"
        },
        bottomSpace: 24
      },
      projects: { variant: "contentFirst", separator: "dot", subTitleFirst: true },
      languages: { grids: 2, variant: "grid", separator: "dot", titleStyle: "bracket" },
      educations: { variant: "contentFirst", separator: "dot", subTitleFirst: true },
      experiences: { variant: "contentFirst", separator: "dot", subTitleFirst: true },
      certificates: { separator: "slash", titleStyle: "bracket" }
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

export const TEMPLATE_MODERN_PROFESSIONAL = TEMPLATES[0]!
export const TEMPLATE_CLASSIC_EXECUTIVE = TEMPLATES[1]!
export const TEMPLATE_CREATIVE_PORTFOLIO = TEMPLATES[2]!
export const TEMPLATE_MINIMALIST = TEMPLATES[3]!
export const TEMPLATE_BOLD_MODERN = TEMPLATES[4]!
export const TEMPLATE_ACADEMIC_TRADITIONAL = TEMPLATES[5]!
export const TEMPLATE_TECH_STARTUP = TEMPLATES[6]!
export const TEMPLATE_ELEGANT_PROFESSIONAL = TEMPLATES[7]!
export const TEMPLATE_COMPACT_DENSE = TEMPLATES[8]!
export const TEMPLATE_COLORFUL_CREATIVE = TEMPLATES[9]!

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find((template) => template.id === id)
}
