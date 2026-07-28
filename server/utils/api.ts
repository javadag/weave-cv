import type { EventHandlerRequest, H3Event } from "h3"
import { requireAuth } from "./auth"

export function handleApiError(error: unknown): never {
  if (error && typeof error === "object" && "statusCode" in error) {
    throw error
  }
  const err = error as { statusCode?: number; statusMessage?: string }
  throw createError({
    statusCode: err.statusCode || 500,
    statusMessage: err.statusMessage || "Internal server error"
  })
}

export function defineProtectedEventHandler(
  handler: (event: H3Event<EventHandlerRequest>, user: Awaited<ReturnType<typeof requireAuth>>) => Promise<unknown>
) {
  return defineEventHandler(async (event) => {
    const user = await requireAuth(event)
    return handler(event, user)
  })
}
