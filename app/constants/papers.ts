export const PAPER_SIZES = {
  A4: {
    h: 297,
    w: 210
  },
  Letter: {
    h: 279.4,
    w: 215.9
  }
}

export const MM_TO_PX = 96 / 25.4

export type TPaperSize = keyof typeof PAPER_SIZES
