import { defineConfig } from "vitest/config";

// Run every package/app test suite from the root with `pnpm vitest`.
// Each project keeps its own vitest.config.ts (defineProject).
// CI uses `pnpm test`, which runs `vitest run` per package through Turbo.
export default defineConfig({
  test: {
    projects: ["packages/*/vitest.config.ts", "apps/*/vitest.config.ts"],
  },
});
