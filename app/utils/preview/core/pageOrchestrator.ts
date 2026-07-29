import { generateSectionBlocks } from "./generateSectionBlocks"
import type { TSectionsOrder } from "./layoutGenerator"
import type { TBlock, TPageBlock, TSingleBlock, TTwoColumnBlock } from "./types"

function createSingleBlock(block: TBlock): TSingleBlock {
  return { type: "single", block }
}

function createTwoColumnBlock(left: TBlock[], right: TBlock[]): TTwoColumnBlock {
  return { type: "two-column", left, right }
}

function generateBlocksTwoColumn(item: { left: string[]; right: string[] }) {
  const leftBlocks = item.left.flatMap((sid) => generateSectionBlocks(sid))
  const rightBlocks = item.right.flatMap((sid) => generateSectionBlocks(sid))

  return createTwoColumnBlock(leftBlocks, rightBlocks)
}

export function generateBlocks(sectionsOrder: TSectionsOrder): TPageBlock[] {
  const page: TPageBlock[] = []

  for (const item of sectionsOrder) {
    if (!item) {
      continue
    }

    if (typeof item === "string") {
      const blocks = generateSectionBlocks(item)
      for (const block of blocks) {
        page.push(createSingleBlock(block))
      }
    } else if (isTwoColumnSection(item)) {
      page.push(generateBlocksTwoColumn(item))
    }
  }

  return page
}

function isTwoColumnSection(item: unknown): item is { left: string[]; right: string[] } {
  return (
    typeof item === "object" &&
    item !== null &&
    "left" in item &&
    "right" in item &&
    Array.isArray((item as { left: unknown }).left) &&
    Array.isArray((item as { right: unknown }).right)
  )
}
