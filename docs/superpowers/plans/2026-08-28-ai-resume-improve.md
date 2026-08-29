# JD-Driven AI Resume Improve — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a JD-pasted analysis modal to the resume editor that returns a match score and per-entry improvement suggestions via BYOK providers, with honest-level refinement and direct apply/undo into the resume store.

**Architecture:** Two stateless BYOK Nitro endpoints (`/api/ai/improve-resume`, `/api/ai/refine-entry`) call the user's chosen provider through the OpenAI SDK using a per-provider `baseURL`, enforcing JSON output via prompt + tolerant extraction. A client modal flattens the resume into ID-tagged entries, calls the endpoints, holds per-entry note history in memory, and applies accepted edits through the existing `updateContent` path so autosave/undo work unchanged.

**Tech Stack:** Nuxt 3 (Nitro server), Pinia store, OpenAI SDK (`openai`), Nuxt UI (`UModal`, `UButton`, `USelect`), `@nuxtjs/i18n`, vitest + jsdom for unit tests.

**Spec:** [`docs/superpowers/specs/2026-08-27-ai-resume-improve-design.md`](../specs/2026-08-27-ai-resume-improve-design.md) — this plan argues from that spec; executors read both.

## Global Constraints

- **BYOK:** both endpoints use `requireAuth`, NO `checkRateLimit`; resume **parsing** (`parse-resume.post.ts`) keeps the server DeepSeek key and its rate limit.
- **Providers (R6):** `deepseek | groq | openai | anthropic | gemini | mistral | perplexity | openrouter | custom`. Custom requires user `baseUrl` (must start `https://`, required) + `model`. OpenRouter exposes an editable model. All called via the OpenAI SDK with a per-provider `baseURL`.
- **Request bodies capped at 64 KB** on both endpoints; reject any body whose `JSON.stringify` exceeds `64 * 1024`.
- **No server-side state or persistence;** no DB changes. Client owns note history + localStorage key store.
- **`updateContent` path shape** used verbatim (matches `app/components/resume/sections-forms/advanced-section-form/SectionForm.vue`): `` `${sectionId}.contents.${entryId}.${field}` ``.
- **Language:** suggestions requested in the resume's configured language, sourced from `useI18n().locale.value` (`en` | `fa`).
- **Suggestion targets** are core sections only: `summary, experiences, projects, educations, skills, languages, certificates, courses, awards, custom`. Personal details excluded.
- **`addedFacts`** is `[]` unless `honesty === "bold"`.
- **New files must pass existing `pnpm lint` + `pnpm typecheck` + `pnpm build`, plus new `pnpm test`** (vitest).
- **i18n:** every new user-facing string added to **both** `i18n/locales/en.json` and `fa.json`, RTL-checked.

---

## File Structure

Server (new, stateless):
| File | Responsibility |
|---|---|
| `server/api/ai/improve-resume.post.ts` | Thin endpoint shell → `handleImproveResume`. |
| `server/api/ai/refine-entry.post.ts` | Thin endpoint shell → `handleRefineEntry`. |
| `server/utils/ai/providers.ts` | Server provider registry (id → baseURL/`defaultModel`). Type unions. |
| `server/utils/ai/prompts/honesty.ts` | Shared honesty-level instruction block. |
| `server/utils/ai/prompts/improveResume.ts` | `buildImproveMessages()` + schema. |
| `server/utils/ai/prompts/refineEntry.ts` | `buildRefineMessages()`. |
| `server/utils/ai/json.ts` | `parseJsonLoose()` tolerant extraction + `jsonSize`. |
| `server/utils/ai/improveChildren.ts` | Pure handlers: validation, `buildImproveMessages`, extraction, sanitize, error mapping. |
| `server/utils/ai/refineChildren.ts` | Pure handlers for refine. |
| `server/utils/ai/client.ts` | `createAiClient()` OpenAI SDK factory + `runChat()` with 60s timeout. |
| `tests/ai/*.spec.ts` | vitest unit tests for all pure server helpers. |

Client:
| File | Responsibility |
|---|---|
| `app/services/ai/registry.ts` | Client provider registry (labels, baseURLs, models, key-hint URLs, editable flags). |
| `app/composables/useResumeAdmin.ts` | Pure helpers: `flattenEntries`, `buildApplyPath`, `appendNote`. |
| `app/composables/useResumeImprove.ts` | Orchestrates calls, note history per entry, apply/undo. |
| `app/composables/useAiProvider.ts` | localStorage-backed key store (`weave-cv:ai-keys`). |
| `app/components/resume/resume-header/widgets/improve/ScoreHero.vue` | Score card. |
| `app/components/resume/resume-header/widgets/improve/StrengthWeaknessCard.vue` | Strengths/weaknesses lists. |
| `app/components/resume/resume-header/widgets/improve/KeywordChips.vue` | Missing-keyword chips. |
| `app/components/resume/resume-header/widgets/improve/SuggestionCard.vue` | One suggestion card with Apply / add-note. |
| `app/components/resume/resume-header/widgets/ImproveResumeModal.vue` | Main modal orchestrator. |
| `app/components/dashboard/AiProviderSettings.vue` | Key/provider settings in dashboard settings. |
| `i18n/locales/en.json`, `i18n/locales/fa.json` | New strings. |
| `vitest.config.ts`, `package.json` (`pnpm test`), `.gitignore` tweak | Test infra. |

---

### Task 1: Test infrastructure (vitest)

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (add `test` script; add `vitest` devDependency)
- Test: `tests/smoke.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `pnpm test` runs vitest over `tests/**/*.spec.ts`; later tasks drop pure-function specs here.

- [ ] **Step 1: Write the failing smoke test**

```ts
// tests/smoke.spec.ts
import { describe, it, expect } from "vitest"

