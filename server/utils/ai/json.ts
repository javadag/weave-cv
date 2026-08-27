export function parseJsonLoose<T>(raw: string): T {
  const tryParse = (s: string): T | undefined => {
    try {
      return JSON.parse(s) as T
    } catch {
      return undefined
    }
  }
  const direct = tryParse(raw)
  if (direct) return direct
  // strip markdown fences
  const noFences = raw.replace(/```(?:json)?\s*/g, "").replace(/```/g, "").trim()
  const fenced = tryParse(noFences)
  if (fenced) return fenced
  // last {...} block
  const block = raw.match(/\{[\s\S]*\}/)
  if (block) {
    const internal = tryParse(block[0])
    if (internal) return internal
  }
  throw new Error("Could not parse model output as JSON")
}

export function jsonSize(obj: unknown): number {
  return JSON.stringify(obj ?? {}).length
}

export function assertCustomBaseUrl(u: string): boolean {
  return u.trim().startsWith("https://")
}