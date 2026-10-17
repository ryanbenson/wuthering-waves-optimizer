import { subStats, subStatsTable } from "./stats";
import { getSubStatRollDistribution } from "./substatRollRates";

// Echo tuning odds: how likely an echo is to end up with a set of substats
// at or above chosen minimum rolls. Model (see docs/adr/0044):
// - every echo reveals 5 of the 13 substats, one per tune (+5 ... +25),
//   never the same substat twice;
// - each not-yet-revealed substat is equally likely on every tune;
// - the rolled value follows that substat's published tier weights.
// Pure TS — no Vue — so the Tune odds tab, the planner and the inventory
// ranking all share one implementation.

export const ECHO_SUBSTAT_SLOTS = 5;
export const TOTAL_SUBSTAT_TYPES = subStats.length;
export const TUNERS_PER_TUNE = 10;

const EPSILON = 1e-9;

/** One goal line: a substat and the lowest roll accepted (null = any roll). */
export interface TuningGoalStat {
  stat: string;
  min: number | null;
}

export type TuningGoal = TuningGoalStat[];

/** Already-revealed substats as [type, value] pairs (getEchoSubStatEntries). */
export type TunedSubstats = Array<[string, number]>;

export interface GoalOdds {
  /** Chance (0-1) the echo ends up meeting every goal line. */
  chance: number;
  /** Expected tuners spent from here, stopping once the goal can't be met. */
  expectedTuners: number;
}

/** Chance (0-1) a single roll of `stat` lands at or above `min`. */
export function rollChanceAtLeast(stat: string, min: number | null): number {
  if (min == null) return 1;
  let chance = 0;
  for (const tier of getSubStatRollDistribution(stat)) {
    if (tier.value >= min - EPSILON) chance += tier.chance;
  }
  return Math.min(chance, 1);
}

/**
 * Share of rolls (0-1) at or above an already-rolled value — "top 30%"
 * means 30% of rolls of that substat are this good or better.
 */
export function rollPercentile(stat: string, value: number): number {
  return rollChanceAtLeast(stat, value);
}

// Keeps the last line per substat and drops substats an echo can't roll.
function normalizeGoal(goal: TuningGoal): TuningGoal {
  const byStat = new Map<string, TuningGoalStat>();
  for (const line of goal) {
    if (subStats.includes(line.stat)) byStat.set(line.stat, line);
  }
  return [...byStat.values()];
}

function normalizeTuned(tuned: TunedSubstats): TunedSubstats {
  const seen = new Set<string>();
  const out: TunedSubstats = [];
  for (const [stat, value] of tuned) {
    if (seen.has(stat) || out.length >= ECHO_SUBSTAT_SLOTS) continue;
    seen.add(stat);
    out.push([stat, value]);
  }
  return out;
}

/**
 * Chance and expected tuner cost of meeting `goal`, starting from an echo
 * whose revealed substats are `tuned` (empty = a fresh +0 echo).
 */