describe("test runner", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 2: Run it to verify it fails** (no runner yet)

Run: `pnpm test`
Expected: FAIL — `vitest: not found`.

- [ ] **Step 3: Add vitest + config + script**

```bash
pnpm add -D vitest
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config"
import { resolve } from "node:path"

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.spec.ts"],
    globals: false
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "app"),
      "@@": resolve(__dirname, "app")
    }
  }
})
```

In `package.json` scripts add: `"test": "vitest run"`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test`
Expected: PASS — 1 passed.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts package.json pnpm-lock.yaml tests/smoke.spec.ts
git commit -m "test: add vitest harness and pnpm test script"
```

---

### Task 2: Type unions + server provider registry

**Files:**
- Create: `server/utils/ai/providers.ts`
- Test: `tests/ai/providers.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type AiId = "deepseek" | "groq" | "openai" | "anthropic" | "gemini" | "mistral" | "perplexity" | "openrouter" | "custom"`
  - `type HonestyLevel = "faithful" | "balanced" | "bold"`
  - `interface AiProviderConfig { id: AiId; label: string; baseURL: string; defaultModel: string; modelEditable: boolean; baseUrlRequired?: boolean }`
  - `const AI_PROVIDERS: AiProviderConfig[]`
  - `function getProvider(id: string): AiProviderConfig` (throws `createError` 400 if unknown)
  - `function isCustomProvider(id: AiId): boolean`

- [ ] **Step 1: Write the failing test**

```ts
// tests/ai/providers.spec.ts
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
    expect(() => getAiProvider("nope" as any)).toThrow()
  })
  it("marks custom as base-url-required", () => {
    expect(isCustomProvider("custom")).toBe(true)
    expect(isCustomProvider("openai")).toBe(false)
  })
})
```

- [ ] **Step 2: Run to verify it fails.** Run: `pnpm test`. Expected: FAIL (`canNot find module`).

- [ ] **Step 3: Implement the registry.** Write `server/utils/ai/providers.ts`:

```ts
export type AiId =
  | "deepseek" | "groq" | "openai" | "anthropic"
  | "gemini" | "mistral" | "perplexity" | "openrouter" | "custom"

export type HonestyLevel = "faithful" | "balanced" | "bold"

export interface AiProviderConfig {
  id: AiId
  label: string
  baseURL: string
  defaultModel: string
  modelEditable: boolean
  baseUrlRequired?: boolean
}

export const AI_PROVIDERS: AiProviderConfig[] = [
  { id: "deepseek",  label: "DeepSeek",       baseURL: "https://api.deepseek.com/v1",                 defaultModel: "deepseek-chat",                      modelEditable: false },
  { id: "groq",      label: "Groq",           baseURL: "https://api.groq.com/openai/v1",             defaultModel: "llama-3.3-70b-versatile",            modelEditable: true },
  { id: "openai",    label: "OpenAI",         baseURL: "https://api.openai.com/v1",                  defaultModel: "gpt-4o-mini",                        modelEditable: true },
  { id: "anthropic", label: "Anthropic",      baseURL: "https://api.anthropic.com/v1",               defaultModel: "claude-sonnet-4-5",                  modelEditable: true },
  { id: "gemini",    label: "Gemini",         baseURL: "https://generativelanguage.googleapis.com/v1beta/openai", defaultModel: "gemini-2.0-flash",                     modelEditable: true },
  { id: "mistral",   label: "Mistral",        baseURL: "https://api.mistral.ai/v1",                  defaultModel: "mistral-small-latest",               modelEditable: true },
  { id: "perplexity",label: "Perplexity",     baseURL: "https://api.perplexity.ai",                  defaultModel: "sonar-pro",                          modelEditable: true },
  { id: "openrouter",label: "OpenRouter",     baseURL: "https://openrouter.ai/api/v1",               defaultModel: "deepseek/deepseek-chat",             modelEditable: true },
  { id: "custom",    label: "Custom (OpenAI-compatible)", baseURL: "", defaultModel: "",             modelEditable: true, baseUrlRequired: true }
]

const index = new Map<AiId, AiProviderConfig>(AI_PROVIDERS.map((p) => [p.id, p]))

export function getAiProvider(id: AiId): AiProviderConfig {
  const cfg = index.get(id)
  if (!cfg) throw new Error(`Unknown provider: ${id}`)
  return cfg
}

export function isCustomProvider(id: string): boolean {
  return id === "custom"
}
```

> The import path uses `#server/...` — mirror whichever alias Nitro exposes. If `srcDir` overrides make `#` unavailable, use a relative import (`../../utils/ai/providers`). Match how `parse-resume.post.ts` imports (`../../utils/...`).

- [ ] **Step 4: Run tests.** Run: `pnpm test`. Expected: PASS. Adjust the import alias in the test until it resolves.

- [ ] **Step 5: Commit**

```bash
git add server/utils/ai/providers.ts tests/ai/providers.spec.ts
git commit -m "feat(ai): add provider registry + type unions"
```

---

### Task 3: Tolerant JSON extraction + body-size cap

**Files:**
- Create: `server/utils/ai/json.ts`
- Test: `tests/ai/json.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `function parseJsonLoose<T>(raw: string): T` — tries `JSON.parse`, then strips ```` ```json ```` / surrounding prose, then extracts the first `{...}` block. Throws on failure.
  - `function jsonSize(obj: unknown): number` — `JSON.stringify(obj).length`.
  - `function isValidCustomBaseUrl(u: string): boolean` — `string.startsWith("https://")`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/ai/json.spec.ts
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
})

describe("custom base url", () => {
  it("requires https", () => {
    expect(assertCustomBaseUrl("https://gateway.example.com/v1")).toBe(true)
    expect(assertCustomBaseUrl("http://gateway.example.com/v1")).toBe(false)
  })
})
```

- [ ] **Step 2: Run to verify it fails.** Run: `pnpm test`. Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// server/utils/ai/json.ts
export function parseJsonLoose<T>(raw: string): T {
  const tryParse = (s: string): T | undefined => {
    try {
      return JSON.parse(s) as T
    } catch {
      return undefined
    }
  }
  const direct = tryParse(raw)
  if (direct) return direct
  // strip markdown fences
  const noFences = raw.replace(/```(?:json)?\s*/g, "").replace(/```/g, "").trim()
  const fenced = tryParse(noFences)
  if (fenced) return fenced
  // last {...} block
  const block = raw.match(/\{[\s\S]*\}/)
  if (block) {
    const internal = tryParse(block[0])
    if (internal) return internal
  }
  throw new Error("Could not parse model output as JSON")
}

export function jsonSize(obj: unknown): number {
  return JSON.stringify(obj ?? {}).length
}

export function assertCustomBaseUrl(u: string): boolean {
  return u.trim().startsWith("https://")
}
```

- [ ] **Step 4: Run to verify pass.** Run: `pnpm test`. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add server/utils/ai/json.ts tests/ai/json.spec.ts
git commit -m "feat(ai): add tolerant JSON extraction + body cap helpers"
```

---

### Task 4: Honesty block + improve prompt builder

**Files:**
- Create: `server/utils/ai/prompts/honesty.ts`, `server/utils/ai/prompts/improveResume.ts`
- Test: `tests/ai/prompts/improve.spec.ts`

**Interfaces:**
- Consumes: `HonestyLevel` from Task 2.
- Produces:
  - `const HONESTY_BLOCK: Record<HonestyLevel, string>`
  - `interface AiEntry { type: AiEntryType; title: string; subtitle: string; description: string }`
  - `type AiEntryType = "summary" | "experiences" | "projects" | "educations" | "skills" | "languages" | "certificates" | "courses" | "awards" | "custom"`
  - `function buildImproveSystemPrompt(): string`
  - `function buildImproveMessages(args: { jobDescription: string; language: string; honesty: HonestyLevel; entries: AiEntry[] }): { system: string; user: string }`

- [ ] **Step 1: Write the failing test**

```ts
// tests/ai/prompts/improve.spec.ts
import { describe, it, expect } from "vitest"
import { HONESTY_BLOCK } from "../../../server/utils/ai/prompts/honesty"
import { buildImproveMessages } from "../../../server/utils/ai/prompts/improveResume"

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
  const entries = [{ serverId: "e1", sectionType: "experiences", title: "SWE", subtitle: "Acme", description: "Led payments" }]
  const { system, user } = buildImproveMessages({ jobDescription: "Senior engineer role", language: "en", honesty: "balanced", entries })
  it("injects honesty block", () => {
    expect(system).toContain(HONESTY_BLOCK.balanced)
  })
  it("injects entries with ids and section types", () => {
    expect(user).toContain("e1")
    expect(user).toContain("experiences")
  })
  it("requests the target language", () => {
    expect(system).toMatch(/Language: en|language/) // at minimum anchors the language
  })
})
```

- [ ] **Step 2: Run to verify fail.** Run: `pnpm test`. Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// server/utils/ai/prompts/honesty.ts
import type { HonestyLevel } from "../providers"

export const HONESTY_BLOCK: Record<HonestyLevel, string> = {
  faithful:
    "HONESTY: Faithful. Reword, reframe, and highlight only what is genuinely in the resume. Never add facts.",
  balanced:
    "HONESTY: Balanced. Weak but defensible phrasing is allowed; never invent new facts about the candidate.",
  bold:
    "HONESTY: Bold. You may add plausible details to make the entry stronger. Every fact NOT grounded in the resume MUST be listed in that suggestion's addedFacts array so the UI can flag it for review."
}
```

