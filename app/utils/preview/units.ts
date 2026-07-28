import { MM_TO_PX, PAPER_SIZES, type TPaperSize } from "~/constants/papers"

export const sizeToPx = (size: TPaperSize, v: "h" | "w") => Math.trunc(PAPER_SIZES[size][v] * MM_TO_PX)

export const calculateLineHeight = (lineHeightPct: number, fontSizePt: number): number => {
  const lineHeight = lineHeightPct * ((fontSizePt / 3) * 4)
  return Math.round(lineHeight)
}

export function getPageDimensionsInPx(paperSize: string) {
  const size: TPaperSize = paperSize === "A4" ? "A4" : "Letter"
  return {
    widthInPx: sizeToPx(size, "w"),
    heightInPx: sizeToPx(size, "h")
  }
}

export const calculateHeaderMargin = (verticalMarginMm: number, isFirstPage = false) => {
  const headerAdjustment = isFirstPage ? 6 : 2
  return verticalMarginMm - (headerAdjustment / MM_TO_PX)
}
