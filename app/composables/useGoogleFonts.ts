import { LOCAL_ONLY_PICKER_ENTRIES, POPULAR_FONT_FAMILIES } from "~/constants/fonts"

export type FontEntry = {
  family: string
  label: string
  category: string
  subsets: string[]
  isLocal?: boolean
}

type GoogleFontRaw = {
  family: string
  category: string
  subsets: string[]
}

// Module-level cache so the fetch only happens once per page load
let cachedFonts: FontEntry[] | null = null

export function useGoogleFonts() {
  const search = ref("")
  const selectedSubset = ref("all")

  const allFonts = ref<FontEntry[]>(cachedFonts ?? [])

  if (!cachedFonts) {
    ;(async () => {
      const { data } = await useFetch<GoogleFontRaw[]>("/google-fonts.json")
      if (!data.value) return

      const googleEntries: FontEntry[] = data.value.map((f) => ({
        family: f.family,
        label: f.family,
        category: f.category,
        subsets: f.subsets
      }))

      const localEntries: FontEntry[] = LOCAL_ONLY_PICKER_ENTRIES.map((e) => ({
        family: e.family,
        label: e.label,
        category: "local",
        subsets: e.subsets,
        isLocal: true
      }))

      const combined = [...googleEntries, ...localEntries].toSorted((a, b) => a.family.localeCompare(b.family))

      cachedFonts = combined
      allFonts.value = combined
    })()
  }

  const subsets = computed(() => {
    const set = new Set<string>()
    for (const font of allFonts.value) {
      for (const s of font.subsets) set.add(s)
    }
    const sorted = [...set].toSorted((a, b) => a.localeCompare(b))
    return ["all", ...sorted]
  })

  // Popular section only shows unfiltered; hidden while searching or a script tab is active
  const isUnfiltered = computed(() => !search.value.trim() && selectedSubset.value === "all")

  const popularFonts = computed<FontEntry[]>(() => {
    if (!isUnfiltered.value) return []
    const byFamily = new Map(allFonts.value.map((f) => [f.family, f]))
    return POPULAR_FONT_FAMILIES.map((family) => byFamily.get(family)).filter((f) => f !== undefined)
  })

  const fonts = computed(() => {
    const query = search.value.trim().toLowerCase()
    const subset = selectedSubset.value
    const popular = new Set(isUnfiltered.value ? POPULAR_FONT_FAMILIES : [])

    return allFonts.value.filter((f) => {
      if (popular.has(f.family)) return false
      const matchesSearch = !query || f.family.toLowerCase().includes(query)
      const matchesSubset = subset === "all" || f.subsets.includes(subset)
      return matchesSearch && matchesSubset
    })
  })

  return { fonts, popularFonts, subsets, search, selectedSubset }
}
