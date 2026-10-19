import { subStats } from "./stats";
import { getSubStatRollDistribution, subStatRollRates } from "./substatRollRates";
import {
  SUBSTAT_SCORE_GRADES,
  getBestPossibleWeightedTotal,
  getGradeForSubstatScorePercent,
  getSubstatRollTier,
} from "./rating";
import { TUNERS_PER_TUNE, tuneStepExp } from "./levelingCost";
import {
  ECHO_SUBSTAT_SLOTS,
  choose,
  normalizeTuned,
  type GoalOdds,
  type TunedSubstats,
} from "./tuningOdds";

// Substat Score odds: where an echo's Substat Score (ADR 0012) for one
// character can end up once tuned to +25, by grade. This is what a build's
// Odds dialog asks — the build's character weights already say what a good
// echo is, so there's no separate goal. Same substat model as tuningOdds.ts
// (5 of 13 substats, each unrevealed one equally likely per tune, rolls on
// the published tier weights). Pure TS. See docs/adr/0044-echo-tuning-odds.md.

export type ScoreWeights = Record<string, number>;

const EPSILON = 1e-9;

/** E through SSS, lowest first — the Substat Score's grade bands. */
export const SCORE_GRADES: readonly string[] = SUBSTAT_SCORE_GRADES.map((band) => band.grade);

// Weighted points as the Substat Score counts them: roll tier (1 = lowest
// value) × the character's weight for that substat.
function getWeight(weights: ScoreWeights, stat: string): number {
  return weights[stat] ?? 1;
}

const roundPoints = (points: number) => Math.round(points * 1e6) / 1e6;

function weightsKey(weights: ScoreWeights): string {
  return subStats.map((stat) => getWeight(weights, stat)).join(",");
}

/** Weighted points of the substats already on the echo. */
export function echoScorePoints(tuned: TunedSubstats, weights: ScoreWeights): number {
  let points = 0;
  for (const [stat, value] of normalizeTuned(tuned)) {
    points += getSubstatRollTier(stat, value) * getWeight(weights, stat);
  }
  return roundPoints(points);
}

/** Substat Score percent (0-100) for a points total, as getSubstatScoreGrade computes it. */
export function scorePercent(points: number, weights: ScoreWeights): number {
  const max = getBestPossibleWeightedTotal(weights);
  return max <= 0 ? 0 : Math.min(Math.max(points / max, 0), 1) * 100;
}

/** Index into SCORE_GRADES for a points total. */
export function scoreGradeIndex(points: number, weights: ScoreWeights): number {
  return SCORE_GRADES.indexOf(getGradeForSubstatScorePercent(scorePercent(points, weights)).grade);
}

// scoreGradeIndex for many totals under one weight profile, memoized per
// total (the DPs below ask about the same totals over and over).
function gradeIndexer(weights: ScoreWeights): (points: number) => number {
  const memo = new Map<number, number>();
  return (points) => {
    let grade = memo.get(points);
    if (grade === undefined) {
      grade = scoreGradeIndex(points, weights);
      memo.set(points, grade);
    }
    return grade;
  };
}

const distributionCache = new Map<string, Array<[number, number]>>();

/**
 * Distribution of the echo's final weighted points once tuned to +25:
 * `[points, chance]` pairs, lowest points first. The substats still to come
 * are a uniformly random set from those not yet revealed, and each rolls on
 * its tier weights, so a DP over (substats picked, points) is exact.
 */
export function finalPointsDistribution(
  tuned: TunedSubstats,
  weights: ScoreWeights,
): Array<[number, number]> {
  const revealed = normalizeTuned(tuned);
  const start = echoScorePoints(revealed, weights);
  const revealedStats = new Set(revealed.map(([stat]) => stat));
  const key = `${weightsKey(weights)}#${[...revealedStats].sort().join(",")}#${start}`;
  const cached = distributionCache.get(key);
  if (cached) return cached;

  const pool = subStats.filter((stat) => !revealedStats.has(stat));
  const picks = Math.max(ECHO_SUBSTAT_SLOTS - revealed.length, 0);
  // byCount[c]: points → number of c-substat subsets × roll chance.
  let byCount: Array<Map<number, number>> = Array.from(
    { length: picks + 1 },
    (_, c) => new Map(c === 0 ? [[start, 1]] : []),
  );
  for (const stat of pool) {
    const weight = getWeight(weights, stat);
    const tiers = getSubStatRollDistribution(stat);
    const next = byCount.map((points) => new Map(points));
    for (let c = 0; c < picks; c++) {
      for (const [points, mass] of byCount[c]) {
        tiers.forEach(({ chance }, i) => {
          const total = roundPoints(points + (i + 1) * weight);
          next[c + 1].set(total, (next[c + 1].get(total) ?? 0) + mass * chance);
        });
      }
    }
    byCount = next;
  }

  const subsets = choose(pool.length, picks);
  const out = [...byCount[picks]]
    .map(([points, mass]) => [points, mass / subsets] as [number, number])
    .sort((a, b) => a[0] - b[0]);
  if (distributionCache.size > 200) distributionCache.clear();
  distributionCache.set(key, out);
  return out;
}

