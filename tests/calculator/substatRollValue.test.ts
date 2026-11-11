import { describe, it, expect } from "vitest";
import type { TeamEnemyConfig } from "../../src/calculator/buildCharacterContext";
import { calcCharacterRotationDamage } from "../../src/calculator/characterRotation";
import {
  createSubstatMeasurer,
  estimateSubstatRollValues,
  formatRollGain,
  formatRollSize,
  formatTopRollChance,
  substatValueStep,
  topSubstatRoll,
  typicalSubstatRoll,
} from "../../src/echoes/substatRollValue";
import { subStats } from "../../src/echoes/stats";

const enemyConfig: TeamEnemyConfig = { enemyLevel: 90, enemyResist: 0.1, enemyType: "Calamity" };

const ROTATION = {
  id: "r1",
  name: "Test rotation",
  duration: 10,
  actions: [{ id: "a1", type: "basic", key: "MoonringBasicAttack1DMG", count: 1 }],
};

const INVENTORY = [
  { echo: "Main4", type: 4, echoId: "e0", echoSet: "TestSet", rank: 5, stat: "CritRate", echoSubStatsType1: "ATK", echoSubStatsValue1: 10 },
  { echo: "ThreeA", type: 3, echoId: "e1", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "CritDMG", echoSubStatsValue1: 12.6 },
  { echo: "ThreeB", type: 3, echoId: "e2", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "CritRate", echoSubStatsValue1: 6.3 },
  { echo: "OneA", type: 1, echoId: "e3", echoSet: "TestSet", rank: 5, stat: "ATK" },
  { echo: "OneB", type: 1, echoId: "e4", echoSet: "TestSet", rank: 5, stat: "ATK" },
];

function iuno(extra: Record<string, any> = {}) {
  return {
    Iuno: {
      rotations: [ROTATION],
      echoes: { 0: { echoId: "e0" }, 1: { echoId: "e1" }, 2: { echoId: "e2" }, 3: { echoId: "e3" }, 4: { echoId: "e4" } },
      ...extra,
    },
  };
}

const target = "Rotation:r1";

async function damage(characters: Record<string, any>, inventory = INVENTORY) {
  const result = await calcCharacterRotationDamage(ROTATION, null, "Iuno", characters, enemyConfig, inventory);
  return result.damageAggregation.avgDamage;
}

describe("typicalSubstatRoll", () => {
  it("weights each roll value by how often it drops", () => {
    // Crit rolls skew low: the three lowest values are 70% of drops.
    expect(typicalSubstatRoll("CritRate")).toBeCloseTo(7.53, 2);
    expect(typicalSubstatRoll("CritDMG")).toBeCloseTo(15.06, 2);
    expect(typicalSubstatRoll("ATK")).toBeCloseTo(8.77, 2);
    expect(typicalSubstatRoll("ATK_FLAT")).toBeCloseTo(43.69, 2);
    expect(typicalSubstatRoll("Nope")).toBe(0);
  });

  it("sits below the plain middle of the range for crit stats", () => {
    const values = [6.3, 6.9, 7.5, 8.1, 8.7, 9.3, 9.9, 10.5];
    const plainMean = values.reduce((sum, value) => sum + value, 0) / values.length;
    expect(typicalSubstatRoll("CritRate")).toBeLessThan(plainMean);
  });
});

describe("topSubstatRoll", () => {
  it("is the biggest roll and its drop rate", () => {
    expect(topSubstatRoll("CritRate").value).toBe(10.5);
    expect(topSubstatRoll("CritRate").chance).toBeCloseTo(0.03, 3);
    expect(topSubstatRoll("ATK_FLAT").value).toBe(60);
  });
});

describe("substatValueStep", () => {
  it("is 1% for percent stats, 10 or 100 points for flat ones", () => {
    expect(substatValueStep("CritRate")).toBe(1);
    expect(substatValueStep("ATK_FLAT")).toBe(10);
    expect(substatValueStep("DEF_FLAT")).toBe(10);
    expect(substatValueStep("HP_FLAT")).toBe(100);
  });
});

