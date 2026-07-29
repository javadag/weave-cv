import type { Component } from "vue"

export interface TBlock {
  id: string
  component: Component
  height: number
}

/**
 * Single column block - a individual content block
 */
export interface TSingleBlock {
  type: "single"
  block: TBlock
}

/**
 * Two column section - contains left and right column blocks
 */
export interface TTwoColumnBlock {
  type: "two-column"
  left: TBlock[]
  right: TBlock[]
}

/**
 * A page block is either a single block or a two-column section
 */
export type TPageBlock = TSingleBlock | TTwoColumnBlock

/**
 * Array of page blocks representing a single page's content
 */
export type TPage = TPageBlock[]

/**
 * Array of pages - the full resume content split across pages
 */
export type TPages = TPage[]

// Type guards
export function isSingleBlock(item: TPageBlock): item is TSingleBlock {
  return item.type === "single"
}

export function isTwoColumnBlock(item: TPageBlock): item is TTwoColumnBlock {
  return item.type === "two-column"
}

/**
 * @deprecated Use TPageBlock type guards instead
 * Legacy type for backwards compatibility during migration
 */
export type TBlocks = TBlock | { left: TBlock[]; right: TBlock[] }
