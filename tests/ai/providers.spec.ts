import { describe, it, expect } from "vitest"
import { AI_PROVIDERS, getAiProvider, isCustomProvider } from "../../server/utils/ai/providers"

describe("providers registry", () => {
  it("covers all nine providers plus custom", () => {
    expect(AI_PROVIDERS.map((p) => p.id)).toEqual([
      "deepseek", "groq", "openai", "anthropic", "gemini",
      "mistral", "perplexity", "openrouter", "custom"
    ])
  })
  it("resolves a known provider", () => {
    expect(getAiProvider("deepseek")).toMatchObject({ baseURL: "https://api.deepseek.com/v1" })
  })
  it("throws on unknown provider", () => {
    expect(() => getAiProvider("nope" as never)).toThrow()
  })
  it("marks custom as base-url-required", () => {
    expect(isCustomProvider("custom")).toBe(true)
    expect(isCustomProvider("openai")).toBe(false)
  })
})