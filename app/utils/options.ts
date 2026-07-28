export const createOptionsFromEnum = (enumValues: readonly string[], labelFormatter?: (value: string) => string) => {
  return enumValues.map((value) => ({
    label: labelFormatter ? labelFormatter(value) : value,
    value
  }))
}

export function createTranslatedOptions<T extends string>(
  t: (key: string) => string,
  prefix: string,
  values: readonly T[]
): { label: string; value: T }[] {
  return values.map((v) => ({ label: t(`${prefix}.${v}`), value: v }))
}
