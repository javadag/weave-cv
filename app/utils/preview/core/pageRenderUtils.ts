import type { TBlock, TBlocks } from "./types"

export function findPersonalElement(page: TBlocks[]): TBlock | null {
  return (page.find((item) => "id" in item && item.id === "personal") as TBlock) || null
}

function isPersonalElement(section: TBlocks): boolean {
  return "id" in section && section.id === "personal"
}

export function isTwoColumnSection(section: unknown) {
  return (
    typeof section === "object" &&
    section !== null &&
    "left" in section &&
    "right" in section &&
    Array.isArray(section.left) &&
    Array.isArray(section.right)
  )
}

export function shouldRenderSection(section: TBlocks, isTopPersonal: boolean, isFirstPage: boolean): boolean {
  if (!section) return false
  if (isTopPersonal && isFirstPage && isPersonalElement(section)) return false
  return true
}
