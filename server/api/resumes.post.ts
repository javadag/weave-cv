import { serverSupabaseClient } from "#supabase/server"
import { CURRENT_SCHEMA_VERSION } from "~/constants/config"
import type { TablesInsert } from "~/types/database.types"
import type { TConfigs } from "~/utils/schemas/configs/configs.schema"
import type { TCoreSections, TPersonalContent } from "~/utils/schemas/content.schema"
import { defineProtectedEventHandler, handleApiError } from "../utils/api"

type CreateResumeBody = {
  title: string
  content: {
    personal: TPersonalContent
    core: TCoreSections
  }
  configs: TConfigs
}

export default defineProtectedEventHandler(async (event, user) => {
  const client = await serverSupabaseClient(event)

  try {
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
  } catch (error) {
    handleApiError(error)
  }
})
