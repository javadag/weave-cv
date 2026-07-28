import { serverSupabaseClient } from "#supabase/server"
import { CURRENT_SCHEMA_VERSION } from "~/constants/config"
import type { Json, TablesUpdate } from "~/types/database.types"
import type { TConfigs } from "~/utils/schemas/configs/configs.schema"
import type { TCoreSections, TPersonalContent } from "~/utils/schemas/content.schema"
import { defineProtectedEventHandler } from "../../utils/api"

type UpdateResumeBody = {
  title: string
  content: {
    personal: TPersonalContent
    core: TCoreSections
  }
  configs: TConfigs
}

export default defineProtectedEventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID is required"
    })
  }

  const body = await readBody<UpdateResumeBody>(event)

  if (!body.title || typeof body.title !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Title is required and must be a string"
    })
  }

  const trimmedTitle = body.title.trim()

  if (!trimmedTitle) {
    throw createError({
      statusCode: 400,
      statusMessage: "Title cannot be empty"
    })
  }

  const client = await serverSupabaseClient(event)

  const updateData: TablesUpdate<"resumes"> = {
    updated_at: new Date().toISOString(),
    content: body.content as Json,
    configs: body.configs as Json,
    title: trimmedTitle,
    schemaVersion: CURRENT_SCHEMA_VERSION
  }

  const { data: resume, error } = await client
    .from("resumes")
    .update(updateData)
    .eq("id", id)
    .select()
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
      statusMessage: error.message || "Failed to update resume"
    })
  }

  return resume
})
