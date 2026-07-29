import { h } from "vue"
import RenderPersonal from "~/components/resume/preview/sections/personal/RenderPersonal.vue"
import PersonalSpace from "~/components/resume/preview/sections/space/PersonalSpace.vue"
import type { OTHER_SECTION_TYPES } from "~/constants/sectionTypes"
import { generateCoreBlocks } from "./generateCoreBlocks"
import type { TBlock } from "./types"

const OTHER_SECTIONS: Record<(typeof OTHER_SECTION_TYPES)[number], TBlock> = {
  personal: {
    id: "personal",
    component: RenderPersonal,
    height: 0
  },
  space: {
    id: "personalSpace",
    component: PersonalSpace,
    height: 0
  }
}

/**
 * Create a block for a "special" section (personal, space)
 * Returns the block from store if it exists, otherwise creates a new one
 */
function createSpecialBlock(block: TBlock): TBlock {
  const { blocks, setBlock } = usePreviewStore()

  const existingBlock = blocks?.get(block.id)
  if (existingBlock) {
    return existingBlock
  }

  const newBlock: TBlock = {
    id: block.id,
    component: h(block.component),
    height: 0
  }

  setBlock(block.id, newBlock)
  return newBlock
}

/**
 * Register blocks in the preview store
 * Called after block generation to sync with the store
 */
export function registerBlocks(blocks: TBlock[]): void {
  const { setBlock } = usePreviewStore()
  for (const block of blocks) {
    setBlock(block.id, block)
  }
}

/**
 * Generate blocks for a section by its ID
 * Handles special sections (personal, space) and core sections
 */
export function generateSectionBlocks(sid: string): TBlock[] {
  const otherBlock = OTHER_SECTIONS[sid as (typeof OTHER_SECTION_TYPES)[number]]

  if (otherBlock) {
    return [createSpecialBlock(otherBlock)]
  }

  const blocks = generateCoreBlocks(sid)

  if (blocks && blocks.length > 0) {
    registerBlocks(blocks)
    return blocks
  }

  return []
}
