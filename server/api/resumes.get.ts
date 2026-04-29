import { serverSupabaseClient } from "#supabase/server"
import { CURRENT_SCHEMA_VERSION } from "~/constants/config"
import type { Json } from "~/types/database.types"
import { migrateResumeData } from "~/utils/migrations/migrations"
import { requireAuth } from "../utils/auth"

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await requireAuth(event)

  try {
    const { data: resumes, error } = await client
      .from("resumes")
      .select("*")
      .eq("owner_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || "Failed to fetch resumes"
      })
    }

    if (!resumes) {
      return []
    }

    const migratedResumes = await Promise.all(
      resumes.map(async (resume) => {
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
            .eq("id", resume.id)
            .eq("owner_id", user.id)

          if (updateError) {
            console.error(`Failed to update migrated resume ${resume.id}:`, updateError)
          }
        }

        return {
          ...resume,
          configs: migrationResult.configs,
          content: migrationResult.content,
          schemaVersion: CURRENT_SCHEMA_VERSION
        }
      })
    )

    return migratedResumes
  } catch (error: unknown) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error
    }
    const err = error as { statusCode?: number; statusMessage?: string }
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || "Internal server error"
    })
  }
})
