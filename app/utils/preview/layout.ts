export function alignToFlex(
  align: "left" | "center" | "right",
  isRtl: boolean
): "flex-start" | "center" | "flex-end" {
  if (align === "center") return "center"
  const isStart = (align === "left") !== isRtl
  return isStart ? "flex-start" : "flex-end"
}
