import { describe, it, expect } from "vitest";
import { buildTradeoffPoints } from "../../src/components/optimizerWorkspace/optimizerTradeoffPoints";

const row = (targetValue: number, er: number, isCurrent = false) => ({
  targetValue,
  isCurrent,
  context: { finalStats: { energyRegen: er, totalCritRate: 0.7, totalCritDMG: 2.2, totalAtk: 3000 } },
});

describe("buildTradeoffPoints", () => {
  it("maps fractions to percent and preserves index", () => {
    const [p0, p1] = buildTradeoffPoints([row(120, 1.208), row(110, 1.0)]);
    expect(p0.x).toBeCloseTo(120.8);
    expect(p0.stats.totalAtk).toBe(3000);
    expect([p0.index, p1.index]).toEqual([0, 1]);
    expect(p0.y).toBe(120);
  });

  it("flags current and computes delta vs it", () => {
    const pts = buildTradeoffPoints([row(120, 1.2), row(100, 1.1, true)]);
    expect(pts.map((p) => p.isCurrent)).toEqual([false, true]);
    expect(pts[0].deltaPercent).toBeCloseTo(20);
    expect(pts[1].deltaPercent).toBeCloseTo(0);
  });

  it("delta is null without a current row", () => {
    expect(buildTradeoffPoints([row(120, 1.2)])[0].deltaPercent).toBeNull();
  });
});
