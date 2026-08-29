import { LOCAL_FONT_FAMILIES, LOCAL_FONTS_CUTS } from "~/constants/fonts"
import type { TFontStyle, TFontWeight } from "~/utils/schemas/shared.schema"

function normalizeFontName(family: string) {
  return family.toLowerCase().replaceAll(/\s+/g, "")
}

function buildLocalFontCss(family: string, baseUrl?: string): string {
  const cuts = LOCAL_FONTS_CUTS[family]
  if (!cuts) return ""

  const normalized = normalizeFontName(family)

  return cuts
    .map((cut) => {
      const [weight, style] = cut.split("-") as [TFontWeight, TFontStyle]
      const url = baseUrl
        ? `${baseUrl}/fonts/${normalized}/${normalized}-${weight}-${style}.woff2`
        : `/fonts/${normalized}/${normalized}-${weight}-${style}.woff2`

      return `
      @font-face {
        font-family: '${family}';
        src: url('${url}') format('woff2');
        font-weight: ${weight};
        font-style: ${style};
        font-display: swap;
      }`
    })
    .join(" ")
}

function buildGoogleFontImport(family: string): string {
  const encoded = encodeURIComponent(family)
  return `@import url('https://fonts.googleapis.com/css2?family=${encoded}:ital,wght@0,400;0,700;1,400;1,700&display=swap');`
}

export function buildFontCss(family: string, baseUrl?: string): string {
  if (LOCAL_FONT_FAMILIES.has(family)) {
    return buildLocalFontCss(family, baseUrl)
  }
  return buildGoogleFontImport(family)
}

export async function preloadFont(family: string) {
  if (!LOCAL_FONT_FAMILIES.has(family)) {
    return
  }

  const cuts = LOCAL_FONTS_CUTS[family]
  if (!cuts) return

  const faces = cuts.map((cut) => {
    const [weight] = cut.split("-")
    return `${weight} 16px "${family}"`
  })

  await Promise.all(faces.map((face) => document.fonts.load(face)))
  await document.fonts.ready
}

const loadedFonts: Record<string, boolean> = {}

export function loadFont(family: string) {
  if (Object.hasOwn(loadedFonts, family)) return

  const css = buildFontCss(family)
  if (!css) return

  const style = document.createElement("style")
  style.append(document.createTextNode(css))
  document.head.append(style)

  loadedFonts[family] = true
}

export function formatFontCase(text: string, fontCase?: string): string {
  if (!text || !fontCase || fontCase === "inherit") return text
  if (fontCase === "uppercase") return text.toUpperCase()
  if (fontCase === "lowercase") return text.toLowerCase()
  if (fontCase === "capitalize") {
    return text.toLowerCase().replace(/(?:^|[\s\-_/()[\]{}.,:;])\p{L}/gu, (char) => char.toUpperCase())
  }
  return text
}

