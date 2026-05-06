/**
 * Helper functions
 */
const sanitizeFormat = (format: string, options?: { hideDay?: boolean }) => {
  if (!options?.hideDay) {
    return format
  }

  const tokenRegex = /(YYYY|YY|MMMM|MMM|MM|DD)|([^YMD]+)/g
  const tokens: Array<{ value: string; type: "date" | "separator" }> = []

  let match: RegExpExecArray | null
  while ((match = tokenRegex.exec(format)) !== null) {
    if (match[1]) {
      tokens.push({ value: match[1], type: "date" })
    } else if (match[2]) {
      tokens.push({ value: match[2], type: "separator" })
    }
  }

  const filtered = tokens.filter((token) => !(token.type === "date" && token.value === "DD"))

  const sanitized = filtered.filter((token, index, array) => {
    if (token.type !== "separator") return true

    const hasPreviousDate = array.slice(0, index).some((item) => item.type === "date")
    const hasNextDate = array.slice(index + 1).some((item) => item.type === "date")

    return hasPreviousDate && hasNextDate
  })

  const result = sanitized.map((token) => token.value).join("")

  return result.replaceAll(/\s{2,}/g, " ").trim() || "YYYY-MM"
}

export const fmtDate = (
  iso: string | null | undefined,
  format: string,
  options?: { hideDay?: boolean; locale?: string }
) => {
  if (!iso) return ""

  const date = new Date(iso)
  const locale = options?.locale ?? "en-US"
  // Persian locale uses the Jalali/Shamsi calendar system
  const calLocale = locale.startsWith("fa") ? `${locale}-u-ca-persian` : locale
  const effectiveFormat = sanitizeFormat(format, options)

  const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(calLocale, opts).formatToParts(date)
  const part = (parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ""

  const yearFull = part(fmt({ year: "numeric" }), "year")
  const monthLong = part(fmt({ month: "long" }), "month")
  const monthShrt = part(fmt({ month: "short" }), "month")
  const monthNum = part(fmt({ month: "2-digit" }), "month")
  const dayNum = part(fmt({ day: "2-digit" }), "day")

  return effectiveFormat
    .replaceAll("YYYY", yearFull)
    .replaceAll("YY", yearFull.slice(-2))
    .replaceAll("MMMM", monthLong)
    .replaceAll("MMM", monthShrt)
    .replaceAll("MM", monthNum)
    .replaceAll("DD", dayNum)
}