describe("estimateSubstatRollValues", () => {
  // The accuracy check (ADR 0057): a roll added through Custom Buffs must move
  // damage exactly as much as the same roll on an equipped echo.
  it.each(["ATK", "ATK_FLAT", "CritRate", "CritDMG", "BasicAttackDMGBonus", "HP", "EnergyRegen"])(
    "adds a typical %s roll the same way an echo substat does",
    async (key) => {
      const characters = iuno();
      const values = await estimateSubstatRollValues("Iuno", characters, enemyConfig, INVENTORY, { target });
      const withEchoRoll = INVENTORY.map((echo) =>
        echo.echoId === "e3"
          ? { ...echo, echoSubStatsType1: key, echoSubStatsValue1: typicalSubstatRoll(key) }
          : echo,
      );
      const echoDelta = (await damage(characters, withEchoRoll)) - (await damage(characters));
      expect(values!.values[key].typical.delta).toBeCloseTo(echoDelta, 4);
    },
  );

  it("measures per 1%, typical and top roll as real recalculations", async () => {
    const characters = iuno();
    const values = await estimateSubstatRollValues("Iuno", characters, enemyConfig, INVENTORY, { target });
    const base = await damage(characters);
    const withBuff = async (key: string, amount: number) =>
      (await damage(iuno({ customBuffs: { [key]: amount } }))) - base;
    const crit = values!.values.CritRate;
    expect(crit.step).toBe(1);
    expect(crit.perStep).toBeCloseTo(await withBuff("CritRate", 1), 4);
    expect(crit.top.delta).toBeCloseTo(await withBuff("CritRate", 10.5), 4);
    expect(crit.top.roll).toBe(10.5);
    const flat = values!.values.ATK_FLAT;
    expect(flat.step).toBe(10);
    expect(flat.perStep).toBeCloseTo(await withBuff("ATK_FLAT", 10), 4);
  });

  it("measures every substat against the current number", async () => {
    const characters = iuno();
    const values = await estimateSubstatRollValues("Iuno", characters, enemyConfig, INVENTORY, { target });
    expect(values!.baseline).toBeCloseTo(await damage(characters), 6);
    expect(values!.label).toBe("Test rotation");
    expect(values!.damageType).toBe("Average");
    expect(Object.keys(values!.values).sort()).toEqual([...subStats].sort());
    const crit = values!.values.CritRate.typical;
    expect(crit.delta).toBeGreaterThan(0);
    expect(crit.pct).toBeCloseTo(crit.delta / values!.baseline);
  });

  it("gives 0 everywhere for stats this attack doesn't use", async () => {
    const values = await estimateSubstatRollValues("Iuno", iuno(), enemyConfig, INVENTORY, { target });
    for (const key of ["EnergyRegen", "DEF", "ResonanceLiberationDMGBonus"]) {
      expect(values!.values[key].typical.delta).toBe(0);
      expect(values!.values[key].perStep).toBe(0);
      expect(values!.values[key].top.delta).toBe(0);
    }
    expect(values!.values.BasicAttackDMGBonus.typical.delta).toBeGreaterThan(0);
  });

  it("shows no Crit Rate gain once Crit Rate is past the cap", async () => {
    const values = await estimateSubstatRollValues(
      "Iuno",
      iuno({ customBuffs: { CritRate: 120 } }),
      enemyConfig,
      INVENTORY,
      { target },
    );
    expect(values!.values.CritRate.typical.delta).toBe(0);
    expect(values!.values.CritRate.perStep).toBe(0);
    expect(values!.values.CritDMG.typical.delta).toBeGreaterThan(0);
  });

  it("adds the roll on top of the user's own Custom Buffs", async () => {
    const characters = iuno({ customBuffs: { ATK: 20 } });
    const values = await estimateSubstatRollValues("Iuno", characters, enemyConfig, INVENTORY, { target });
    const expected =
      (await damage(iuno({ customBuffs: { ATK: 20 + typicalSubstatRoll("ATK") } }))) - (await damage(characters));
    expect(values!.values.ATK.typical.delta).toBeCloseTo(expected, 4);
  });

  it("follows the damage type", async () => {
    const values = await estimateSubstatRollValues("Iuno", iuno(), enemyConfig, INVENTORY, {
      target,
      damageType: "Normal",
    });
    // Non-crit damage doesn't move with crit stats.
    expect(values!.values.CritRate.typical.delta).toBe(0);
    expect(values!.values.CritDMG.typical.delta).toBe(0);
    expect(values!.values.ATK.typical.delta).toBeGreaterThan(0);
  });

  it("measures a single attack and names it", async () => {
    const values = await estimateSubstatRollValues("Iuno", iuno(), enemyConfig, INVENTORY, {
      target: "Attack:basicAttacks|MoonringBasicAttack1DMG",
    });
    expect(values!.baseline).toBeGreaterThan(0);
    expect(values!.label).not.toBe("");
    expect(values!.label).not.toBe("MoonringBasicAttack1DMG");
  });

  it("returns null when the Live Result Bar shows a stat", async () => {
    const values = await estimateSubstatRollValues("Iuno", iuno(), enemyConfig, INVENTORY, { target: "Stat:totalAtk" });
    expect(values).toBeNull();
  });
});

describe("createSubstatMeasurer", () => {
  it("measures any amount, for Try a change", async () => {
    const characters = iuno();
    const measurer = await createSubstatMeasurer("Iuno", characters, enemyConfig, INVENTORY, { target });
    const expected = (await damage(iuno({ customBuffs: { CritRate: 2.5 } }))) - (await damage(characters));
    expect(await measurer!.measure({ CritRate: 2.5 })).toBeCloseTo(expected, 4);
    expect(await measurer!.measure({ CritRate: 0 })).toBe(0);
  });
});

describe("formatting", () => {
  it("shortens large gains", () => {
    expect(formatRollGain(2986.5)).toBe("+2,987");
    expect(formatRollGain(99_999)).toBe("+99,999");
    expect(formatRollGain(123_456)).toBe("+123K");
    expect(formatRollGain(1_234_567)).toBe("+1.23M");
    expect(formatRollGain(0)).toBe("+0");
  });

  it("formats roll sizes and top roll chances", () => {
    expect(formatRollSize("CritRate", 7.53)).toBe("7.5%");
    expect(formatRollSize("CritDMG", 21)).toBe("21%");
    expect(formatRollSize("ATK_FLAT", 43.69)).toBe("44");
    expect(formatTopRollChance(0.03)).toBe("3 in 100");
    expect(formatTopRollChance(0.0291)).toBe("3 in 100");
    expect(formatTopRollChance(0.004)).toBe("1 in 250");
    expect(formatTopRollChance(0)).toBe("");
  });
});