export function goalOdds(tuned: TunedSubstats, goal: TuningGoal): GoalOdds {
  const lines = normalizeGoal(goal);
  const revealed = normalizeTuned(tuned);
  const revealedValues = new Map(revealed);
  const n0 = revealed.length;

  // Lines the echo already settled (met or missed) vs lines still open.
  const open: number[] = [];
  for (const line of lines) {
    if (revealedValues.has(line.stat)) {
      const value = revealedValues.get(line.stat)!;
      if (line.min != null && value < line.min - EPSILON) {
        return { chance: 0, expectedTuners: 0 };
      }
    } else {
      open.push(rollChanceAtLeast(line.stat, line.min));
    }
  }

  const k = open.length;
  const memo = new Map<number, GoalOdds>();

  // n = substats revealed so far, mask = open lines already met.
  function solve(n: number, mask: number): GoalOdds {
    const id = n * 64 + mask;
    const cached = memo.get(id);
    if (cached) return cached;

    let left = 0;
    for (let i = 0; i < k; i++) if (!((mask >> i) & 1)) left++;

    let result: GoalOdds;
    if (left === 0) {
      result = { chance: 1, expectedTuners: 0 };
    } else if (ECHO_SUBSTAT_SLOTS - n < left) {
      result = { chance: 0, expectedTuners: 0 };
    } else {
      const pool = TOTAL_SUBSTAT_TYPES - n;
      let chance = 0;
      let expectedTuners = TUNERS_PER_TUNE;
      for (let i = 0; i < k; i++) {
        if ((mask >> i) & 1) continue;
        // Draws this line's substat and clears the bar; drawing it and
        // missing the bar ends the attempt (adds nothing further).
        const next = solve(n + 1, mask | (1 << i));
        chance += (open[i] / pool) * next.chance;
        expectedTuners += (open[i] / pool) * next.expectedTuners;
      }
      const other = solve(n + 1, mask);
      chance += ((pool - left) / pool) * other.chance;
      expectedTuners += ((pool - left) / pool) * other.expectedTuners;
      result = { chance, expectedTuners };
    }
    memo.set(id, result);
    return result;
  }

  return solve(n0, 0);
}

function choose(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  let out = 1;
  for (let i = 1; i <= r; i++) out = (out * (n - r + i)) / i;
  return out;
}

export interface WantedDrawOdds {
  remainingTunes: number;
  /** Wanted substats not yet revealed. */
  wantedLeft: number;
  /** Chance the very next tune reveals a wanted substat. */
  next: number;
  /** Chance the remaining tunes reveal at least one / two wanted substats. */
  atLeastOne: number;
  atLeastTwo: number;
}

/**
 * Which-substat odds only (ignores roll values): how likely the remaining
 * tunes are to reveal substats from `wanted`.
 */
export function wantedDrawOdds(
  tuned: TunedSubstats,
  wanted: string[],
): WantedDrawOdds {
  const revealed = new Set(normalizeTuned(tuned).map(([stat]) => stat));
  const pool = TOTAL_SUBSTAT_TYPES - revealed.size;
  const draws = ECHO_SUBSTAT_SLOTS - revealed.size;
  const wantedLeft = [...new Set(wanted)].filter(
    (stat) => subStats.includes(stat) && !revealed.has(stat),
  ).length;
  const total = choose(pool, draws);
  const exactly = (hits: number) =>
    total ? (choose(wantedLeft, hits) * choose(pool - wantedLeft, draws - hits)) / total : 0;
  const none = draws > 0 ? exactly(0) : 1;
  return {
    remainingTunes: draws,
    wantedLeft,
    next: draws > 0 && pool > 0 ? wantedLeft / pool : 0,
    atLeastOne: draws > 0 ? 1 - none : 0,
    atLeastTwo: draws > 1 ? 1 - none - exactly(1) : 0,
  };
}

/** Echoes needed to have `confidence` (0-1) odds of at least one success. */
export function echoesForConfidence(chance: number, confidence: number): number {
  if (chance >= 1) return 1;
  if (chance <= 0) return Infinity;
  return Math.ceil(Math.log(1 - confidence) / Math.log(1 - chance));
}

/** Chance at least one of `echoes` independent attempts succeeds. */
export function chanceWithinEchoes(chance: number, echoes: number): number {
  return 1 - Math.pow(1 - chance, echoes);
}

/** Expected tuners to tune every slot to +25 on a fresh echo. */
export const FULL_TUNE_COST = ECHO_SUBSTAT_SLOTS * TUNERS_PER_TUNE;

export type TuningVerdict = "likely" | "worth-a-shot" | "long-grind" | "very-rare";

export function getTuningVerdict(chance: number): TuningVerdict {
  if (chance < 0.03) return "very-rare";
  if (chance < 0.15) return "long-grind";
  if (chance < 0.5) return "worth-a-shot";
  return "likely";
}

