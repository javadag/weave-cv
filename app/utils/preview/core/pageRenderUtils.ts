import type { TBlock, TPageBlock } from "./types"
import { isSingleBlock, isTwoColumnBlock } from "./types"

export function findPersonalElement(page: TPageBlock[]): TBlock | null {
  for (const item of page) {
    if (isSingleBlock(item) && item.block.id === "personal") {
      return item.block
    }
  }
  return null
}

export function shouldRenderSection(section: TPageBlock, isTopPersonal: boolean, isFirstPage: boolean): boolean {
  if (!section) return false
  if (isSingleBlock(section) && section.block.id === "personal") {
    return !(isTopPersonal && isFirstPage)
  }
  return true
}

/**
 * Check if a page block has content (non-empty)
 */
export function hasContent(section: TPageBlock): boolean {
  if (isSingleBlock(section)) {
    return true
  }
  if (isTwoColumnBlock(section)) {
    return section.left.length > 0 || section.right.length > 0
  }
  return false
}

/**
 * Get all blocks from a page (flattened)
 */
export function getAllBlocks(page: TPageBlock[]): TBlock[] {
  const blocks: TBlock[] = []
  for (const item of page) {
    if (isSingleBlock(item)) {
      blocks.push(item.block)
    } else if (isTwoColumnBlock(item)) {
      blocks.push(...item.left, ...item.right)
    }
  }
  return blocks
}
