import { calculatePageHeight } from "~/utils/preview/core/pageHeight"
import type { TBlock, TBlocks } from "~/utils/preview/core/types"

interface IProcessPagesProps {
  blocks: Map<string, TBlock>
  page: TBlocks[]
}

interface ColumnState {
  heading: TBlock | undefined
  height: number
  done: boolean
  ids: string[]
}

const isHeading = (id: string): boolean => id.endsWith("Heading")
const isSpace = (id: string): boolean => id.endsWith("Space") || id === "personalSpace"

function processColumn(element: TBlock | undefined, state: ColumnState, pageHeightLimit: number, column: TBlock[]) {
  if (!element || state.done) return false

  if (isHeading(element.id)) {
    state.heading = element
    state.ids.shift()
    return true
  }

  const totalHeight = element.height + (state.heading?.height ?? 0)
  const shouldSkipSpace = state.height === 0 && isSpace(element.id) && element.height !== 0
  const fitsOnPage = state.height === 0 || state.height + totalHeight < pageHeightLimit

  if (shouldSkipSpace) {
    state.ids.shift()
    return true
  }

  if (fitsOnPage) {
    if (state.heading) {
      column.push(state.heading)
      state.heading = undefined
    }
    column.push(element)
    state.height += totalHeight
    state.ids.shift()
    return true
  }

  state.done = true
  return false
}

function processTwoColumn(
  element: { left: TBlock[]; right: TBlock[] },
  blocks: Map<string, TBlock>,
  pages: Array<Array<TBlocks>>,
  config: {
    size: string
    verticalMargin: number
    isTopPersonal: boolean
    isFirstPage: boolean
    currentHeight: number
  }
) {
  const lastPage = pages.at(-1) as Array<{ left: TBlock[]; right: TBlock[] }>
  if (!lastPage?.at(-1)?.left) {
    lastPage?.push({ left: [], right: [] })
  }

  const leftState: ColumnState = {
    heading: undefined,
    height: config.currentHeight,
    done: false,
    ids: element.left.map((block) => block.id)
  }

  const rightState: ColumnState = {
    heading: undefined,
    height: config.currentHeight,
    done: false,
    ids: element.right.map((block) => block.id)
  }

  let isFirstPage = config.isFirstPage

  while (leftState.ids.length > 0 || rightState.ids.length > 0) {
    const pageHeightLimit = calculatePageHeight({
      pageFormat: config.size,
      verticalMargin: config.verticalMargin,
      isTopPersonal: config.isTopPersonal,
      isFirstPage
    })

    const currentPage = pages.at(-1)
    const currentCol = currentPage?.at(-1) as { left: TBlock[]; right: TBlock[] }

    const leftElement = blocks.get(leftState.ids[0] ?? "")
    const rightElement = blocks.get(rightState.ids[0] ?? "")

    processColumn(leftElement, leftState, pageHeightLimit, currentCol.left)
    processColumn(rightElement, rightState, pageHeightLimit, currentCol.right)

    const needsNewPage =
      (leftState.done && rightState.done) ||
      (leftState.ids.length === 0 && rightState.done) ||
      (rightState.ids.length === 0 && leftState.done)

    if (needsNewPage) {
      pages.push([{ left: [], right: [] }])
      leftState.height = 0
      rightState.height = 0
      leftState.done = false
      rightState.done = false
      isFirstPage = false
    }
  }

  return { isFirstPage, currentHeight: Math.max(leftState.height, rightState.height) }
}

function processSingleColumn(
  element: TBlock,
  pages: Array<Array<TBlocks>>,
  heading: { current: TBlock | undefined },
  config: {
    size: string
    verticalMargin: number
    isTopPersonal: boolean
    isFirstPage: boolean
    currentHeight: number
  }
) {
  const pageHeightLimit = calculatePageHeight({
    pageFormat: config.size,
    verticalMargin: config.verticalMargin,
    isTopPersonal: config.isTopPersonal,
    isFirstPage: config.isFirstPage
  })

  let { currentHeight, isFirstPage } = config

  if (isHeading(element.id)) {
    heading.current = element
    return { isFirstPage, currentHeight }
  }

  const totalHeight = element.height + (heading.current?.height ?? 0)
  const isSpaceBlock = isSpace(element.id) && element.height !== 0
  const willOverflow = currentHeight > 0 && currentHeight + totalHeight > pageHeightLimit

  if (willOverflow && isSpaceBlock) {
    return { isFirstPage, currentHeight }
  }

  if (willOverflow) {
    pages.push([])
    currentHeight = 0
    isFirstPage = false
  }

  const shouldSkipSpace = currentHeight === 0 && isSpaceBlock

  if (shouldSkipSpace) {
    return { isFirstPage, currentHeight }
  }

  if (heading.current) {
    pages.at(-1)?.push(heading.current)
    heading.current = undefined
  }

  pages.at(-1)?.push(element)
  currentHeight += totalHeight

  return { isFirstPage, currentHeight }
}

/**
 * Process the generated page into multiple pages
 */
export function paginate({ blocks, page }: IProcessPagesProps) {
  const pages = [[]] as Array<Array<TBlocks>>

  const configsStore = useConfigsStore()
  const { configs } = storeToRefs(configsStore)

  const {
    general: {
      layout: { verticalMargin, size, personalPosition }
    }
  } = configs.value

  const isTopPersonal = personalPosition === "top"
  const config = { size, verticalMargin, isTopPersonal }

  const heading = { current: undefined as TBlock | undefined }
  let currentHeight = 0
  let isFirstPage = true

  for (const element of page) {
    if (!element) continue

    if ("left" in element && "right" in element && (element.left.length > 0 || element.right.length > 0)) {
      const result = processTwoColumn(element, blocks, pages, {
        ...config,
        isFirstPage,
        currentHeight
      })

      isFirstPage = result.isFirstPage
      currentHeight = result.currentHeight
    } else if ("id" in element) {
      const result = processSingleColumn(element, pages, heading, {
        ...config,
        isFirstPage,
        currentHeight
      })
      isFirstPage = result.isFirstPage
      currentHeight = result.currentHeight
    }
  }

  const filteredPages = pages.filter((page) =>
    page.some((el) => {
      if ("id" in el) return true
      if ("left" in el && "right" in el) return (el as { left: unknown[]; right: unknown[] }).left.length > 0 || (el as { left: unknown[]; right: unknown[] }).right.length > 0
      return false
    })
  )
  return filteredPages.length > 0 ? filteredPages : [[]]
}
