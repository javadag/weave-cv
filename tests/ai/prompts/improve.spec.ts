import { describe, it, expect } from "vitest"
import { HONESTY_BLOCK } from "../../../server/utils/ai/prompts/honesty"
import { buildImproveMessages, type AiEntry } from "../../../server/utils/ai/prompts/improveResume"

describe("honesty block", () => {
  it("has all three levels", () => {
    expect(Object.keys(HONESTY_BLOCK).sort()).toEqual(["balanced", "bold", "faithful"])
  })
  it("bold flags added facts and others do not", () => {
    expect(HONESTY_BLOCK.bold).toMatch(/addedFacts/)
    expect(HONESTY_BLOCK.faithful).not.toMatch(/addedFacts/)
  })
})

describe("improve messages", () => {
  const entries: AiEntry[] = [{ serverId: "e1", sectionType: "experiences", title: "SWE", subtitle: "Acme", description: "Led payments" }]
  const { system, user } = buildImproveMessages({ jobDescription: "Senior engineer role", language: "en", honesty: "balanced", entries })
  it("injects honesty block", () => {
    expect(system).toContain(HONESTY_BLOCK.balanced)
  })
  it("injects entries with ids and section types", () => {
    expect(user).toContain("e1")
    expect(user).toContain("experiences")
  })
  it("requests the target language", () => {
    expect(system).toContain('Language: write all text in "en"')
  })
})