import { serverSupabaseClient } from "#supabase/server"
import { defineProtectedEventHandler } from "../../utils/api"

export default defineProtectedEventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID is required"
    })
  }

  const client = await serverSupabaseClient(event)

  const { error: deleteError } = await client.from("resumes").delete().eq("id", id)

  if (deleteError) {
    if (deleteError.code === "PGRST116") {
      throw createError({
        statusCode: 404,
        statusMessage: "Resume not found"
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: deleteError.message || "Failed to delete resume"
    })
  }

  return { success: true, id }
})
