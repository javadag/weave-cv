import { SECTIONS_REGISTRY } from "~/constants/sections/registry"
import type { TConfigs } from "~/utils/schemas/configs/configs.schema"

type Order = TConfigs["general"]["layout"]["order"]

const KNOWN_TYPES = new Set<string>(Object.keys(SECTIONS_REGISTRY))
const UUID_SUFFIX = /-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function getSectionType(id: string): string {
  if (KNOWN_TYPES.has(id)) return id
  return id.replace(UUID_SUFFIX, "")
}

const dedupe = <T>(arr: T[]): T[] => {
  const seen = new Set<T>()
  const out: T[] = []
  for (const item of arr) {
    if (!seen.has(item)) {
      seen.add(item)
      out.push(item)
    }
  }
  return out
}

export function reconcileSectionsOrder(templateOrder: Order, currentOrder: Order, coreKeys: string[]): Order {
  const coreSet = new Set(coreKeys)
  const orderedUserIds: string[] = []
  const seen = new Set<string>()

  const collect = (id: string) => {
    if (coreSet.has(id) && !seen.has(id)) {
      seen.add(id)
      orderedUserIds.push(id)
    }
  }
  for (const id of currentOrder.twoCol.left) collect(id)
  for (const id of currentOrder.twoCol.right) collect(id)
  for (const id of currentOrder.oneCol) collect(id)
  for (const id of coreKeys) collect(id)

  const byType = new Map<string, string[]>()
  for (const id of orderedUserIds) {
    const type = getSectionType(id)
    const list = byType.get(type) ?? []
    list.push(id)
    byType.set(type, list)
  }

  const used = new Set<string>()
  const expand = (entry: string): string[] => {
    const type = getSectionType(entry)
    const ids = byType.get(type) ?? []
    for (const id of ids) used.add(id)
    return ids
  }

  const oneCol = templateOrder.oneCol.flatMap((entry) => expand(entry))
  const left = templateOrder.twoCol.left.flatMap((entry) => expand(entry))
  const right = templateOrder.twoCol.right.flatMap((entry) => expand(entry))

  const wasInLeft = new Set(currentOrder.twoCol.left)
  const wasInRight = new Set(currentOrder.twoCol.right)

  for (const id of orderedUserIds) {
    if (used.has(id)) continue
    used.add(id)
    if (wasInLeft.has(id)) left.push(id)
    else if (wasInRight.has(id)) right.push(id)
    else right.push(id)
    oneCol.push(id)
  }

  return {
    oneCol: dedupe(oneCol),
    twoCol: { left: dedupe(left), right: dedupe(right) }
  }
}
