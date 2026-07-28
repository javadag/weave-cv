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
  if (customIcons && customIcons[sectionType]) {
    const customIcon = customIcons[sectionType]

    return customIcon || null
  }

  return getSectionIconName(sectionType)
}
