# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Job seekers actively applying for roles who need a professional resume quickly. They range from entry-level graduates to senior professionals, and value speed, simplicity, and a polished result without design expertise.

## Product Purpose

Weave CV is a free, browser-based resume builder that lets job seekers create professional, ATS-friendly resumes in minutes. It exists because most resume builders are either paywalled, ugly, or slow — Weave CV is none of those.

## Positioning

The honest, no-nonsense resume builder. Free forever, no paywall, no upsell. Modern templates, pixel-perfect PDF export, drag-and-drop editing, cloud sync, and full design control — all without asking for a credit card.

## Operating Context

- Browser-based workflow: pick template → add content → customize design → export PDF
- Autosave with cloud sync across devices
- Guest trial mode (`/try`) for immediate value before signup
- Dashboard for managing multiple resumes
- Live editor with real-time preview, undo/redo, section reordering
- PDF export with embedded fonts, A4/Letter support

## Capabilities and Constraints

- Multi-provider AI integration (OpenAI, Groq, Anthropic, Gemini, etc.) for resume parsing and job matching — a capability, not the positioning
- English and Persian (RTL) interface with `no_prefix` i18n strategy
- Supabase backend: auth, database, storage
- Vercel deployment, Nuxt 4 / Vue 3 stack
- Tiptap-based rich text editor (CSR-only)
- Puppeteer server-side PDF generation
- Tailwind CSS v4 + Nuxt UI v4 with orange/zinc theme

## Brand Commitments

- Name: Weave CV
- Primary color: orange
- Neutral: zinc
- Voice: honest, direct, helpful — no corporate jargon, no fake urgency
- Existing logo and favicon assets in `/public/`

## Evidence on Hand

- Live at https://weavecv.app
- Full English and Persian translation files in `i18n/locales/`
- Landing page with hero, features, templates, and CTA sections
- Dashboard, editor, auth flows all implemented
- Changelog maintained at `CHANGELOG.md`

## Product Principles

1. **Free means free** — no paywalls, no premium tiers, no tricks
2. **Speed to value** — a polished resume in under 10 minutes
3. **Design quality without expertise** — templates that look like a designer made them
4. **Works everywhere** — responsive, RTL-aware, accessible
5. **Honest product** — no dark patterns, no fake scarcity, no upselling

## Accessibility & Inclusion

- RTL layout support for Persian/Arabic scripts
- Logical CSS properties used throughout
- Dark mode support
- Reduced motion support via `prefers-reduced-motion`