```ts
// server/utils/ai/prompts/improveResume.ts
import type { AiEntryType } from "../providers"
import type { HonestyLevel } from "../providers"
import { HONESTY_BLOCK } from "./honesty"

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
    .map((e) => `<entry id="${e.serverId}" section="${e.sectionType}">\n${e.title}\n${e.subtitle}\n${e.description}\n</entry>`)
    .join("\n")

  const user = `Job description:\n${args.jobDescription}\n\nResume entries:\n${entriesBlock}`

  return { system, user }
}
```

- [ ] **Step 4: Run to verify pass.** Run: `pnpm test`. Expected: PASS. (If the language assertion is brittle, loosen the assertion.)

- [ ] **Step 5: Commit**

```bash
git add server/utils/ai/prompts/honesty.ts server/utils/ai/prompts/improveResume.ts tests/ai/prompts/improve.spec.ts
git commit -m "feat(ai): honesty block + improve prompt builder"
```

---

### Task 5: Improve — validation + sanitize + error mapping (pure)

**Files:**
- Create: `server/utils/ai/improveChildren.ts`
- Test: `tests/ai/improveChildren.spec.ts`

**Interfaces:**
- Consumes: `AiEntry` (Task 4), `parseJsonLoose`/`jsonSize`/`assertCustomBaseUrl` (Task 3), `getAiProvider`/`isCustomProvider` (Task 2).
- Produces:
  - `interface ImproveRequestShape { jobDescription; honesty; language; provider; apiKey; model?; baseUrl?; entries: AiEntry[] }`
  - `function normalizeImproveRequest(body: unknown): ImproveRequestShape` — throws `createError` on any violation.
  - `interface HistorySuggestion { entryId; field; suggestedText; rationale; addedFacts: string[] }`
  - `function sanitizeSuggestions(raw: unknown, sectionsTypeOf: Set<string>): HistorySuggestion[]`
  - `function mapProviderError(error: unknown): never` — rethrows as statusMessage-appropriate `createError`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/ai/improveChildren.spec.ts
import { describe, it, expect } from "vitest"
import { normalizeImproveRequest, sanitizeSuggestions, mapProviderError } from "../../server/utils/ai/improveChildren"

const valid = {
  clearDescription: "Ship an API integrating payments for a senior backend engineer at Acme.",
  honesty: "balanced",
  language: "en",
  provider: "deepseek",
  model: undefined,
  baseUrl: undefined,
  entries: [{ serverId: "e1", sectionType: "experiences", title: "SWE", subtitle: "Acme", description: "...", }]
}

describe("normalizeImproveRequest", () => {
  it("accepts a valid body", () => {
    expect(normalizeImproveRequest(valid)).toMatchObject({ provider: "deepseek", honesty: "balanced" })
  })
  it("rejects empty job description", () => {
    expect(() => normalizeImproveRequest({ ...valid, clearMessage: "" })).toThrow()
  })
  it("rejects oversized bodies", () => {
    const huge = { ...valid, jobDescription: "x".repeat(65 * 1024) }
    expect(() => normalizeImproveRequest(huge)).toThrow()
  })
  it("rejects http custom base url", () => {
    expect(() => normalizeImproveRequest({ ...valid, provider: "custom", baseUrl: "http://h" })).toThrow()
  })
  it("rejects unknown providers", () => {
    expect(() => normalizeImproveRequest({ ...valid, provider: "nope" })).toThrow()
  })
})

describe("sanitizeSuggestions", () => {
  const sections = new Set(["summary", "experiences", "custom"])
  it("keeps typed suggestions", () => {
    const raw = [{ entryId: "e1", field: "description", suggestedText: "x", rationale: "why", addedFacts: [] }]
    expect(sanitizeSuggestions(raw, sections)).toEqual(raw)
  })
  it("drops suggestions referencing unknown sections", () => {
    const raw = [
      { entryId: "e1", field: "title", suggestedText: "x", rationale: "r", addedFacts: [] },
      { entryId: "e1", field: "pharmacyioxy", suggestedText: "z", rationale: "r", addedFacts: [] }
    ]
    const out = sanitizeSuggestions(raw, sections)
    expect(out).toHaveLength(1)
    expect(out[0]?.field).toBe("title")
  })
  it("coerces and defaults addedFacts to a list", () => {
    const raw = [{ entryId: "e1", field: "title", suggestedText: "x", rationale: "r" }]
    expect(sanitizeSuggestions(raw, sections)[0]?.addedFacts).toEqual([])
  })
})

describe("mapProviderError", () => {
  it("maps 401 to a clean message", () => {
    expect(mapProviderError({ status: 401 })).toMatch(/API key|key/i)
  })
  it("does not include the key", () => {
    const msg = mapProviderError({ status: 401, message: "invalid key abc123" })
    expect(msg).not.toContain("abc123")
  })
})
```

- [ ] **Step 2: Run to verify fail.** Expected: FAIL.

- [ ] **Step 3: Implement `server/utils/ai/improveChildren.ts`:** Use `createError` from `h3` (available via `#imports`/`h3`). Full code:

