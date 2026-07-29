import type { TCoreSection, TCoreSections } from "~/utils/schemas/content.schema"
import { processDescriptionLines } from "../html/contentParser"

interface ContentCacheEntry {
  previousState: TCoreSections
}

/**
 * Processes content sections and updates the store with processed fragments.
 * Uses cache to avoid re-processing unchanged content for performance.
 */
function processContent(
  currentContent: TCoreSection["contents"][0],
  previousState: TCoreSections,
  sectionKey: string,
  processedContents: Map<string, string[]>
) {
  if (!currentContent?.id) return

  const previousContent = previousState[sectionKey]?.contents?.find((e) => e?.id === currentContent.id)

  const isDescriptionChanged =
    typeof currentContent.description === "string" && previousContent?.description !== currentContent.description

  if (isDescriptionChanged || (!processedContents.has(currentContent.id) && currentContent.description)) {
    processedContents.set(currentContent.id, processDescriptionLines(currentContent.description))
  }
}

export function processContents(
  sections: TResumeState["core"],
  cache: ContentCacheEntry,
  processedContents: Map<string, string[]>
) {
  if (!sections) return

  const sectionKeys = Object.keys(sections)

  for (const sectionKey of sectionKeys) {
    if (!Object.hasOwn(sections, sectionKey) || typeof sections[sectionKey] !== "object") continue

    const currentSection = sections[sectionKey] as TCoreSections[typeof sectionKey]
    const currentContents = currentSection.contents

    if (!currentContents?.length) continue

    for (const currentContent of currentContents) {
      processContent(currentContent, cache.previousState, sectionKey, processedContents)
    }
  }
}

export type { ContentCacheEntry }
