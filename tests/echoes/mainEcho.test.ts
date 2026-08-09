import { describe, it, expect } from "vitest";

const { combineEchoStats } = await import("../../src/echoes/mainEcho");

describe("combineEchoStats", () => {
  it("sums combined echo stats and set bonus stats", () => {
    const result = combineEchoStats({ ATK_FLAT: 100 }, { ATK: 0.1 }, { CritRate: 0.05 }, {});
    expect(result).toEqual({ ATK_FLAT: 100, ATK: 0.1, CritRate: 0.05 });
  });

  it("overwrites (does not sum) EnableAttack only for setBonusTwo", () => {
    const result = combineEchoStats(
      {},
      { EnableAttack: ["fromOnePiece"] },
      {},
      { EnableAttack: ["fromTwoSet"] },
    );
    expect(result.EnableAttack).toEqual(["fromTwoSet"]);
  });
});
