import type { TCoreSections } from "~/utils/schemas/content.schema"

export interface AiResumeEntry {
  serverId: string
  sectionType: string
  title: string
  subtitle: string
  description: string
}

export function flattenEntries(core: TCoreSections): AiResumeEntry[] {
  const out: AiResumeEntry[] = []
  const sections = Object.entries(core ?? {})

  for (const [sectionType, section] of sections) {
    if (!section || section.isSectionVisible === false) continue
    const visibleEntries = (section.contents ?? []).filter((c) => c.isHidden !== true)
    out.push(
      ...visibleEntries.map((c) => ({
        serverId: c.id,
        sectionType,
        title: c.title ?? "",
        subtitle: (c as { subtitle?: string }).subtitle ?? "",
        description: c.description ?? ""
      }))
    )
  }
  return out
}

export function buildApplyPath(sectionType: string, entryId: string, field: "description" | "title"): string {
  return `${sectionType}.contents.${entryId}.${field}`
}

export function appendNote(notes: string[], note: string): string[] {
  const trimmed = note.trim()
  return trimmed ? [...notes, trimmed] : notes
}