import { describe, expect, it } from "vitest";

import { TYPES_PACKAGE } from "./index.js";

describe("@cafe/types", () => {
  it("exports the package marker", () => {
    expect(TYPES_PACKAGE).toBe("@cafe/types");
  });
});
