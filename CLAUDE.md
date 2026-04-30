# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm**. Node 18+.

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm preview` — preview production build
- `pnpm generate` — static generate
- `pnpm update-types` — regenerate `app/types/database.types.ts` from Supabase (runs `scripts/update-types.sh`; needs `SUPABASE_PROJECT_REF`)
- `pnpm release:patch | release:minor | release:major` — bump `package.json` and write `CHANGELOG.md` via changelogen
- `pnpm changelog` — regenerate `CHANGELOG.md` only

There is no test runner configured. There is no separate lint script — ESLint is wired through `@nuxt/eslint` and runs via the dev server / IDE; `eslint.config.mjs` extends Nuxt's config plus `eslint-plugin-unicorn` and Prettier.

Husky + commitlint enforce **conventional commits** (`feat:`, `fix:`, `chore:`, etc.) on every commit. Don't bypass with `--no-verify`.

`.env` requires `SUPABASE_URL`, `SUPABASE_KEY`, and (for type generation) `SUPABASE_PROJECT_REF`.

## Architecture

### Two data shapes per resume

Every resume is the union of two independently-versioned JSON blobs persisted in Supabase's `resumes` table:

- **`content`** — the user's data: `{ personal, core }`. Schemas in `app/utils/schemas/content.schema.ts`. `core` is a record keyed by section ID (`<type>-<uuid>`).
- **`configs`** — the styling/layout: `{ general, personal, summary, ... }`. Schemas in `app/utils/schemas/configs/`. Composed in `configs.schema.ts` by spreading `SectionsConfigsSchema.shape` into `general`.

These are loaded into separate Pinia stores (`app/stores/resume.store.ts`, `configs.store.ts`) on editor mount, edited in place, and posted back. `preview.store.ts` holds transient UI state (zoom, selected page).

### Editor data flow

`app/pages/editor/[id].vue` (SSR disabled — see `routeRules`) fetches `/api/resumes/[id]`, hydrates both stores, then mounts:

- `ResumeSectionsForms` (left) edits `resume.store` via `updateContent(path, value)` (dot-path).
- `ResumeConfigsForms` (right) edits `configs.store` via `updateConfig(path, value)`.
- `ResumePreview` reads both stores reactively. Pagination + layout happens in `app/utils/preview/core/*` (see `pageOrchestrator.ts`, `generateCoreBlocks.ts`, `pagination.ts`); the result is a list of pages rendered by `RenderPages.vue`.

Autosave is driven from the editor page; PDF export hits `POST /api/pdf` which renders the same preview server-side with Puppeteer (`@sparticuz/chromium` for serverless).

### Single-source-of-truth registries (post-refactor)

The codebase was recently refactored to eliminate parallel section/template registries. Three rules:

1. **Schemas own defaults.** Every leaf in `generalConfigs.schema.ts` and `sectionsConfigs.schema.ts` has `.default(...)`. `DEFAULT_CONFIGS` in `app/constants/default.ts` is `ConfigsSchema.parse({...})` — never hand-edited.

2. **Templates are partial overrides.** `app/constants/templates.ts` declares `TemplateSpec[]` with `configs: DeepPartial<TConfigs>`. At read time, `mergeConfigs<TConfigs>(DEFAULT_CONFIGS, spec.configs)` resolves them. Merge semantics: missing keys inherit; arrays replace wholesale (no concat). The merge utility is `app/utils/configs/mergeConfigs.ts`. When applying a template in the editor (`ChangeTemplateModal.vue`), `reconcileSectionsOrder` (`app/utils/configs/reconcileSectionsOrder.ts`) maps the user's existing section IDs into the template's column layout slots — preserving the user's relative ordering within each column. Sections not in the template's order fall back to the column they were already in.

3. **One section registry.** `app/constants/sections/registry.ts` exposes `SECTIONS_REGISTRY` keyed by section type. Each entry contributes `kind`, `label`, `icon`, `fields`, `configOptions`, `defaultConfig`, `dummyData`, `singleItem`. Four files derive from it: `sectionFields.ts`, `sectionConfigs.ts`, `dummyData.ts`, `singleContent.ts`. A fifth file, `sectionTypes.ts`, defines the `ADVANCED_SECTION_TYPES`, `BASIC_SECTION_TYPES`, and `OTHER_SECTION_TYPES` arrays statically (not derived from the registry). **Do not add a new parallel registry keyed by section type** — extend `SectionDescriptor` and let consumers derive.

The `personal` section is intentionally NOT in `SECTIONS_REGISTRY` (its shape differs); see `DETAILS_CATALOG` in `content.schema.ts` for the personal-details registry.

### Adding things — file count

| Change | Files to edit |
|---|---|
| New template | `app/constants/templates.ts` + screenshot in `public/images/templates/` |
| New config field | the relevant `*.schema.ts` (add `.default()`) — propagates to all templates and `DEFAULT_CONFIGS` automatically |
| Change a default value | the relevant `*.schema.ts` |
| New section type | `content.schema.ts` (union) + `sectionsConfigs.schema.ts` (configs entry) + `sections/registry.ts` (descriptor) |

### Schema versioning + migrations

`CURRENT_SCHEMA_VERSION` in `app/constants/config.ts` (currently 1) is stored on every resume row. When the persisted shape of `configs` or `content` changes in a non-additive way:

1. Bump `CURRENT_SCHEMA_VERSION`.
2. Add a `migrateFromVNToVN+1` function and register it in the `MIGRATIONS` map in `app/utils/migrations/migrations.ts`.
3. `migrateResumeData` walks rows up to the current version on read.

Adding a new optional field with a `.default()` is *not* a breaking change and does not require a migration — Zod parse fills the default on read.

**Zod 4 `.default()` on nested objects** — Zod 4 requires the *output* type for `.default()`, not an empty `{}`. Always pass explicit full values: `.default({ width: 0, color: "#000000" })`. An empty `.default({})` will cause a TypeScript error. Every nested `z.object({...})` whose fields all have leaf-level defaults MUST also have its own `.default({...})` so `ConfigsSchema.parse({})` (used by `DEFAULT_CONFIGS`) doesn't throw "Required" for the missing key.

**`renderer$1` before initialization crash** — if the Nuxt dev server crashes on every page with `Cannot access 'renderer$1' before initialization`, the cause is always a module-level expression throwing during initialization (most commonly `ConfigsSchema.parse(...)` in `app/constants/default.ts`). Check that every `z.object({...})` in the schema that is not explicitly provided in the `DEFAULT_CONFIGS` parse call has a `.default()` value.

**Server API endpoints — no runtime schema imports** — never import Zod schema objects (only `import type`) in `server/api/**` files. Runtime imports of app schemas in server handlers create a circular dependency in the Nuxt dev bundle that triggers the `renderer$1` crash. Type-only imports are safe.

**Backfilling new config fields for existing resumes** — don't call `ConfigsSchema.parse()` on stored data in the editor page or server endpoints (circular dep risk). Instead, `setConfigs` in `configs.store.ts` calls `mergeConfigs(DEFAULT_CONFIGS, value)`, which deep-merges the fully-parsed defaults over the stored object, filling any missing keys. This is the same pattern used for template loading.

### Preview / PDF parity

The preview pipeline (`app/utils/preview/core/*`) is the single source of truth for rendering. Server-side PDF generation in `server/api/pdf.post.ts` injects the compiled `public/tailwind-pdf.css` and the same fonts (`buildFontCss` in `fontUtils.ts`) so client preview and PDF stay byte-identical. If you change preview rendering, run a PDF export to verify parity.

### i18n

Two locales: `en` (LTR) and `fa` (RTL). Strategy is `no_prefix` — locale switching uses a cookie, no URL changes. RTL is wired through both i18n config and the resume's `general.rtl` config flag (independent of UI locale).

### Auth + access control

`@nuxtjs/supabase` redirects unauthenticated users from `/dashboard/**`, `/editor/**`, `/login` to `/login`. Server endpoints call `requireAuth(event)` from `server/utils/auth.ts`. `MAX_RESUMES = 3` per user, enforced in `server/utils/resumes.ts` (`checkResumeLimit`) on create + duplicate.

### Schema introspection at runtime

`app/utils/schemas/schemaExtractors.ts` exposes `extractNumberConstraintsFromPath`, which reads a Zod `ZodNumber` field's `min`/`max` checks at runtime. Used by config-form components to drive range inputs without duplicating the constraint values in component props.

## Conventions

- Vue 3 Composition API with `<script setup lang="ts">`.
- Conventional Commits (enforced).
- ESLint config disables several Vue/Unicorn rules (`vue/html-self-closing`, `unicorn/filename-case`, `unicorn/prevent-abbreviations`, `unicorn/no-null`, `vue/no-v-html`); follow the existing style rather than re-enabling.
- TypeScript paths: `~/*` resolves to `app/*` (Nuxt default).
