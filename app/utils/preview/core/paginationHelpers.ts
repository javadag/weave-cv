import { MM_TO_PX } from "~/constants/papers"
import type { TBlock } from "./types"
import { getPageDimensionsInPx } from "~/utils/preview/units"

// Section ID helpers
export const isHeading = (id: string): boolean => id.endsWith("Heading")
export const isSpace = (id: string): boolean => id.endsWith("Space") || id === "personalSpace"

/**
 * Calculate available page height in pixels
 */
export function calculatePageHeight({
  pageFormat,
  verticalMargin,
  isTopPersonal,
  isFirstPage,
}: {
  pageFormat: string
  verticalMargin: number
  isTopPersonal: boolean
  isFirstPage: boolean
}): number {
  const marginPx = verticalMargin * MM_TO_PX
  const pageHeightPx = getPageDimensionsInPx(pageFormat).heightInPx
  let availableHeight = pageHeightPx - marginPx

  if (!isTopPersonal || !isFirstPage) {
    availableHeight -= marginPx
  }

  return availableHeight
}

/**
 * Handle heading element - stores it for next content block
 * Returns true if element was a heading (and should not be counted toward height)
 */
export function shouldHandleHeading(
  element: TBlock,
  state: { heading: TBlock | undefined },
): boolean {
  if (isHeading(element.id)) {
    state.heading = element
    return true
  }
  return false
}

/**
 * Check if a space block should be skipped (at page start)
 */
export function shouldSkipSpace(element: TBlock, currentHeight: number): boolean {
  return currentHeight === 0 && isSpace(element.id) && element.height !== 0
}

/**
 * Check if adding an element would overflow the page
 */
export function willOverflow(
  currentHeight: number,
  elementHeight: number,
  headingHeight: number,
  pageHeightLimit: number,
): boolean {
  if (currentHeight === 0) return false
  return currentHeight + elementHeight + headingHeight > pageHeightLimit
}

/**
 * Calculate total height including any pending heading
 */
export function totalHeight(element: TBlock, heading: TBlock | undefined): number {
  return element.height + (heading?.height ?? 0)
}

/**
 * Get page height limit, caching by page configuration
 * Returns a function that can be called to get the limit for current page
 */
export function createPageHeightCalculator(config: {
  pageFormat: string
  verticalMargin: number
  isTopPersonal: boolean
}) {
  const cache = new Map<string, number>()

  return (isFirstPage: boolean): number => {
    const key = String(isFirstPage)
    if (!cache.has(key)) {
      cache.set(
        key,
        calculatePageHeight({
          pageFormat: config.pageFormat,
          verticalMargin: config.verticalMargin,
          isTopPersonal: config.isTopPersonal,
          isFirstPage,
        }),
      )
    }
    return cache.get(key)!
  }
}
