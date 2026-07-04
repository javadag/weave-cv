import type { TCoreSections, TPersonalContent } from "~/utils/schemas/content.schema"

function stripHtml(html: string): string {
  return html
    .replaceAll(/<[^>]*>/g, "")
    .replaceAll("&nbsp;", " ")
    .replaceAll(/\s+/g, " ")
    .trim()
}

function formatDate(
  start: string | null | undefined,
  end: string | null | undefined,
  present: boolean | undefined
): string {
  if (!start && !end) return ""
  const s = start ? start.slice(0, 7) : "?"
  if (present) return `${s} – Present`
  const e = end ? end.slice(0, 7) : "?"
  return `${s} – ${e}`
}

export function resumeToText(personal: TPersonalContent | null, core: TCoreSections | null): string {
  const lines: string[] = []

  if (personal) {
    lines.push(`Name: ${personal.title}`)
    if (personal.subtitle) lines.push(`Title: ${personal.subtitle}`)
    const visibleDetails = personal.details.filter((d) => !d.isHidden).map((d) => d.value)
    if (visibleDetails.length > 0) lines.push(`Contact: ${visibleDetails.join(", ")}`)
    lines.push("")
  }

  if (!core) return lines.join("\n")

  const typeLabels: Record<string, string> = {
    summary: "Summary",
    experiences: "Experience",
    educations: "Education",
    skills: "Skills",
    languages: "Languages",
    certificates: "Certificates",
    projects: "Projects",
    awards: "Awards",
    courses: "Courses",
    custom: "Custom"
  }

  const advancedTypes = new Set(["experiences", "educations", "projects", "awards", "courses"])

  for (const [_, section] of Object.entries(core)) {
    if (!section.isSectionVisible) continue
    const label = section.title || typeLabels[section.type] || section.type
    lines.push(`${label}:`)

    for (const entry of section.contents) {
      if ("isHidden" in entry && entry.isHidden) continue

      const title = entry.title || ""
      const description = stripHtml("description" in entry ? (entry.description as string) : "")
      const url = "url" in entry && entry.url ? ` (${entry.url})` : ""

      const entryId = "id" in entry ? `[entryId: ${entry.id}] ` : ""

      if (advancedTypes.has(section.type)) {
        const adv = entry as {
          subtitle?: string
          startDate?: string | null
          endDate?: string | null
          present?: boolean
          location?: string
        }
        const subtitle = adv.subtitle ? ` at ${adv.subtitle}` : ""
        const location = adv.location ? ` — ${adv.location}` : ""
        const date = formatDate(adv.startDate, adv.endDate, adv.present)
        const dateStr = date ? ` (${date})` : ""
        lines.push(`- ${entryId}${title}${subtitle}${location}${dateStr}${url}`)
        if (description) {
          lines.push(`  ${description}`)
        }

        if ("subRoles" in entry && Array.isArray(entry.subRoles)) {
          for (const sr of entry.subRoles as {
            id?: string
            title?: string
            subtitle?: string
            startDate?: string | null
            endDate?: string | null
            present?: boolean
          }[]) {
            const srId = sr.id ? `[entryId: ${sr.id}] ` : ""
            const srSub = sr.subtitle ? ` at ${sr.subtitle}` : ""
            const srDate = formatDate(sr.startDate, sr.endDate, sr.present)
            const srDateStr = srDate ? ` (${srDate})` : ""
            lines.push(`  - ${srId}${sr.title || ""}${srSub}${srDateStr}`)
          }
        }
      } else {
        lines.push(`- ${entryId}${title}: ${description}${url}`)
      }
    }
    lines.push("")
  }

  return lines.join("\n").trim()
}
