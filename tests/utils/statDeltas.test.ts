import { describe, it, expect } from "vitest";
import {
  getStatDeltas,
  pickStatParts,
  statDeltaKeyForTarget,
  type StatDeltaSource,
} from "../../src/utils/statDeltas";

// Issue #746: the optimizer shows both how much a whole stat changes and how
// much the stat itself moves.
const current: StatDeltaSource = {
  totalHp: 17181,
  totalAtk: 2203,
  totalDef: 1105,
  totalCritRate: 0.802,
  totalCritDMG: 2.384,
  energyRegen: 1.306,
  hpPercent: 30.1,
  hpFlat: 2580,
  attackPercent: 60,
  attackFlat: 350,
  defPercent: 21.8,
  defFlat: 0,
};

const result: StatDeltaSource = {
  totalHp: 16118,
  totalAtk: 2211,
  totalDef: 1000,
  totalCritRate: 0.721,
  totalCritDMG: 2.558,
  energyRegen: 1.29,
  hpPercent: 20,
  hpFlat: 2580,
  attackPercent: 60.8,
  attackFlat: 350,
  defPercent: 10,
  defFlat: 0,
};

const texts = (parts: { label: string; delta: { text: string } }[]) =>
  parts.map((p) => `${p.label} ${p.delta.text}`);

describe("getStatDeltas", () => {
  it("keeps the total change relative, as the tiles always showed", () => {
    const d = getStatDeltas(result, current);
    expect(d.critRate.totalPercent).toBeCloseTo(-10.1, 1);
    expect(d.hp.totalPercent).toBeCloseTo(-6.19, 2);
  });

  it("gives Crit Rate, Crit DMG and Energy Regen in points of the final value", () => {
    const d = getStatDeltas(result, current);
    expect(texts(d.critRate.parts)).toEqual(["Stat -8.1%"]);
    expect(texts(d.critDmg.parts)).toEqual(["Stat +17.4%"]);
    expect(texts(d.energyRegen.parts)).toEqual(["Stat -1.6%"]);
  });

  it("splits HP, ATK and DEF into %-stat and flat-stat changes", () => {
    const d = getStatDeltas(result, current);
    expect(texts(d.hp.parts)).toEqual(["HP% -10.1%", "Flat 0"]);
    expect(texts(d.atk.parts)).toEqual(["ATK% +0.8%", "Flat 0"]);
    expect(texts(d.def.parts)).toEqual(["DEF% -11.8%", "Flat 0"]);
  });

  it("marks a change that rounds away as neutral with no sign", () => {
    const d = getStatDeltas(
      { ...result, attackFlat: 350.4, totalCritRate: 0.80201 },
      current,
    );
    expect(d.atk.parts[1].delta).toEqual({ text: "0", tone: "neutral" });
    expect(d.critRate.parts[0].delta).toEqual({ text: "0.0%", tone: "neutral" });
  });

  it("skips the split when either side doesn't have it", () => {
    const { hpPercent: _hp, ...noSplit } = current;
    expect(getStatDeltas(result, noSplit).hp.parts).toEqual([]);
    expect(getStatDeltas({ totalHp: 1 }, current).hp.parts).toEqual([]);
  });

  it("reads a zero current total as no change instead of dividing by zero", () => {
    expect(getStatDeltas(result, { ...current, totalHp: 0 }).hp.totalPercent).toBe(0);
  });
});

describe("pickStatParts", () => {
  it("takes only the %/flat pools", () => {
    expect(pickStatParts(current)).toEqual({
      hpPercent: 30.1,
      hpFlat: 2580,
      attackPercent: 60,
      attackFlat: 350,
      defPercent: 21.8,
      defFlat: 0,
    });
    expect(pickStatParts(null).hpPercent).toBeUndefined();
  });
});

describe("statDeltaKeyForTarget", () => {
  it("maps optimizer stat targets and ignores others", () => {
    expect(statDeltaKeyForTarget("totalCritRate")).toBe("critRate");
    expect(statDeltaKeyForTarget("totalCritDMG")).toBe("critDmg");
    expect(statDeltaKeyForTarget("energyRegen")).toBe("energyRegen");
    expect(statDeltaKeyForTarget("totalHp")).toBe("hp");
    expect(statDeltaKeyForTarget("Attack")).toBeNull();
  });
});
