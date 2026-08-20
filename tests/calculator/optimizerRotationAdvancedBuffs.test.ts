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
import { configOptimizer as cartethyiaConfigOptimizer } from "../../cypress/e2e/calculator/data/Cartethyia/data";
import { resolveSetBonusStats } from "../../src/echoes/echoSetPassives";
import { setBonusEffectsOne, setBonusEffectsTwo } from "../../src/echoes/sets";
import { mainEchoesData } from "../../src/echoes/index";
import {
  getMainEchoBuffs,
  isMainEchoBuffEnabled,
  getMainEchoBuffStacks,
  mergeMainEchoBuffStats,
} from "../../src/echoes/mainEchoBuffs";
import { applyMainEchoBuffEffects } from "../../src/echoes/applyMainEchoBuffEffects";

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

  // computeOverrideBuffVariants resolves selfBuffsData/resonanceChainsBuffsData
  // from the override's merged config, but AdditionalBase/CritOverflow bonuses
  // (computeAdditionalBaseBuffs/computeCritOverflowBuffs, both re-derived
  // straight from raw buffsConfig/resonanceChainsConfig, independent of the
  // already-resolved *BuffsData) previously kept reading the character's own
  // un-overridden config — silently ignoring this category of buff toggle for
  // an override action (issue #401 follow-up).
  it("matches calcCharacterRotationDamage for an override that flips a buff feeding an AdditionalBase bonus", async () => {
    const characters = {
      Shorekeeper: {
        echoes: { 0: fixedEchoes[0], 1: fixedEchoes[1], 2: fixedEchoes[2], 3: fixedEchoes[3], 4: fixedEchoes[4] },
        buffs: { SophisticatedStellarealmCritRate: { isEnabled: false } },
      },
    };
    const actions: CharacterRotationAction[] = [
      { id: "a1", order: 0, type: "basic", key: "OriginCalculusStage1DMG", count: 1 },
      {
        id: "a2",
        order: 1,
        type: "basic",
        key: "OriginCalculusStage1DMG",
        count: 1,
        advancedConfig: { buffs: { SophisticatedStellarealmCritRate: { isEnabled: true } } },
      },
    ];

    const built = await buildCharacterCalculationContext("Shorekeeper", characters, enemyConfig);
    const groundTruth = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions },
      { chosenChar: built.chosenChar, characterLevel: built.characterLevel, context: built.context },
      "Shorekeeper",
      characters,
      enemyConfig,
    );

    const optimizerContext = await buildOptimizerContext("Shorekeeper", characters);
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

    // `.damage.totalDamage` is the non-crit "normal hit" figure — insensitive
    // to CritRate by design — so this buff's effect only shows up in
    // `.damage.avgDamage` (the crit-rate-weighted average).
    expect(gtOverride.damage.avgDamage).toBeGreaterThan(gtPlain.damage.avgDamage);
    expect(optOverride.damage.avgDamage).toBeGreaterThan(optPlain.damage.avgDamage);

    expect(optPlain.damage.avgDamage).toBeCloseTo(gtPlain.damage.avgDamage, 5);
    expect(optOverride.damage.avgDamage).toBeCloseTo(gtOverride.damage.avgDamage, 5);
  });

  // Real user-reported rotation (issue #401 follow-up) with a rich override:
  // several self buffs off, one weapon passive off, echo set passives/main
  // echo/team buffs left matching the character's own defaults. Found two
  // further bugs beyond the AdditionalBase/CritOverflow one above, both in
  // scoreOptimizerRotation's override branch:
  //  1. computeOverrideBuffVariants's team-buff resolution only considered
  //     the two selected teammates' buffs, silently dropping any enabled
  //     echo-granted (allEchoBuffs) or weapon-granted (allWeaponTeamBuffs)
  //     team buff for an override action.
  //  2. buildOptimizerCalculationContext unconditionally forwarded
  //     context.charBuffsData/charResonanceChainsData/teamBuffsData (the
  //     character's un-overridden defaults) into getCalculationContext even
  //     when scoring an override action, instead of that action's own
  //     variant.selfBuffsData/resonanceChainsBuffsData/teamBuffsData — a
  //     mismatch against what was actually used to compute overrideFinalStats.
  // Together these produced a real, reported +8.4% overestimate for the
  // overridden action specifically (every plain action already matched).
  // Heavier than the synthetic fixtures above — a real 17-echo inventory and
  // 13-action rotation — and can exceed the default 5s under full-suite
  // parallel CPU contention even though it runs in ~2s in isolation.
  it("matches calcCharacterRotationDamage exactly, action for action, for a real multi-category override (Cartethyia)", async () => {
    const char = JSON.parse(cartethyiaConfigOptimizer.data.character);
    const inv = JSON.parse(cartethyiaConfigOptimizer.data.inventory);
    const characters = char.characters;
    const characterId = "Cartethyia";
    const characterData = characters[characterId];
    const rotation = characterData.rotations[0];
    const cartethyiaEnemyConfig: TeamEnemyConfig = {
      enemyLevel: Number(characterData.enemyLevel ?? 90),
      enemyResist: Number(characterData.enemyResist ?? 0.1),
      enemyType: "Calamity",
    };

    const built = await buildCharacterCalculationContext(characterId, characters, cartethyiaEnemyConfig, inv.echoes);

    const groundTruth = await calcCharacterRotationDamage(
      { id: rotation.id, name: rotation.name, duration: rotation.duration, actions: rotation.actions },
      { chosenChar: built.chosenChar, characterLevel: built.characterLevel, context: built.context },
      characterId,
      characters,
      cartethyiaEnemyConfig,
      inv.echoes,
    );

    // Wire echoSetPassiveBuffs/mainEchoStats the way CalculatorOptimizer.vue
    // actually does — a raw isEnabled-config map here (a mistake made while
    // first writing this test) silently no-ops the whole set-bonus/main-echo
    // resolution instead of erroring, so the wiring matters.
    const echoSetPassiveBuffs: Record<string, any> = {};
    for (const label of ["Windward Pilgrimage 2 Set", "Gusts of Welkin 2 Set"]) {
      echoSetPassiveBuffs[label] = resolveSetBonusStats(
        (setBonusEffectsOne as Record<string, any>)[label],
        characterData.echoSetPassives ?? {},
        built.talentData,
      );
    }
    for (const label of ["Windward Pilgrimage 5 Set", "Gusts of Welkin 5 Set"]) {
      echoSetPassiveBuffs[label] = resolveSetBonusStats(
        (setBonusEffectsTwo as Record<string, any>)[label],
        characterData.echoSetPassives ?? {},
        built.talentData,
      );
    }
    // Resolves a main echo's fully-merged buff stats from a legacy-shaped
    // isEnabled/stacks config, mirroring buildCharacterContext.ts's per-buff
    // loop (isMainEchoBuffEnabled/getMainEchoBuffStacks fall back to the
    // flat isEnabled/stacks fields when there's no per-buff `buffs` map).
    function resolveMainEchoStatsForTest(
      echoKey: string,
      config: { isEnabled?: boolean; stacks?: number },
    ): Record<string, unknown> {
      const echoDef = (mainEchoesData as Record<string, any>)[echoKey] ?? null;
      const buffStatsByKey: Record<string, Record<string, unknown>> = {};
      for (const buff of getMainEchoBuffs(echoDef)) {
        if (!isMainEchoBuffEnabled(config, buff.key)) {
          continue;
        }
        buffStatsByKey[buff.key] = applyMainEchoBuffEffects({
          effects: buff.effects,
          character: characterId,
          hasStacks: buff.hasStacks,
          stacks: getMainEchoBuffStacks(config, buff.key),
          talentData: built.talentData,
        });
      }
      return mergeMainEchoBuffStats(buffStatsByKey);
    }

    const mainEchoStats: Record<string, any> = {
      ReminiscenceFleurdelys: resolveMainEchoStatsForTest("ReminiscenceFleurdelys", {
        isEnabled: true,
        stacks: 0,
      }),
    };

    const optimizerContext: OptimizerContext = {
      chosenChar: built.chosenChar,
      character: characterId,
      characterLevel: built.characterLevel,
      talentData: built.talentData,
      baseHp: built.baseHp,
      baseAtk: built.baseAtk,
      baseDef: built.baseDef,
      weaponData: {
        ...built.weaponData,
        weaponPassiveDefs: built.definitions.weaponPassives,
        refinement: characterData.weapons?.[characterData.weapon]?.refinement ?? "1",
      },
      charBuffsData: built.charBuffsData,
      charResonanceChainsData: built.charResonanceChainsData,
      teamBuffsData: built.teamBuffsData,
      customBuffs: built.customBuffs,
      echoSetPassivesConfig: characterData.echoSetPassives ?? {},
      echoStats: built.echoStats,
      enemyLevel: cartethyiaEnemyConfig.enemyLevel,
      enemyResist: cartethyiaEnemyConfig.enemyResist,
      enemyType: cartethyiaEnemyConfig.enemyType,
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
      activeCharacterBuffs: characterData.buffs ?? {},
      activeCharacterResonanceChains: characterData.resonanceChains ?? {},
      activeStance: null,
      getRotationById: (_char: string, rotationId: string) => (rotationId === rotation.id ? rotation : null),
    };

    const results = optimize(
      inv.echoes,
      optimizerContext,
      [],
      1,
      characterData.optimizer.mainEchoes,
      [],
      echoSetPassiveBuffs,
      mainEchoStats,
      characterData.optimizer.optimizationTarget,
      characterData.optimizer.damageType,
    );

    expect(results.length).toBeGreaterThan(0);
    const optimizerAttacks = results[0].context.attacks.attacks as any[];
    expect(optimizerAttacks).toHaveLength(groundTruth.attacks.length);

    for (const gtAttack of groundTruth.attacks) {
      const optAttack = optimizerAttacks.find((a) => a.id === gtAttack.id);
      expect(optAttack, `no optimizer attack found for action ${gtAttack.id}`).toBeDefined();
      expect(optAttack.damage.avgDamage).toBeCloseTo(gtAttack.damage.avgDamage, 3);
      expect(optAttack.damage.totalDamage).toBeCloseTo(gtAttack.damage.totalDamage, 3);
    }
    expect(results[0].context.attacks.damageAggregation.normalDamage).toBeCloseTo(
      groundTruth.damageAggregation.normalDamage,
      2,
    );
  }, 20000);
});
