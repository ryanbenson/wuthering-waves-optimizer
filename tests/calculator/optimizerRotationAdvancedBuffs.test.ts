import { describe, it, expect } from "vitest";
import { optimize, type OptimizerContext } from "../../src/calculator/optimizer";
import {
  calcCharacterRotationDamage,
  type CharacterRotationAction,
} from "../../src/calculator/characterRotation";
import {
  buildCharacterCalculationContext,
  type TeamEnemyConfig,
} from "../../src/calculator/buildCharacterContext";

const enemyConfig: TeamEnemyConfig = {
  enemyLevel: 90,
  enemyResist: 0.1,
  enemyType: "Calamity",
};

// One fixed 5-echo loadout (standard 4+3+3+1+1 = 12 cost budget), shared
// between the "already equipped" (ground truth, via characterRotation.ts)
// and "optimizer search space" (forced to this exact combo) representations
// below — same values, two shapes.
const fixedEchoes = [
  { echo: "Main4", type: 4, echoId: "m4", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 50 },
  { echo: "ThreeA", type: 3, echoId: "t3a", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 30 },
  { echo: "ThreeB", type: 3, echoId: "t3b", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 30 },
  { echo: "OneA", type: 1, echoId: "o1a", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 10 },
  { echo: "OneB", type: 1, echoId: "o1b", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 10 },
];

async function buildOptimizerContext(
  characterId: string,
  characters: Record<string, any>,
): Promise<OptimizerContext> {
  const built = await buildCharacterCalculationContext(characterId, characters, enemyConfig);
  const characterConfig = characters[characterId] ?? {};

  return {
    chosenChar: built.chosenChar,
    character: characterId,
    characterLevel: built.characterLevel,
    talentData: built.talentData,
    baseHp: built.baseHp,
    baseAtk: built.baseAtk,
    baseDef: built.baseDef,
    weaponData: built.weaponData,
    charBuffsData: built.charBuffsData,
    charResonanceChainsData: built.charResonanceChainsData,
    teamBuffsData: built.teamBuffsData,
    customBuffs: built.customBuffs,
    echoSetPassivesConfig: characterConfig.echoSetPassives ?? {},
    echoStats: built.echoStats,
    enemyLevel: enemyConfig.enemyLevel,
    enemyResist: enemyConfig.enemyResist,
    enemyType: enemyConfig.enemyType,
    isSpectroFrazzleEnabled: false,
    spectroFrazzleStacks: 0,
    isAeroErosionEnabled: false,
    aeroErosionStacks: 0,
    isFusionBurstEnabled: false,
    fusionBurstStacks: 0,
    isElectroFlareEnabled: false,
    electroFlareStacks: 0,
    electroRageStacks: 0,
    isGlacioChafeEnabled: false,
    glacioChafeStacks: 0,
    havocBaneStacks: 0,
    strainStacks: 0,
    mainEcho: built.mainEcho,
    mainEchoRank: built.mainEchoRank,
    rotationsList: [],
    Glacio: built.finalStats?.Glacio ?? 0,
    Fusion: built.finalStats?.Fusion ?? 0,
    Electro: built.finalStats?.Electro ?? 0,
    Aero: built.finalStats?.Aero ?? 0,
    Spectro: built.finalStats?.Spectro ?? 0,
    Havoc: built.finalStats?.Havoc ?? 0,
    characters,
    activeCharacterBuffs: characterConfig.buffs ?? {},
    activeCharacterResonanceChains: characterConfig.resonanceChains ?? {},
    activeStance: null,
    getRotationById: () => null,
  };
}

