// Sliding-window in-memory rate limiter keyed by an arbitrary string (e.g. "ai:<userId>").
// Suitable for single-process deployments; if you add multiple instances / serverless
// replicas, back this with a shared store (Redis, KV, Supabase) instead.

interface WindowEntry {
  timestamps: number[]
}

const store = new Map<string, WindowEntry>()

/**
 * Throws 429 if `key` has exceeded `limit` calls within the last `windowMs` ms.
 * Records the current call on every successful pass.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): void {
  if (process.env.DISABLE_RATE_LIMIT === "true") return

  const now = Date.now()
  const cutoff = now - windowMs

  const entry = store.get(key) ?? { timestamps: [] }
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff)

  if (entry.timestamps.length >= limit) {
    const oldestInWindow = entry.timestamps[0]!
    const retryAfterSec = Math.ceil((oldestInWindow - cutoff) / 1000)
    throw createError({
      statusCode: 429,
      statusMessage: `Too many requests. Please wait ${retryAfterSec} seconds and try again.`
    })
  }

  entry.timestamps.push(now)
  store.set(key, entry)
}
