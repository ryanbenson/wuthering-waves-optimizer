import { describe, it, expect } from "vitest";
import type { TeamEnemyConfig } from "../../src/calculator/buildCharacterContext";
import { calcCharacterRotationDamage } from "../../src/calculator/characterRotation";
import {
  averageSubstatRoll,
  estimateSubstatRollValues,
  formatRollGain,
  pickRollFor,
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

describe("averageSubstatRoll", () => {
  it("is the mean of the substat's roll values", () => {
    expect(averageSubstatRoll("CritRate")).toBeCloseTo(8.4);
    expect(averageSubstatRoll("CritDMG")).toBeCloseTo(16.8);
    expect(averageSubstatRoll("ATK")).toBeCloseTo(9);
    expect(averageSubstatRoll("ATK_FLAT")).toBeCloseTo(45);
    expect(averageSubstatRoll("Nope")).toBe(0);
  });
});

describe("estimateSubstatRollValues", () => {
  // The accuracy check (ADR 0056): a roll added through Custom Buffs must move
  // damage exactly as much as the same roll on an equipped echo.
  it.each(["ATK", "ATK_FLAT", "CritRate", "CritDMG", "BasicAttackDMGBonus", "HP", "EnergyRegen"])(
    "adds %s the same way an echo substat does",
    async (key) => {
      const characters = iuno();
      const values = await estimateSubstatRollValues("Iuno", characters, enemyConfig, INVENTORY, { target });
      const withEchoRoll = INVENTORY.map((echo) =>
        echo.echoId === "e3"
          ? { ...echo, echoSubStatsType1: key, echoSubStatsValue1: averageSubstatRoll(key) }
          : echo,
      );
      const echoDelta = (await damage(characters, withEchoRoll)) - (await damage(characters));
      expect(values!.gains[key].delta).toBeCloseTo(echoDelta, 4);
    },
  );

  it("measures every substat against the current number", async () => {
    const characters = iuno();
    const values = await estimateSubstatRollValues("Iuno", characters, enemyConfig, INVENTORY, { target });
    expect(values!.baseline).toBeCloseTo(await damage(characters), 6);
    expect(values!.label).toBe("Test rotation");
    expect(values!.damageType).toBe("Average");
    expect(Object.keys(values!.gains).sort()).toEqual([...subStats].sort());
    expect(values!.gains.CritRate.delta).toBeGreaterThan(0);
    expect(values!.gains.CritRate.pct).toBeCloseTo(values!.gains.CritRate.delta / values!.baseline);
  });

  it("gives 0 for stats this attack doesn't use", async () => {
    const values = await estimateSubstatRollValues("Iuno", iuno(), enemyConfig, INVENTORY, { target });
    expect(values!.gains.EnergyRegen.delta).toBe(0);
    expect(values!.gains.DEF.delta).toBe(0);
    expect(values!.gains.ResonanceLiberationDMGBonus.delta).toBe(0);
    expect(values!.gains.BasicAttackDMGBonus.delta).toBeGreaterThan(0);
  });

  it("shows no Crit Rate gain once Crit Rate is past the cap", async () => {
    const values = await estimateSubstatRollValues(
      "Iuno",
      iuno({ customBuffs: { CritRate: 120 } }),
      enemyConfig,
      INVENTORY,
      { target },
    );
    expect(values!.gains.CritRate.delta).toBe(0);
    expect(values!.gains.CritDMG.delta).toBeGreaterThan(0);
  });

  it("adds the roll on top of the user's own Custom Buffs", async () => {
    const characters = iuno({ customBuffs: { ATK: 20 } });
    const values = await estimateSubstatRollValues("Iuno", characters, enemyConfig, INVENTORY, { target });
    const expected =
      (await damage(iuno({ customBuffs: { ATK: 20 + averageSubstatRoll("ATK") } }))) - (await damage(characters));
    expect(values!.gains.ATK.delta).toBeCloseTo(expected, 4);
  });

  it("follows the damage type", async () => {
    const values = await estimateSubstatRollValues("Iuno", iuno(), enemyConfig, INVENTORY, {
      target,
      damageType: "Normal",
    });
    // Non-crit damage doesn't move with crit stats.
    expect(values!.gains.CritRate.delta).toBe(0);
    expect(values!.gains.CritDMG.delta).toBe(0);
    expect(values!.gains.ATK.delta).toBeGreaterThan(0);
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

describe("pickRollFor", () => {
  it("ranks by gain and leaves out what adds nothing", () => {
    const picks = pickRollFor({
      ATK: { delta: 2055, pct: 0.045 },
      CritRate: { delta: 2987, pct: 0.066 },
      EnergyRegen: { delta: 0, pct: 0 },
      CritDMG: { delta: 2382, pct: 0.053 },
      ATK_FLAT: { delta: 1015, pct: 0.022 },
    });
    expect(picks.map((pick) => pick.key)).toEqual(["CritRate", "CritDMG", "ATK"]);
  });

  it("breaks ties by key so the order doesn't flicker", () => {
    const picks = pickRollFor({ CritRate: { delta: 5, pct: 0 }, ATK: { delta: 5, pct: 0 } }, 2);
    expect(picks.map((pick) => pick.key)).toEqual(["ATK", "CritRate"]);
  });

  it("is empty when nothing adds damage", () => {
    expect(pickRollFor({ EnergyRegen: { delta: 0, pct: 0 } })).toEqual([]);
  });
});

describe("formatRollGain", () => {
  it("shortens large numbers", () => {
    expect(formatRollGain(2986.5)).toBe("+2,987");
    expect(formatRollGain(99_999)).toBe("+99,999");
    expect(formatRollGain(123_456)).toBe("+123K");
    expect(formatRollGain(1_234_567)).toBe("+1.23M");
    expect(formatRollGain(0)).toBe("+0");
  });
});
