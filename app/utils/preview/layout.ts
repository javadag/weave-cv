export function alignToFlex(
  align: "left" | "center" | "right",
  rtl: boolean
): "flex-start" | "center" | "flex-end" {
  if (align === "center") return "center"
  const isStart = (align === "left") !== rtl
  return isStart ? "flex-start" : "flex-end"
}
