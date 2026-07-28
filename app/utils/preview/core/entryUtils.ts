import type { TAdvancedContent, TBasicContent } from "~/utils/schemas/content.schema"
import type { TAdvancedSectionVariant } from "~/utils/schemas/shared.schema"

export const determineDisplayMode = ({
  columns,
  displayMode
}: {
  columns: string
  displayMode: TAdvancedSectionVariant
}) => {
  if (columns === "1") {
    return displayMode || "dateLocationLeft"
  }

  if (columns === "2") {
    return "columns"
  }

  return "columns"
}

export const isContentEmpty = (content: TAdvancedContent | TBasicContent) => {
  if (!content) return true

  const { id, isHidden, ...rest } = content

  return Object.values(rest).every((value) => {
    if (Array.isArray(value)) return value.length === 0
    return !value
  })
}

export const hasValidDescription = (contents: TBasicContent[]) => {
  return contents.some((content) => content.description && content.description.trim().length > 0)
}
