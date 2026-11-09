import { describe, expect, it } from "vitest";
import {
  BUILD_CARD_LAYOUTS,
  DEFAULT_BUILD_CARD_LAYOUT,
  resolveBuildCardLayout,
} from "../../src/buildCard/layouts";

describe("resolveBuildCardLayout", () => {
  it("defaults to Columns", () => {
    expect(DEFAULT_BUILD_CARD_LAYOUT).toBe("columns");
    expect(resolveBuildCardLayout(undefined)).toBe("columns");
    expect(resolveBuildCardLayout(null)).toBe("columns");
  });

  it("keeps every known layout", () => {
    for (const layout of BUILD_CARD_LAYOUTS) {
      expect(resolveBuildCardLayout(layout.id)).toBe(layout.id);
    }
  });

  it("falls back to the default for an unknown saved value", () => {
    expect(resolveBuildCardLayout("glass")).toBe("columns");
    expect(resolveBuildCardLayout(3)).toBe("columns");
  });
});
