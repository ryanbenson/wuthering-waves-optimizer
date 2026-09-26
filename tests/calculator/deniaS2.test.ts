import { describe, it, expect } from "vitest";
import { buildCharacterCalculationContext } from "../../src/calculator/buildCharacterContext";
import { resolveRotationActionToAttackData } from "../../src/calculator/resolveRotationAction";
import { calcDamages } from "../../src/calculator/attacks";
import type { TeamEnemyConfig } from "../../src/calculator/buildCharacterContext";

// Regression test for #575: Denia's Sequence Node 2 (+40% DMG Multiplier on
// Banish - Breakdown Form) multiplies with the Dark Core bonus (+150% per core)
// in game: MV * (1 + 1.5 * cores) * 1.4. It used to be summed into the same
// talentModifierMultiply bucket, giving MV * (1 + 1.5 * cores + 0.4).
const enemyConfig: TeamEnemyConfig = {
  enemyLevel: 90,
  enemyResist: 0.1,
  enemyType: "Calamity",
};

const S2 = "SequenceNode2TossedintheTidesofReality";
const S3 = "SequenceNode3ThroughDarkandWindtheErlkingFollows";

async function banishDamageFor(key: string, resonanceChains: Record<string, any>) {
  const characters = {
    Denia: {
      buffs: { DarkCore: { isEnabled: true, stacks: 5 } },
      resonanceChains,
    },
  };
  const built = await buildCharacterCalculationContext("Denia", characters, enemyConfig);
  const action = { id: "a1", order: 0, type: "skill", key, count: 1 };
  const resolvedAttack = resolveRotationActionToAttackData(action, built.chosenChar, built.characterLevel);
  built.context.rotationsList = [
    { id: "r1", name: "r1", duration: 10, order: 0, attacks: [resolvedAttack] },
  ];
  const result = calcDamages(built.context);
  return result.rotations[0].attacks[0].damage;
}

describe("Denia Sequence Node 2 multiplier (#575)", () => {
  it("keeps Dark Core additive and puts S2 in the multiplicative layer", async () => {
    const damage = await banishDamageFor("BanishBreakdownFormStage2DMG", {
      [S2]: { isEnabled: true },
      [S3]: { isEnabled: true },
    });

    expect(damage.totalDamageContext.talentModifierMultiply).toBeCloseTo(1.5 * 5);
    expect(damage.totalDamageContext.totalTalentModifierSpecialMultiply).toBeCloseTo(0.4);
  });

  it("multiplies Banish Stage 2 damage by 1.4 on top of 5 Dark Cores", async () => {
    const withoutS2 = await banishDamageFor("BanishBreakdownFormStage2DMG", {
      [S3]: { isEnabled: true },
    });
    const withS2 = await banishDamageFor("BanishBreakdownFormStage2DMG", {
      [S2]: { isEnabled: true },
      [S3]: { isEnabled: true },
    });

    expect(withS2.totalDamage / withoutS2.totalDamage).toBeCloseTo(1.4, 6);
  });

  it("still multiplies Banish Stage 1 damage by 1.4", async () => {
    const withoutS2 = await banishDamageFor("BanishBreakdownFormStage1DMG", {});
    const withS2 = await banishDamageFor("BanishBreakdownFormStage1DMG", {
      [S2]: { isEnabled: true },
    });

    expect(withS2.totalDamage / withoutS2.totalDamage).toBeCloseTo(1.4, 6);
  });
});
