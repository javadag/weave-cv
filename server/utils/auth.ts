import { serverSupabaseUser } from "#supabase/server"
import type { EventHandlerRequest, H3Event } from "h3"

export async function requireAuth(event: H3Event<EventHandlerRequest>) {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    })
  }

  if (!user.id && user.sub) {
    user.id = user.sub
  }

  return user
}
