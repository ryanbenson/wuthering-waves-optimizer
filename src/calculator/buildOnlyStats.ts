/**
 * A character's "build" stats — equipment + permanent unlocks alone, with no
 * conditional, team or custom buffs (issue #383). One helper so the build
 * card and the V3 build-vs-live split (ADR 0051) can't drift apart.
 *
 * Pure: no Vue, no stores.
 */
import {
  buildCharacterCalculationContext,
  type TeamEnemyConfig,
} from "./buildCharacterContext";
import { computeTotalTuneBreakBoost } from "./stats";
import type { StatSourceInputs } from "./statSplit";

// Stats don't depend on the enemy except through Havoc Bane stacks, which a
// build has none of — fixed so the build card reads the same everywhere.
export const BUILD_ONLY_ENEMY_CONFIG: TeamEnemyConfig = {
  enemyLevel: 90,
  enemyResist: 0.1,
  enemyType: "Calamity",
};

/** Same field names and units as Calculator.vue's live refs /
 *  `LiveResultStatSource` (crit/ER/healing/tune break as decimals, DMG
 *  bonuses as whole-number percents). */
export interface LiveStatValues {
  totalHp: number;
  totalAtk: number;
  totalDef: number;
  totalCritRate: number;
  totalCritDmg: number;
  energyRegen: number;
  basicAttackDmgBonus: number;
  heavyAttackDmgBonus: number;
  resonanceSkillDmgBonus: number;
  resonanceLiberationDmgBonus: number;
  healingBonus: number;
  tuneBreakBoost: number;
  glacio: number;
  fusion: number;
  electro: number;
  aero: number;
  spectro: number;
  havoc: number;
}

/** Maps a pipeline `finalStats` object the same way Calculator.vue's
 *  `updateStats` does. */
export function toLiveStatValues(finalStats: Record<string, any>, tuneBreakBoost: number): LiveStatValues {
  return {
    totalHp: finalStats.totalHp ?? 0,
    totalAtk: finalStats.totalAtk ?? 0,
    totalDef: finalStats.totalDef ?? 0,
    totalCritRate: (finalStats.critRate ?? 0) / 100,
    totalCritDmg: (finalStats.critDMG ?? 0) / 100,
    energyRegen: finalStats.energyRegen ?? 0,
    basicAttackDmgBonus: finalStats.basicAttackDMGBonus ?? 0,
    heavyAttackDmgBonus: finalStats.heavyAttackDMGBonus ?? 0,
    resonanceSkillDmgBonus: finalStats.resonanceSkillDMGBonus ?? 0,
    resonanceLiberationDmgBonus: finalStats.resonanceLiberationDMGBonus ?? 0,
    healingBonus: finalStats.healingBonus ?? 0,
    tuneBreakBoost,
    glacio: finalStats.glacio ?? 0,
    fusion: finalStats.fusion ?? 0,
    electro: finalStats.electro ?? 0,
    aero: finalStats.aero ?? 0,
    spectro: finalStats.spectro ?? 0,
    havoc: finalStats.havoc ?? 0,
  };
}

export interface BuildOnlyStats {
  /** Raw pipeline output, as the build card's CalculatorStats consumes it. */
  finalStats: Record<string, any>;
  tuneBreakBoost: number;
  values: LiveStatValues;
  inputs: StatSourceInputs;
}

export async function computeBuildOnlyStats(
  characterId: string,
  characters: Record<string, any>,
  inventoryEchoes: any[] = [],
): Promise<BuildOnlyStats> {
  const built = await buildCharacterCalculationContext(
    characterId,
    characters,
    BUILD_ONLY_ENEMY_CONFIG,
    inventoryEchoes,
    { alwaysEnabledOnly: true },
  );
  const baseTuneBreakBoost = built.chosenChar?.basic?.tuneBreakBoost ?? 0;
  const echoTuneBreakBoost = Number((built.echoStats as any)?.tuneBreakBoost ?? 0);
  // Matches what the build card has always shown: base + echoes only.
  const tuneBreakBoost = computeTotalTuneBreakBoost({
    baseTuneBreakBoost,
    echoStats: built.echoStats as { tuneBreakBoost?: number },
  });
  return {
    finalStats: built.finalStats,
    tuneBreakBoost,
    values: toLiveStatValues(built.finalStats, tuneBreakBoost),
    inputs: {
      baseHp: built.baseHp,
      baseAtk: built.baseAtk,
      baseDef: built.baseDef,
      weaponData: built.weaponData,
      selfBuffs: built.appliedCharBuffsData,
      resonanceChains: built.charResonanceChainsData,
      echoStats: built.echoStats,
      echoSetAdditionalBase: built.echoSetAdditionalBaseBuffsData,
      // The context returns the stored team/custom buffs, but the build-only
      // pass ran with neither.
      customBuffs: {},
      teamBuffs: {},
      tuneBreakBoost: {
        base: baseTuneBreakBoost,
        selfBuffs: 0,
        resonanceChains: 0,
        teamBuffs: 0,
        echoes: echoTuneBreakBoost,
      },
    },
  };
}
