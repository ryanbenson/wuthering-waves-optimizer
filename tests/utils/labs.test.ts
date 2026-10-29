import { describe, it, expect } from "vitest";
import { FRAME_TIMING_LAB, isFrameTimingEnabled, isLabEnabled } from "../../src/utils/labs";

describe("labs flags", () => {
  it("is on only when the lab is explicitly enabled", () => {
    expect(isFrameTimingEnabled({ labs: { [FRAME_TIMING_LAB]: { isEnabled: true } } })).toBe(true);
    expect(isFrameTimingEnabled({ labs: { [FRAME_TIMING_LAB]: { isEnabled: false } } })).toBe(false);
    expect(isFrameTimingEnabled({ labs: {} })).toBe(false);
    expect(isFrameTimingEnabled({})).toBe(false);
  });

  it("keeps labs independent of each other", () => {
    expect(isLabEnabled({ labs: { other: { isEnabled: true } } }, FRAME_TIMING_LAB)).toBe(false);
  });
});
