import { icons } from "@iconify-json/lucide"
import { getIconData, iconToHTML, iconToSVG, replaceIDs } from "@iconify/utils"
import { SECTION_DISPLAY_CONFIG } from "~/constants/sectionConfigs"

export function getIcon(icon: string, size: number) {
  try {
    const iconData = getIconData(icons, icon)

    if (!iconData) {
      console.warn(`Icon "${icon}" is missing`)
      return ""
    }

    const renderData = iconToSVG(iconData, {
      height: size,
      width: size
    })

    return iconToHTML(replaceIDs(renderData.body), renderData.attributes)
  } catch (error) {
    console.warn(`Error rendering icon "${icon}":`, error)
    return ""
  }
}

export function getSectionIconName(sectionType: string) {
  const config = SECTION_DISPLAY_CONFIG[sectionType as keyof typeof SECTION_DISPLAY_CONFIG]
  if (!config?.icon) return null

  const match = config.icon.match(/i-lucide-(.+)/)
  return match && match[1] ? match[1] : null
}

export function getSectionIconNameWithCustom(sectionType: string, customIcons?: Record<string, string | undefined>) {
  if (customIcons && Object.hasOwn(customIcons, sectionType)) {
    const customIcon = customIcons[sectionType]

    return customIcon || null
  }

  return getSectionIconName(sectionType)
}

export const CUSTOM_ICON_NAMES = {
  colon: "i-custom-colon",
  parentheses: "i-custom-parentheses",
  pipe: "i-custom-pipe",
  comma: "i-custom-comma",
  dot: "i-custom-dot",
  "same-line": "i-custom-same-line",
  disc: "i-custom-disc",
  circle: "i-custom-circle",
  square: "i-custom-square",
  arrow: "i-custom-arrow",
  chain: "i-custom-chain",
  pill: "i-custom-pill"
} as const

export const CUSTOM_ICONS: Record<string, string> = {
  "i-custom-colon":
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 16 24"><text x="6" y="16" font-size="22" font-weight="bold" fill="currentColor">:</text></svg>',
  "i-custom-parentheses":
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 4C4 8 4 16 6 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M18 4C20 8 20 16 18 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
  "i-custom-pipe":
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  "i-custom-comma":
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><text x="12" y="12" font-size="24" font-weight="bold" fill="currentColor">,</text></svg>',
  "i-custom-dot":
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>',
  "i-custom-same-line":
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="10" width="20" height="4" rx="2" fill="currentColor"/></svg>',
  "i-custom-disc":
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="currentColor"/></svg>',
  "i-custom-circle":
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
  "i-custom-square":
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" fill="currentColor"/></svg>',
  "i-custom-arrow":
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm11-3v8h-2V6.413l-7.793 7.794l-1.414-1.414L17.585 5H13V3z"/></svg>',
  "i-custom-chain":
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m13.06 8.111l1.415 1.414a7 7 0 0 1 0 9.9l-.354.353a7 7 0 1 1-9.9-9.9l1.415 1.415a5 5 0 1 0 7.071 7.071l.354-.354a5 5 0 0 0 0-7.07l-1.415-1.415zm6.718 6.01l-1.414-1.414a5 5 0 0 0-7.071-7.07l-.354.353a5 5 0 0 0 0 7.07l1.415 1.415l-1.415 1.414l-1.414-1.414a7 7 0 0 1 0-9.9l.354-.353a7 7 0 1 1 9.9 9.9"/></svg>',
  "i-custom-pill":
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 0 0-7.071-7.071L9.878 7.05L8.464 5.636l1.414-1.414a7 7 0 0 1 9.9 9.9zm-2.829 2.828l-1.414 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 0 0 7.07 7.071l1.415-1.414zm-.707-10.607l1.415 1.415l-7.072 7.07l-1.414-1.414z"/></svg>'
}

export function getCustomIconSvg(iconName: string): string | null {
  return CUSTOM_ICONS[iconName] || null
}
