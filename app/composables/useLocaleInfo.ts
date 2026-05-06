export const useLocaleInfo = () => {
  const { locale, locales } = useI18n()
  const current = computed(() =>
    (locales.value as Array<{ code: string; language: string; dir: "ltr" | "rtl" }>).find(
      (l) => l.code === locale.value
    )
  )
  const isRtl = computed(() => current.value?.dir === "rtl")
  const language = computed(() => current.value?.language ?? "en-US")
  return { isRtl, language }
}
