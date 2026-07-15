import type { serverSupabaseClient } from "#supabase/server"
import type { Database } from "~/types/database.types"

export async function checkResumeLimit(
  client: Awaited<ReturnType<typeof serverSupabaseClient<Database>>>,
  userId: string,
  action: "creating" | "duplicating" = "creating"
) {
  // Resume limit has been removed — this function is kept as a no-op
  // in case it is re-enabled in the future.
}
