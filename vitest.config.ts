import { defineConfig } from "vitest/config"
import path from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.spec.ts"],
    globals: false
  },
  resolve: {
    alias: {
      "~": path.join(rootDir, "app"),
      "@": path.join(rootDir, "app"),
      "@@": path.join(rootDir, "app")
    }
  }
})