import { CURRENT_SCHEMA_VERSION } from "~/constants/config"
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

/**
 * Migration from version 1 to version 2
 * This is a template for future migrations
 * Uncomment and add to MIGRATIONS map when version 2 is needed
 */
// function migrateFromV1ToV2(configs: unknown, content: unknown): MigrationResult {}

const MIGRATIONS = new Map<string, (configs: unknown, content: unknown) => MigrationResult>([
  // ["1->2", migrateFromV1ToV2],
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
  let migrated = false
  let currentVersion = schemaVersion

  while (currentVersion < CURRENT_SCHEMA_VERSION) {
    const nextVersion = currentVersion + 1
    const migrationKey = `${currentVersion}->${nextVersion}`
    const migrationFunction = MIGRATIONS.get(migrationKey)

    if (migrationFunction) {
      const result = migrationFunction(currentConfigs, currentContent)

      currentConfigs = result.configs
      currentContent = result.content
      migrated = migrated || result.migrated
      currentVersion = nextVersion
    } else {
      // No migration function found - preserve existing data but mark as migrated
      // This handles cases where version increment doesn't require data changes
      console.warn(`No migration function found for ${migrationKey}. Preserving existing data.`)
      currentVersion = nextVersion
      migrated = true
    }
  }

  return {
    configs: currentConfigs,
    content: currentContent,
    migrated
  }
}
