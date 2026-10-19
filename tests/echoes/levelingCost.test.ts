import { describe, it, expect } from "vitest";
import {
  ECHO_LEVEL_EXP,
  FULL_TUNE_RESOURCES,
  echoResources,
  formatResourceAmount,
  fullTuneResourcesPerSuccess,
  resourcesPerSuccess,
  tuneStepExp,
} from "../../src/echoes/levelingCost";

describe("echo leveling cost (5★)", () => {
  it("matches the game's cumulative EXP at each tune level", () => {
    expect([5, 10, 15, 20, 25].map((level) => ECHO_LEVEL_EXP[level])).toEqual([
      4400, 16500, 39600, 79100, 142600,
    ]);
  });

  it("tune steps add up to +25", () => {
    expect([0, 1, 2, 3, 4].reduce((a, i) => a + tuneStepExp(i), 0)).toBe(142600);
    expect(tuneStepExp(0)).toBe(4400);
    expect(tuneStepExp(4)).toBe(142600 - 79100);
  });

  it("Shell Credits: 0.1 per EXP plus 2,000 per tune, as the game totals them", () => {
    // In-game totals with tuning: +5 2,440 · +10 5,650 · +15 9,960 · +20 15,910 · +25 24,260.
    const totals = [1, 2, 3, 4, 5].map((t) => echoResources(ECHO_LEVEL_EXP[5 * t], 10 * t).shellCredits);
    expect(totals.map((c) => Math.round(c))).toEqual([2440, 5650, 9960, 15910, 24260]);
    expect(FULL_TUNE_RESOURCES).toEqual({ exp: 142600, tuners: 50, shellCredits: 24260 });
  });
});

describe("resources per success", () => {
  it("without feeding, an attempt's cost divided by the chance", () => {
    const r = fullTuneResourcesPerSuccess(0.1, false)!;
    expect(r.exp).toBeCloseTo(1_426_000, 6);
    expect(r.tuners).toBeCloseTo(500, 9);
    expect(r.shellCredits).toBeCloseTo(242_600, 6);
  });

  it("feeding returns 75% EXP and 30% tuners of the misses, never Shell Credits", () => {
    // 1 in 10: 9 misses on average, each fed back.
    const r = fullTuneResourcesPerSuccess(0.1, true)!;
    expect(r.exp).toBeCloseTo(1_426_000 - 0.75 * 9 * 142_600, 6);
    expect(r.tuners).toBeCloseTo(500 - 0.3 * 9 * 50, 9);
    expect(r.shellCredits).toBeCloseTo(242_600, 6);
  });

  it("a sure thing costs one echo either way", () => {
    expect(fullTuneResourcesPerSuccess(1, true)).toEqual(FULL_TUNE_RESOURCES);
  });

  it("an impossible goal has no cost per success", () => {
    expect(resourcesPerSuccess(FULL_TUNE_RESOURCES, FULL_TUNE_RESOURCES, 0, true)).toBeNull();
  });
});

describe("formatResourceAmount", () => {
  it("keeps small amounts whole and compacts large ones", () => {
    expect(formatResourceAmount(4400)).toBe("4,400");
    expect(formatResourceAmount(142600)).toBe("142.6K");
    expect(formatResourceAmount(1_426_000)).toBe("1.4M");
  });
});
