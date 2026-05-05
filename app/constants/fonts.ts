export type TFontCut = `${number}-${"normal" | "italic"}`

// All fonts that have local WOFF2 files in /public/fonts/
// These are loaded from the local server (not Google Fonts CDN)
export const LOCAL_FONT_FAMILIES = new Set([
  "Calibri",
  "Cambria",
  "Garamond",
  "Georgia",
  "Helvetica",
  "Times New Roman",
  "Verdana",
  "Fira Sans",
  "Inter",
  "Lato",
  "Open Sans",
  "Source Sans Pro",
  "Space Mono",
  "Titillium Web",
  "Iran Sans",
  "Noto Sans Arabic",
  "Sahel",
  "Samim",
  "Shabnam",
  "Vazirmatn",
])

// Weight/style cuts available for each local font
export const LOCAL_FONTS_CUTS: Record<string, TFontCut[]> = {
  Calibri: ["400-normal", "700-normal", "400-italic", "700-italic"],
  Cambria: ["400-normal", "700-normal", "400-italic", "700-italic"],
  Garamond: ["400-normal", "700-normal", "400-italic", "700-italic"],
  Georgia: ["400-normal", "700-normal", "400-italic", "700-italic"],
  Helvetica: ["400-normal", "700-normal", "400-italic", "700-italic"],
  "Times New Roman": ["400-normal", "700-normal", "400-italic", "700-italic"],
  Verdana: ["400-normal", "700-normal", "400-italic", "700-italic"],
  "Fira Sans": ["400-normal", "700-normal", "400-italic", "700-italic"],
  Inter: ["400-normal", "700-normal", "400-italic", "700-italic"],
  Lato: ["400-normal", "700-normal", "400-italic", "700-italic"],
  "Open Sans": ["400-normal", "700-normal", "400-italic", "700-italic"],
  "Source Sans Pro": ["400-normal", "700-normal", "400-italic", "700-italic"],
  "Space Mono": ["400-normal", "700-normal", "400-italic", "700-italic"],
  "Titillium Web": ["400-normal", "700-normal", "400-italic", "700-italic"],
  "Iran Sans": ["400-normal", "700-normal"],
  "Noto Sans Arabic": ["400-normal", "700-normal"],
  Sahel: ["400-normal", "700-normal"],
  Samim: ["400-normal", "700-normal"],
  Shabnam: ["400-normal", "700-normal"],
  Vazirmatn: ["400-normal", "700-normal"],
}

// Fonts shown in the picker that are NOT in google-fonts.json
// (Microsoft/classic system fonts and Iranian-specific fonts)
export const LOCAL_ONLY_PICKER_ENTRIES = [
  { label: "Calibri", family: "Calibri", subsets: ["latin"] },
  { label: "Cambria", family: "Cambria", subsets: ["latin"] },
  { label: "Garamond", family: "Garamond", subsets: ["latin"] },
  { label: "Georgia", family: "Georgia", subsets: ["latin"] },
  { label: "Helvetica", family: "Helvetica", subsets: ["latin"] },
  { label: "Times New Roman", family: "Times New Roman", subsets: ["latin"] },
  { label: "Verdana", family: "Verdana", subsets: ["latin"] },
  { label: "ایران سنس", family: "Iran Sans", subsets: ["arabic"] },
  { label: "ساحل", family: "Sahel", subsets: ["arabic"] },
  { label: "صمیم", family: "Samim", subsets: ["arabic"] },
  { label: "شبنم", family: "Shabnam", subsets: ["arabic"] },
]

// Maps old enum slug values (V1 schema) to display names (V2 schema)
export const FONT_SLUG_MIGRATION_MAP: Record<string, string> = {
  calibri: "Calibri",
  cambria: "Cambria",
  firasans: "Fira Sans",
  garamond: "Garamond",
  georgia: "Georgia",
  helvetica: "Helvetica",
  inter: "Inter",
  lato: "Lato",
  opensans: "Open Sans",
  sourcesanspro: "Source Sans Pro",
  spacemono: "Space Mono",
  timesnewroman: "Times New Roman",
  titilliumweb: "Titillium Web",
  verdana: "Verdana",
  iransans: "Iran Sans",
  notosansarabic: "Noto Sans Arabic",
  sahel: "Sahel",
  samim: "Samim",
  shabnam: "Shabnam",
  vazirmatn: "Vazirmatn",
}
