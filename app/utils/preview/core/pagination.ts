import {
  createPageHeightCalculator,
  shouldHandleHeading,
  shouldSkipSpace,
  totalHeight,
  willOverflow
} from "./paginationHelpers"
import type { TBlock, TPage, TPageBlock, TPages } from "./types"
import { isSingleBlock } from "./types"

interface PaginateInput {
  blocks: Map<string, TBlock>
  page: TPageBlock[]
}

interface ColumnState {
  heading: TBlock | undefined
  height: number
  done: boolean
  ids: string[]
}

function canProcessColumnItem(
  element: TBlock | undefined,
  state: ColumnState,
  pageHeightLimit: number,
  output: TBlock[]
): boolean {
  if (!element || state.done) return false

  if (shouldHandleHeading(element, state)) {
    state.ids.shift()
    return true
  }

  const height = totalHeight(element, state.heading)

  if (shouldSkipSpace(element, state.height)) {
    state.ids.shift()
    return true
  }

  const isFitsOnPage =
    state.height === 0 || !willOverflow(state.height, element.height, state.heading?.height ?? 0, pageHeightLimit)

  if (isFitsOnPage) {
    if (state.heading) {
      output.push(state.heading)
      state.heading = undefined
    }
    output.push(element)
    state.height += height
    state.ids.shift()
    return true
  }

  state.done = true
  return false
}

function processTwoColumn(
  element: { left: TBlock[]; right: TBlock[] },
  blocks: Map<string, TBlock>,
  pages: TPages,
  config: {
    size: string
    verticalMargin: number
    isTopPersonal: boolean
    isFirstPage: boolean
    currentHeight: number
  }
): { isFirstPage: boolean; currentHeight: number } {
  const lastPage = pages.at(-1) as TPage
  if (!lastPage?.at(-1) || !("left" in lastPage.at(-1)!)) {
    lastPage?.push({ type: "two-column", left: [], right: [] })
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
  const getPageHeightLimit = createPageHeightCalculator({
    pageFormat: config.size,
    verticalMargin: config.verticalMargin,
    isTopPersonal: config.isTopPersonal
  })

  while (leftState.ids.length > 0 || rightState.ids.length > 0) {
    const pageHeightLimit = getPageHeightLimit(isFirstPage)

    const currentPage = pages.at(-1)
    const currentCol = currentPage?.at(-1) as { left: TBlock[]; right: TBlock[] }

    const leftElement = blocks.get(leftState.ids[0] ?? "")
    const rightElement = blocks.get(rightState.ids[0] ?? "")

    canProcessColumnItem(leftElement, leftState, pageHeightLimit, currentCol.left)
    canProcessColumnItem(rightElement, rightState, pageHeightLimit, currentCol.right)

    const needsNewPage =
      (leftState.done && rightState.done) ||
      (leftState.ids.length === 0 && rightState.done) ||
      (rightState.ids.length === 0 && leftState.done)

    if (needsNewPage) {
      pages.push([{ type: "two-column", left: [], right: [] }])
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
  pages: TPages,
  heading: { heading: TBlock | undefined },
  config: {
    size: string
    verticalMargin: number
    isTopPersonal: boolean
    isFirstPage: boolean
    currentHeight: number
  }
): { isFirstPage: boolean; currentHeight: number } {
  const getPageHeightLimit = createPageHeightCalculator({
    pageFormat: config.size,
    verticalMargin: config.verticalMargin,
    isTopPersonal: config.isTopPersonal
  })

  const pageHeightLimit = getPageHeightLimit(config.isFirstPage)
  let { currentHeight, isFirstPage } = config

  if (shouldHandleHeading(element, heading)) {
    return { isFirstPage, currentHeight }
  }

  const height = totalHeight(element, heading.heading)
  const isSpaceBlock = shouldSkipSpace(element, currentHeight)
  const overflows = willOverflow(currentHeight, element.height, heading.heading?.height ?? 0, pageHeightLimit)

  if (overflows && isSpaceBlock) {
    return { isFirstPage, currentHeight }
  }

  if (overflows) {
    pages.push([])
    currentHeight = 0
    isFirstPage = false
  }

  if (currentHeight === 0 && isSpaceBlock) {
    return { isFirstPage, currentHeight }
  }

  if (heading.heading) {
    pages.at(-1)?.push({ type: "single", block: heading.heading })
    heading.heading = undefined
  }

  pages.at(-1)?.push({ type: "single", block: element })
  currentHeight += height

  return { isFirstPage, currentHeight }
}

/**
 * Process the generated page into multiple pages
 */
export function paginate({ blocks, page }: PaginateInput): TPages {
  const pages: TPages = [[]]

  const configsStore = useConfigsStore()
  const { configs } = storeToRefs(configsStore)

  const { general } = configs.value
  const { verticalMargin, size, personalPosition } = general.layout

  const isTopPersonal = personalPosition === "top"
  const config = { size, verticalMargin, isTopPersonal }

  const heading = { heading: undefined as TBlock | undefined }
  let currentHeight = 0
  let isFirstPage = true

  for (const element of page) {
    if (!element) continue

    if (isSingleBlock(element)) {
      const result = processSingleColumn(element.block, pages, heading, {
        ...config,
        isFirstPage,
        currentHeight
      })
      isFirstPage = result.isFirstPage
      currentHeight = result.currentHeight
    } else if (element.type === "two-column") {
      const result = processTwoColumn(element, blocks, pages, {
        ...config,
        isFirstPage,
        currentHeight
      })
      isFirstPage = result.isFirstPage
      currentHeight = result.currentHeight
    }
  }

  const filteredPages = pages.filter((page) =>
    page.some(
      (element) =>
        isSingleBlock(element) ||
        (element.type === "two-column" && (element.left.length > 0 || element.right.length > 0))
    )
  )
  return filteredPages.length > 0 ? filteredPages : [[]]
}
