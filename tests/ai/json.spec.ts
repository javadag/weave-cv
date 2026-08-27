import { describe, it, expect } from "vitest"
import { parseJsonLoose, jsonSize, assertCustomBaseUrl } from "../../server/utils/ai/json"

describe("parseJsonLoose", () => {
  it("parses plain JSON", () => {
    expect(parseJsonLoose(`{"a":1}`)).toEqual({ a: 1 })
  })
  it("strips code fences", () => {
    expect(parseJsonLoose("```json\n{\"a\":1}\n```")).toEqual({ a: 1 })
  })
  it("extracts trailing JSON object from prose", () => {
    expect(parseJsonLoose("Here:\n{ \"a\": 1 }")).toEqual({ a: 1 })
  })
  it("throws on unparsable output", () => {
    expect(() => parseJsonLoose("nothing here")).toThrow()
  })
})

describe("body cap", () => {
  it("measures serialized size", () => {
    expect(jsonSize({ a: ["x"] })).toBe(JSON.stringify({ a: ["x"] }).length)
  })
  it("handles null/undefined", () => {
    expect(jsonSize(null)).toBe(JSON.stringify({}).length)
  })
})

describe("custom base url", () => {
  it("requires https", () => {
    expect(assertCustomBaseUrl("https://gateway.example.com/v1")).toBe(true)
    expect(assertCustomBaseUrl("http://gateway.example.com/v1")).toBe(false)
  })
})