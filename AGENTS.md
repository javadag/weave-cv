# AGENTS.md

## Setup

- **Package manager**: pnpm (v10). Never use npm or yarn.
- Install dependencies: `pnpm install`
- `.env` is required. See `.env.example` for Supabase, AI, and email keys.
- `postinstall` auto-runs `nuxt prepare` to generate `.nuxt/` (required for typechecking, linting, and IDE support).
- ESLint config imports from `.nuxt/eslint.config.mjs` — if linting fails with import errors, run `pnpm install` first.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build (`nuxt build`) |
| `pnpm typecheck` | Type-check with `nuxt typecheck` |
| `pnpm lint` | Lint via ESLint (Nuxt auto-config) |
| `pnpm format` | Format with Prettier |
| `pnpm build:pdf-css` | Build a standalone `public/tailwind-pdf.css` for PDF rendering |
| `pnpm update-types` | Fetch Supabase DB types (needs `SUPABASE_PROJECT_REF` in `.env` + Supabase CLI) |
| `pnpm release` | `standard-version` for changelog + version bump |

No test suite exists in this repo.

## Architecture

This is a **Nuxt 4 / Vue 3** resume builder app ("Weave CV"), deployed to **Vercel** with a **Supabase** backend.

```
app/          # Frontend (Vue pages, components, composables, stores, utils)
server/       # Nitro server (API routes, server utils)
  api/        # API endpoints: ai/, pdf, feedback, resumes (CRUD)
  utils/      # Shared server utils: aiClient, auth, rate limiter, resumes
i18n/         # Translation files (en, fa)
scripts/      # update-types.sh, fetch-google-fonts.ts
```

- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin. Nuxt UI v4 with `orange`/`zinc` theme.
- **Auth**: Supabase Auth (`@nuxtjs/supabase`). Auth-required routes: `/dashboard/*`, `/editor/*`, `/login`.
- **i18n**: English (default) + Persian (RTL). Locale detection via cookie, `no_prefix` strategy.
- **State**: Pinia stores — `resume`, `preview`, `configs`. Cross-store access is used (e.g. resume store imports configs store).
- **Editor**: `/editor/[id].vue` is a **CSR-only SPA** (`ssr: false`). Built with Tiptap + custom composables for autosave, undo/redo, match-to-job.
- **AI**: Multi-provider chat (OpenAI, Groq, Anthropic, Gemini, DeepSeek, Mistral, xAI, Perplexity) for resume parsing and job matching. Client runs server-side only in `server/utils/aiClient.ts`.
- **PDF**: Puppeteer for server-side PDF generation (`server/api/pdf.post.ts`). Uses a separate `tailwind-pdf.css` stylesheet.
- **Database**: Supabase PostgreSQL, types in `app/types/database.types.ts`.
- **Migrations**: In-app data migrations at `app/utils/migrations/migrations.ts` (run client-side on resume load).

## Conventions

- **No semicolons**, double quotes, `trailingComma: "none"`, `printWidth: 120` (Prettier).
- **Conventional commits** enforced by commitlint + husky.
- **Vue components**: `<script setup lang="ts">` with explicit type imports from `~/utils/schemas/`.
- **RTL-aware**: When touching CSS or UI, remember the app supports Persian RTL (use logical properties, test both directions).
- Editor route rules disallow SSR — if adding editor features, they must work client-side only.
- `/try/**` also has `ssr: false` in route rules.
- Image provider switches automatically: `ipx` locally, `vercel` in CI (`GITHUB_ACTIONS` env check).
- AI providers expect API keys from the **client** (passed from frontend), not server-side env vars.
- If modifying PDF styles or `tailwind-pdf.css`, run `pnpm build:pdf-css` to regenerate the stylesheet.

## Deployment

- **Platform**: Vercel, `vercel.json` framework is `nuxtjs`, nitro preset is `vercel`.
- **CI**: Tag pushes trigger prod deploy (`main.yml`). Pushes to `hotfix` branch trigger hotfix deploy (`hotfix.yml`).
- Deploy uses `vercel build --prod` then `vercel deploy --prebuilt --prod`.
- `NODE_OPTIONS: --max-old-space-size=4096` is set in CI due to build memory requirements.
- `pnpm release` runs `standard-version` — auto-generates changelog from conventional commits, bumps version, creates a git tag. Customize sections in `.versionrc.json`.

## Agent skills

### Issue tracker

GitHub Issues via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context layout: `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.