```ts
import { createError } from "h3"
import type { AiEntry } from "./prompts/improveResume"
import { parseJsonLoose, jsonSize, assertCustomBaseUrl } from "../../server/utils/ai/json"
import { getAiProvider, isCustomProvider, type AiId, type HonestyLevel } from "./providers"

export interface ImproveRequestShape {
  jobDescription: string
  honesty: HonestyLevel
  language: string
  provider: AiId
  model?: string
  baseUrl?: string
  entries: AiEntry[]
}
export interface HistorySuggestion {
  entryId: string
  field: "description" | "title"
  suggestedText: string
  rationale: string
  addedFacts: string[]
}

const SECTION_TYPES = new Set([
  "summary", "experiences", "projects", "educations", "skills",
  "languages", "certificates", "courses", "awards", "custom"
] as const)

const SECTION_TYPE_SET = new Set([
  "summary", "experiences", "projects", "educations", "skills",
  "languages", "certificates", "courses", "awards", "custom"
])

const PROVIDER_IDS = [
  "deepseek", "groq", "openai", "anthropic", "gemini",
  "mistral", "perplexity", "openrouter", "custom"
] as const

export function isProviderId(v: string): v is AiId {
  return (PROVIDER_IDS as readonly string[]).includes(v)
}

function validEntry(e: unknown): e is AiEntry {
  const o = e as AiEntry
  return (
    !!o &&
    typeof o.serverId === "string" &&
    typeof o.sectionType === "string" &&
    SECTION_TYPE_SET.has(o.sectionType)
  )
}

export function normalizeImproveRequest(body: unknown): ImproveRequestShape {
  const b = (body ?? {}) as Record<string, unknown>
  if (typeof b.jobDescription !== "string" || b.jobDescription.trim().length === 0) {
    throw createError({ statusCode: 400, statusMessage: "jobDescription is required" })
  }
  const provider = String(b.provider ?? "")
  if (!isProviderId(provider)) {
    throw createError({ statusCode: 400, statusMessage: `Unknown provider: ${provider}` })
  }
  const honesty = b.honesty as HonestyLevel
  if (!["faithful", "balanced", "bold"].includes(honesty)) {
    throw createError({ statusCode: 400, statusMessage: "invalid honesty level" })
  }
  const language = typeof b.language === "string" && b.language ? b.language : "en"
  const baseUrl = typeof b.baseUrl === "string" ? b.baseUrl : undefined
  if (provider === "custom") {
    if (!baseUrl || !assertCustomBaseUrl(baseUrl)) {
      throw createError({ statusCode: 400, statusMessage: "custom provider requires an https baseUrl" })
    }
  }
  const entries = (Array.isArray(b.entries) ? b.entries : []).filter(validEntry)
  if (jsonSize({ jobDescription: b.jobDescription, entries }) > 64 * 1024) {
    throw createError({ statusCode: 413, statusMessage: "Request body too large" })
  }
  return {
    jobDescription: b.jobDescription,
    honesty,
    language,
    provider: provider as AiId,
    model: typeof b.model === "string" ? b.model : undefined,
    baseUrl,
    entries
  }
}

export const SECTION_TYPE_SET_EXPORTED = SECTION_TYPE_SET

export function sanitizeSuggestions(raw: unknown, knownSections: Set<string>): HistorySuggestion[] {
  if (!Array.isArray(raw)) return []
  const out: HistorySuggestion[] = []
  for (const s of raw) {
    const o = s as HistorySuggestion
    if (!o || !knownSections.has(o.sectionType) || !o.entryId) continue
    if (o.field !== "description" && o.field !== "title") continue
    const suggestedText = typeof o.suggestedText === "string" ? o.suggestedText : ""
    if (!suggestedText.trim()) continue
    out.push({
      entryId: o.entryId,
      field: o.field,
      suggestedText,
      rationale: typeof o.rationale === "string" ? o.rationale : "",
      addedFacts: Array.isArray(o.addedFacts) ? o.addedFacts.map(normalizeStr) : []
    })
  }
  return out
}
export function normalizeString(v: unknown): string { return typeof v === "string" ? v : String(v) }

export function mapProviderError(e: unknown): string {
  const err = e as Record<string, unknown>
  const status = err.status
  if (status === 401 || status === 403) {
    return "Your provider rejected the API key or credits. Open dashboard settings to fix it."
  }
  if (status === 429) return "Your provider rate-limited this request. Try again shortly."
  return "The AI provider failed. Please try again."
}
```

(Section-type membership lives in `improveChildren.ts` as `SECTION_TYPE_SET` and is exported as `SECTION_TYPE_SET_EXPORTED`. The endpoint imports it from there; do not redefine it in the prompt module.)

- [ ] **Step 4: Run to verify pass.** Run: `pnpm test`. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add server/utils/ai/improveChildren.ts tests/ai/improveChildren.spec.ts
git commit -m "feat(ai): improve-request validation, sanitize, provider error mapping"
```

---

### Task 6: Refine-entry prompts + validation + extraction (pure)

**Files:**
- Create: `server/utils/ai/prompts/refineEntry.ts`, `server/utils/ai/refineChildren.ts`
- Test: `tests/ai/refineChildren.spec.ts`

**Interfaces:**
- Consumes: HONESTY_BLOCK (Task 4), `parseJsonLoose`, `getAiProvider`.
- Produces:
  - `function buildRefineMessages(args: { jobDescription; language; honesty; entry: AiEntry; currentSuggestion: HistorySuggestion; notes: string[] }): { system; user }`
  - `function normalizeRefineRequest(body: unknown): {...}` — identical provider/baseUrl/body checks as `normalizeImproveRequest`, plus `entry`, `currentSuggestion`, `notes: string[]` (validate note array of strings).
  - `function sanitizeRefineToast(raw: unknown): HistorySuggestion | null`

- [ ] **Step 1: Write the failing test**

```ts
// tests/ai/refineChildren.spec.ts
import { describe, it, expect } from "vitest"
import { buildRefineMessages } from "../../server/utils/ai/prompts/refineEntry"
import { normalizeRefineRequest, sanitizeRefineToast } from "../../server/utils/ai/refineChildren"

describe("refine prompt", () => {
  const entry = { serverId: "e1", sectionType: "experiences", title: "t", subtitle: "s", description: "d" }
  const suggestion = { entryId: "e1", field: "description", suggestedText: "old", rationale: "r", addedFacts: [] }
  const { system, user } = buildRefineMessages({ jobDescription: "jd", language: "en", honesty: "balanced", entry, currentSuggestion: suggestion, notes: ["too vague"] })
  it("treats notes as binding constraints, newest last", () => {
    expect(user).toContain("too vague")
  })
  it("includes the entry and suggestion", () => {
    expect(user).toContain("e1")
    expect(user).toContain("old")
  })
})

describe("normalizeRefineRequest", () => {
  const base = { jobDescription: "jd", honesty: "balanced", language: "en", provider: "openai", entries: [], entry: { serverId: "e1", sectionType: "experiences", title: "t", subtitle: "s", description: "d" }, currentSuggestion: { entryId: "e1", field: "description", suggestedText: "x", rationale: "r", addedFacts: [] }, notes: ["n1"] }
  it("accepts a valid body", () => {
    expect(() => normalizeRefineRequest(base)).not.toThrow()
  })
  it("rejects non-array notes", () => {
    expect(() => normalizeRefineRequest({ ...base, notes: "nope" })).toThrow()
  })
})

describe("sanitizeRefineToast", () => {
  it("returns a single suggestion or null", () => {
    const raw = { entryId: "e1", field: "description", suggestedText: "new", rationale: "why", addedFacts: [] }
    expect(sanitizeRefineToast(raw)?.suggestedText).toBe("new")
    expect(sanitizeRefineToast("garbage" as unknown)).toBeNull()
  })
})
```

- [ ] **Step 2: Run to verify fail.** Run: `pnpm test`. Expected: FAIL.

- [ ] **Step 3: Implement.** Mirror Task 5 structure but for one entry; reuse `SECTION_TYPE_SET`, `isProviderId` (export it), and `mapProviderError`/`normalizeImproveRequest` patterns by importing from `improveChildren`. Include the JSON schema for a single suggestion.

```ts
// server/utils/ai/prompts/refineEntry.ts
import type { AiEntry } from "./improveResume"
import { MIME } ...
import type { HonestyLevel } from "../providers"
import { HONESTY_BLOCK } from "./honesty"

