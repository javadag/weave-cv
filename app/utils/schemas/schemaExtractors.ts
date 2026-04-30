import { z } from "zod"

function extractNumberConstraints(schema: z.ZodNumber): { min?: number; max?: number } {
  const checks = schema.def.checks || []

  let min: number | undefined
  let max: number | undefined

  const minCheck = checks?.find((check) => check._zod.def.check === "greater_than")

  if (minCheck && "value" in minCheck._zod.def) {
    min = minCheck._zod.def.value as number
  }

  const maxCheck = checks?.find((check) => check._zod.def.check === "less_than")

  if (maxCheck && "value" in maxCheck._zod.def) {
    max = maxCheck._zod.def.value as number
  }

  return { min, max }
}

export function extractNumberConstraintsFromPath(
  parentSchema: z.ZodPrefault<z.ZodObject<Record<string, z.ZodTypeAny>>> | z.ZodObject<Record<string, z.ZodTypeAny>>,
  path: string
) {
  const shape = parentSchema instanceof z.ZodPrefault ? parentSchema.unwrap().shape : parentSchema.shape
  const fieldSchema = shape[path]

  if (fieldSchema && fieldSchema instanceof z.ZodNumber) {
    return extractNumberConstraints(fieldSchema)
  }

  return {}
}
