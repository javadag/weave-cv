import { serverSupabaseClient } from "#supabase/server"
import { CURRENT_SCHEMA_VERSION } from "~/constants/config"
import type { Json } from "~/types/database.types"
import { migrateResumeData } from "~/utils/migrations/migrations"
import { defineProtectedEventHandler, handleApiError } from "../../utils/api"

export default defineProtectedEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID is required"
    })
  }

  try {
    const { data: resume, error } = await client
      .from("resumes")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        throw createError({
          statusCode: 404,
          statusMessage: "Resume not found"
        })
      }
      throw createError({
        statusCode: 500,
        statusMessage: error.message || "Failed to fetch resume"
      })
    }

    if (!resume) {
      throw createError({
        statusCode: 404,
        statusMessage: "Resume not found"
      })
    }

    const migrationResult = migrateResumeData(resume.schemaVersion, resume.configs, resume.content)

    if (migrationResult.migrated) {
      const { error: updateError } = await client
        .from("resumes")
        .update({
          configs: migrationResult.configs as Json,
          content: migrationResult.content as Json,
          schemaVersion: CURRENT_SCHEMA_VERSION,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)

      if (updateError) {
        console.error("Failed to update migrated resume:", updateError)
      }
    }

    return {
      ...resume,
      configs: migrationResult.configs,
      content: migrationResult.content,
      schemaVersion: CURRENT_SCHEMA_VERSION
    }
  } catch (error) {
    handleApiError(error)
  }
})
