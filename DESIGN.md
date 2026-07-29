---
name: Weave CV
description: The honest, no-nonsense resume builder — warm, inviting, and professional
colors:
  primary-warm: "#ea580c"
  primary-light: "#fb923c"
  primary-deep: "#c2410c"
  amber-glow: "#f59e0b"
  amber-warm: "#fbbf24"
  neutral-950: "#09090b"
  neutral-900: "#18181b"
  neutral-800: "#27272a"
  neutral-700: "#3f3f46"
  neutral-500: "#71717a"
  neutral-400: "#a1a1aa"
  neutral-300: "#d4d4d8"
  neutral-200: "#e4e4e7"
  neutral-100: "#f4f4f5"
  neutral-50: "#fafafa"
  success: "#10b981"
  error: "#ef4444"
typography:
  display:
    fontFamily: "Noto Sans Arabic, Inter, Vazirmatn, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Noto Sans Arabic, Inter, Vazirmatn, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Noto Sans Arabic, Inter, Vazirmatn, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Noto Sans Arabic, Inter, Vazirmatn, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Noto Sans Arabic, Inter, Vazirmatn, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary-warm}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary-warm}"
    rounded: "{rounded.sm}"
    padding: "14px 28px"
  card:
    backgroundColor: "{colors.neutral-50}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  card-elevated:
    backgroundColor: "{colors.neutral-50}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  input:
    backgroundColor: "{colors.neutral-50}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
  chip:
    backgroundColor: "{colors.neutral-100}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
---

# Design System: Weave CV

## Overview

**Creative North Star: "The Golden Desk"**

Weave CV's design system is built around the metaphor of a golden desk — a warm, well-organized workspace where every tool has its place and the light feels just right. The palette glows with the amber and orange tones of late-afternoon sun on polished wood, grounded by deep zinc neutrals that suggest solidity and reliability. It's the kind of workspace where you feel immediately capable, where the environment fades away and only the work remains.

The visual language is warm and tactile: generous border-radius that invites touch, soft shadows that suggest depth without drama, and a golden accent that evokes optimism and new beginnings. This is not a sterile corporate tool — it's a companion for one of life's most important moments: landing your next role. Every interaction is designed to feel unhurried, confident, and honest.

**Key Characteristics:**
- **Warm professionalism** — orange/amber primary with golden accents, grounded by zinc neutrals
- **Soft tactility** — generous border-radius (8–16px), subtle warm shadows, inviting interactions
- **Spatial clarity** — generous whitespace, consistent 8px rhythm, predictable hierarchy
- **Honest simplicity** — no dark patterns, no fake urgency, no decorative noise

## Colors

The palette is warm and optimistic, anchored by a vibrant orange that feels like sunrise — the promise of a new day, a new opportunity. In dark mode, the primary shifts to amber for eye comfort while maintaining the same warmth. Every surface, shadow, and accent leans warm; cool grays and stark whites are avoided.

