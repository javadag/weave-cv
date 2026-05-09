// Color calculation utilities

import type { TColors } from "~/utils/schemas/configs/generalConfigs.schema"

export function getColumnColors(colors: TColors, personalPosition: string, isRtl: boolean = false) {
  let leftColumnColors = {
    accentColor: "#ffffff",
    textColor: "#ffffff",
    bgColor: "#000000"
  }
  let rightColumnColors = {
    accentColor: "#000000",
    textColor: "#000000",
    bgColor: "#ffffff"
  }

  leftColumnColors = colors.primary
  rightColumnColors = colors.secondary

  const adjustedPosition = /* isRtl
    ? personalPosition === "left"
      ? "right"
      : personalPosition === "right"
        ? "left"
        : personalPosition
    : */ personalPosition

  if (adjustedPosition === "left") {
    return { left: leftColumnColors, right: rightColumnColors }
  } else if (adjustedPosition === "right") {
    return { left: rightColumnColors, right: leftColumnColors }
  } else {
    return { left: rightColumnColors, right: rightColumnColors }
  }
}
