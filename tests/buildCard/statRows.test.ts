import { describe, expect, it } from "vitest";
import { buildCardStatRows } from "../../src/buildCard/statRows";
import { getElementAccent, getElementIcon, FALLBACK_ACCENT } from "../../src/buildCard/theme";
import { getEchoCritValue } from "../../src/composables/useEchoCardStats";

const STATS = {
  totalHp: 16456.9,
  totalAtk: 2088.4,
  totalDef: 1224,
  critRate: 87.7,
  critDMG: 277.4,
  energyRegen: 1,
  aero: 82,
  fusion: 40,
  basicAttackDMGBonus: 7.1,
  heavyAttackDMGBonus: 22.9,
  resonanceSkillDMGBonus: 7.1,
  resonanceLiberationDMGBonus: 27,
  healingBonus: 0,
};

describe("buildCardStatRows", () => {
  const rows = buildCardStatRows(STATS, "Aero", 0.5);
  const byKey = Object.fromEntries(rows.map((row) => [row.key, row]));

  it("formats each stat in the units the stats table always used", () => {
    expect(byKey.hp.value).toBe("16,456");
    expect(byKey.atk.value).toBe("2,088");
    expect(byKey.critRate.value).toBe("87.7%");
    expect(byKey.critDMG.value).toBe("277.4%");
    expect(byKey.energyRegen.value).toBe("100.0%");
    expect(byKey.aero.value).toBe("82.0%");
    expect(byKey.healingBonus.value).toBe("0.0%");
    expect(byKey.tuneBreakBoost.value).toBe("50");
  });

  it("shows only the character's own element bonus", () => {
    expect(byKey.aero).toBeTruthy();
    expect(byKey.fusion).toBeUndefined();
    expect(rows.filter((row) => row.label.endsWith("DMG Bonus") && /Glacio|Fusion|Electro|Spectro|Havoc/.test(row.label))).toEqual([]);
  });

  it("marks zero stats and keeps short labels for narrow lists", () => {
    expect(byKey.healingBonus.isZero).toBe(true);
    expect(byKey.hp.isZero).toBe(false);
    expect(byKey.resonanceLiberationDMGBonus.shortLabel).toBe("Liberation DMG");
    expect(byKey.aero.shortLabel).toBe("Aero DMG");
  });

  it("splits base stats from bonuses", () => {
    expect(rows.filter((row) => row.group === "base").map((row) => row.key)).toEqual([
      "hp", "atk", "def", "critRate", "critDMG", "energyRegen",
    ]);
  });
});

describe("element theme", () => {
  it("has an icon and accent per element and a fallback accent", () => {
    expect(getElementIcon("Aero")).toContain("aerodmgbonus.png");
    expect(getElementIcon(null)).toBeNull();
    expect(getElementAccent("Aero")).toMatch(/^#[0-9a-f]{6}$/);
    expect(getElementAccent(undefined)).toBe(FALLBACK_ACCENT);
  });
});

describe("getEchoCritValue", () => {
  it("sums 2x crit rate plus crit DMG across substats only", () => {
    expect(
      getEchoCritValue({
        stat: "CritRate",
        echoSubStatsType1: "CritRate",
        echoSubStatsValue1: 7.5,
        echoSubStatsType2: "CritDMG",
        echoSubStatsValue2: "15",
        echoSubStatsType3: "ATK",
        echoSubStatsValue3: 9.4,
      }),
    ).toBeCloseTo(30);
    expect(getEchoCritValue(null)).toBe(0);
  });
});
