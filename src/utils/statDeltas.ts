/**
 * How an optimizer result's stats differ from the current build (issue #746),
 * in two ways side by side:
 *
 * - `totalPercent`: how much the whole stat changes, relative to now
 *   (80.2% → 72.1% Crit Rate is -10.1%). What the tiles always showed.
 * - `parts`: how much the stat itself moves. Crit Rate, Crit DMG and Energy
 *   Regen in points (-8.1%); HP, ATK and DEF split into their %-stat and
 *   flat-stat pools (HP% -10.1%, Flat 0).
 *
 * Every number is a difference of final totals, so set bonuses and buffs a
 * loadout turns on count too, not only the echoes' own stats.
 */
import { signedInt, signedPercent, type SignedDelta } from "./signedDelta";

/** Final-stat fields read here, named as `calcCharStats` returns them. Rates are fractions (0.802). */
export type StatDeltaSource = {
  totalHp?: number;
  totalAtk?: number;
  totalDef?: number;
  totalCritRate?: number;
  totalCritDMG?: number;
  energyRegen?: number;
  hpPercent?: number;
  hpFlat?: number;
  attackPercent?: number;
  attackFlat?: number;
  defPercent?: number;
  defFlat?: number;
};

/** The %-stat and flat-stat pools behind HP, ATK and DEF. */
export type CurrentStatParts = Pick<
  StatDeltaSource,
  "hpPercent" | "hpFlat" | "attackPercent" | "attackFlat" | "defPercent" | "defFlat"
>;

/** Picks those pools off a full stats object (the shape `calcCharStats` returns). */
export function pickStatParts(stats: StatDeltaSource | null | undefined): CurrentStatParts {
  return {
    hpPercent: stats?.hpPercent,
    hpFlat: stats?.hpFlat,
    attackPercent: stats?.attackPercent,
    attackFlat: stats?.attackFlat,
    defPercent: stats?.defPercent,
    defFlat: stats?.defFlat,
  };
}

export type StatDeltaKey = "hp" | "atk" | "def" | "critRate" | "critDmg" | "energyRegen";

export type StatDeltaPart = { label: string; delta: SignedDelta };

export type StatDelta = {
  /** Relative change of the total, in percent: -10.1 means -10.1%. */
  totalPercent: number;
  /** The stat's own change; empty when the current build's split isn't known. */
  parts: StatDeltaPart[];
};

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function relativePercent(next: number, current: number): number {
  if (!current) return 0;
  return ((next - current) / current) * 100;
}

/** The %-stat and flat-stat change, or nothing when either side lacks the split. */
function splitParts(
  label: string,
  result: StatDeltaSource,
  current: StatDeltaSource,
  percentKey: "hpPercent" | "attackPercent" | "defPercent",
  flatKey: "hpFlat" | "attackFlat" | "defFlat",
): StatDeltaPart[] {
  const rp = num(result[percentKey]);
  const cp = num(current[percentKey]);
  const rf = num(result[flatKey]);
  const cf = num(current[flatKey]);
  if (rp === null || cp === null || rf === null || cf === null) return [];
  return [
    { label: `${label}%`, delta: signedPercent(rp - cp) },
    { label: "Flat", delta: signedInt(rf - cf) },
  ];
}

/** A rate stored as a fraction (0.802), changed in percentage points. */
function pointsPart(next: number, current: number): StatDeltaPart[] {
  return [{ label: "Stat", delta: signedPercent((next - current) * 100) }];
}

export function getStatDeltas(
  result: StatDeltaSource,
  current: StatDeltaSource,
): Record<StatDeltaKey, StatDelta> {
  const v = (source: StatDeltaSource, key: keyof StatDeltaSource) => num(source[key]) ?? 0;

  return {
    hp: {
      totalPercent: relativePercent(v(result, "totalHp"), v(current, "totalHp")),
      parts: splitParts("HP", result, current, "hpPercent", "hpFlat"),
    },
    atk: {
      totalPercent: relativePercent(v(result, "totalAtk"), v(current, "totalAtk")),
      parts: splitParts("ATK", result, current, "attackPercent", "attackFlat"),
    },
    def: {
      totalPercent: relativePercent(v(result, "totalDef"), v(current, "totalDef")),
      parts: splitParts("DEF", result, current, "defPercent", "defFlat"),
    },
    critRate: {
      totalPercent: relativePercent(v(result, "totalCritRate"), v(current, "totalCritRate")),
      parts: pointsPart(v(result, "totalCritRate"), v(current, "totalCritRate")),
    },
    critDmg: {
      totalPercent: relativePercent(v(result, "totalCritDMG"), v(current, "totalCritDMG")),
      parts: pointsPart(v(result, "totalCritDMG"), v(current, "totalCritDMG")),
    },
    energyRegen: {
      totalPercent: relativePercent(v(result, "energyRegen"), v(current, "energyRegen")),
      parts: pointsPart(v(result, "energyRegen"), v(current, "energyRegen")),
    },
  };
}

/** The optimizer's target-stat key (`totalCritRate`, ...) to its delta key, or null for other targets. */
export function statDeltaKeyForTarget(targetValue: string): StatDeltaKey | null {
  switch (targetValue) {
    case "totalHp":
      return "hp";
    case "totalAtk":
      return "atk";
    case "totalDef":
      return "def";
    case "totalCritRate":
      return "critRate";
    case "totalCritDMG":
      return "critDmg";
    case "energyRegen":
      return "energyRegen";
    default:
      return null;
  }
}
