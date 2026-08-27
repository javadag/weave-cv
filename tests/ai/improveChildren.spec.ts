import { describe, it, expect } from "vitest"
import { normalizeImproveRequest, sanitizeSuggestions, mapProviderError } from "../../server/utils/ai/improveChildren"

const validBody = {
  jobDescription: "Ship an API integrating payments for a senior backend engineer at Acme.",
  honesty: "balanced",
  language: "en",
  provider: "deepseek",
  apiKey: "sk-test",
  model: undefined,
  baseUrl: undefined,
  entries: [{ serverId: "e1", sectionType: "experiences", title: "SWE", subtitle: "Acme", description: "..." }]
}

describe("normalizeImproveRequest", () => {
  it("accepts a valid body", () => {
    expect(normalizeImproveRequest(validBody)).toMatchObject({ provider: "deepseek", honesty: "balanced" })
  })
  it("rejects empty job description", () => {
    expect(() => normalizeImproveRequest({ ...validBody, jobDescription: "" })).toThrow()
  })
  it("rejects oversized bodies", () => {
    const huge = { ...validBody, jobDescription: `"x".repeat(65 * 1024)` }
    expect(() => normalizeImproveRequest({ ...validBody, jobDescription: "x".repeat(65 * 1024) })).toThrow()
  })
  it("rejects http custom base url", () => {
    expect(() => normalizeImproveRequest({ ...validBody, provider: "custom", baseUrl: "http://h" })).toThrow()
  })
  it("rejects unknown providers", () => {
    expect(() => normalizeImproveRequest({ ...validBody, provider: "nope" })).toThrow()
  })
  it("drops entries with unknown section types", () => {
    const res = normalizeImproveRequest({
      ...validBody,
      entries: [...validBody.entries, { serverId: "e2", sectionType: "personal", title: "", subtitle: "", description: "" }]
    })
    expect(res.entries).toHaveLength(1)
  })
})

describe("sanitizeSuggestions", () => {
  const sections = new Set(["summary", "experiences", "custom"])
  it("keeps well-formed suggestions, stripping sectionType", () => {
    const raw = [{ entryId: "e1", sectionType: "experiences", field: "description", suggestedText: "x", rationale: "why", addedFacts: [] }]
    const out = sanitizeSuggestions(raw, sections)
    expect(out).toHaveLength(1)
    expect(out[0]).toEqual({ entryId: "e1", field: "description", suggestedText: "x", rationale: "why", addedFacts: [] })
  })
  it("drops suggestions referencing unknown sections", () => {
    const raw = [
      { entryId: "e1", sectionType: "experiences", field: "title", suggestedText: "x", rationale: "r", addedFacts: [] },
      { entryId: "e2", sectionType: "pharmacyioxy", field: "title", suggestedText: "z", rationale: "r", addedFacts: [] }
    ]
    const out = sanitizeSuggestions(raw, sections)
    expect(out).toHaveLength(1)
    expect(out[0]?.entryId).toBe("e1")
  })
  it("coerces and defaults addedFacts to a list", () => {
    const raw = [{ entryId: "e1", sectionType: "experiences", field: "title", suggestedText: "x", rationale: "r" }]
    expect(sanitizeSuggestions(raw, sections)[0]?.addedFacts).toEqual([])
  })
  it("drops non-array input", () => {
    expect(sanitizeSuggestions("garbage", sections)).toEqual([])
  })
})

describe("mapProviderError", () => {
  it("maps 401 to a clean message", () => {
    expect(mapProviderError({ status: 401 })).toMatch(/API key/i)
  })
  it("does not include the key", () => {
    expect(mapProviderError({ status: 401, message: "invalid key abc123" })).not.toContain("abc123")
  })
  it("falls back to a generic message", () => {
    expect(mapProviderError(new Error("boom"))).toContain("provider")
  })
})