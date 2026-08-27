import type { AiEntry } from "./improveResume"
import type { HonestyLevel } from "../providers"
import { HONESTY_BLOCK } from "./honesty"

export const REFINE_SCHEMA = `{
  "entryId": "...",
  "field": "description" | "title",
  "suggestedText": "...",
  "rationale": "...",
  "addedFacts": []
}`

export function buildRefineMessages(args: {
  jobDescription: string
  language: string
  honesty: HonestyLevel
  entry: AiEntry
  currentSuggestion: { field: "description" | "title"; suggestedText: string }
  notes: string[]
}): { system: string; user: string } {
  const system = [
    `You are revising one resume suggestion. Output ONLY valid JSON matching this exact schema (a single object, not an array):`,
    REFINE_SCHEMA,
    ``,
    HONESTY_BLOCK[args.honesty],
    ``,
    `Keep the suggestion specific to BOTH the job description and the entry. Respect all user notes as binding constraints.`,
    `Language: write all text in "${args.language}".`
  ].join("\n")

  const constraints = args.notes.map((n, i) => `${i + 1}. ${n}`).join("\n")
  const user = [
    `Job description:\n${args.jobDescription}`,
    ``,
    `Entry:\n<entry id="${args.entry.serverId}" section="${args.entry.sectionType}">\n${args.entry.title}\n${args.entry.subtitle}\n${args.entry.description}\n</entry>`,
    ``,
    `Current suggestion (${args.currentSuggestion.field}):\n${args.currentSuggestion.suggestedText}`,
    ``,
    args.notes.length
      ? `User notes (BINDING, newest last):\n${constraints}`
      : `No notes provided — strengthen the suggestion.`
  ].join("\n")

  return { system, user }
}