### Primary
- **Warm Sunrise Orange** (#ea580c): The hero color. Used for CTAs, active states, brand accents, and the gradient that defines Weave CV's identity. In light mode, it's confident and energetic. Appears on no more than 10% of any screen — its rarity is the point.

### Secondary
- **Amber Glow** (#f59e0b): The gradient partner and dark-mode primary. Used in the brand gradient (orange-500 to amber-500) and as the full primary scale in dark mode (amber-400 through amber-900). Warmer and softer than the primary, it bridges the gap between bold CTAs and neutral backgrounds.

### Neutral
- **Deep Ink** (#09090b): Near-black for primary text in light mode. Never pure black — the slight warmth keeps it friendly.
- **Zinc Gray Scale** (#18181b → #fafafa): The workhorse. Used for backgrounds, borders, text hierarchy, and surface layering. The scale runs from near-black (900) through mid-grays (500, 400) to near-white (50, 100).
- **Dark Mode Surfaces** (#0b0b0e, #15151a, #1c1c21): Custom dark backgrounds that avoid the cold blue-black of many dark modes. These are warm, deep charcoals that let the orange/amber accent breathe.

### Semantic
- **Emerald Success** (#10b981): Confirmation states, checkmarks, "saved" indicators. Used sparingly for positive feedback.
- **Red Error** (#ef4444): Error states, destructive actions. Always paired with clear messaging.

### Named Rules
**The Warmth Rule.** Every surface, shadow, and accent should feel warm. Avoid pure grays (#808080), cool blues, and stark whites. When in doubt, lean toward the warm end of the neutral scale.

**The 10% Rule.** The primary orange accent appears on ≤10% of any given screen. Its rarity creates impact — if everything is orange, nothing is.

## Typography

**Display Font:** Noto Sans Arabic (with Inter for Latin, Vazirmatn for Persian/RTL, system-ui fallback)
**Body Font:** Noto Sans Arabic (with Inter for Latin, Vazirmatn for Persian/RTL, system-ui fallback)
**Resume Font:** Inter (default, configurable per template — 17 templates ship with distinct font families)

**Character:** Noto Sans Arabic is the app-level workhorse — clean, geometric, highly readable at all sizes, with excellent Arabic/Latin coverage. It's professional without being sterile, friendly without being whimsical. Inter handles resume content and Latin-heavy interfaces. The tight tracking on headlines (-0.04em) gives display text a modern, confident feel. For RTL, Vazirmatn takes the lead — it's the Persian counterpart with matching optical weight and personality.

### Hierarchy
- **Display** (700, clamp(2.5rem, 7vw, 4.5rem), 1.05): Hero headlines only. Tight tracking (-0.04em) creates a modern, editorial feel. Used for the main value proposition on landing pages.
- **Headline** (700, 2.25rem, 1.15): Section headings. Slightly looser tracking (-0.03em) than display. Used for feature titles, page headings.
- **Title** (600, 1.25rem, 1.3): Card headings, subheadings, form labels. Medium weight provides hierarchy without heaviness.
- **Body** (400, 1rem, 1.625): Primary content text. Generous line-height for readability. Max line length ~65ch for comfortable reading.
- **Label** (600, 0.75rem, 1.4, uppercase, 0.05em tracking): Small caps, section labels, metadata. Wide tracking creates clear visual anchors.
- **X-Small** (400, 13px): Compact labels, input placeholders, fine print. Used via the `text-2sm` utility throughout forms and navigation.

### Named Rules
**The Tight-Head Rule.** Display and headline text always uses negative letter-spacing (-0.04em to -0.03em). This creates a modern, confident feel that distinguishes Weave CV from generic resume builders.

**The RTL Swap Rule.** When `lang="fa"`, the font stack swaps to Vazirmatn first. All spacing and layout uses logical properties (margin-inline-start, not margin-left) so the entire interface mirrors correctly.

## Layout

**Container:** max-width 1600px (`--container-compact`), centered with auto margins. Generous enough for wide editor views but constrains content on ultra-wide screens.

**Grid:** The landing page uses a 2-column grid on desktop (content + preview), collapsing to single-column on mobile. The dashboard uses a sidebar + main content pattern. The editor uses a 3-panel layout (sidebar sections, editor, preview).

**Spacing Rhythm:** 8px base unit. Vertical spacing follows a scale: 8, 16, 24, 32, 48, 64. Sections are separated by 80–112px (py-20 to py-28) on landing pages. Internal card padding is 24–28px.

**Density:** The editor is denser than the landing page — tighter padding, smaller text, more information per square inch. This is intentional: the editor is a tool for focused work, while the landing page is a space for persuasion.

**Responsive Breakpoints:**
- `sm` (640px): Single-column layout, stacked navigation
- `md` (768px): Side-by-side elements begin
- `lg` (1024px): Full 2-column layouts, expanded spacing (`px-6 lg:px-12`)

**Header Pattern:** All three headers (landing, dashboard, editor) share: height 64px, `bg-default/80 backdrop-blur-md`, bottom border, container `max-w-compact mx-auto px-6 lg:px-12`.

## Elevation & Depth

**Philosophy:** Soft, ambient depth. Shadows are never dramatic — they suggest layering and lift without creating visual noise. The system uses a hybrid approach: tonal layering (lighter/darker surfaces) for structural depth, and subtle warm-toned shadows for interactive elements. Dark mode uses stronger shadows to compensate for darker surfaces.

### Shadow Vocabulary
- **Card Rest** (`0 1px 2px rgba(0,0,0,0.03)`): Barely visible. Cards at rest feel grounded but not flat.
- **Card Hover** (`0 20px 44px -16px rgba(28,25,23,0.14)`): Significant lift on interaction. The warm brown-black tone keeps it from feeling cold.
- **Dark Mode Hover** (`0 20px 44px -16px rgba(32,32,32,0.65)`): Stronger shadow in dark mode to compensate for the darker surfaces.
- **Hero Preview** (`0 50px 100px -30px rgba(28,25,23,0.22)`): Dramatic but warm. Used only for the hero preview card to create a "floating" effect.
- **CTA Glow** (`0 40px 80px -30px rgba(234,88,12,0.45)`): Orange-tinted shadow for the CTA card. Creates a warm halo effect that draws the eye.
- **Button Hover** (`0 8px 24px -8px rgba(234,88,12,0.5)`): Orange glow on primary buttons. Subtle but unmistakable.

### Named Rules
**The Warm Shadow Rule.** Shadows use warm brown-black tones (`rgba(28,25,23,...)`) instead of pure black (`rgba(0,0,0,...)`). This keeps the depth feeling organic and inviting rather than harsh.

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, elevation, focus). A card at rest has a barely-visible shadow; on hover, it lifts significantly.

## Shapes

**Form Language:** Soft, rounded, inviting. The system avoids sharp corners entirely — every interactive element has at least 8px border-radius, and cards use 12–16px. This creates a tactile, approachable feel that says "touch me."

**Border Radius Scale:**
- `sm` (8px): Inputs, chips, buttons (Nuxt UI global override: `rounded-lg`)
- `md` (12px): Cards (Nuxt UI global override: `rounded-xl`), form sections
- `lg` (16px): Feature cards, elevated surfaces, FAQ cards
- `xl` (24px): Hero sections, CTA cards, modal dialogs

**Borders:** Subtle, 1px, using the neutral-200 (light) or neutral-800 (dark) tokens. Borders are functional, not decorative — they define edges without creating visual weight.

**Named Rules**
**The No-Sharp Rule.** Nothing in the UI has a 0px border-radius. Even the smallest interactive element (a chip, a toggle) has at least 8px rounding. Sharp corners are reserved for PDF output only.

**The Generous Touch Rule.** Touch targets are minimum 44×44px. Buttons have generous padding (14px vertical, 28px horizontal). This isn't just accessibility — it makes the interface feel confident and unhurried.

## Components

### Buttons

- **Shape:** Softly rounded (8px radius via Nuxt UI global), generous padding (14px 28px)
- **Primary:** Orange gradient background (from-orange-500 to-orange-700), white text. On hover: slight lift (translateY -1px), brightness increase, warm orange glow shadow (`rgba(234,88,12,0.5)`).
- **Secondary:** Transparent background, orange text, orange border. On hover: subtle orange tint background.
- **Ghost:** No border, no background. Used for navigation links, toolbar actions (undo, redo, help). `color="neutral" variant="ghost"`.
- **Dashboard CTA:** Zinc-900 background, white text. On hover: lighter zinc. Deliberately muted compared to the landing page CTA.
- **ButtonGroupInput:** Custom toggle using UButton `xs` size. Selected: `variant="solid" color="primary"`. Unselected: `variant="outline" color="neutral"`.

### Cards / Containers

- **Corner Style:** 12px radius (Nuxt UI global: `rounded-xl`)
- **Background:** White (light mode) or elevated surface (dark mode: #1c1c21)
- **Shadow Strategy:** Flat at rest (1px shadow), significant lift on hover (20px shadow with warm tone)
- **Border:** 1px neutral-200 (light) / neutral-800 (dark)
- **Internal Padding:** 24–28px (`p-3 sm:p-4` for compact, `p-7` for feature cards)
- **Hover Behavior:** Border shifts to primary-tinted (30% opacity), shadow increases dramatically

### Inputs / Fields

- **Style:** Rounded (8px), subtle background (neutral-50), 1px border
- **Focus:** Border shifts to primary, subtle glow
- **Padding:** 10px vertical, 14px horizontal (`px-3 py-2 text-sm`)
- **Placeholder:** Dimmed text, slightly smaller in RTL mode
- **Label:** `text-2sm font-medium text-muted` (13px), supports "inline" or "stacked" variants

### Chips / Tags

- **Style:** Rounded (8px), neutral-100 background, neutral-900 text
- **Padding:** 6px vertical, 12px horizontal
- **Use Case:** Skill tags, filter pills, metadata labels

### Navigation

- **Header:** Sticky, 64px height, blurred backdrop (`backdrop-blur-md`), bottom border
- **Logo:** Left-aligned, linked to home
- **Actions:** Right-aligned, `gap-1.5` on mobile, `gap-4` on desktop
- **Active State:** Primary color text, subtle background tint

### Status Indicators

- **Saved:** Emerald dot (pulsing), "Saved Xs ago" text
- **ATS Check:** Emerald checkmark with emerald-tinted background
- **Version Badge:** Orange dot (pulsing), version number, rounded pill shape

## Do's and Don'ts

### Do:
- **Do** use the warm orange/amber palette consistently — it's Weave CV's signature
- **Do** apply generous border-radius (8–16px) to all interactive elements
- **Do** use warm shadow tones (`rgba(28,25,23,...)`) instead of pure black
- **Do** keep the primary accent to ≤10% of any screen
- **Do** use logical CSS properties (margin-inline-start, padding-inline-end) for RTL support
- **Do** include hover and focus states on all interactive elements
- **Do** use the brand gradient (orange-500 to amber-500) for hero text and accent elements
- **Do** respect reduced-motion preferences with graceful fallbacks
- **Do** use Nuxt UI semantic tokens (`bg-default`, `text-muted`, `border-accented`) for consistency

### Don't:
- **Don't** use sharp corners (0px radius) on any interactive element
- **Don't** use pure black (`#000000`) for shadows or text — always use warm tones
- **Don't** overuse the primary orange — if everything is orange, nothing is
- **Don't** use cool grays or blue-blacks — the palette is always warm
- **Don't** create dark patterns or fake urgency — the design is honest
- **Don't** use decorative noise — every element should serve a purpose
- **Don't** forget RTL — test all layouts in both directions
- **Don't** use font sizes below 12px for body text — readability is non-negotiable
