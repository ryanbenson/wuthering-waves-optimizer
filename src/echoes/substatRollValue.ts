import {
  calcCharacterRotationDamage,
  type DamageAggregation,
} from "../calculator/characterRotation";
import {
  resolveComparisonRotation,
  type ComparisonTargetOptions,
} from "../calculator/rotationComparison";
import type { TeamEnemyConfig } from "../calculator/buildCharacterContext";
import { ROTATION_DAMAGE_FIELD, type LiveResultBarDamageType } from "../calculator/liveResultBar";
import { subStats, subStatsTable } from "./stats";
import { getSubStatRollDistribution } from "./substatRollRates";

/**
 * What each substat is worth to the number the Live Result Bar shows
 * (ADR 0056): per 1% (per 10 or 100 for flat stats), per typical roll, and
 * per top roll. Each value is a real before-and-after through the same
 * headless pipeline the echo-swap estimate uses (`echoImpact.ts`, ADR 0011):
 * the extra stat is added to a copy of the character's Custom Buffs, whose
 * keys are the substat keys, so no damage math lives here. A real
 * recalculation (not a derivative) is what makes the Crit Rate cap and
 * stat-scaled buffs come out right. The store is never touched.
 */

/** Echo slots a build has; each can carry a given substat once. */
export const ECHO_SLOT_COUNT = 5;

const FLAT_STEPS: Record<string, number> = { ATK_FLAT: 10, DEF_FLAT: 10, HP_FLAT: 100 };

/** The "per" unit for a substat: 1 (%) for percent stats, 10 or 100 points for flat ones. */
export function substatValueStep(key: string): number {
  return FLAT_STEPS[key] ?? 1;
}

export function isFlatSubstat(key: string): boolean {
  return key in FLAT_STEPS;
}

/**
 * The size a roll of this substat usually drops at: the mean of its roll
 * values weighted by the published drop rates (`substatRollRates.ts`, the
 * same data the Tune odds use). Rolls skew low, so this sits below the middle
 * of the range: 7.53% for Crit Rate against a 6.3-10.5% range. Percent stats
 * are whole-number percents (7.53 = 7.53%), flat stats are points.
 */
