import type { TBlock } from "~/utils/preview/core/types"

export type TPreviewStore = {
  contentLines: Map<string, string[]> | null
  blocks: Map<string, TBlock> | null
}

export const usePreviewStore = defineStore("preview", {
  state: (): TPreviewStore => ({
    contentLines: null,
    blocks: null
  }),
  actions: {
    setContentLines(lines: Map<string, string[]>) {
      if (!this.contentLines) {
        this.contentLines = new Map()
      }
      this.contentLines.clear()
      for (const [key, value] of lines) {
        this.contentLines.set(key, value)
      }
    },
    setBlock(id: string, block: TBlock) {
      if (!this.blocks) {
        this.blocks = new Map()
      }
      this.blocks.set(id, block)
    },
    getContentLine(contentId: string) {
      return this.contentLines?.get(contentId) ?? []
    },
    getBlock(id: string) {
      return this.blocks?.get(id) ?? null
    },
    updateHeight(id: string, height: number) {
      const block = this.blocks?.get(id)
      if (block) block.height = height
    }
  }
})
