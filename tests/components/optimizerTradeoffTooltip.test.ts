import { describe, it, expect } from "vitest";
import {
  getTooltipStatLines,
  placeTooltip,
} from "../../src/components/optimizerWorkspace/optimizerTradeoffTooltip";
import { statWithDelta } from "../../src/utils/statDelta";
import { characterSubstatPriorities } from "../../src/characters/substatPriorities";

const labels = (weights: Record<string, number> | null, element: string) =>
  getTooltipStatLines(weights, element).map((line) => line.label);

describe("getTooltipStatLines", () => {
  it("shows ER, the character's weighted stats in a fixed order, then its element", () => {
    expect(labels(characterSubstatPriorities.Hiyuki as Record<string, number>, "Glacio")).toEqual([
      "ER", "CR", "CD", "ATK", "Lib DMG", "Glacio DMG",
    ]);
  });

  it("follows the character's scaling stat (DEF for Mornye)", () => {
    const mornye = labels(characterSubstatPriorities.Mornye as Record<string, number>, "Fusion");
    expect(mornye).toContain("DEF");
    expect(mornye).not.toContain("HP");
  });

  it("falls back to ER, CR, CD, ATK without weights", () => {
    expect(labels(null, "Spectro")).toEqual(["ER", "CR", "CD", "ATK", "Spectro DMG"]);
  });
});

describe("statWithDelta", () => {
  const [er, , , atk] = getTooltipStatLines(null, null);

  it("gives VALUE and a signed DELTA in the stat's own unit", () => {
    expect(statWithDelta(er, 1.208, 1.308)).toEqual({ text: "120.8%", delta: expect.closeTo(-10), deltaText: "-10.0%" });
    expect(statWithDelta(atk, 2436.9, 2400)).toMatchObject({ text: "2,436", deltaText: "+36" });
  });

  it("has no delta when there is no current set", () => {
    expect(statWithDelta(er, 1.208, null)).toEqual({ text: "120.8%", delta: null, deltaText: null });
  });
});

describe("placeTooltip", () => {
  const size = { width: 300, height: 200 };
  const viewport = { width: 1000, height: 800 };

  it("goes right of the mouse when it fits, centred vertically", () => {
    expect(placeTooltip({ x: 100, y: 400 }, size, viewport)).toEqual({ left: 120, top: 300 });
  });

  it("goes left near the right edge", () => {
    expect(placeTooltip({ x: 900, y: 400 }, size, viewport)).toEqual({ left: 588, top: 300 });
  });

  it("goes below when neither side fits, clear of the pointer", () => {
    expect(placeTooltip({ x: 500, y: 100 }, { width: 700, height: 200 }, viewport)).toEqual({ left: 150, top: 128 });
  });

  it("goes above when below doesn't fit either", () => {
    expect(placeTooltip({ x: 500, y: 700 }, { width: 700, height: 200 }, viewport)).toEqual({ left: 150, top: 488 });
  });

  it("stays inside the window when nothing fits", () => {
    const { left, top } = placeTooltip({ x: 10, y: 10 }, { width: 990, height: 790 }, viewport);
    expect(left).toBeGreaterThanOrEqual(0);
    expect(top).toBeGreaterThanOrEqual(0);
  });
});
