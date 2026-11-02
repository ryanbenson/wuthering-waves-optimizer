import { describe, it, expect } from "vitest";
import { useLiveResultStatRows, type LiveResultStatSource } from "../../src/composables/useLiveResultStatRows";
import type { LiveStatValues } from "../../src/calculator/buildOnlyStats";

const live: LiveResultStatSource = {
  totalHp: 14200,
  totalAtk: 3500,
  totalDef: 1150,
  totalCritRate: 0.744,
  totalCritDmg: 2.48,
  energyRegen: 1.12,
  basicAttackDmgBonus: 0,
  heavyAttackDmgBonus: 0,
  resonanceSkillDmgBonus: 37,
  resonanceLiberationDmgBonus: 20,
  healingBonus: 0,
  tuneBreakBoost: 0.1,
  glacio: 0,
  fusion: 90,
  electro: 0,
  aero: 0,
  spectro: 0,
  havoc: 0,
  elementFilter: "Fusion",
};
const build: LiveStatValues = {
  ...live,
  totalAtk: 2000,
  totalCritRate: 0.624,
  resonanceSkillDmgBonus: 12,
  resonanceLiberationDmgBonus: 0,
  fusion: 40,
};

describe("useLiveResultStatRows", () => {
  it("formats values exactly as before", () => {
    const rows = useLiveResultStatRows(() => live).value;
    const byKey = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    expect(byKey).toMatchObject({
      totalHp: "14,200",
      totalAtk: "3,500",
      totalCritRate: "74.4%",
      totalCritDMG: "248.0%",
      energyRegen: "112.0%",
      resonanceSkillDmgBonus: "37.0%",
      healingBonus: "0.0%",
      tuneBreakBoost: "10",
      elementDmgBonus: "90.0%",
    });
    expect(rows.find((row) => row.key === "elementDmgBonus")?.label).toBe("Fusion DMG Bonus");
  });

  it("has no shares until build stats are given", () => {
    const rows = useLiveResultStatRows(() => live).value;
    expect(rows.every((row) => row.share === null)).toBe(true);
  });

  it("adds a share per row once build stats are given", () => {
    const rows = useLiveResultStatRows(() => live, () => build).value;
    const byKey = Object.fromEntries(rows.map((row) => [row.key, row.share]));
    expect(byKey.totalAtk).toMatchObject({ hasBuffs: true, buildText: "2,000", buffsText: "+1,500" });
    expect(byKey.totalCritRate).toMatchObject({ buffsText: "+12.0%" });
    expect(byKey.elementDmgBonus).toMatchObject({ buildText: "40.0%", buffsText: "+50.0%" });
    expect(byKey.resonanceLiberationDmgBonus).toMatchObject({ build: 0, buffs: 1 });
    expect(byKey.totalHp).toMatchObject({ hasBuffs: false, build: 1, buffs: 0 });
    // zero stat: nothing to draw
    expect(byKey.basicAttackDmgBonus).toBeNull();
  });
});