/** A fresh +0 echo's final points distribution. */
export function freshEchoPointsDistribution(weights: ScoreWeights): Array<[number, number]> {
  return finalPointsDistribution([], weights);
}

/**
 * Per grade (SCORE_GRADES order), the chance the echo finishes at that
 * grade or higher. Index 0 (E) is always 1.
 */
export function gradeReachChances(tuned: TunedSubstats, weights: ScoreWeights): number[] {
  const exact = SCORE_GRADES.map(() => 0);
  const gradeOf = gradeIndexer(weights);
  for (const [points, chance] of finalPointsDistribution(tuned, weights)) {
    exact[gradeOf(points)] += chance;
  }
  const out = exact.slice();
  for (let i = out.length - 2; i >= 0; i--) out[i] += out[i + 1];
  return out.map((chance) => Math.min(chance, 1));
}

/** Share of fresh echoes (0-1) whose final points are below `points`. */
export function freshShareBelow(points: number, weights: ScoreWeights): number {
  let below = 0;
  for (const [freshPoints, chance] of freshEchoPointsDistribution(weights)) {
    if (freshPoints < points - EPSILON) below += chance;
  }
  return Math.min(below, 1);
}

export interface BetterEchoOdds {
  /** This echo's weighted substat points (the Substat Score's numerator). */
  points: number;
  /** Chance a fresh echo, tuned to +25, scores strictly higher. */
  better: number;
  /** Chance it scores at least as high (ties included). */
  atLeast: number;
}

/**
 * For a finished echo: how likely is a fresh +0 echo, tuned all the way,
 * to end up with a higher Substat Score for the same character weights?
 * Substats only; the main stat and set come from the drop.
 */
export function betterEchoOdds(tuned: TunedSubstats, weights: ScoreWeights): BetterEchoOdds {
  const points = echoScorePoints(tuned, weights);
  let better = 0;
  let atLeast = 0;
  for (const [freshPoints, chance] of freshEchoPointsDistribution(weights)) {
    if (freshPoints > points + EPSILON) better += chance;
    if (freshPoints >= points - EPSILON) atLeast += chance;
  }
  return { points, better: Math.min(better, 1), atLeast: Math.min(atLeast, 1) };
}

/**
 * What "better" means: reaching a grade (index into SCORE_GRADES), or, for
 * a finished echo already at the top grade, any score above its points.
 */
export type ScoreTarget = { kind: "grade"; grade: number } | { kind: "beat"; points: number };

export function scoreTargetKey(target: ScoreTarget): string {
  return target.kind === "grade" ? SCORE_GRADES[target.grade] : "higher";
}


// Substats that score the same are interchangeable in the DP: same weight
// and same tier weights, or weight 0 (which scores nothing whatever it
// rolls). Grouping them keeps the state small.
interface StatClass {
  weight: number;
  chances: number[];
  count: number;
}

function groupPool(pool: string[], weights: ScoreWeights): StatClass[] {
  const byKey = new Map<string, StatClass>();
  for (const stat of pool) {
    const weight = getWeight(weights, stat);
    const key = weight === 0 ? "0" : `${weight}:${(subStatRollRates[stat] ?? []).join(",")}`;
    const existing = byKey.get(key);
    if (existing) existing.count++;
    else {
      const chances = weight === 0 ? [1] : getSubStatRollDistribution(stat).map((tier) => tier.chance);
      byKey.set(key, { weight, chances, count: 1 });
    }
  }
  return [...byKey.values()];
}

const NO_COST = { expectedTuners: 0, expectedExp: 0, successTuners: 0, successExp: 0 };
const targetOddsCache = new Map<string, GoalOdds>();

/**
 * Chance and expected cost of the echo reaching `target`, tuning from its
 * current substats and stopping as soon as the target is reached (points
 * only go up) or can't be (even the best rolls left fall short). Same
 * cost fields as goalOdds, so resourcesPerSuccess works on either.
 */
