import { serverSupabaseClient } from "#supabase/server"
import type { TablesInsert } from "~/types/database.types"
import type { TResume } from "~/types/resume.types"
import { defineProtectedEventHandler, handleApiError } from "../../../utils/api"

export default defineProtectedEventHandler(async (event, user) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID is required"
    })
  }

  const client = await serverSupabaseClient(event)

  try {
    const { data: originalResume, error: fetchError } = await client
      .from("resumes")
      .select("*")
      .eq("id", id)
      .single()
      .overrideTypes<TResume>()

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

    if (!originalResume) {
      throw createError({
        statusCode: 404,
        statusMessage: "Resume not found"
      })
    }

    const insertData = {
      owner_id: user.id,
      title: originalResume.title,
      content: originalResume.content,
      configs: originalResume.configs,
      schemaVersion: originalResume.schemaVersion
    } as TablesInsert<"resumes">

    const { data: duplicatedResume, error: insertError } = await client
      .from("resumes")
      .insert(insertData)
      .select()
      .single()

    if (insertError) {
      throw createError({
        statusCode: 500,
        statusMessage: insertError.message || "Failed to duplicate resume"
      })
    }

    return duplicatedResume
  } catch (error) {
    handleApiError(error)
  }
})
