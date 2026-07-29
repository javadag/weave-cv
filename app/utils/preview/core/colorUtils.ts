import type { TColors } from "~/utils/schemas/configs/generalConfigs.schema"

export function getColumnColors(colors: TColors, personalPosition: string, _isRtl: boolean = false) {
  const leftColumnColors = colors.primary
  const rightColumnColors = colors.secondary

  if (personalPosition === "left") {
    return { left: leftColumnColors, right: rightColumnColors }
  }
  return personalPosition === "right" ? { left: rightColumnColors, right: leftColumnColors } : { left: rightColumnColors, right: rightColumnColors };
}
