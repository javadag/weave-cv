# Landing Page Redesign — Playful & Energetic Animations

## Context

The current landing page uses the same animation pattern everywhere: `useScrollReveal` fade-up from below, identical timing, rigid 3-column feature grid. Every section has the same "badge + heading + subtitle" reveal. This makes the page feel generic and AI-generated.

**Goal:** Transform the landing page into something with personality — playful, bouncy, cursor-interactive — while keeping all existing content and i18n keys unchanged.

**Approach:** Layout + Animation Hybrid. Restructure the features section layout, completely rethink animations per-section, add cursor-interactive composables.

**Stack:** motion-v (v2.3.0, already installed), VueUse composables, Tailwind CSS v4. No new dependencies.

---

## New Composables

### 1. `useMagneticCursor(strength?: number)`

**File:** `app/composables/useMagneticCursor.ts`

Returns a template ref and event handlers for a magnetic cursor effect. When the cursor enters the element, the element elastically follows the cursor within bounds (default 10px max offset). On leave, it springs back to center.

```ts
// Usage
const { ref, style } = useMagneticCursor(10)
// Bind: <div ref="ref" :style="style" @mouseenter="onEnter" @mouseleave="onLeave" @mousemove="onMove">
```

- Uses `motion-v` spring for smooth interpolation
- Respects `useReducedMotion()` — returns no-op handlers when reduced motion is preferred
- Disables on touch devices via `useMediaQuery('(hover: hover)')` — returns no-op handlers when hover is not supported
- `strength` param controls max pixel offset (default 10)

### 2. `useTiltCard(maxDeg?: number)`

**File:** `app/composables/useTiltCard.ts`

Returns a template ref and event handlers for 3D perspective tilt. The card tilts toward the cursor position (default max 5deg). On leave, springs back to flat.

```ts
// Usage
const { ref, style } = useTiltCard(5)
// Bind: <div ref="ref" :style="style" @mousemove="onMove" @mouseleave="onLeave">
```

- Applies `perspective(800px) rotateX(...) rotateY(...)` via style binding
- Uses `motion-v` spring for return animation
- Respects `useReducedMotion()` — no-op when reduced motion preferred
- Disables on touch devices via `useMediaQuery('(hover: hover)')` — returns no-op handlers when hover is not supported

### 3. Update `useScrollReveal`

**File:** `app/composables/useScrollReveal.ts`

Add a `direction` option: `"up" | "left" | "right" | "scale"`. Different sections can reveal differently instead of everything fading up.

```ts
// Current: useScrollReveal(0.1, { y: 24 })
// New:     useScrollReveal(0.1, { direction: "left" })
```

- `"up"` (default): current behavior — `{ opacity: 0, y }` → `{ opacity: 1, y: 0 }`
- `"left"`: `{ opacity: 0, x: -30 }` → `{ opacity: 1, x: 0 }`
- `"right"`: `{ opacity: 0, x: 30 }` → `{ opacity: 1, x: 0 }`
- `"scale"`: `{ opacity: 0, scale: 0.9 }` → `{ opacity: 1, scale: 1 }`
- Transition uses spring instead of ease curve for bouncy feel

---

## Section Redesigns

### Hero Section

**File:** `app/components/landing/home/HeroSection.vue`

**Layout:** Unchanged — two-column (text left, preview right), version badge, headline, subtitle, CTAs, trust badges.

**Animation changes:**

1. **Headline text bounce-in:** Replace `fadeUp(0.2)` on the `<h1>` with word-by-word spring reveals. The i18n keys `hero.titleStart` and `hero.titleHighlight` are split by spaces into individual words. Each word gets wrapped in a `<motion.span>` with `type: "spring", bounce: 0.4` and staggered delays (0.05s per word). The `titleHighlight` words are wrapped together inside the existing gradient `<span>` — the gradient span itself gets a single spring animation with a slightly longer bounce. Example: if `titleStart` = "Build your perfect" and `titleHighlight` = "resume instantly", the template renders 5 `<motion.span>` words, with the last 2 inside the gradient wrapper.

2. **Magnetic CTAs:** Both CTA buttons use `useMagneticCursor(10)`. On hover, the button elastically follows the cursor. On leave, it springs back. The primary CTA also keeps its existing shadow/brightness hover.

3. **Preview card tilt:** The editor preview `<motion.div>` uses `useTiltCard(5)` for 3D perspective tilt toward cursor. Keeps existing entry animation (slide from right + scale).

4. **Trust badges alternating direction:** Instead of all fading up, odd badges slide from left, even badges slide from right. Use `useScrollReveal` with `direction: "left"` / `"right"`.

5. **Floating notifications:** Replace linear float (`y: [0, -6, 0]`) with spring-based bounce. Use `type: "spring", bounce: 0.5` on the y animation. Slightly more vertical movement (8px instead of 6px).

6. **Version badge pulse:** Keep pulse animation but add a slight spring bounce to the scale component (`scale: [1, 1.3, 1]` with spring).

**Unchanged:** Content, i18n keys, blob parallax, sidebar sections list, resume preview content.

### Features Section