export function typicalSubstatRoll(key: string): number {
  const distribution = getSubStatRollDistribution(key);
  if (distribution.length) return distribution.reduce((sum, tier) => sum + tier.value * tier.chance, 0);
  const values = subStatsTable[key] ?? [];
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

/** The biggest roll the substat can have, and the chance (0-1) a roll lands on it. */
export function topSubstatRoll(key: string): { value: number; chance: number } {
  const distribution = getSubStatRollDistribution(key);
  if (distribution.length) return distribution[distribution.length - 1];
  const values = subStatsTable[key] ?? [];
  return values.length ? { value: Math.max(...values), chance: 0 } : { value: 0, chance: 0 };
}

export interface SubstatValue {
  /** The "per" unit: 1 (%) or 10/100 points for flat stats. */
  step: number;
  /** Damage `step` more of the stat adds. */
  perStep: number;
  /** One typical roll: its size, and the damage it adds (also as a share of the baseline). */
  typical: { roll: number; delta: number; pct: number };
  /** The top roll: its size, how often it drops (0-1), and the damage it adds. */
  top: { roll: number; chance: number; delta: number };
}

export interface SubstatRollValues {
  /** The current number, before any change. */
  baseline: number;
  /** What was measured: the rotation's name, or the attack's label. */
  label: string;
  damageType: LiveResultBarDamageType;
  /** One entry per key in `subStats`. */
  values: Record<string, SubstatValue>;
}

export type SubstatRollValueOptions = ComparisonTargetOptions & {
  damageType?: LiveResultBarDamageType;
};

/** Measures the damage change from extra substats, against a fixed baseline. */
export interface SubstatMeasurer {
  baseline: number;
  label: string;
  damageType: LiveResultBarDamageType;
  /** Damage added by these extra substat amounts (Custom Buffs units). */
  measure: (extra: Record<string, number>) => Promise<number>;
}

function readDamage(aggregation: DamageAggregation, damageType: LiveResultBarDamageType): number {
  const field = ROTATION_DAMAGE_FIELD[damageType] as keyof DamageAggregation;
  return aggregation[field] ?? 0;
}

function withExtra(customBuffs: Record<string, number>, extra: Record<string, number>) {
  const next = { ...customBuffs };
  for (const [key, amount] of Object.entries(extra)) next[key] = (Number(next[key]) || 0) + amount;
  return next;
}

/**
 * Sets up before-and-after runs on the Live Result Bar's target. Returns
 * `null` when there is nothing to measure: the bar shows a stat rather than
 * damage, no attack resolves, or the number is 0 (a healing or shield target
 * reads 0 damage, and "+0" on every row would mislead).
 */
export async function createSubstatMeasurer(
  characterId: string,
  characters: Record<string, any>,
  enemyConfig: TeamEnemyConfig,
  inventoryEchoes: any[] = [],
  options: SubstatRollValueOptions = {},
): Promise<SubstatMeasurer | null> {
  if (options.target?.startsWith("Stat:")) return null;
  const damageType = options.damageType ?? "Average";
  const rotation = await resolveComparisonRotation(
    characterId,
    characters,
    "substat-roll-value",
    "Substat roll value",
    options,
  );
  if (!rotation) return null;

  const characterData = characters?.[characterId] ?? {};
  const storedCustomBuffs: Record<string, number> = characterData.customBuffs ?? {};
  const run = (extra: Record<string, number> | null) =>
    calcCharacterRotationDamage(
      rotation,
      null,
      characterId,
      extra
        ? { ...characters, [characterId]: { ...characterData, customBuffs: withExtra(storedCustomBuffs, extra) } }
        : characters,
      enemyConfig,
      inventoryEchoes,
    );

  const baselineResult = await run(null);
  const baseline = readDamage(baselineResult.damageAggregation, damageType);
  if (!(baseline > 0)) return null;

  const isSingleAttack = rotation.id === "substat-roll-value";
  const label = isSingleAttack
    ? (baselineResult.attacks?.[0]?.label ?? baselineResult.attacks?.[0]?.name ?? rotation.actions[0]?.key ?? "")
    : rotation.name;

  const measure = async (extra: Record<string, number>) => {
    if (!Object.values(extra).some((amount) => amount !== 0)) return 0;
    const result = await run(extra);
    const delta = readDamage(result.damageAggregation, damageType) - baseline;
    // Float noise from an unchanged result reads as "+0", not "+0.0000001".
    return Math.abs(delta) < 1e-6 ? 0 : delta;
  };

  return { baseline, label, damageType, measure };
}

/**
 * Measures one typical roll of every substat, then per-step and the top roll
 * only for those a typical roll moves: a stat a whole roll can't move won't
 * move for 1% either. About 20 runs for a typical build instead of 39.
 */
export async function measureSubstatValues(measurer: SubstatMeasurer): Promise<SubstatRollValues> {
  const entries = await Promise.all(
    subStats.map(async (key): Promise<[string, SubstatValue]> => {
      const step = substatValueStep(key);
      const typicalRoll = typicalSubstatRoll(key);
      const top = topSubstatRoll(key);
      const typicalDelta = await measurer.measure({ [key]: typicalRoll });
      const [perStep, topDelta] =
        typicalDelta === 0
          ? [0, 0]
          : await Promise.all([measurer.measure({ [key]: step }), measurer.measure({ [key]: top.value })]);
      return [
        key,
        {
          step,
          perStep,
          typical: { roll: typicalRoll, delta: typicalDelta, pct: typicalDelta / measurer.baseline },
          top: { roll: top.value, chance: top.chance, delta: topDelta },
        },
      ];
    }),
  );
  const { baseline, label, damageType } = measurer;
  return { baseline, label, damageType, values: Object.fromEntries(entries) };
}

/** `createSubstatMeasurer` and `measureSubstatValues` in one call. */
export async function estimateSubstatRollValues(
  characterId: string,
  characters: Record<string, any>,
  enemyConfig: TeamEnemyConfig,
  inventoryEchoes: any[] = [],
  options: SubstatRollValueOptions = {},
): Promise<SubstatRollValues | null> {
  const measurer = await createSubstatMeasurer(characterId, characters, enemyConfig, inventoryEchoes, options);
  return measurer ? measureSubstatValues(measurer) : null;
}

export interface RollForPick {
  key: string;
  value: SubstatValue;
}

/**
 * The substats whose next typical roll adds the most, best first. Stats
 * already on all five echoes are left out (there's no echo left to roll one
 * on), and so are those that add nothing.
 */
export function pickRollFor(
  values: Record<string, SubstatValue>,
  echoCounts: Record<string, number> = {},
  count = 3,
): RollForPick[] {
  return Object.entries(values)
    .filter(([key, value]) => value.typical.delta > 0 && (echoCounts[key] ?? 0) < ECHO_SLOT_COUNT)
    .sort((a, b) => b[1].typical.delta - a[1].typical.delta || a[0].localeCompare(b[0]))
    .slice(0, count)
    .map(([key, value]) => ({ key, value }));
}

/** "+2,987", shortened from 100K up so a rotation's total fits a cell ("+123K", "+1.23M"). */
export function formatRollGain(delta: number): string {
  const sign = delta < 0 ? "−" : "+";
  const abs = Math.abs(delta);
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 100_000) return `${sign}${Math.round(abs / 1000)}K`;
  return `${sign}${Math.round(abs).toLocaleString("en-US")}`;
}

/** A roll size for display: "7.5%" for percent stats, "44" for flat ones. */
export function formatRollSize(key: string, value: number): string {
  return isFlatSubstat(key) ? String(Math.round(value)) : `${Number(value.toFixed(1))}%`;
}

/** How often the top roll drops, as a plain chance: "3 in 100", or "1 in 250" when rarer than 1 in 100. */
export function formatTopRollChance(chance: number): string {
  if (!(chance > 0)) return "";
  if (chance * 100 >= 0.5) return `${Math.round(chance * 100)} in 100`;
  return `1 in ${Math.round(1 / chance)}`;
}
