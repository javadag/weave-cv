import { serverSupabaseClient } from "#supabase/server"
import { defineProtectedEventHandler, handleApiError } from "../../../utils/api"

function generateSlug(title: string): string {
  const base =
    title
      .toLowerCase()
      .replaceAll(/[^\w\s-]/g, "")
      .replaceAll(/[\s_]+/g, "-")
      .replaceAll(/^-+|-+$/g, "")
      .slice(0, 80) || "resume"

  // Always append a short random suffix so slugs are unique
  const suffix = crypto.randomUUID().slice(0, 6)
  return `${base}-${suffix}`
}

export default defineProtectedEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID is required" })
  }

  const body = await readBody<{ is_public: boolean }>(event)

  if (typeof body.is_public !== "boolean") {
    throw createError({ statusCode: 400, statusMessage: "is_public must be a boolean" })
  }

  try {
    let updatePayload: { is_public: boolean; slug?: string; public_updated_at?: string }

    if (body.is_public) {
      const { data: resume, error: fetchError } = await client.from("resumes").select("*").eq("id", id).single()

      if (fetchError || !resume) {
        throw createError({ statusCode: 404, statusMessage: "Resume not found" })
      }

      let slug = resume.slug

      if (!slug) {
        const baseSlug = generateSlug(resume.title)

        // Try base slug first, then with random suffixes
        for (let attempt = 0; attempt < 5; attempt++) {
          const candidate = attempt === 0 ? baseSlug : `${baseSlug}-${crypto.randomUUID().slice(0, 4)}`

          const { data: existing } = await client.from("resumes").select("id").eq("slug", candidate).maybeSingle()

          if (!existing) {
            slug = candidate
            break
          }
        }

        if (!slug) {
          slug = crypto.randomUUID().slice(0, 12)
        }
      }

      updatePayload = {
        is_public: true,
        slug,
        public_updated_at: new Date().toISOString()
      }
    } else {
      updatePayload = { is_public: false }
    }

    const { data: updated, error: updateError } = await client
      .from("resumes")
      .update(updatePayload)
      .eq("id", id)
      .select("is_public, slug, public_view_count")
      .single()

    if (updateError) {
      throw createError({ statusCode: 500, statusMessage: updateError.message })
    }

    return {
      is_public: updated.is_public,
      slug: updated.slug,
      public_view_count: updated.public_view_count
    }
  } catch (error) {
    handleApiError(error)
  }
})
