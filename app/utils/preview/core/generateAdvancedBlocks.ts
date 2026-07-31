import { h } from "vue"
import AdvancedDetailBlock from "~/components/resume/preview/advanced/AdvancedDetailBlock.vue"
import AdvancedLineBlock from "~/components/resume/preview/advanced/AdvancedLineBlock.vue"
import type { AdvancedSectionTypeSchema, TCoreSection } from "~/utils/schemas/content.schema"
import type { TBlock } from "./types"

type AdvancedSectionType = (typeof AdvancedSectionTypeSchema.options)[number]

export function generateAdvancedBlocks(sid: string, section: TCoreSection) {
  const { getContentLine, blocks, setBlock } = usePreviewStore()

  const sectionType = section.type as AdvancedSectionType

  const visibleContents = section.contents.filter((content) => content && !(content as { isHidden?: boolean }).isHidden)

  if (visibleContents.length === 0) {
    return
  }

  const newBlocks: TBlock[] = []

  for (const content of visibleContents) {
    const contentId = content.id
    const detailBlockKey = `${sid}-${contentId}`

    const detailBlock = blocks?.get(detailBlockKey) ?? {
      id: detailBlockKey,
      component: h(AdvancedDetailBlock, {
        sid,
        contentId,
        sectionType,
        blockKey: detailBlockKey
      }),
      height: 0
    }

    setBlock(detailBlock.id, detailBlock)

    const lineBlocks = getContentLine(contentId).map((_, index) => {
      const lineId = `${sid}-${content.id}-${index}`

      const lineBlock = blocks?.get(lineId) ?? {
        id: lineId,
        component: h(AdvancedLineBlock, {
          sid,
          lineId,
          index,
          contentId: content.id,
          sectionType
        }),
        height: 0
      }

      setBlock(lineId, lineBlock)
      return lineBlock
    })

    newBlocks.push(detailBlock, ...lineBlocks)
  }

  return newBlocks
}
