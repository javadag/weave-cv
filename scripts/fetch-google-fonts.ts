/**
 * One-time script to generate public/google-fonts.json
 *
 * Usage:
 *   set GOOGLE_FONTS_API_KEY=api_key && tsx scripts/fetch-google-fonts.ts
 *
 * Get a free API key at: https://console.developers.google.com/
 * Enable "Google Fonts Developer API" for your project.
 *
 * The generated file is committed to the repo and only needs refreshing
 * when you want to pick up newly added Google Fonts.
 */

import { writeFileSync } from "node:fs"
// eslint-disable-next-line unicorn/import-style
import { join } from "node:path"

const API_KEY = process.env.GOOGLE_FONTS_API_KEY

if (!API_KEY) {
  console.error("Error: GOOGLE_FONTS_API_KEY env var is required.")
  console.error("Usage: GOOGLE_FONTS_API_KEY=your-key npx tsx scripts/fetch-google-fonts.ts")
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1)
}

type GoogleFontItem = {
  family: string
  category: string
  subsets: string[]
  variants: string[]
}

type GoogleFontsApiResponse = {
  items: GoogleFontItem[]
}

// Only these categories are useful for professional documents
const RESUME_CATEGORIES = new Set(["sans-serif", "serif", "monospace"])

// Always include Arabic/Persian-subset fonts regardless of rank
const ALWAYS_INCLUDE_SUBSETS = new Set(["arabic", "hebrew"])

// Maximum fonts per category (API returns them sorted by popularity)
const MAX_PER_CATEGORY: Record<string, number> = {
  "sans-serif": 80,
  serif: 50,
  monospace: 20
}

async function fetchGoogleFonts() {
  console.log("Fetching Google Fonts catalogue...")

  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Google Fonts API error: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as GoogleFontsApiResponse

  const countPerCategory: Record<string, number> = {}
  const fonts = []

  for (const item of data.items) {
    if (!RESUME_CATEGORIES.has(item.category)) continue

    const hasSpecialSubset = item.subsets.some((s) => ALWAYS_INCLUDE_SUBSETS.has(s))
    const limit = MAX_PER_CATEGORY[item.category] ?? 50
    const count = countPerCategory[item.category] ?? 0

    if (!hasSpecialSubset && count >= limit) continue

    countPerCategory[item.category] = count + 1
    fonts.push({
      family: item.family,
      category: item.category,
      subsets: item.subsets
    })
  }

  const outputPath = join(process.cwd(), "public", "google-fonts.json")
  writeFileSync(outputPath, JSON.stringify(fonts, null, 2), "utf8")

  const byCategory = Object.entries(countPerCategory)
    .map(([cat, n]) => `${cat}: ${n}`)
    .join(", ")
  console.log(`Done. Wrote ${fonts.length} fonts (${byCategory}) to public/google-fonts.json`)
}

try {
  await fetchGoogleFonts()
} catch (error) {
  console.error(error)
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1)
}
