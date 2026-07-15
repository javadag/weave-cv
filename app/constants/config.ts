import pkg from "../../package.json"

/**
 * Schema version history:
 * - Version 1: Initial version
 * - Version 2: fontFamily stored as display name (e.g. "Inter") instead of slug (e.g. "inter")
 *
 * When updating the version, you should:
 * 1. Increment CURRENT_SCHEMA_VERSION
 * 2. Create a migration function in utils/migrations/migrations.ts
 * 3. Add the migration to the MIGRATIONS map
 * 4. Update this documentation
 */

export const CURRENT_SCHEMA_VERSION = 2

// App version is the single source of truth in package.json so `pnpm release:*`
// (changelogen) bumps it and the UI follows automatically.
export const APP_VERSION = pkg.version
export const CONTACT_EMAIL = "hello@weavecv.app"

export const MAX_RESUMES = Number.MAX_SAFE_INTEGER
