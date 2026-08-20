import { describe, it, expect } from "vitest";
import { buildCharacterCalculationContext } from "../../src/calculator/buildCharacterContext";
import { resolveRotationActionToAttackData } from "../../src/calculator/resolveRotationAction";
import { calcDamages } from "../../src/calculator/attacks";
import type { TeamEnemyConfig } from "../../src/calculator/buildCharacterContext";

// Regression test for #424: Qingxiao's Sequence Node 3 (Dreams Fade, Sword
// Abides) buffs Heavy Attack - Heaven's Reckoning: Ephemeral Transcendence
// with a talentModifierSpecialMultiply of 3% per Mindlock stack. That buff is
// computed as a self buff in stats.ts (specificTalentBuffs), but attacks.ts
// only ever read talentModifierSpecialMultiply from resonance-chain buff
// data, so the self-buffed value never reached the damage calc or the
// Damage Breakdown slideout.
const enemyConfig: TeamEnemyConfig = {
  enemyLevel: 90,
  enemyResist: 0.1,
  enemyType: "Calamity",
};

async function heavenSReckoningDamageFor(characters: Record<string, any>) {
  const built = await buildCharacterCalculationContext("Qingxiao", characters, enemyConfig);
  const action = {
    id: "a1",
    order: 0,
    type: "forteCircuit",
    key: "HeavenSReckoningEphemeralTranscendenceDMG",
    count: 1,
  };
  const resolvedAttack = resolveRotationActionToAttackData(action, built.chosenChar, built.characterLevel);
  built.context.rotationsList = [
    { id: "r1", name: "r1", duration: 10, order: 0, attacks: [resolvedAttack] },
  ];
  const result = calcDamages(built.context);
  return result.rotations[0].attacks[0].damage;
}

describe("Qingxiao Sequence Node 3 talentModifierSpecialMultiply (#424)", () => {
  it("applies 3% per Mindlock stack to Heaven's Reckoning: Ephemeral Transcendence when S3 is enabled", async () => {
    const mindlockStacks = 10;
    const characters = {
      Qingxiao: {
        buffs: { Mindlock: { isEnabled: true, stacks: mindlockStacks } },
        resonanceChains: { SequenceNode3DreamsFadeSwordAbides: { isEnabled: true } },
      },
    };

    const damage = await heavenSReckoningDamageFor(characters);

    expect(damage.totalDamageContext.totalTalentModifierSpecialMultiply).toBeCloseTo(0.03 * mindlockStacks);
  });

  it("deals more damage with S3 enabled than without it, for the same Mindlock stacks", async () => {
    const mindlockStacks = 10;
    const withoutS3 = await heavenSReckoningDamageFor({
      Qingxiao: {
        buffs: { Mindlock: { isEnabled: true, stacks: mindlockStacks } },
        resonanceChains: {},
      },
    });
    const withS3 = await heavenSReckoningDamageFor({
      Qingxiao: {
        buffs: { Mindlock: { isEnabled: true, stacks: mindlockStacks } },
        resonanceChains: { SequenceNode3DreamsFadeSwordAbides: { isEnabled: true } },
      },
    });

    expect(withoutS3.totalDamageContext.totalTalentModifierSpecialMultiply).toBe(0);
    expect(withS3.totalDamage).toBeGreaterThan(withoutS3.totalDamage);
  });
});
