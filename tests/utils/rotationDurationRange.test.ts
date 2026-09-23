import { describe, it, expect } from "vitest";
import { getDurationPool, resolveDurationTargetIds } from "../../src/utils/rotationDurationRange";

const rangeActions = [
  { id: "a", characterName: "Rover", key: "basic1" },
  { id: "b", characterName: "Verina", key: null },
  { id: "c", characterName: "Rover", key: "skill" },
  { id: "d", characterName: "Rover", key: "liberation" },
];

describe("getDurationPool", () => {
  it("starts at the given action and labels relative offsets", () => {
    expect(getDurationPool(rangeActions, "b")).toEqual([
      { id: "b", label: "This action — Verina: unconfigured" },
      { id: "c", label: "+1 — Rover: skill" },
      { id: "d", label: "+2 — Rover: liberation" },
    ]);
  });

  it("falls back to the whole list for an unknown action id", () => {
    expect(getDurationPool(rangeActions, "zzz").map((a) => a.id)).toEqual(["a", "b", "c", "d"]);
  });
});

describe("resolveDurationTargetIds", () => {
  const pool = getDurationPool(rangeActions, "a");

  it("count mode takes the first N actions, clamped to the pool", () => {
    expect(resolveDurationTargetIds(pool, "count", 2, null)).toEqual(["a", "b"]);
    expect(resolveDurationTargetIds(pool, "count", 99, null)).toEqual(["a", "b", "c", "d"]);
    expect(resolveDurationTargetIds(pool, "count", 0, null)).toEqual(["a"]);
  });

  it("until mode is inclusive of the chosen action", () => {
    expect(resolveDurationTargetIds(pool, "until", 1, "c")).toEqual(["a", "b", "c"]);
  });

  it("until mode with an unknown target covers the whole pool", () => {
    expect(resolveDurationTargetIds(pool, "until", 1, null)).toEqual(["a", "b", "c", "d"]);
  });
});
