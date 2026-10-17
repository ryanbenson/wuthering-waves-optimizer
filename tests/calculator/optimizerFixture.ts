// Shared optimizer test fixture: a fixed 5-echo loadout and the OptimizerContext the
// main-thread optimize() and processLoadout() take, built from a character config.
import type { OptimizerContext } from "../../src/calculator/optimizer";
import {
  buildCharacterCalculationContext,
  type TeamEnemyConfig,
} from "../../src/calculator/buildCharacterContext";

export const enemyConfig: TeamEnemyConfig = {
  enemyLevel: 90,
  enemyResist: 0.1,
  enemyType: "Calamity",
};

// One fixed 5-echo loadout (standard 4+3+3+1+1 = 12 cost budget), shared
// between the "already equipped" (ground truth, via characterRotation.ts)
// and "optimizer search space" (forced to this exact combo) representations
// below — same values, two shapes.
export const fixedEchoes = [
  { echo: "Main4", type: 4, echoId: "m4", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 50 },
  { echo: "ThreeA", type: 3, echoId: "t3a", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 30 },
  { echo: "ThreeB", type: 3, echoId: "t3b", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 30 },
  { echo: "OneA", type: 1, echoId: "o1a", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 10 },
  { echo: "OneB", type: 1, echoId: "o1b", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 10 },
];

export async function buildOptimizerContext(
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
