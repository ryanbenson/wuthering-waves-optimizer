import { subStatsTable } from "./stats";

// Per-tier roll weights (percent) for each substat, lined up index-for-index
// with subStatsTable's roll values. These are the developer's published
// substat rates; keep them here rather than in stats.ts so that file stays
// the single source of roll *values*. The published figures are rounded, so
// a row sums to 99.99-100.01 — consumers normalize by the row's own total.
const CRIT_WEIGHTS = [23.33, 23.33, 23.33, 8, 8, 8, 3, 3];
const STANDARD_WEIGHTS = [6.8, 7.77, 20.39, 24.27, 17.48, 14.56, 5.83, 2.91];

export const subStatRollRates: Record<string, number[]> = {
  CritRate: CRIT_WEIGHTS,
  CritDMG: CRIT_WEIGHTS,
  ATK: STANDARD_WEIGHTS,
  HP: STANDARD_WEIGHTS,
  DEF: STANDARD_WEIGHTS,
  HP_FLAT: STANDARD_WEIGHTS,
  EnergyRegen: STANDARD_WEIGHTS,
  BasicAttackDMGBonus: STANDARD_WEIGHTS,
  HeavyAttackDMGBonus: STANDARD_WEIGHTS,
  ResonanceSkillDMGBonus: STANDARD_WEIGHTS,
  ResonanceLiberationDMGBonus: STANDARD_WEIGHTS,
  ATK_FLAT: [6.8, 52.43, 37.86, 2.91],
  DEF_FLAT: [14.56, 44.66, 32.04, 8.74],
};

/** Roll values paired with their probability (0-1), lowest roll first. */
export function getSubStatRollDistribution(
  stat: string,
): Array<{ value: number; chance: number }> {
  const values = subStatsTable[stat] ?? [];
  const weights = subStatRollRates[stat] ?? [];
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (!total || values.length !== weights.length) return [];
  return values.map((value, i) => ({ value, chance: weights[i] / total }));
}