export function scoreTargetOdds(
  tuned: TunedSubstats,
  weights: ScoreWeights,
  target: ScoreTarget,
): GoalOdds {
  const revealed = normalizeTuned(tuned);
  const start = echoScorePoints(revealed, weights);
  const revealedStats = new Set(revealed.map(([stat]) => stat));
  const cacheKey = `${weightsKey(weights)}#${[...revealedStats].sort().join(",")}#${start}#${
    target.kind === "grade" ? `g${target.grade}` : `b${target.points}`
  }`;
  const cached = targetOddsCache.get(cacheKey);
  if (cached) return cached;

  const classes = groupPool(
    subStats.filter((stat) => !revealedStats.has(stat)),
    weights,
  );
  const counts = classes.map((c) => c.count);
  const best = classes
    .map((c, i) => ({ i, max: c.weight * c.chances.length }))
    .sort((a, b) => b.max - a.max);
  const memo = new Map<number, GoalOdds>();
  const gradeOf = gradeIndexer(weights);
  const reachesTarget = (points: number) =>
    target.kind === "grade" ? gradeOf(points) >= target.grade : points > target.points + EPSILON;
  // Numeric memo id: the remaining counts in mixed radix, then the points.
  const radix = classes.map((c) => c.count + 1);
  const POINTS_SPAN = 1_000_003;
  function stateId(points: number): number {
    let code = 0;
    for (let i = 0; i < counts.length; i++) code = code * radix[i] + counts[i];
    return code * POINTS_SPAN + Math.round(points * 1000);
  }

  function bestRemaining(picks: number): number {
    let total = 0;
    for (const { i, max } of best) {
      if (picks <= 0) break;
      const take = Math.min(counts[i], picks);
      total += take * max;
      picks -= take;
    }
    return total;
  }

  function solve(n: number, points: number): GoalOdds {
    if (reachesTarget(points)) return { chance: 1, ...NO_COST };
    if (n >= ECHO_SUBSTAT_SLOTS) return { chance: 0, ...NO_COST };
    if (!reachesTarget(roundPoints(points + bestRemaining(ECHO_SUBSTAT_SLOTS - n)))) {
      return { chance: 0, ...NO_COST };
    }
    const id = stateId(points);
    const hit = memo.get(id);
    if (hit) return hit;

    // This tune: level from +5n to +5(n+1), then spend one tune.
    const pool = counts.reduce((sum, c) => sum + c, 0);
    const stepExp = tuneStepExp(n);
    let chance = 0;
    let expectedTuners = TUNERS_PER_TUNE;
    let expectedExp = stepExp;
    let successTuners = 0;
    let successExp = 0;
    classes.forEach((statClass, i) => {
      if (!counts[i]) return;
      const draw = counts[i] / pool;
      counts[i]--;
      statClass.chances.forEach((rollChance, tier) => {
        const next = solve(n + 1, roundPoints(points + (tier + 1) * statClass.weight));
        const weight = draw * rollChance;
        chance += weight * next.chance;
        expectedTuners += weight * next.expectedTuners;
        expectedExp += weight * next.expectedExp;
        successTuners += weight * next.successTuners;
        successExp += weight * next.successExp;
      });
      counts[i]++;
    });
    successTuners += chance * TUNERS_PER_TUNE;
    successExp += chance * stepExp;
    const result = { chance, expectedTuners, expectedExp, successTuners, successExp };
    memo.set(id, result);
    return result;
  }

  const result = solve(revealed.length, start);
  if (targetOddsCache.size > 200) targetOddsCache.clear();
  targetOddsCache.set(cacheKey, result);
  return result;
}

/**
 * The default meaning of "better": the next grade up from where the echo
 * stands. A finished echo: one grade above its own (any higher score at
 * SSS). An unfinished echo: one grade above where it most likely lands —
 * the lowest grade it reaches less than half the time.
 */
export function defaultScoreTarget(tuned: TunedSubstats, weights: ScoreWeights): ScoreTarget {
  const revealed = normalizeTuned(tuned);
  const top = SCORE_GRADES.length - 1;
  if (revealed.length >= ECHO_SUBSTAT_SLOTS) {
    const points = echoScorePoints(revealed, weights);
    const grade = scoreGradeIndex(points, weights);
    return grade < top ? { kind: "grade", grade: grade + 1 } : { kind: "beat", points };
  }
  const reach = gradeReachChances(revealed, weights);
  const grade = reach.findIndex((chance, i) => i > 0 && chance < 0.5);
  return { kind: "grade", grade: grade === -1 ? top : grade };
}
