import type { serverSupabaseClient } from "#supabase/server"
import { MAX_RESUMES } from "~/constants/limits"
import type { Database } from "~/types/database.types"

export async function checkResumeLimit(
  client: Awaited<ReturnType<typeof serverSupabaseClient<Database>>>,
  userId: string,
  action: "creating" | "duplicating" = "creating"
) {
  const { count, error: countError } = await client
    .from("resumes")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", userId)

  if (countError) {
    throw createError({
      statusCode: 500,
      statusMessage: countError.message || "Failed to check resume count"
    })
  }

  if (count !== null && count >= MAX_RESUMES) {
    const actionText = action === "creating" ? "creating a new one" : "duplicating"
    throw createError({
      statusCode: 403,
      statusMessage: `You have reached the maximum limit of ${MAX_RESUMES} resumes. Please delete an existing resume before ${actionText}.`
    })
  }
}
