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

const generateOtherBlock = (block: TBlock): TBlock => {
  const { blocks, setBlock } = usePreviewStore()

  const newBlock = blocks?.get(block.id) ?? {
    id: block.id,
    component: h(block.component),
    height: 0
  }

  setBlock(block.id, newBlock)
  return newBlock
}

export function generateSectionBlocks(sid: string) {
  const otherBlock = OTHER_SECTIONS[sid as (typeof OTHER_SECTION_TYPES)[number]]

  const { setBlock } = usePreviewStore()

  if (otherBlock) {
    return [generateOtherBlock(otherBlock)]
  }

  const blocks = generateCoreBlocks(sid)

  if (blocks) {
    for (const block of blocks) {
      setBlock(block.id, block)
    }
    return blocks
  }

  return []
}
