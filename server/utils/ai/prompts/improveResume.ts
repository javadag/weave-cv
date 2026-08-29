import type { HonestyLevel } from "../providers"
import { HONESTY_BLOCK } from "./honesty"

export type AiEntryType =
  | "summary"
  | "experiences"
  | "projects"
  | "educations"
  | "skills"
  | "languages"
  | "certificates"
  | "courses"
  | "awards"
  | "custom"

export interface AiEntry {
  serverId: string
  sectionType: AiEntryType
  title: string
  subtitle: string
  description: string
}

export const IMPROVE_SCHEMA = `{
  "matchScore": 0-100,
  "scoreSummary": "one line",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "missingKeywords": ["..."],
  "suggestions": [
    {
      "entryId": "...",
      "field": "description" | "title",
      "suggestedText": "...",
      "rationale": "...",
      "addedFacts": []
    }
  ]
}`

export function buildImproveMessages(args: {
  jobDescription: string
  language: string
  honesty: HonestyLevel
  entries: AiEntry[]
}): { system: string; user: string } {
  const system = [
    `You are a resume improvement coach. Output ONLY valid JSON matching this exact schema:`,
    IMPROVE_SCHEMA,
    ``,
    HONESTY_BLOCK[args.honesty],
    ``,
    `Every suggestion must cite specifics from BOTH the resume entry AND the job description. Generic advice is forbidden.`,
    `Strengths, weaknesses, and missingKeywords must reference actual resume or JD content.`,
    `Return one suggestion per resume entry you choose to improve (you may skip entries already strong).`,
    `Field must be "description" or "title". addedFacts is [] unless the honesty level says otherwise.`,
    ``,
    `Language: write all text in "${args.language}".`
  ].join("\n")

  const entriesBlock = args.entries
    .map(
      (e) =>
        `<entry id="${e.serverId}" section="${e.sectionType}">\n${e.title}\n${e.subtitle}\n${e.description}\n</entry>`
    )
    .join("\n")

  const user = `Job description:\n${args.jobDescription}\n\nResume entries:\n${entriesBlock}`

  return { system, user }
}