export function buildRefineMessages(args: { jobDescription; language; honesty; entry: AiEntry; currentSuggestion: { field; suggestedText }; notes: string[] }) {
  const constraints = args.notes.length
    ? `The user's notes below are BINDING constraints for a revised suggestion, newest last:\n${args.notes.map((n, i) => `${i}. ${n}`).join("\n")}`
    : `No notes provided — revise to be stronger.`
  const system = [
    `You are revising one resume-suggestion. Output ONLY JSON matching the single suggestion schema (no array):`,
    `{ "entryId": "...", "field": "description" | "title", "suggestedText": "...", "rationale": "...", "addedFacts": [...] }`,
    ``,
    HONESTY_BLOCK[args.honesty],
    `Keep suggestions specific to the job description AND the entry. Respect all notes.`,
    `Language: ${args.language}.`
  ].join("\n")
  const user = `Job description:\n${args.jobDescription}\n\nEntry:\n<entry id="${args.entry.serverId}" section="${args.entry.sectionType}">\n${args.entry.title}\n${args.entry.subtitle}\n${args.entry.description}\n</entry>\n\nCurrent suggestion:\n${args.currentSuggestion.suggestedText}\n\n${args.notes && args.notes.length ? "Notes (binding):\n" + args.notes.map((n, i) => `${i}. ${n}`).join("\n") : "No notes."}`
  return { system, user }
}
```

- [ ] **Step 4: Run to verify pass.** Run: `pnpm test`. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add server/utils/ai/prompts/refineEntry.ts server/utils/ai/refineChildren.ts tests/ai/refineChildren.spec.ts
git commit -m "feat(ai): refine-entry prompts, validation, extraction"
```

---

### Task 7: Server endpoints (thin shells) + client factory

**Files:**
- Create: `server/utils/ai/client.ts`, `server/api/ai/improve-resume.post.ts`, `server/api/ai/refine-entry.post.ts`

**Interfaces:**
- Consumes: all Task 2–6 helpers, `getAiProvider`/`isCustomProvider`, `requireAuth`.
- Produces: working `POST /api/ai/improve-resume` and `POST /api/ai/refine-entry` responses matching the spec contract.

- [ ] **Step 1: Create `server/utils/ai/client.ts`**

```ts
import OpenAI from "openai"
import { getAiProvider, isCustomProvider, type AiId } from "./providers"

export interface CallOutcome {
  text: string
}

export function createAiClient(opts: { provider: AiId; apiKey: string; baseUrl?: string; model?: string }) {
  const cfg = getAiProvider(opts.provider)
  const baseURL = isCustomProvider(opts.provider) ? opts.baseUrl! : cfg.baseURL
  const client = new OpenAI({ apiKey: opts.apiKey, baseURL })
  const model = opts.model ?? cfg.defaultModel
  return { client, model }
}

// second arg supports per-call timeout in the openai SDK (compliant on Node builds)
export const CALL_TIMEOUT_MS = 60_000

export async function completeJson(
  opts: { provider: AiId; apiKey: string; baseUrl?: string; model?: string; system: string; user: string }
): Promise<string> {
  const { client, model } = createAiClient(opts)
  const completion = await client.chat.completions.create(
    { model, temperature: 0.2, messages: [
      { role: "system", content: opts.system },
      { role: "user", content: opts.user }
    ]},
    { timeout: CALL_TIMEOUT_MS }
  )
  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new Error("Empty response from model")
  return raw
}
```

- [ ] **Step 2: Create `server/api/ai/improve-resume.post.ts`** (thin shell that wires the pure helpers)

```ts
import { requireAuth } from "../../utils/auth"
import { normalizeImproveRequest, mapProviderError, sanitizeSuggestions } from "../../utils/ai/improveChildren"
import { parseJsonLoose } from "../../utils/ai/json"
import { completeJson } from "../../utils/ai/client"
import { buildImproveMessages } from "../../utils/ai/prompts/improveResume"
import { getAiProvider } from "../../utils/ai/providers"

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
  const req = normalizeImproveRequest(body)
  const extraSectionKeys = new Set(req.entries.map((e) => e.sectionType))
  try {
    const { system, user } = buildImproveMessages({ jobDescription: req.jobDescription, language: req.language, honesty: req.honesty, entries: req.entries })
    const raw = await completeJson({
      provider: req.provider, apiKey: req.apiKey!, baseUrl: req.baseUrl, model: req.model, system, user
    })
    const parsed = parseJsonLoose<Record<string, unknown>>(raw)
    const suggestions = sanitizeSuggestions(parsed.suggestions, SECTION_TYPE_SET_EXPORTED)
    return {
      matchScore: clampNumber(parsed.matchScore),
      scoreSummary/text: parsed.scoreSummary ?? "",
      strengths: strArr(parsed.strengths),
      weaknesses: strArr(parsed.weaknesses),
      missingKeywords: strArr(parsed.missingKeywords),
      suggestions
    }
  } catch (e) {
    throw createError({ statusCode: 422, statusMessage: mapProviderError(e) })
  }
})
```