export const tuningVerdictLabels: Record<TuningVerdict, string> = {
  likely: "Likely",
  "worth-a-shot": "Worth a shot",
  "long-grind": "Long grind",
  "very-rare": "Very rare",
};

/** The next roll value below `min` on that substat's table, if any. */
export function getLowerRollValue(stat: string, min: number): number | null {
  const values = subStatsTable[stat] ?? [];
  let lower: number | null = null;
  for (const value of values) {
    if (value < min - EPSILON) lower = value;
  }
  return lower;
}

export interface GoalLever {
  kind: "loosen" | "drop";
  stat: string;
  /** For "loosen": the new minimum (null = any roll). */
  min?: number | null;
  chance: number;
}

/**
 * The single goal edits that raise the chance most: lower one line's
 * minimum by a tier, or drop one line entirely. Highest chance first.
 */
export function goalLevers(
  goal: TuningGoal,
  tuned: TunedSubstats = [],
  limit = 3,
): GoalLever[] {
  const lines = normalizeGoal(goal);
  const levers: GoalLever[] = [];
  lines.forEach((line, i) => {
    if (line.min != null) {
      const lower = getLowerRollValue(line.stat, line.min);
      const loosened = lines.map((l, j) => (j === i ? { ...l, min: lower } : l));
      levers.push({
        kind: "loosen",
        stat: line.stat,
        min: lower,
        chance: goalOdds(tuned, loosened).chance,
      });
    }
    if (lines.length > 1) {
      levers.push({
        kind: "drop",
        stat: line.stat,
        chance: goalOdds(tuned, lines.filter((_, j) => j !== i)).chance,
      });
    }
  });
  return levers.sort((a, b) => b.chance - a.chance).slice(0, limit);
}

export type UnfinishedEchoTag = "keep" | "baseline" | "fodder";

/**
 * How a not-fully-tuned echo compares with farming a fresh one for the same
 * goal: worth finishing ("keep"), untuned ("baseline"), or worse than a fresh
 * echo ("fodder").
 */
export function getUnfinishedEchoTag(
  chance: number,
  freshChance: number,
  tunedCount: number,
): UnfinishedEchoTag {
  if (tunedCount === 0) return "baseline";
  return chance > 0 && chance >= freshChance - EPSILON ? "keep" : "fodder";
}

/** Stable cache key for a goal (order-insensitive). */
export function getTuningGoalKey(goal: TuningGoal): string {
  return normalizeGoal(goal)
    .map((line) => `${line.stat}:${line.min ?? "any"}`)
    .sort()
    .join("|");
}

export const TUNING_GOAL_PRESETS: Record<string, { label: string; goal: TuningGoal }> = {
  "double-crit": {
    label: "Double crit",
    goal: [
      { stat: "CritRate", min: null },
      { stat: "CritDMG", min: null },
    ],
  },
  "good-double-crit": {
    label: "Good double crit",
    goal: [
      { stat: "CritRate", min: 8.1 },
      { stat: "CritDMG", min: 16.2 },
    ],
  },
};

const FLAT_SUBSTATS = new Set(["HP_FLAT", "ATK_FLAT", "DEF_FLAT"]);

/** A roll value with its unit: "8.1%" or "430". */
export function formatSubstatRoll(stat: string, value: number): string {
  return FLAT_SUBSTATS.has(stat) ? String(value) : `${value}%`;
}

/** Formats a 0-1 chance for display: "12.8%", "0.36%", "<0.01%". */
export function formatTuningChance(chance: number): string {
  if (chance >= 0.9995) return "100%";
  if (chance <= 0) return "0%";
  const pct = chance * 100;
  if (pct < 0.01) return "<0.01%";
  if (pct < 1) return `${pct.toFixed(2)}%`;
  if (pct < 10) return `${pct.toFixed(2).replace(/0$/, "")}%`;
  return `${pct.toFixed(1)}%`;
}
