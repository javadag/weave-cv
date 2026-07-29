import { CURRENT_SCHEMA_VERSION } from "~/constants/config"
import { FONT_SLUG_MIGRATION_MAP } from "~/constants/fonts"
import type { TConfigs } from "~/utils/schemas/configs/configs.schema"
import type { TCoreSections, TPersonalContent } from "~/utils/schemas/content.schema"

export type MigrationResult = {
  configs: TConfigs
  content: {
    personal: TPersonalContent
    core: TCoreSections
  }
  migrated: boolean
}

function migrateFromV1ToV2(configs: unknown, content: unknown): MigrationResult {
  const c = configs as { general?: { typography?: { fontFamily?: string } } } | null

  if (c?.general?.typography?.fontFamily) {
    const oldSlug = c.general.typography.fontFamily
    const displayName = FONT_SLUG_MIGRATION_MAP[oldSlug]
    if (displayName) {
      c.general.typography.fontFamily = displayName
    }
  }

  return {
    configs: c as TConfigs,
    content: content as { personal: TPersonalContent; core: TCoreSections },
    migrated: true
  }
}

const MIGRATIONS = new Map<string, (configs: unknown, content: unknown) => MigrationResult>([
  ["1->2", migrateFromV1ToV2]
])

export function migrateResumeData(schemaVersion: number, configs: unknown | null, content: unknown | null) {
  if (schemaVersion === CURRENT_SCHEMA_VERSION) {
    return {
      configs,
      content,
      migrated: false
    }
  }

  if (schemaVersion > CURRENT_SCHEMA_VERSION) {
    console.warn(
      `Resume schema version ${schemaVersion} is higher than current version ${CURRENT_SCHEMA_VERSION}. This may cause compatibility issues.`
    )
    return {
      configs,
      content,
      migrated: false
    }
  }

  let currentConfigs = configs
  let currentContent = content
  let isMigrated = false
  let currentVersion = schemaVersion

  while (currentVersion < CURRENT_SCHEMA_VERSION) {
    const nextVersion = currentVersion + 1
    const migrationKey = `${currentVersion}->${nextVersion}`
    const migrationFunction = MIGRATIONS.get(migrationKey)

    if (migrationFunction) {
      const result = migrationFunction(currentConfigs, currentContent)

      currentConfigs = result.configs
      currentContent = result.content
      isMigrated = isMigrated || result.migrated
      currentVersion = nextVersion
    } else {
      // No migration function found - preserve existing data but mark as migrated
      // This handles cases where version increment doesn't require data changes
      console.warn(`No migration function found for ${migrationKey}. Preserving existing data.`)
      currentVersion = nextVersion
      isMigrated = true
    }
  }

  return {
    configs: currentConfigs,
    content: currentContent,
    migrated: isMigrated
  }
}