Note: for step 3 first get it compiling through the existing typecheck gates then step 4 refactor to share `SECTION_TYPE_SET`/`strArr` as small exports if needed — but prefer importing from the pure helper module (`improveChildren` should export `SECTION_TYPE_SET_$,` `strArr`, `clampMatchScore` as additionally testable pure helpers — if they don't exist, add them in this task and their tests to `tests/ai/improveChildren.spec.ts`).

- [ ] **Step 3: Create `refine-entry.post.ts`** — same shell shape, using `normalizeRefineRequest`, `buildRefineMessages`, `completeJson`, `sanitizeRefineToast`.

- [ ] **Step 4: Add `clampMatchScore`, `strArr` testable exports + tests** (extend `tests/ai/improveChildren.spec.ts`).

- [ ] **Step 5: Typecheck + lint.** Run: `pnpm typecheck && pnpm lint`. Fix any drift (import aliases, h3 `createError` availability, unused `user` — use `void user`).

- [ ] **Step 6: Commit**

```bash
git add server/api/ai server/utils/ai/client.ts server/utils/ai/improveChildren.ts server/utils/ai/refineChildren.ts
git commit -m "feat(ai): stateless improve + refine endpoints over BYOK"
```

---

### Task 8: Client provider registry + localStorage key store

**Files:**
- Create: `app/services/ai/registry.ts`, `app/composables/useAiProvider.ts`
- Test: `tests/ai/clientRegistry.spec.ts` (vitest with `environment: "node"` — use jsdom env override in-file if needed)

**Interfaces:**
- Consumes: the client registry mirrors the server `AiProviderConfig`.
- Produces:
  - `export const AI_PROVIDERS: AiProviderRegistry[]` (labels, `modelEditable`, `baseUrlRequired`, `keyHintUrl`)
  - `export type AiKeyStore = { provider: AiProviderId; key: string; model?: string; baseUrl?: string }`
  - `export function clampKeys(k: AiKeyStore): AiKeyStore` — normalize a raw value into a valid `AiKeyStore`.
  - `export function buildAiKeyStore(data: unknown): AiKeyStore | null` — parse/clamp arbitrary input.
  - `useAiProvider(): { keys: Ref<AiKeyStore|null>, setKeys(k), clearKeys() }` — localStorage-backed (`weave-cv:ai-keys`).

- [ ] **Step 1: Write failing test** (pure serialization helpers so it does not need a browser):

```ts
// tests/ai/registry.spec.ts
import { describe, it, expect } from "vitest"
import { AI_PROVIDERS, buildAiKeyStore } from "../../app/services/ai/registry"

describe("client registry", () => {
  it("mirrors the nine providers", () => {
    expect(AI_PROVIDERS.map((p) => p.id)).toContain("custom")
  })
  it("custom is baseUrlRequired", () => {
    expect(AI_PROVIDERS.find((p) => p.id === "custom")?.baseUrlRequired).toBe(true)
  })
})

describe("buildAiKeyStore", () => {
  it("round-trips key config", () => {
    expect(buildAiKeyStore({ provider: "openai", key: "sk-x", model: "gpt-4o-mini", baseUrl: undefined }))
      .toEqual({ provider: "openai", key: "sk-x", model: "gpt-4o-mini", baseUrl: undefined })
  })
})
```

- [ ] **Step 2: Run to verify fail.** Run: `pnpm test`. Expected: FAIL.

- [ ] **Step 3: Implement.** Registry mirrors `server/utils/ai/providers.ts` but with `keyHintUrl` + icon; key composable uses `localStorage` guarded to `typeof window !== "undefined"`.

```ts
// app/services/ai/registry.ts
export type AiProviderId = "deepseek" | "groq" | "openai" | "anthropic" | "gemini" | "mistral" | "perplexity" | "openrouter" | "custom"
export interface AiProviderRegistry { id: AiProviderId; label; baseURL; defaultModel; modelEditable; baseUrlRequired?; keyHintUrl? }
export const AI_PROVIDERS: AiProviderRegistry[] = [ /* same data as server + keyHintUrl */ ]

export interface AiKeyStore {
  provider: AiProviderId
  key: string
  model?: string
  baseUrl?: string
}

export function clampKeys(k: Partial<AiKeyStore>): AiKeyStore | null {
  if (!k || typeof k.key !== "string" || !k.key.trim()) return null
  const provider = (AI_PROVIDERS.some((p) => p.id === k.provider) ? k.provider : AI_PROVIDERS[0]!.id) as AiProviderId
  return {
    provider,
    key: k.key.trim(),
    model: typeof k.model === "string" && k.model.trim() ? k.model : undefined,
    baseUrl: typeof k.baseUrl === "string" && k.baseUrl.trim() ? k.baseUrl : undefined
  }
}

export function buildAiKeyStore(data: unknown): AiKeyStore | null {
  if (!data || typeof data !== "object") return null
  return clampKeys(data as Partial<AiKeyStore>)
}
```

```ts
// app/composables/useAiProvider.ts
const STORAGE_KEY = "weave-cv:ai-keys"
const empty = ref<AiKeyStore | null>(null)
export function useAiProvider() {
  const keys = ref<AiKeyStore | null>(loaded())
  function loaded(): AiKeyStore | null {
    if (typeof window === "undefined") return empty.value
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try { return clampKeys(JSON.parse(raw)) } catch { return null }
  }
  function persist(v) { if (typeof window === "undefined") return; v ? localStorage.setItem(STORAGE_KEY, JSON.stringify(v)) : localStorage.removeItem(STORAGE_KEY) }
  function setKeys(k: AiKeyStore) { keys.value = k; persist(k) }
  function clearKeys() { keys.value = null; persist(null) }
  return { keys, setKeys, clearKeys }
}
```

- [ ] **Step 4: Run to verify pass.** Run: `pnpm test`. Expected: PASS (registry + clamp pure parts).

- [ ] **Step 5: Commit**

```bash
git add app/services/ai/registry.ts app/composables/useAiProvider.ts tests/ai/registry.spec.ts
git commit -m "feat(ai): client provider registry + localStorage key store"
```

---

### Task 9: Client resume→entry flattening + apply helpers (pure)

**Files:**
- Create: `app/composables/useResumeAdmin.ts` (pure helpers file: `flattenEntries`, `buildApplyPath`, `appendNote`)
- Test: `tests/ai/resumeAdmin.spec.ts`

**Interfaces:**
- Consumes: `TCoreSections` type from `~/utils/schemas/content.schema`.
- Produces:
  - `function flattenEntries(core: TCoreSections): AiEntryFromResume[]` — skips sections with `!isSectionVisible` and entries with `isHidden === true`. `sectionType` = the section key.
  - `function buildApplyPath(sectionType: string, entryId: string, field: "description" | "title"): string`
  - `function appendNote(notes: string[], note: string): string[]`

- [ ] **Step 1: Write the failing test**

```ts
// tests/ai/resumeAdmin.spec.ts
import { describe, it, expect } from "vitest"
import { flattenEntries, buildApplyPath, appendNote } from "../../app/composables/useResumeAdmin"

const orr = (over) => ({ id: "e1", isHidden: false, title: "t", subtitle: "", description: "d", ...over })
const core = {
  summary: { type: "summary", isSectionVisible: true, isTitleVisible: true, title: "Summary", contents: [orr({})] } as any,
  experiences: { type: "experiences", isSectionVisible: true, isTitleVisible: true, title: "Exp", contents: [orr({}), orr({ id: "e2", isHidden: true })] } as any,
  hiddenSection: { type: "custom", isSectionVisible: false, isTitleVisible: true, title: "H", contents: [orr({ id: "e3" })] } as any
}
describe("flattenEntries", () => {
  it("skips hidden sections and hidden entries", () => {
    const out = flattenEntries(core as any)
    expect(out.map((e) => e.serverId).sort()).toEqual(["e1"])
  })
  it("tags entries with their section type", () => {
    expect(flattenEntries(core as any)[0]?.sectionType).toBe("summary")
  })
})

describe("buildApplyPath", () => {
  it("produces sectionId.contents.entryId.field", () => {
    expect(buildApplyPath("experiences", "e1", "description")).toBe("experiences.contents.e1.description")
  })
})

describe("appendNote", () => {
  it("appends immutable", () => {
    expect(appendNote(["a"], "b")).toEqual(["a", "b"])
  })
})
```

- [ ] **Step 2: Run to verify fail.** Run: `pnpm test`. Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// app/composables/useResumeAdmin.ts
import type { TCoreSections } from "~/utils/schemas/content.schema"

export interface AiResumeEntry { serverId: string; sectionType: string; title: string; subtitle: string; description: string }

export function flattenEntries(core: TCoreSections): AiResumeEntry[] {
  const out: AiResumeEntry[] = []
  for (const [sectionType, section] of Object.entries(core ?? {})) {
    if (!section || section.isSectionVisible === false) continue
    for (const c of section.contents ?? []) {
      if (c.isHidden === true) continue
      out.push({
        serverId: c.id,
        sectionType,
        title: c.title ?? "",
        subtitle: (c as { subtitle?: string }).subtitle ?? "",
        description: c.description ?? ""
      })
    }
  }
  return out
}

export function buildApplyPath(sectionType: string, entryId: string, field: "description" | "title"): string {
  return `${sectionType}.contents.${entryId}.${field}`
}

export function appendNote(notes: string[], note: string): string[] {
  return [...notes, note.trim()].filter(Boolean)
}
```

- [ ] **Step 4: Run to verify pass.** Run: `pnpm test`. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/composables/useResumeAdmin.ts tests/ai/resumeAdmin.spec.ts
git commit -m "feat(ai): resume flatten + apply-path helpers"
```

---

### Task 10: Client orchestrator composable

**Files:**
- Create: `app/composables/useResumeImprove.ts`

**Interfaces:**
- Consumes: `useAiRoute` (keys), `flattenEntries`/`appendNote`, `$fetch`, `useI18n().locale`.
- Produces:
  - `useResumeImprove()` returns `{ status, result, errors, runAnalyze(newJd, honesty), refine(entryId, note), apply(entryId, key), reset, applied: Record<entryIndex,string> }`
  - Pure state testable: `updateAppliedCardEntries(result, applyId)` and `notesKey`.

Actual browser flow: call endpoint, hold per-entry `currentSuggestion`, `notes: string[]`, `applied`. On note, POST refine for that entry, replace its suggestion. On apply, `updateContent(buildApplyPath(...), text)` and record undo-able previous.

Since orchestration touches store/localStorage (hard to unit test), keep the thin logic and rely on the pure helpers already tested + typecheck/lint gates.

- [ ] **Step 1: Write the minimal composable**

```ts
// app/composables/useResumeImprove.ts
import { useAiProvider } from "./useAiProvider"
import { flattenEntries, buildApplyPath, appendNote } from "./useResumeAdmin"
import { useI18n } from "vue-i18n"
import type { TCoreSections } from "~/utils/schemas/content.schema"

export function useResumeImprove() {
  const resumeStore = useResumeStore()
  const ai = useAiProvider()
  const { locale } = useI18n()
  const jobDescription = ref("")
  const honestyDraw = ref<"faithful" | "balanced" | "bold">("faithful")
  const analyzing = ref(false)
  const refiningId = ref<string | null>(null)
  const result = ref<ImproveResult | null>(null)
  const error = ref<string | null>(null)
  const pendingNotes = ref<Record<string, string[]>>({})
  const applied = ref<Record<string, string>>({}) // serverId -> previous value

  const language = computed(() => (locale.value === "fa" ? "fa" : "en"))

  async function runAnalyze(jd: string) {
    if (!jd.trim()) return
    const { provider, key, model, baseUrl } = ai.keys?.value ?? {}
    if (!provider || !key) { error.value = "missing_key"; return }
    analyzing.value = true; error.value = null
    try {
      const entries = flattenEntries(resumeStore.core as TCoreSections)
      entryIndex.value = Object.fromEntries(entries.map((e) => [e.serverId, { sectionType: e.sectionType }]))
      const res = await $fetch<ImproveResult>("/api/ai/improve-resume", { method: "POST", body: { jobDescription: jd, honesty: honestyDraw.value, language: language.value, provider, apiKey: key, model, baseUrl, entries } })
      result.value = res
      pendingNotes.value = {}
      applied.value = {}
    } catch (e) { error.value = (e as any)?.data?.statusMessage ?? "improve_failed" }
    finally { analyzing.value = false }
  }

  async function refine(serverItem: string, noteText: string) {
    if (!result.value || !ai.keys.value) return
    const cur = result.value.suggestions.find((s) => s.entryId === serverItem)
    if (!cur) return
    pendingNotes.value[serverItem] = appendNote(pendingNotes.value[serverItem] ?? [], noteText)
    refiningId.value = serverItem
    try {
      const entry = resumeStore.core ? flattenEntries(resumeStore.core).find((e) => e.serverId === serverItem) : undefined
      const res = await $fetch<HistorySuggestion>("/api/ai/refine-entry", { method: "POST", body: { jobDescription: jobDescription.value, honesty: honestyDraw.value, language: language.value, provider: ai.keys.value.provider, apiKey: ai.keys.value.key, model: ai.keys.value.model, baseUrl: ai.keys.value.baseUrl, entry, currentSuggestion: cur, notes: pendingNotes.value[serverItem] } })
      const i = result.value.suggestions.findIndex((s) => s.entryId === serverItem)
      if (i >= 0) result.value.suggestions[i] = res
    } catch (e) { error.value = (e as any)?.data?.statusMessage ?? "refine_failed" }
    finally { refiningId.value = null }
  }

  // serverId -> { sectionType } captured from flattenEntries at analyze time.
  const entryIndex = ref<Record<string, { sectionType: string }>>({})

  function currentValue(serverItemId: string, field: "description" | "title"): string | undefined {
    const meta = entryIndex.value[serverItemId]
    if (!meta) return undefined
    const section = resumeStore.core?.[meta.sectionType]
    const entry = section?.contents?.find((c) => c.id === serverItemId)
    if (!entry) return undefined
    return (entry as Record<string, unknown>)[field] as string | undefined
  }

  function apply(serverItemId: string, suggestion: HistorySuggestion) {
    const prev = currentValue(serverItemId, suggestion.field)
    if (prev === undefined) return // entry gone: card calls this only when the entry exists
    applied.value[serverItemId] = prev
    const meta = entryIndex.value[serverItemId]
    if (!meta) return
    resumeStore.updateContent(buildApplyPath(meta.sectionType, serverItemId, suggestion.field), suggestion.suggestedText)
  }

  function undo(serverItemId: string, suggestion: HistorySuggestion) {
    const prev = applied.value[serverItemId]
    if (prev === undefined) return
    const meta = entryIndex.value[serverItemId]
    if (!meta) return
    resumeStore.updateContent(buildApplyPath(meta.sectionType, serverItemId, suggestion.field), prev)
    delete applied.value[serverItemId]
  }

  function isApplied(serverItemId: string): boolean {
    return serverItemId in applied.value
  }

  return { result, error, analyzing, refiningId, pendingNotes, isApplied, runAnalyze, refine, apply, undo }
}
```

- [ ] **Step 2: Typecheck + lint.** Run: `pnpm typecheck && pnpm lint`. Fix drift: the composable is the only non-pure piece; keep the store projection slim and rely on already-tested helpers. Ensure every value read off `resumeStore.core` is a `TCoreSections` (never a nested `.core`).

- [ ] **Step 3: Introduce pure `pickSuggestionSectionType`? no — the entry mapping uses `flattenEntries`; ensure `status-message` type consistency.**

- [ ] **Step 4: Commit**

```bash
git add app/composables/useResumeImprove.ts
git commit -m "feat(ai): client orchestrator for analyze/refine/apply"
```

---

### Task 11: Client UI child components

**Files:**
- Create:
  - `app/components/resume/resume-header/widgets/improve/ScoreHero.vue`
  - `app/components/resume/resume-header/widgets/improve/StrengthsCard.vue` (strengths + weaknesses)
  - `app/components/resume/resume-header/widgets/improve/KeywordChips.vue`
  - `app/components/resume/resume-header/widgets/improve/SuggestionCard.vue`

**Interfaces:**
- Consumes: props typed from `ImproveResult` / `HistorySuggestion`.
- Produces: presentational components used by `ImproveResume.vue`.

- [ ] **Step 1: ScoreHero.vue** — `defineProps<{ matchScore: number; summary: string }>`; color by threshold (`>=70` green, `>=40` amber, else red) using `UProgress`/plain div; localize labels.

- [ ] **Step 2: StrengthsCard.vue** — props `{ strengths: string[]; weaknesses: string[] }`; two lists.

- [ ] **Step 3: KeywordChips.vue** — props `{ keywords: string[] }`; a shaped chip row.

- [ ] **Step 4: SuggestionCard.vue** — the interactive card. Props `{ suggestion, note, refining }`; emits `apply`, `refine(text)`. Shows title, current vs suggested text, rationale, amber "added — verify" tag for `addedFacts`, and inline note input that emits `refine`. Surface an "Applied ✓" state when prop `applied` is true, with an Undo emit.

- [ ] **Step 5: Typecheck + lint.** Run: `pnpm typecheck && pnpm lint`. Fix untranslated text; forward `$t` keys.

- [ ] **Step 6: Commit**

```bash
git add app/components/resume/resume-header/widgets/improve
git commit -m "feat(ai): presentational improvement widgets"
```

---

### Task 12: ImproveResumeModal + ResumeHeader wiring

**Files:**
- Create: `app/components/resume/resume-header/widgets/improve/ImproveResume.vue`
- Modify: `app/components/resume/resume-header/ResumeHeader.vue`

**Interfaces:**
- Consumes: `useResumeImprove`, all Task 11 widgets, `useAiSettings` for gate.
- Produces: full modal flow with `defineModel<boolean>` open; a header button in `ResumeHeader`.

- [ ] **Step 1: ImproveResume.vue**

Compose the flow per spec §"Modal layout": JD textarea with client-side validity (≥ ~80 chars / 10 words), honesty dial (three segments + bold note), Analyze button → gate (show inline settings link if no key) → score hero → lists → keyword chips → suggestion cards. Reuse constants from registry for the dial. Loading spinners on analyze/refine; `Retry` on error (`error` ref reset).

- [ ] **Step 2: Wire into ResumeHeader**

Add a button (icon `i-lucide-sparkles`) that toggles the modal; `const isImproveModalOpen = ref(false)`, async-component import, render `<ImproveResumeU v-model="isImproveModalOpen" />`.

- [ ] **Step 3: Typecheck + lint.** Run: `pnpm typecheck && pnpm lint`.

- [ ] **Step 4: Commit**

```bash
git add app/components/resume/resume-header/widgets/improve/ImproveResume.vue app/components/resume/resume-header/ResumeHeader.vue
git commit -m "feat(ai): improve-resume modal + header entry point"
```

---

### Task 13: AiProviderSettings + dashboard wiring

**Files:**
- Create: `app/components/dashboard/AiProviderSettings.vue`
- Modify: `app/pages/dashboard/settings.vue`

**Interfaces:**
- Consumes: `useAiSettings`, `AI_PROVIDERS` registry.
- Produces: a settings card to select provider, paste key, and (for OpenRouter/Custom) edit model / baseUrl; persists via `setKeys`.

- [ ] **Step 1: Create `AiProviderSettings.vue`** — `USelect` for provider, `UInput` password-type for key, conditional model + baseUrl inputs (`USelectInput` from registry), a Save (persist) action and a Clear action. Never reads stored key into a plain display (mask). On load seed from `keys.value`.

- [ ] **Step 2: Wire into `settings.vue`** — add a new `UCard` after the language card: `<AiProviderSettings />`.

- [ ] **Step 3: Typecheck + lint.** Run: `pnpm typecheck && pnpm lint`.

- [ ] **Step 4: Commit**

```bash
git add app/components/dashboard/AiProviderSettings.vue app/pages/dashboard/settings.vue
git commit -m "feat(ai): provider key settings in dashboard"
```

---

### Task 14: i18n (en + fa)

**Files:**
- Create: none.
- Modify: `i18n/locales/en.json`, `i18n/locales/fa.json`

**Interfaces:**
- Produces: keys consumed by Tasks 11–13. Every key added to both files; the `fa` file is RTL-checked.

- [ ] **Step 1: Add `editor.improve.*` block to `en.json`** — keys: `button, title, subtitle, jdLabel, jdPlaceholder, jdTooShort, dialTitle, honest/fair, balanced, bold, dialNames (3), boldNote, analyze, analyzing, mustSignIn, noKey, goToSettings, scoreLabel, strengths, weaknesses, missingKeywords, noSuggestions, rationale, addedVerify, apply, applyAlt, applied, undo, addNote, notePlaceholder, refine, refining, retry, errorGeneric, keyTitle, cancel`.

- [ ] **Step 2: Add identical keys to `fa.json`** with Persian strings; verify RTL-facing order reads naturally.

- [ ] **Step 3: Grep all `$t(` new keys match — no orphan keys, no missing.**

- [ ] **Step 4: Commit**

```bash
git add i18n/locales
git commit -m "feat(i18n): improvement UI strings (en, fa)"
```

---

### Task 15: Global gates + manual QA checklist

**Files:** none.
**Interfaces:** confirms every task's deliverable compiles and the feature is manually exercised.

- [ ] **Step 1: Run the full gate.** Run: `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` (build can include `--max-old-space-size` if needed). Expected: all green.

- [ ] **Step 2: Manual QA (RTL + Persian + gate + guest).** Follow the spec §Testing "Manual QA": analyze real JD, refine with note, apply, undo, review "added — verify" at Bold, provider key gate shows inline link when absent, guest (`/try`) sees signup nudge. Confirm Persian (`fa`) suggestions and RTL.

- [ ] **Step 3: Address any finding in a small focused commit**, then re-run gates.

- [ ] **Step 4: Commit any residuals** with conventional commit.

---

## Self-Review (run by plan author — completed)

**Spec coverage:**

- R1 analyze → Task 4/5/7. ✅
- R2 honesty dial → pleasant block prompt (Task 4) + values validate (Task 5) + 3-segment UI (Task 12). ✅
- R3 refine with note → Task 6 (prompt + validation) + Task 10 (`refine`) note accumulation per entry. Server stateless, client owns notes. ✅
- R4 apply → `updateContent(path…` via `buildApplyPath` (Task 9/10); card collapse + Undo (Task 11 SuggestionCard applied state). ✅
- R5 BYOK unlimited → both endpoints no `checkRateLimit`, key from client; parsing unaffected (untouched). ✅
- R6 registry 9 providers + OpenRouter editable + Custom baseURL → Task 2/8. All through OpenAI SDK (`client.ts`). ✅
- R7 language en/fa → `language` computed from i18n locale (Task 10), prompt anchors it (Task 4), UI RTL. ✅
- R8 guests → signup nudge in modal (Task 12) + `requireAuth` 401 (Task 7). ✅

**Placeholder scan:** No TBD/TODO — every step names a file, signature, or behavior; tests carry real assertions.

**Type consistency:** `AiId`, `AiProviderConfig`, `AiEntry`, `HistorySuggestion`, `ImproveResult` names are consistent across server (`providers.ts`, `improveChildren.ts`, `client.ts`) and client (`registry.ts`, `composables`). Apply path uses the exact store shape verified against `resume.store.ts` `updateContent`.

Risk note: **Anthropic** via the OpenAI SDK is technically incompatible with Anthropic's native Messages API; this plan follows the spec (R6) literally. If unsupported, `mapProviderError` surfaces a clean message and Anthropic can be dropped from the registry with no flow change. Flag to the human reviewer.