**File:** `app/components/landing/home/FeaturesSection.vue`

**Layout change — Alternating Spotlight:**

Replace the rigid 3×2 grid with an alternating layout:

```
Row 1: [==== Feature 1 — Large Spotlight ====]
Row 2: [ Feature 2 ] [ Feature 3 ]
Row 3: [==== Feature 4 — Large Spotlight ====]
Row 4: [ Feature 5 ] [ Feature 6 ]
```

- **Spotlight cards** (features 1, 4): Full-width, larger padding, bigger icon (size-16 vs size-12), colored accent strip on the left edge (4px wide, gradient), more text space.
- **Small cards** (features 2, 3, 5, 6): Half-width in a 2-column grid, standard padding, standard icon size.
- Spotlight feature selection: features 1 ("Refined Templates") and 4 ("Color & Typography") — the most visually compelling differentiators.

**Animation changes:**

1. **Spotlight cards:** Enter with `useScrollReveal` `direction: "scale"` — scale up from 0.92 with spring bounce. Icon bounces in with a 0.2s delay after the card appears.

2. **Small cards:** Alternate `direction: "left"` and `direction: "right"` — cards slide in from their side. Staggered delays within each row.

3. **All cards get `useTiltCard(3)`:** Subtle 3D perspective tilt on hover (max 3deg — less than hero since cards are smaller).

4. **Icon bounce on hover:** Replace the CSS `rotate(-6deg) scale(1.1)` with a motion-v spring bounce — `scale: [1, 1.2, 1]` with `type: "spring", bounce: 0.5`.

5. **Section heading:** Replace uniform `useScrollReveal` with word-by-word spring reveal (same technique as hero headline).

**Unchanged:** Same 6 features, same i18n content, same icon set, same section badge text.

### Templates Section

**File:** `app/components/landing/home/TemplatesSection.vue`

**Layout:** Unchanged — dual-row opposite-direction scroll carousel with edge fade gradients.

**Animation changes:**

1. **Card tilt on hover:** Each `TemplateCarouselCard` gets `useTiltCard(3)` — subtle 3D perspective tilt (max 3deg).

2. **Card scale on hover:** Replace CSS hover `scale(1.02)` with a motion-v spring transition — `type: "spring", bounce: 0.3, scale: 1.03`.

3. **Scroll-linked offset increase:** Increase `SHIFT` from 450 to 550 for more dramatic parallax movement.

**Unchanged:** Dual-row layout, `ClientOnly` wrapper, edge gradients, i18n content, template data.

### CTA Section

**File:** `app/components/landing/home/CTASection.vue`

**Layout:** Unchanged — gradient card with badge, headline, subtitle, CTA button, stats, floating notifications.

**Animation changes:**

1. **Magnetic CTA button:** The "Build" button uses `useMagneticCursor(12)`. Slightly stronger magnetic pull than hero CTAs since it's the primary conversion action.

2. **Elastic scroll entry:** Replace the hover `scale-[100.4%]` with an elastic scale-up on scroll entry. The entire card uses `useScrollReveal` with `direction: "scale"` — springs from 0.95 to 1 with `bounce: 0.35`.

3. **Floating notifications:** Replace linear float with spring-based bounce. Left card: `y: [0, -10, 0]` with spring. Right card: `y: [0, -10, 0]` with spring, 1s phase offset.

4. **Stats row:** Stagger in with alternating `direction: "left"` / `"right"` instead of uniform fade-up.

5. **Button glow:** Keep the box-shadow pulse but add a slight scale pulse too (`scale: [1, 1.02, 1]`).

**Unchanged:** Content, i18n keys, gradient card design, grid pattern, radial gradients.

---

## Files to Modify

| File | Change |
|------|--------|
| `app/composables/useMagneticCursor.ts` | **New** — magnetic cursor composable |
| `app/composables/useTiltCard.ts` | **New** — 3D tilt card composable |
| `app/composables/useScrollReveal.ts` | **Update** — add `direction` option, spring transitions |
| `app/components/landing/home/HeroSection.vue` | **Update** — magnetic CTAs, tilt preview, bouncy text, alternating trust badges |
| `app/components/landing/home/FeaturesSection.vue` | **Update** — spotlight layout, directional reveals, tilt cards, icon bounce |
| `app/components/landing/home/TemplatesSection.vue` | **Update** — tilt cards, scale hover, increased shift |
| `app/components/landing/home/CTASection.vue` | **Update** — magnetic button, elastic entry, bouncy floats, directional stats |
| `app/components/landing/home/TemplateCarouselCard.vue` | **Update** — integrate `useTiltCard` |

---

## Verification

1. `npm run dev` — check all four sections render correctly
2. Hover test: CTAs should magnetically follow cursor, preview card should tilt, feature cards should tilt
3. Scroll test: sections should reveal with varied directions (not all from bottom), springs should feel bouncy
4. Reduced motion: enable "prefers-reduced-motion" in browser devtools — all animations should be disabled
5. RTL test: switch to Farsi — animations should work identically in RTL
6. Mobile test: tilt/magnetic effects should be disabled on touch devices (no pointer events)
7. `npm run lint` — no lint errors