describe("optimize() Rotation target — advancedConfig overrides", () => {
  it("matches calcCharacterRotationDamage (the live Character Rotation display) for a rotation mixing plain and overridden actions", async () => {
    const characters = {
      Calcharo: {
        echoes: { 0: fixedEchoes[0], 1: fixedEchoes[1], 2: fixedEchoes[2], 3: fixedEchoes[3], 4: fixedEchoes[4] },
      },
    };

    const actions: CharacterRotationAction[] = [
      { id: "a1", order: 0, type: "basic", key: "Part1Damage", count: 1 },
      {
        id: "a2",
        order: 1,
        type: "basic",
        key: "Part1Damage",
        count: 1,
        advancedConfig: { buffs: { StatBonusATK1: { isEnabled: true } } },
      },
    ];

    // Ground truth: the live Character Rotation display's own pipeline.
    const built = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);
    const groundTruth = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions },
      { chosenChar: built.chosenChar, characterLevel: built.characterLevel, context: built.context },
      "Calcharo",
      characters,
      enemyConfig,
    );

    // Optimizer path: same character/rotation, search space forced to the
    // exact same 5-echo loadout the character has "equipped" above.
    const optimizerContext = await buildOptimizerContext("Calcharo", characters);
    optimizerContext.getRotationById = (_char: string, rotationId: string) =>
      rotationId === "r1" ? { id: "r1", name: "Rotation", duration: 10, actions } : null;

    const results = optimize(
      fixedEchoes,
      optimizerContext,
      [],
      1,
      ["Main4"],
      [],
      {},
      {},
      "Rotation:r1",
      "Average",
    );

    expect(results.length).toBeGreaterThan(0);
    const optimizerRotation = results[0].context.attacks;

    expect(optimizerRotation.attacks).toHaveLength(2);
    expect(optimizerRotation.attacks.map((a: any) => a.id)).toEqual(["a1", "a2"]);

    // The overridden action (a2, StatBonusATK1 forced on) must do more
    // damage than the plain one (a1) in both pipelines...
    const [gtPlain, gtOverride] = groundTruth.attacks;
    const [optPlain, optOverride] = optimizerRotation.attacks;
    expect(gtOverride.damage.totalDamage).toBeGreaterThan(gtPlain.damage.totalDamage);
    expect(optOverride.damage.totalDamage).toBeGreaterThan(optPlain.damage.totalDamage);

    // ...and, the actual regression guard: the optimizer's numbers must
    // match the live display's numbers exactly, action for action.
    expect(optPlain.damage.totalDamage).toBeCloseTo(gtPlain.damage.totalDamage, 5);
    expect(optOverride.damage.totalDamage).toBeCloseTo(gtOverride.damage.totalDamage, 5);
    expect(optimizerRotation.damageAggregation.normalDamage).toBeCloseTo(
      groundTruth.damageAggregation.normalDamage,
      5,
    );
  });

  it("two override actions with different overrides don't cross-contaminate", async () => {
    const characters = {
      Calcharo: {
        echoes: { 0: fixedEchoes[0], 1: fixedEchoes[1], 2: fixedEchoes[2], 3: fixedEchoes[3], 4: fixedEchoes[4] },
      },
    };
    const actions: CharacterRotationAction[] = [
      {
        id: "a1",
        order: 0,
        type: "basic",
        key: "Part1Damage",
        count: 1,
        advancedConfig: { buffs: { StatBonusATK1: { isEnabled: true } } },
      },
      { id: "a2", order: 1, type: "basic", key: "Part1Damage", count: 1 },
      {
        id: "a3",
        order: 2,
        type: "basic",
        key: "Part1Damage",
        count: 1,
        advancedConfig: { buffs: { StatBonusATK1: { isEnabled: false } } },
      },
    ];

    const optimizerContext = await buildOptimizerContext("Calcharo", characters);
    optimizerContext.getRotationById = (_char: string, rotationId: string) =>
      rotationId === "r1" ? { id: "r1", name: "Rotation", duration: 10, actions } : null;

    const results = optimize(
      fixedEchoes,
      optimizerContext,
      [],
      1,
      ["Main4"],
      [],
      {},
      {},
      "Rotation:r1",
      "Average",
    );

    expect(results.length).toBeGreaterThan(0);
    const attacks = results[0].context.attacks.attacks;
    expect(attacks.map((a: any) => a.id)).toEqual(["a1", "a2", "a3"]);

    const [a1, a2, a3] = attacks;
    // a1 (StatBonusATK1 on) does the most damage, a3 (forced off, and — since
    // it's off by default anyway — identical to a2's plain baseline) the least.
    expect(a1.damage.totalDamage).toBeGreaterThan(a2.damage.totalDamage);
    expect(a3.damage.totalDamage).toBeCloseTo(a2.damage.totalDamage, 5);
  });

  // Team buffs specifically — the category the migrated Zani e2e fixture
  // actually exercises (a legacy "exclude team buffs" checkbox migrated into
  // a blanket advancedConfig.teamBuffs override), and the one category the
  // self-buff-focused tests above never touch: computeOverrideBuffVariants's
  // team-buff resolution has its own code path (resolveTeamBuffInstance +
  // aggregateTeamBuffStats against buffsByCharacter), independent of the
  // self-buff/resonance-chain merge already verified above.
  it("matches calcCharacterRotationDamage for a team-buff override", async () => {
    const characters = {
      Calcharo: {
        echoes: { 0: fixedEchoes[0], 1: fixedEchoes[1], 2: fixedEchoes[2], 3: fixedEchoes[3], 4: fixedEchoes[4] },
        teamBuffs: {
          selectedCharacter1: "Sanhua",
          buffs: { SequenceNode6DaybreakRadiance: { isEnabled: true, stacks: 2 } },
        },
      },
    };
    const actions: CharacterRotationAction[] = [
      { id: "a1", order: 0, type: "basic", key: "Part1Damage", count: 1 },
      {
        id: "a2",
        order: 1,
        type: "basic",
        key: "Part1Damage",
        count: 1,
        advancedConfig: { teamBuffs: { SequenceNode6DaybreakRadiance: { isEnabled: false } } },
      },
    ];

    const built = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);
    const groundTruth = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions },
      { chosenChar: built.chosenChar, characterLevel: built.characterLevel, context: built.context },
      "Calcharo",
      characters,
      enemyConfig,
    );

    const optimizerContext = await buildOptimizerContext("Calcharo", characters);
    optimizerContext.getRotationById = (_char: string, rotationId: string) =>
      rotationId === "r1" ? { id: "r1", name: "Rotation", duration: 10, actions } : null;

    const results = optimize(
      fixedEchoes,
      optimizerContext,
      [],
      1,
      ["Main4"],
      [],
      {},
      {},
      "Rotation:r1",
      "Average",
    );

    expect(results.length).toBeGreaterThan(0);
    const optimizerAttacks = results[0].context.attacks.attacks;
    expect(optimizerAttacks).toHaveLength(2);

    const [gtPlain, gtOverride] = groundTruth.attacks;
    const [optPlain, optOverride] = optimizerAttacks;

    // The team buff must actually do something for this to be a real test.
    expect(gtPlain.damage.totalDamage).toBeGreaterThan(gtOverride.damage.totalDamage);
    expect(optPlain.damage.totalDamage).toBeGreaterThan(optOverride.damage.totalDamage);

    expect(optPlain.damage.totalDamage).toBeCloseTo(gtPlain.damage.totalDamage, 5);
    expect(optOverride.damage.totalDamage).toBeCloseTo(gtOverride.damage.totalDamage, 5);
  });
});
