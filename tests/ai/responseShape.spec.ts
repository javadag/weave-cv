import { describe, it, expect } from "vitest"
import { clampMatchScore, toStr, toStrArr } from "../../server/utils/ai/improveChildren"

describe("clampMatchScore", () => {
  it("clamps to [0,100]", () => {
    expect(clampMatchScore(150)).toBe(100)
    expect(clampMatchScore(-5)).toBe(0)
    expect(clampMatchScore(42.4)).toBe(42)
  })
  it("defaults non-numbers to 0", () => {
    expect(clampMatchScore(undefined)).toBe(0)
    expect(clampMatchScore("high")).toBe(0)
  })
})

describe("toStr", () => {
  it("only passes strings through", () => {
    expect(toStr("x")).toBe("x")
    expect(toStr(5)).toBe("")
    expect(toStr(undefined)).toBe("")
  })
})

describe("toStrArr", () => {
  it("filters array items to strings", () => {
    expect(toStrArr(["a", 1, "b"])).toEqual(["a", "b"])
    expect(toStrArr("nope")).toEqual([])
  })
})