import { describe, it, expect } from "vitest"
import { buildRefineMessages } from "../../server/utils/ai/prompts/refineEntry"
import { normalizeRefineRequest, sanitizeRefineResult } from "../../server/utils/ai/refineChildren"
import type { AiEntry } from "../../server/utils/ai/prompts/improveResume"
import type { HistorySuggestion } from "../../server/utils/ai/improveChildren"

const entry: AiEntry = { serverId: "e1", sectionType: "experiences", title: "t", subtitle: "s", description: "d" }
const suggestion: HistorySuggestion = { entryId: "e1", field: "description", suggestedText: "old", rationale: "r", addedFacts: [] }

describe("refine prompt", () => {
  const { system, user } = buildRefineMessages({
    jobDescription: "jd",
    language: "en",
    honesty: "balanced",
    entry,
    currentSuggestion: suggestion,
    notes: ["too vague"]
  })
  it("treats notes as binding constraints, newest last", () => {
    expect(user).toContain("too vague")
    expect(user).toContain("BINDING")
  })
  it("includes the entry and suggestion", () => {
    expect(user).toContain("e1")
    expect(user).toContain("old")
  })
  it("anchors the language", () => {
    expect(system).toContain('Language: write all text in "en"')
  })
})

describe("normalizeRefineRequest", () => {
  const base = {
    jobDescription: "jd",
    honesty: "balanced",
    language: "en",
    provider: "openai",
    apiKey: "sk-test",
    entry,
    currentSuggestion: suggestion,
    notes: ["n1"]
  }
  it("accepts a valid body", () => {
    const res = normalizeRefineRequest(base)
    expect(res.notes).toEqual(["n1"])
    expect(res.entry.serverId).toBe("e1")
  })
  it("rejects non-array notes", () => {
    expect(() => normalizeRefineRequest({ ...base, notes: "nope" })).toThrow()
  })
  it("rejects a missing entry", () => {
    expect(() => normalizeRefineRequest({ ...base, entry: undefined })).toThrow()
  })
  it("defaults missing notes to []", () => {
    const { notes } = normalizeRefineRequest({ ...base, notes: undefined })
    expect(notes).toEqual([])
  })
})

describe("sanitizeRefineResult", () => {
  it("returns a single suggestion or null", () => {
    const raw = { entryId: "e1", field: "description", suggestedText: "new", rationale: "why", addedFacts: [] }
    expect(sanitizeRefineResult(raw)?.suggestedText).toBe("new")
    expect(sanitizeRefineResult("garbage" as unknown)).toBeNull()
  })
})