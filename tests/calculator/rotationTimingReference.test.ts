import { describe, expect, it } from "vitest";
import { computeRotationTiming } from "@/calculator/rotationTiming";
import { referenceExpectations } from "../fixtures/frames/reference-expectations";
import {
  loadReferenceRotation,
  referenceGaps,
  referenceRotationIds,
  referenceTimingActions,
} from "../fixtures/frames/wuwalabReference";

// Set D (ADR 0047): wuwalab's verified rotations, fetched into a gitignored
// folder with `npm run fixtures:wuwalab`. They're test material only, so on
// a fresh clone (and in CI) these tests skip; sets A-C and E still run.
const ids = referenceRotationIds();

describe.skipIf(ids.length === 0)("timing engine against wuwalab's verified rotations", () => {
  it("has expectations for every reference rotation", () => {
    expect(ids).toEqual(Object.keys(referenceExpectations).map(Number).sort((a, b) => a - b));
  });

  describe.each(ids)("rotation %i", (id) => {
    const rotation = loadReferenceRotation(id);
    const expected = referenceExpectations[id];

    it("reproduces every gap between actions except the known differences", () => {
      const timing = computeRotationTiming(referenceTimingActions(rotation));
      const gaps = referenceGaps(rotation);
      const differing: Record<number, number> = {};
      gaps.forEach((gap, i) => {
        if (timing.actions[i].gameFrames !== gap) differing[rotation.rows[i].index] = gap;
      });
      expect(gaps).toHaveLength(expected.gaps);
      expect(Object.keys(differing).map(Number)).toEqual(Object.keys(expected.differences).map(Number));
      expect(gaps.length - Object.keys(differing).length).toBe(expected.exact);
    });

    it("measures DPS on the clock that skips time stop", () => {
      // wuwalab's DPS is damage ÷ game time; real time would be far longer.
      if (rotation.loopFrames) {
        expect(Math.round(rotation.loopDpr / (rotation.loopFrames / 60))).toBe(rotation.loopDps);
      }
      expect(Math.round(rotation.twoMinDpr / (rotation.totalFrames / 60))).toBe(rotation.twoMinDps);
    });
  });
});
