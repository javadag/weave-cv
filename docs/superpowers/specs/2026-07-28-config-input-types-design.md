# Config Input Types — Design Spec

## Problem

The editor config panel uses only three input types: `NumberInput` (spinbox), `SelectItem` (dropdown), and `ToggleInput` (switch). Short selects with 2-6 options feel clunky as dropdowns, and numeric ranges don't show their bounds visually. The panel should feel more like a design tool (Figma, Canva) with segmented button bars and sliders.

## Approach

Create two new UI wrapper components (`SliderInput`, `ButtonGroupInput`) that follow the same prop/emit contract as existing `NumberInput` and `SelectItem`. Swap them into config control files on a per-field basis. No changes to the config store, schema, or data flow.

## Phase 1: General Configs (right panel)

### New Components

#### `SliderInput` — `app/components/ui/SliderInput.vue`

Drop-in replacement for `NumberInput` on numeric range fields.

**Props** (matches `NumberInput`):
- `modelValue: number`
- `label: string`
- `labelVariant?: "inline" | "stacked"` (default: `"inline"`)
- `min: number`
- `max: number`
- `step?: number` (default: `1`)
- `disabled?: boolean`

**Behavior:**
- Renders label on left, current value on right (`justify-between`)
- `USlider` below with `size="sm"`, `color="primary"`, `tooltip` on hover
- No manual number input — slider is the sole input
- Emits `update:modelValue`

**Appearance:**
```
Section Gap         12px
════════●═════════════════
```

#### `ButtonGroupInput` — `app/components/ui/ButtonGroupInput.vue`

Drop-in replacement for `SelectItem` on short option lists (2-6 options).

**Props** (matches `SelectItem`):
- `modelValue: string`
- `label: string`
- `labelVariant?: "inline" | "stacked"` (default: `"inline"`)
- `options: { label: string; value: string; icon?: string }[]`
- `disabled?: boolean`

**Behavior:**
- Renders label, then a flex row of `UButton` components
- Inactive buttons: `variant="outline"`, `size="xs"`
- Active button: `variant="solid"`, `color="primary"`
- Buttons fill container width evenly
- Emits `update:modelValue`

**Appearance:**
```
Columns
[▐▌] [▐▐]
```

### Field Mapping — LayoutControls

| Field | Current | New | Notes |
|---|---|---|---|
| columns (1/2) | `SelectItem` | `ButtonGroupInput` | 2 options |
| personalPosition (left/right/top) | `SelectItem` | `ButtonGroupInput` | 3 options |
| sectionGap | `NumberInput` | `SliderInput` | range from schema |
| verticalMargin | `NumberInput` | `SliderInput` | range from schema |
| horizontalMargin | `NumberInput` | `SliderInput` | range from schema |
| columnsWidth.left | `NumberInput` | `SliderInput` | range from schema |
| columnsWidth.right | `NumberInput` | `SliderInput` | range from schema |
| contentLayout widths (4 fields) | `NumberInput` | `SliderInput` | range from schema |
| indent | `NumberInput` | `SliderInput` | range from schema |
| rtl | `ToggleInput` | **Keep** | |
| language | `SelectItem` | **Keep** | 15 options |
| dateFormat | `SelectItem` | **Keep** | many options |
| pageSize | `SelectItem` | **Keep** | |
| listType | `SelectItem` | **Keep** | |

### Field Mapping — HeadingsControls

| Field | Current | New | Notes |
|---|---|---|---|
| heading variant (6 options) | `SelectItem` | `ButtonGroupInput` | plain/underline/underline-full/pill/border/vertical-border |
| icon.size | `NumberInput` | `SliderInput` | range from schema |
| icon.visible | `ToggleInput` | **Keep** | |

### Field Mapping — TypographyControls

| Field | Current | New | Notes |
|---|---|---|---|
| font size | `NumberInput` | `SliderInput` | range from schema |
| line height | `NumberInput` | `SliderInput` | range from schema |
| font family | `FontPicker` | **Keep** | |

### Field Mapping — SectionTypography (reusable component)

| Field | Current | New | Notes |
|---|---|---|---|
| font size / multiplier | `NumberInput` | `SliderInput` | range from schema |
| font weight | `SelectItem` | `ButtonGroupInput` | |
| font case | `SelectItem` | `ButtonGroupInput` | |
| font style | `SelectItem` | `ButtonGroupInput` | |

### Unchanged Components

`ToggleInput`, `ColorPicker`, `FontPicker`, `DatePicker`, `TextInput`, `USelectMenu`, `SectionsOrderControl` — all stay as-is.

## Phase 2: Per-Section Configs (follow-up)

In `SectionConfigControls.vue`:

| Field | Current | New |
|---|---|---|
| variant (3 options) | `SelectItem` | `ButtonGroupInput` |
| grids (1-4) | `NumberInput` | `SliderInput` |
| separator | `SelectItem` | `ButtonGroupInput` |
| titleStyle | `SelectItem` | `ButtonGroupInput` |
| titleSubtitleVariant | `SelectItem` | `ButtonGroupInput` |
| subTitleFirst | `ToggleInput` | **Keep** |
| linkInTitle | `ToggleInput` | **Keep** |

## Files Changed

**New files:**
- `app/components/ui/SliderInput.vue`
- `app/components/ui/ButtonGroupInput.vue`

**Modified files (Phase 1):**
- `app/components/resume/configs-forms/general/LayoutControls.vue`
- `app/components/resume/configs-forms/general/HeadingsControls.vue`
- `app/components/resume/configs-forms/general/TypographyControls.vue`
- `app/components/resume/configs-forms/sections/SectionTypography.vue`

**Modified files (Phase 2):**
- `app/components/resume/sections-forms/SectionConfigControls.vue`

**No changes to:** config store, schemas, types, defaults, extractor utilities.

## Constraints

- SliderInput must reuse `extractNumberConstraintsFromPath()` for min/max (already used by NumberInput)
- ButtonGroupInput options use the same `{ label, value }` format as SelectItem — no option format changes needed in config controls
- Both components must support `labelVariant="stacked"` for grid layouts (used in margins/widths ConfigWrappers)
- Phase 1 and Phase 2 are independent — Phase 2 can ship separately
