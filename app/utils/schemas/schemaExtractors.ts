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
  let fieldSchema = shape[path]

  if (!fieldSchema) return {}

  // Unwrap ZodDefault / ZodPrefault to get the underlying schema
  while (typeof (fieldSchema as any).unwrap === "function") {
    fieldSchema = (fieldSchema as any).unwrap()
  }

  if (fieldSchema instanceof z.ZodNumber) {
    return extractNumberConstraints(fieldSchema)
  }

  // Nested z.object with number fields (e.g. { left: z.number(), right: z.number() })
  if (fieldSchema instanceof z.ZodObject) {
    const firstNumberField = Object.values(fieldSchema.shape).find((field) => {
      let f = field
      while (typeof (f as any).unwrap === "function") f = (f as any).unwrap()
      return f instanceof z.ZodNumber
    })

    if (firstNumberField) {
      let unwrapped: any = firstNumberField
      while (typeof unwrapped.unwrap === "function") unwrapped = unwrapped.unwrap()
      return extractNumberConstraints(unwrapped)
    }
  }

  return {}
}
