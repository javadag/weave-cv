export type DeepPartial<T> = T extends (infer _U)[] ? T : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype

export function mergeConfigs<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (override === undefined) return base
  const baseRec = base as unknown
  const overrideRec = override as unknown
  if (!isPlainObject(baseRec) || !isPlainObject(overrideRec)) return base
  const out: Record<string, unknown> = { ...baseRec }
  for (const [key, overrideVal] of Object.entries(overrideRec)) {
    if (overrideVal === undefined) continue
    const baseVal = out[key]
    out[key] = isPlainObject(baseVal) && isPlainObject(overrideVal) ? mergeConfigs(baseVal, overrideVal) : overrideVal
  }
  return out as T
}
