import { LOCAL_ONLY_PICKER_ENTRIES } from "~/constants/fonts"

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
    useFetch<GoogleFontRaw[]>("/google-fonts.json").then(({ data }) => {
      if (!data.value) return

      const googleEntries: FontEntry[] = data.value.map((f) => ({
        family: f.family,
        label: f.family,
        category: f.category,
        subsets: f.subsets,
      }))

      const localEntries: FontEntry[] = LOCAL_ONLY_PICKER_ENTRIES.map((e) => ({
        family: e.family,
        label: e.label,
        category: "local",
        subsets: e.subsets,
        isLocal: true,
      }))

      const combined = [...googleEntries, ...localEntries].sort((a, b) => a.family.localeCompare(b.family))

      cachedFonts = combined
      allFonts.value = combined
    })
  }

  const subsets = computed(() => {
    const set = new Set<string>()
    for (const font of allFonts.value) {
      for (const s of font.subsets) set.add(s)
    }
    const sorted = [...set].sort()
    return ["all", ...sorted]
  })

  const fonts = computed(() => {
    const query = search.value.trim().toLowerCase()
    const subset = selectedSubset.value

    return allFonts.value.filter((f) => {
      const matchesSearch = !query || f.family.toLowerCase().includes(query)
      const matchesSubset = subset === "all" || f.subsets.includes(subset)
      return matchesSearch && matchesSubset
    })
  })

  return { fonts, subsets, search, selectedSubset }
}
