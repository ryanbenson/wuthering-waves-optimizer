import { describe, expect, it } from "vitest";
import {
  SCROLL_COLLAPSE_MIN_DELTA_PX,
  SCROLL_COLLAPSE_TOP_PX,
  nextScrollCollapsed,
} from "../../src/composables/useScrollCollapse";

describe("nextScrollCollapsed", () => {
  const below = SCROLL_COLLAPSE_TOP_PX + 200;

  it("collapses on a scroll down past the top", () => {
    expect(nextScrollCollapsed(false, below, below + 40)).toBe(true);
  });

  it("comes back on any real scroll up", () => {
    expect(nextScrollCollapsed(true, below + 40, below)).toBe(false);
  });

  it("always shows near the top, whichever way it moved", () => {
    expect(nextScrollCollapsed(true, 0, SCROLL_COLLAPSE_TOP_PX)).toBe(false);
    expect(nextScrollCollapsed(true, SCROLL_COLLAPSE_TOP_PX + 40, 10)).toBe(false);
  });

  it("keeps its state on a move smaller than the threshold", () => {
    const small = SCROLL_COLLAPSE_MIN_DELTA_PX - 1;
    expect(nextScrollCollapsed(true, below, below - small)).toBe(true);
    expect(nextScrollCollapsed(false, below, below + small)).toBe(false);
  });
});
