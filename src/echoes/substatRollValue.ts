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
import { getEchoSubStatEntries, subStats, subStatsTable, type EchoSubStatsSource } from "./stats";

/**
 * What one more roll of each substat adds to the number the Live Result Bar
 * shows (ADR 0056). Each value is a real before-and-after through the same
 * headless pipeline the echo-swap estimate uses (`echoImpact.ts`, ADR 0011):
 * the roll is added to a copy of the character's Custom Buffs, whose keys are
 * the substat keys, so no damage math lives here. A real recalculation (not a
 * derivative) is what makes the Crit Rate cap and stat-scaled buffs come out
 * right. The store is never touched.
 *
 * A substat can sit on each echo only once, so a stat already on all five
 * echoes has no slot for another roll. For those the value is instead what
 * the build gains if every one of its current rolls were a max roll.
 */

/** Echo slots a build has; each can carry a given substat once. */
export const ECHO_SLOT_COUNT = 5;

export interface SubstatRollGain {
  /**
   * "roll": one more average roll (the stat has a free echo slot).
   * "max": every current roll of it raised to the max (it's on all five echoes).
   */
  kind: "roll" | "max";
  /** Damage added. */
  delta: number;
  /** `delta` as a share of the current number (0.05 = +5%). */
  pct: number;
}

export interface SubstatRollValues {
  /** The current number, before any extra roll. */
  baseline: number;
  /** What was measured: the rotation's name, or the attack's label. */
  label: string;
  damageType: LiveResultBarDamageType;
  /** One entry per key in `subStats`. */
  gains: Record<string, SubstatRollGain>;
}

export interface SubstatRollValueOptions extends ComparisonTargetOptions {
  damageType?: LiveResultBarDamageType;
  /** Each substat's current roll values across the equipped echoes (`collectSubstatRolls`). */
  rolls?: Record<string, number[]>;
}

/**
 * The average size of one roll: the mean of the substat's possible roll values.
 * Percent stats are whole-number percents (8.4 = 8.4%) and flat stats are
 * points, the same units Custom Buffs stores.
 */
export function averageSubstatRoll(key: string): number {
  const values = subStatsTable[key];
  if (!values?.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/** The biggest single roll the substat can have. */
export function maxSubstatRoll(key: string): number {
  const values = subStatsTable[key];
  return values?.length ? Math.max(...values) : 0;
}

/** Each substat's roll values across the given echoes, one entry per echo that has it. */
export function collectSubstatRolls(echoes: EchoSubStatsSource[]): Record<string, number[]> {
  const rolls: Record<string, number[]> = {};
  for (const echo of echoes) {
    for (const [type, value] of getEchoSubStatEntries(echo)) (rolls[type] ??= []).push(value);
  }
  return rolls;
}

/**
 * What to add for one substat, and which kind of value that is: one average
 * roll while it has a free echo slot, otherwise the gap between its current
 * rolls and max rolls (0 once they're all maxed).
 */
export function substatRollIncrease(
  key: string,
  rolls: number[] = [],
): { kind: SubstatRollGain["kind"]; amount: number } {
  if (rolls.length < ECHO_SLOT_COUNT) return { kind: "roll", amount: averageSubstatRoll(key) };
  const max = maxSubstatRoll(key);
  const amount = rolls.reduce((sum, value) => sum + Math.max(0, max - value), 0);
  return { kind: "max", amount };
}

function readDamage(aggregation: DamageAggregation, damageType: LiveResultBarDamageType): number {
  const field = ROTATION_DAMAGE_FIELD[damageType] as keyof DamageAggregation;
  return aggregation[field] ?? 0;
}

/**
 * Returns `null` when there is nothing to measure: the Live Result Bar shows
 * a stat rather than damage, no attack resolves, or the number is 0 (a
 * healing or shield target reads 0 damage, and "+0" on every row would mislead).
 */
export async function estimateSubstatRollValues(
  characterId: string,
  characters: Record<string, any>,
  enemyConfig: TeamEnemyConfig,
  inventoryEchoes: any[] = [],
  options: SubstatRollValueOptions = {},
): Promise<SubstatRollValues | null> {
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
        ? {
            ...characters,
            [characterId]: { ...characterData, customBuffs: { ...storedCustomBuffs, ...extra } },
          }
        : characters,
      enemyConfig,
      inventoryEchoes,
    );

  const baselineResult = await run(null);
  const baseline = readDamage(baselineResult.damageAggregation, damageType);
  if (!(baseline > 0)) return null;

  const entries = await Promise.all(
    subStats.map(async (key): Promise<[string, SubstatRollGain]> => {
      const { kind, amount } = substatRollIncrease(key, options.rolls?.[key]);
      if (!(amount > 0)) return [key, { kind, delta: 0, pct: 0 }];
      const current = Number(storedCustomBuffs[key]) || 0;
      const result = await run({ [key]: current + amount });
      const delta = readDamage(result.damageAggregation, damageType) - baseline;
      // Float noise from an unchanged result reads as "+0", not "+0.0000001".
      const clean = Math.abs(delta) < 1e-6 ? 0 : delta;
      return [key, { kind, delta: clean, pct: clean / baseline }];
    }),
  );

  const isSingleAttack = rotation.id === "substat-roll-value";
  const label = isSingleAttack
    ? (baselineResult.attacks?.[0]?.label ?? baselineResult.attacks?.[0]?.name ?? rotation.actions[0]?.key ?? "")
    : rotation.name;

  return { baseline, label, damageType, gains: Object.fromEntries(entries) };
}

export interface RollForPick {
  key: string;
  gain: SubstatRollGain;
}

/**
 * The substats whose next roll adds the most, best first. Stats with no free
 * echo slot ("max" values) and those that add nothing are left out.
 */
export function pickRollFor(gains: Record<string, SubstatRollGain>, count = 3): RollForPick[] {
  return Object.entries(gains)
    .filter(([, gain]) => gain.kind === "roll" && gain.delta > 0)
    .sort((a, b) => b[1].delta - a[1].delta || a[0].localeCompare(b[0]))
    .slice(0, count)
    .map(([key, gain]) => ({ key, gain }));
}

/** "+2,987", shortened from 100K up so a rotation's total fits a row ("+123K", "+1.23M"). */
export function formatRollGain(delta: number): string {
  const sign = delta < 0 ? "−" : "+";
  const abs = Math.abs(delta);
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 100_000) return `${sign}${Math.round(abs / 1000)}K`;
  return `${sign}${Math.round(abs).toLocaleString("en-US")}`;
}
