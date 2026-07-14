import { serverSupabaseClient } from "#supabase/server"
import { requireAuth } from "../../utils/auth"

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID is required"
    })
  }

  const client = await serverSupabaseClient(event)

  // Verify the resume exists and belongs to the user
  const { data: resume, error: fetchError } = await client
    .from("resumes")
    .select("id")
    .eq("id", id)
    .single()

  if (fetchError) {
    if (fetchError.code === "PGRST116") {
      throw createError({
        statusCode: 404,
        statusMessage: "Resume not found"
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: fetchError.message || "Failed to fetch resume"
    })
  }

  if (!resume) {
    throw createError({
      statusCode: 404,
      statusMessage: "Resume not found"
    })
  }

  // Delete the resume
  const { error: deleteError } = await client.from("resumes").delete().eq("id", id)

  if (deleteError) {
    throw createError({
      statusCode: 500,
      statusMessage: deleteError.message || "Failed to delete resume"
    })
  }

  return { success: true, id }
})
