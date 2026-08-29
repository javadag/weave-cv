import { describe, it, expect } from "vitest"
import { flattenEntries, buildApplyPath, appendNote } from "~/composables/useResumeAdmin"
import type { TCoreSections } from "~/utils/schemas/content.schema"

const entry = (id: string, isHiddenEntry = false) => ({ id, isHidden: isHiddenEntry, title: "t", subtitle: "s", description: "d" })

const core = {
  summary: { type: "summary", isSectionVisible: true, isTitleVisible: true, title: "Summary", contents: [entry("e1")] },
  experiences: { type: "experiences", isSectionVisible: true, isTitleVisible: true, title: "Exp", contents: [entry("e2"), entry("e3", true)] },
  custom: { type: "custom", isSectionVisible: false, isTitleVisible: true, title: "H", contents: [entry("e4")] }
} as unknown as TCoreSections

describe("flattenEntries", () => {
  it("skips hidden sections and hidden entries", () => {
    const out = flattenEntries(core)
    expect(out.map((e) => e.serverId).toSorted((a, b) => a.localeCompare(b))).toEqual(["e1", "e2"])
  })
  it("tags entries with their section type", () => {
    const out = flattenEntries(core)
    expect(out.find((e) => e.serverId === "e2")?.sectionType).toBe("experiences")
  })
  it("handles null core", () => {
    expect(flattenEntries(null as unknown as TCoreSections)).toEqual([])
  })
})

describe("buildApplyPath", () => {
  it("produces sectionId.contents.entryId.field", () => {
    expect(buildApplyPath("experiences", "e1", "description")).toBe("experiences.contents.e1.description")
    expect(buildApplyPath("summary", "e1", "title")).toBe("summary.contents.e1.title")
  })
})

describe("appendNote", () => {
  it("appends trimmed notes immutably", () => {
    expect(appendNote(["a"], " b ")).toEqual(["a", "b"])
  })
  it("ignores empty notes", () => {
    expect(appendNote(["a"], " ".repeat(3))).toEqual(["a"])
  })
})