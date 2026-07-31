import { serverSupabaseServiceRole } from "#supabase/server"
import { CURRENT_SCHEMA_VERSION } from "~/constants/config"
import { migrateResumeData } from "~/utils/migrations/migrations"
import { checkRateLimit } from "../../../utils/rateLimit"

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug")

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug is required" })
  }

  const forwarded = getHeader(event, "x-forwarded-for") || ""
  const ip = forwarded.split(",")[0]!.trim() || getHeader(event, "x-real-ip") || "unknown"
  checkRateLimit(`public-resume:${slug}:${ip}`, 100, 60_000)

  try {
    const client = serverSupabaseServiceRole(event)

    const { data: resume, error } = await client
      .from("resumes")
      .select("*")
      .eq("slug", slug)
      .eq("is_public", true)
      .single()

    if (error || !resume) {
      throw createError({ statusCode: 404, statusMessage: "Resume not found" })
    }

    const migrationResult = migrateResumeData(resume.schemaVersion as number, resume.configs, resume.content)

    client
      .from("resumes")
      .update({
        public_view_count: ((resume.public_view_count as number) || 0) + 1
      })
      .eq("id", resume.id)
      .then(({ error: updateErr }) => {
        if (updateErr) console.error("Failed to increment view count:", updateErr)
      })

    const { owner_id: _ownerId, ...safeResume } = resume

    return {
      ...safeResume,
      configs: migrationResult.configs,
      content: migrationResult.content,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      migrated: migrationResult.migrated
    }
  } catch (error) {
    const err = error as { statusCode?: number; statusMessage?: string }
    if (err.statusCode) throw error
    console.error("Public resume fetch error:", error)
    throw createError({ statusCode: 500, statusMessage: "Failed to fetch resume" })
  }
})
