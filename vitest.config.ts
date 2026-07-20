import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@fdi/shared-types": fileURLToPath(
        new URL("./packages/shared-types/src/index.ts", import.meta.url),
      ),
      "@fdi/draft-engine": fileURLToPath(
        new URL("./packages/draft-engine/src/index.ts", import.meta.url),
      ),
      "@fdi/recommendation-engine": fileURLToPath(
        new URL("./packages/recommendation-engine/src/index.ts", import.meta.url),
      ),
    },
  },
  test: {
    include: ["packages/**/tests/**/*.test.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
