import { describe, it, expect } from "vitest";
import { optimize } from "../../src/calculator/optimizer";
import { buildOptimizerRotationData } from "../../src/calculator/rotationData";
import { computeRunBuffData, processLoadout } from "../../src/calculator/processLoadout";
import {
  calcCharacterRotationDamage,
  type CharacterRotationAction,
} from "../../src/calculator/characterRotation";
import { buildCharacterCalculationContext } from "../../src/calculator/buildCharacterContext";
import { buildOptimizerContext, enemyConfig, fixedEchoes } from "./optimizerFixture";

// processLoadout scores every worker candidate and, on the main thread, the loadout
// equipped when the optimizer runs (the "Current" row), so both must agree exactly.
const characters = {
  Calcharo: {
    echoes: { 0: fixedEchoes[0], 1: fixedEchoes[1], 2: fixedEchoes[2], 3: fixedEchoes[3], 4: fixedEchoes[4] },
  },
};
const actions: CharacterRotationAction[] = [
  { id: "a1", order: 0, type: "basic", key: "Part1Damage", count: 1 },
  { id: "a2", order: 1, type: "basic", key: "Part1Damage", count: 2 },
];
const rotation = { id: "r1", name: "Rotation", duration: 10, actions };

async function scoreWithProcessLoadout(minStats: any[] = []) {
  const context = await buildOptimizerContext("Calcharo", characters);
  const rotationData = buildOptimizerRotationData(rotation, context.chosenChar, context.characterLevel);
  const { selfBuffsData, resonanceChainsBuffsData, overrideBuffVariants } = computeRunBuffData(context, rotationData);
  return processLoadout(
    fixedEchoes,
    context,
    minStats,
    {},
    {},
    "Rotation:r1",
    "Average",
    rotationData,
    selfBuffsData,
    resonanceChainsBuffsData,
    overrideBuffVariants,
  );
}

describe("processLoadout", () => {
  it("scores a loadout exactly like optimize() and the live rotation display", async () => {
    const built = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);
    const groundTruth = await calcCharacterRotationDamage(
      rotation,
      { chosenChar: built.chosenChar, characterLevel: built.characterLevel, context: built.context },
      "Calcharo",
      characters,
      enemyConfig,
    );

    const context = await buildOptimizerContext("Calcharo", characters);
    context.getRotationById = (_char: string, id: string) => (id === "r1" ? rotation : null);
    const [best] = optimize(fixedEchoes, context, [], 1, ["Main4"], [], {}, {}, "Rotation:r1", "Average");

    const current = await scoreWithProcessLoadout();

    expect(current).not.toBeNull();
    expect(current.targetValue).toBeGreaterThan(0);
    expect(current.targetValue).toBeCloseTo(best.targetValue, 5);
    expect(current.context.rotation.damageAggregation.normalDamage).toBeCloseTo(
      groundTruth.damageAggregation.normalDamage,
      5,
    );
  });

  it("drops a loadout below a min stat (the Current row passes none, so it always shows)", async () => {
    expect(await scoreWithProcessLoadout([{ stat: "energyRegen", minValue: "999" }])).toBeNull();
  });
});
