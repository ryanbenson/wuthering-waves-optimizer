import { describe, it, expect } from "vitest";
import { optimize, type OptimizerContext } from "../../src/calculator/optimizer";
import { calculateAllStats } from "../../src/calculator/stats";
import {
  buildCharacterCalculationContext,
  type TeamEnemyConfig,
} from "../../src/calculator/buildCharacterContext";

const enemyConfig: TeamEnemyConfig = {
  enemyLevel: 90,
  enemyResist: 0.1,
  enemyType: "Calamity",
};

function makeEcho(
  echo: string,
  type: number,
  echoId: string,
  substatType: string,
  substatValue: number,
) {
  return {
    echo,
    type,
    echoId,
    echoSet: "TestSet",
    rank: 5,
    stat: "ATK",
    echoSubStatsType1: substatType,
    echoSubStatsValue1: substatValue,
  };
}

/**
 * Wraps `buildCharacterCalculationContext`'s output (already proven correct —
 * it's what `characterRotation.ts`/Calculator.vue's live display use) into
 * the differently-shaped `OptimizerContext` `optimize()` expects. Elemental
 * reaction toggles default off/0 — not exercised by these tests.
 */
async function buildOptimizerContext(
  characterId: string,
  characters: Record<string, any>,
  rotation?: { id: string; name: string; actions: any[] },
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
    getRotationById: (_char: string, rotationId: string) =>
      rotation && rotation.id === rotationId ? rotation : null,
  };
}

function echoSet(substatType: string, substatValue: number) {
  return [
    makeEcho("Main4", 4, "m4", substatType, substatValue),
    makeEcho("FourA", 4, "f4a", substatType, substatValue),
    makeEcho("ThreeA", 3, "t3a", substatType, substatValue),
    makeEcho("ThreeB", 3, "t3b", substatType, substatValue),
    makeEcho("OneA", 1, "o1a", substatType, substatValue),
  ];
}

describe("optimize() Rotation target", () => {
  it("scores a rotation's attacks, and the loadout's own echo stats actually reach the damage calc", async () => {
    const characters = { Calcharo: {} };
    const rotation = {
      id: "r1",
      name: "Test Rotation",
      actions: [{ id: "a1", order: 0, type: "basic", key: "Part1Damage", count: 1 }],
    };
    const context = await buildOptimizerContext("Calcharo", characters, rotation);

    const run = (substatValue: number) =>
      optimize(
        echoSet("ATK", substatValue),
        context,
        [],
        1,
        ["Main4"],
        [],
        {},
        {},
        "Rotation:r1",
        "Average",
      );

    const buffed = run(50);
    const unbuffed = run(0);

    expect(buffed.length).toBeGreaterThan(0);
    expect(unbuffed.length).toBeGreaterThan(0);
    const buffedResult = buffed[0];
    const unbuffedResult = unbuffed[0];

    // Internal consistency: the ranked result's targetValue must be the same
    // number as its own recorded rotation breakdown, not just self-consistent
    // in isolation — both derived from the same aggregateRotationDamage call.
    expect(buffedResult.context.attacks.attacks).toHaveLength(1);
    expect(buffedResult.context.attacks.damageAggregation.avgDamage).toBeCloseTo(
      buffedResult.targetValue,
    );

    // The actual regression guard: echoes with real ATK substats must score
    // meaningfully higher than the same loadout shape with zero substats —
    // this fails if the loadout's own echo stats (`combinedEchoBuffs`,
    // threaded through `injectEchoStats`) stop reaching the per-loadout stat
    // calc, even though both runs would otherwise look internally consistent.
    expect(buffedResult.targetValue).toBeGreaterThan(unbuffedResult.targetValue * 1.2);
  });

  // Augusta specifically: her self-buff/resonance-chain code paths have
  // character-specific special-casing in stats.ts (the "ignore Augusta, her
  // additional-base buffs are handled in self buffs" guard) that optimizer.ts
  // and processor.worker.ts each re-implemented independently pre-refactor
  // and had silently drifted on (one had the guard, one didn't). Asserting
  // `optimize()`'s output matches `calculateAllStats` — the canonical
  // pipeline `characterRotation.ts`/the live Calculator page use — for this
  // character is what would have caught that drift, and guards against any
  // future re-divergence between the two now-shared implementations.
  it("matches calculateAllStats's canonical pipeline for a character with special-cased buff handling (Augusta)", async () => {
    const characters = {
      Augusta: {
        buffs: {
          CrownofWills: { isEnabled: true },
        },
        resonanceChains: {
          SequenceNode2CleansedinCrimsonWar: { isEnabled: true },
        },
      },
    };
    const context = await buildOptimizerContext("Augusta", characters);

    const run = (substatValue: number) =>
      optimize(
        echoSet("CritRate", substatValue),
        context,
        [],
        1,
        ["Main4"],
        [],
        {},
        {},
        "Stat:totalCritRate",
        "Average",
      );

    const buffed = run(10);
    const unbuffed = run(0);
    expect(buffed.length).toBeGreaterThan(0);
    expect(unbuffed.length).toBeGreaterThan(0);

    // Echo CritRate substats must actually move the result (same regression
    // guard as above, applied to the Stat target path).
    expect(buffed[0].targetValue).toBeGreaterThan(unbuffed[0].targetValue);

    // Independently derive the "true" value via the canonical pipeline for
    // the buffed loadout the optimizer picked, and assert they agree.
    const pickedLoadout = buffed[0].loadout;
    const echoCritRateTotal = pickedLoadout.reduce(
      (sum: number, echo: any) => sum + (echo.echoSubStatsValue1 ?? 0),
      0,
    );
    const canonical = calculateAllStats({
      baseHp: context.baseHp,
      baseAtk: context.baseAtk,
      baseDef: context.baseDef,
      weaponAtk: context.weaponData.attack,
      weaponModifier: context.weaponData.modifier,
      weaponModifierValue: context.weaponData.modifierValue,
      weaponPassiveData: context.weaponData.weaponPassiveStats,
      buffsConfig: context.activeCharacterBuffs,
      resonanceChainsConfig: context.activeCharacterResonanceChains,
      customBuffs: context.customBuffs,
      teamBuffsData: context.teamBuffsData,
      echoStats: { CritRate: echoCritRateTotal },
      buffsCharInfo: context.chosenChar?.buffs ?? [],
      resonanceChainsCharInfo: context.chosenChar?.resonanceChains ?? [],
      character: "Augusta",
      talentData: context.talentData,
      activeStance: null,
    });

    expect(buffed[0].targetValue).toBeCloseTo(canonical.finalStats.totalCritRate, 5);
  });
});
