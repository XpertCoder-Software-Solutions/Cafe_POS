import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    name: "@cafe/types",
    include: ["src/**/*.test.ts"],
  },
});
