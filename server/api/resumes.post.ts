import { serverSupabaseClient } from "#supabase/server"
import { CURRENT_SCHEMA_VERSION } from "~/constants/config"
import type { TablesInsert } from "~/types/database.types"
import type { TConfigs } from "~/utils/schemas/configs/configs.schema"
import type { TCoreSections, TPersonalContent } from "~/utils/schemas/content.schema"
import { requireAuth } from "../utils/auth"
import { checkResumeLimit } from "../utils/resumes"

type CreateResumeBody = {
  title: string
  content: {
    personal: TPersonalContent
    core: TCoreSections
  }
  configs: TConfigs
}

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await requireAuth(event)

  try {
    await checkResumeLimit(client, user.id, "creating")

    const body = await readBody<CreateResumeBody>(event)

    const insertData: TablesInsert<"resumes"> = {
      owner_id: user.id,
      title: body.title,
      content: body.content,
      configs: body.configs,
      schemaVersion: CURRENT_SCHEMA_VERSION
    }

    const { data, error } = await client.from("resumes").insert(insertData).select().single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || "Failed to create resume"
      })
    }

    return data
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
