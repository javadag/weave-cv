# AI Resume Improve (JD-driven) — Design Spec

**Date:** 2026-08-27
**Status:** Approved for implementation planning
**Supersedes:** the removed "AI match-to-job" feature (`f9b920c`, reverted in `5b4f9ee`)

## Purpose

Bring back JD-driven resume improvement with a new flow focused on the reason the old
feature was removed: **quality of output**. The old one-shot analysis produced generic,
unstable advice. The new flow produces specific, grounded, actionable suggestions, and
lets users push back per entry with a note instead of a full re-run.

User-facing flow:

1. User pastes a job description and picks an honesty level, then runs the analysis.
2. The LLM returns a match score, strengths, weaknesses, missing keywords, and one
   suggestion per relevant resume entry.
3. For any unsatisfying suggestion, the user writes a short note and gets a revised
   suggestion for that entry only (no chat UI).
4. The user applies suggestions directly to the resume; autosave and undo behave as
   anywhere else in the editor.

## Requirements

- **R1 — Analyze:** one LLM call returns `matchScore`, `scoreSummary`, `strengths`,
  `weaknesses`, `missingKeywords`, and per-entry `suggestions`.
- **R2 — Honesty dial:** three levels —
  - **Faithful:** reword, reframe, and highlight only what is genuinely in the resume.
  - **Balanced:** weaker, defensible phrasing is allowed; no new facts.
  - **Bold:** may add plausible details; every non-grounded claim is returned in
    `addedFacts` so the UI can flag it "added — verify".
- **R3 — Refine with note:** per-entry refinement endpoint takes the entry, its current
  suggestion, and an accumulating list of notes; returns one revised suggestion.
  The server stays stateless; the client owns note history.
- **R4 — Apply:** applying a suggestion patches the entry in the resume store via
  `updateContent` (path-based, resolves array items by `id`). Applied cards collapse to
  an "Applied ✓" state with an Undo affordance that restores the previous value.
- **R5 — BYOK, unlimited:** the user's own provider key is used for both endpoints with
  no server-side rate limit. Resume **parsing** is unaffected: it keeps the server
  DeepSeek key and its existing rate limit.
- **R6 — Provider registry:** DeepSeek, Groq, OpenAI, Anthropic, Gemini, Mistral,
  Perplexity, **OpenRouter** (editable model ID), and **Custom (OpenAI-compatible)**
  with user-supplied baseURL + model + key — the Custom entry covers gateways like
  OpenCode Zen without hardcoding their endpoints. All providers are called through the
  OpenAI SDK with a per-provider `baseURL`.
- **R7 — Language:** suggestions come back in the resume's configured language
  (currently `en` or `fa`); the whole UI is translated and RTL-aware.
- **R8 — Guests:** the feature requires auth. `/try` guests see a signup nudge instead.

## Non-goals

- No chat/conversation UI or server-side session state.
- No persistence of analysis results (no DB schema changes); state lives in the modal
  for the session and disappears with it.
- No auto-retry loops; errors surface an explicit Retry button.
- Per-entry suggestions cover core sections only (`summary`, `experiences`, `projects`,
  `educations`, `skills`, `languages`, `certificates`, `courses`, `awards`, `custom`);
  personal details (name, contacts, photo) are not suggestion targets.
- No browser e2e in this feature (Playwright was previously reverted, `bbcdc03`);
  vitest unit tests + manual QA instead.
- Missing-keyword tap-to-highlight in the JD is cut as a nicety.

## Architecture

### Server (new files, stateless)

| File | Role |
|---|---|
| `server/api/ai/improve-resume.post.ts` | Analysis endpoint. One LLM call. |
| `server/api/ai/refine-entry.post.ts` | Per-entry refinement endpoint. One cheap LLM call. |
| `server/utils/ai/prompts/improveResume.ts` | Analysis prompt + JSON schema instructions. |
| `server/utils/ai/prompts/refineEntry.ts` | Refinement prompt. |
| `server/utils/ai/client.ts` | Shared OpenAI-SDK client factory from `provider` + `apiKey` + registry entry. |

Both endpoints use `requireAuth`. No `checkRateLimit` (BYOK). Request bodies are capped
at 64 KB. Custom provider baseURL must be `https://`.

### API contracts

**`POST /api/ai/improve-resume`** — request:

```jsonc
{
  "jobDescription": "string",
  "honesty": "faithful | balanced | bold",
  "language": "en | fa",
  "provider": "deepseek | groq | openai | anthropic | gemini | mistral | perplexity | openrouter | custom",
  "apiKey": "string",
  "model": "string (optional override, required for custom, exposed for openrouter)",
  "baseUrl": "string (custom only, https-only)",
  "entries": [
    { "id": "…", "sectionType": "summary | experiences | projects | educations | skills | languages | certificates | courses | awards | custom",
      "title": "…", "subtitle": "…", "description": "…" }
  ]
}
```

Response:

```jsonc
{
  "matchScore": 0-100,
  "scoreSummary": "one line",
  "strengths": ["…"],
  "weaknesses": ["…"],
  "missingKeywords": ["…"],
  "suggestions": [
    { "entryId": "…", "field": "description | title",
      "suggestedText": "…", "rationale": "…",
      "addedFacts": ["…"] }
  ]
}
```

`addedFacts` is empty except at `bold` level, where it lists claims not grounded in the
resume so the UI can flag them.

**`POST /api/ai/refine-entry`** — request: same auth/provider fields plus
`{ jobDescription, honesty, language, entry, currentSuggestion, notes: string[] }`.
Response: a single suggestion object (same shape as one element of `suggestions[]`).

JSON is enforced in-prompt with tolerant extraction on the server (same approach as
`parse-resume.post.ts`) rather than provider-specific structured-output features, so
exotic gateways and models cannot break the flow.

### Prompt quality rules (the fix for the old failure mode)

- Every suggestion must cite specifics from the entry and the JD; generic advice
  ("add more keywords") is forbidden.
- Weaknesses and missing keywords must reference actual resume or JD content.
- The honesty-level instruction block is shared between both prompts.
- The refinement prompt treats accumulated notes as binding constraints, newest last.

### Client

| File | Role |
|---|---|
| `app/components/resume/resume-header/ImproveResumeModal.vue` | Main modal (entry point button in `ResumeHeader.vue`). |
| child components (score hero, lists, suggestion card) | Kept small, one purpose each. |
| `app/composables/useResumeImprove.ts` | Orchestration: flatten entries, call endpoints, note history per entry, apply/undo. |
| `app/utils/ai/resumeEntries.ts` | Resume → ID-tagged entries (skips hidden sections). |
| `app/constants/aiProviders.ts` | Provider registry (labels, models, baseURLs, key-hint URLs). |
| `app/composables/useAiProvider.ts` | localStorage-backed key store (`weave-cv:ai-keys`), as before. |
| `app/components/dashboard/AiProviderSettings.vue` | Settings UI in dashboard settings. |

Modal layout, top to bottom:

1. JD textarea (client-side validity check: min ~80 chars / 10 words with sentence
   structure) + honesty dial (three segments with one-line descriptions; Bold carries a
   "may add details — flagged for review" note) + Analyze button.
2. Score hero with color thresholds (green ≥70, amber ≥40, red below) + `scoreSummary`.
3. Strengths / weaknesses lists.
4. Missing-keyword chip row.
5. Suggestion cards: entry title, current vs suggested text, one-line rationale,
   amber "added — verify" tags for `addedFacts`. Actions: **Apply** and **"Not right?
   Add a note"** — the note input slides open inline; a refined suggestion replaces the
   card content; notes accumulate per entry.
6. If no key is set, the modal shows an inline prompt linking to dashboard settings
   instead of failing after submit.

Apply calls
`resumeStore.updateContent("<sectionId>.contents.<entryId>.<field>", suggestedText)` —
the same path shape existing callers use (`SectionContentEditor.vue`), where
`updateContent` resolves `contents` array items by their `id`. Autosave and undo work
unchanged. Card undo re-applies the stored previous value through the same path.

## Error handling

| Case | Behavior |
|---|---|
| Provider rejects key (401/403/no credit) | Clean message + link to settings; key never echoed in errors or logs. |
| Malformed LLM output | Tolerant extraction; if still unparsable, retryable error with explicit Retry button. |
| Slow LLM | ~60s timeout, loading state with Cancel. |
| Invalid JD | Client-side validity check before spending a call. |
| Entry deleted before Apply | `updateContent` id resolution fails; card shows "This entry no longer exists" and drops itself. |
| Guest usage | Signup nudge; endpoints reject unauthenticated calls. |

## Security considerations

- `requireAuth` on both endpoints prevents anonymous relay abuse.
- Custom baseURL is https-only; bodies are capped at 64 KB.
- Residual risk: an authenticated user could point a Custom provider at an internal
  host. Vercel has no internal network to reach, so exposure is minimal; acceptable for
  now, revisit if the deployment model changes.
- Keys live only in browser localStorage and travel only in the request body.

## Testing

- **Unit (vitest, added as part of this feature):** entry flattening (hidden sections
  skipped), JD validation, tolerant JSON parsing, honesty-block prompt builders, pure
  endpoint helpers (request validation, response sanitizing, error mapping), and the
  pure pieces of the improve composable (apply paths, note accumulation).
- **Server handler logic:** extracted into pure helpers in `server/utils/ai/` and
  tested directly with vitest (no Nitro test harness needed); endpoints stay thin
  shells.
- **Manual QA:** full browser pass — analyze, refine with note, apply, undo, RTL and
  Persian flow, provider gate, guest nudge.
- Existing CI (lint, typecheck, build) gates everything, plus a `pnpm test` script.

Browser e2e is out of scope: Playwright was deliberately reverted from the repo
(`bbcdc03`); restoring it is a separate future decision.

## i18n

All new UI strings in `i18n/locales/en.json` and `fa.json`, RTL-checked. Suggestions are
requested in the resume's configured language.
