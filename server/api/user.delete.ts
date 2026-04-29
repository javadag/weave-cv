import { serverSupabaseServiceRole } from "#supabase/server"
import { requireAuth } from "../utils/auth"

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const adminClient = serverSupabaseServiceRole(event)

  const { error: resumesError } = await adminClient.from("resumes").delete().eq("owner_id", user.id)

  if (resumesError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to delete user data" })
  }

  const { error } = await adminClient.auth.admin.deleteUser(user.id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to delete account" })
  }

  return { success: true }
})
