import type { TColors } from "~/utils/schemas/configs/generalConfigs.schema"

export function getColumnColors(colors: TColors, personalPosition: string, isRtl: boolean = false) {
  const leftColumnColors = colors.primary
  const rightColumnColors = colors.secondary

  if (personalPosition === "left") {
    return { left: leftColumnColors, right: rightColumnColors }
  } else if (personalPosition === "right") {
    return { left: rightColumnColors, right: leftColumnColors }
  } else {
    return { left: rightColumnColors, right: rightColumnColors }
  }
}
