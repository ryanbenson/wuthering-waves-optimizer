import { subStatsTable, subStats, getEchoSubStatEntries } from "./stats";
import type { EchoSubStatsSource } from "./stats";

export const SUBSTAT_WEIGHT_MIN = 0;
export const SUBSTAT_WEIGHT_MAX = 4;
export const SUBSTAT_WEIGHT_STEP = 0.5;

export type SubstatWeights = Partial<Record<string, number>>;

// Neutral profile (every substat weighted equally) — reproduces the plain
// 1-8 point-per-substat scale with no bias. Used as the global Echo Rating's
// baseline (no customization yet) and as a character's baseline when that
// character has no curated profile at all (no basis to assume any stat
// matters less than another yet).
export const DEFAULT_SUBSTAT_WEIGHTS: Record<string, number> = Object.fromEntries(
  subStats.map((stat) => [stat, 1]),
);

// Every stat ignored by default. Used as a curated character's baseline: a
// curated profile is a deliberate, complete statement of what matters for
// that character, so a stat it doesn't mention should count for nothing,
// not the neutral default.
export const ZERO_SUBSTAT_WEIGHTS: Record<string, number> = Object.fromEntries(
  subStats.map((stat) => [stat, 0]),
);

export function clampSubstatWeight(weight: number): number {
  const clamped = Math.min(
    Math.max(weight, SUBSTAT_WEIGHT_MIN),
    SUBSTAT_WEIGHT_MAX,
  );
  return Math.round(clamped / SUBSTAT_WEIGHT_STEP) * SUBSTAT_WEIGHT_STEP;
}

// Layers weight sources onto a baseline, later sources winning — e.g.
// resolveSubstatWeights(ZERO_SUBSTAT_WEIGHTS, curatedCharacterDefaults, userOverrides).
// The baseline is caller-chosen (DEFAULT_SUBSTAT_WEIGHTS for the global Echo
// Rating and for a character with no curated profile at all; ZERO_SUBSTAT_WEIGHTS
// for a curated character, so stats its curated profile omits count as 0, not neutral).
export function resolveSubstatWeights(
  baseline: Record<string, number>,
  ...sources: Array<SubstatWeights | undefined | null>
): Record<string, number> {
  const resolved: Record<string, number> = { ...baseline };
  for (const source of sources) {
    if (!source) continue;
    for (const [stat, weight] of Object.entries(source)) {
      if (weight !== undefined && weight !== null) resolved[stat] = weight;
    }
  }
  return resolved;
}

function getWeightFor(weights: SubstatWeights, stat: string): number {
  return weights[stat] ?? DEFAULT_SUBSTAT_WEIGHTS[stat] ?? 1;
}

// The number of possible roll values for a substat — most have 8, but
// ATK_FLAT/DEF_FLAT only have 4 (see subStatsTable). HP_FLAT has the full 8,
// same granularity/probability distribution as any %-based substat, despite
// also being a "flat" stat — the two other flat stats' narrower range isn't
// a property of "flatness," just of those two specific substats, so it's
// derived per-stat from the real roll table rather than assumed uniformly.
function getSubstatTierCount(stat: string): number {
  return subStatsTable[stat]?.length ?? 8;
}

// 1-N roll tier (N = getSubstatTierCount): position of the rolled value
// within that substat's possible values (matches the same subStatsTable
// used for RV, just reindexed as a point scale instead of a 30-100 score).
export function getSubstatRollTier(
  stat: string,
  value: number | string,
): number {
  const tiers = subStatsTable[stat];
  if (!tiers) return 0;
  const target = String(Number(value));
  const index = tiers.findIndex((tierValue) => String(tierValue) === target);
  return index === -1 ? 0 : index + 1;
}

// The achievable tier range for a stat — used to compute weighted min/max
// possible totals.
function getSubstatTierBounds(stat: string): { min: number; max: number } {
  return { min: 1, max: getSubstatTierCount(stat) };
}

export interface EchoRatingPoints {
  rawPoints: number; // unweighted sum of roll tiers (1-8 per filled substat)
  weightedPoints: number; // sum of tier * weight
  minPossible: number; // achievable weighted min for the filled substats
  maxPossible: number; // achievable weighted max for the filled substats
  filledCount: number; // 0-5 revealed substats
}

export function getEchoRatingPoints(
  echo: EchoSubStatsSource,
  weights: SubstatWeights = DEFAULT_SUBSTAT_WEIGHTS,
): EchoRatingPoints {
  let rawPoints = 0;
  let weightedPoints = 0;
  let minPossible = 0;
  let maxPossible = 0;
  let filledCount = 0;

  for (const [type, value] of getEchoSubStatEntries(echo)) {
    const tier = getSubstatRollTier(type, value);
    if (tier === 0) continue;
    filledCount += 1;
    const weight = getWeightFor(weights, type);
    const bounds = getSubstatTierBounds(type);
    rawPoints += tier;
    weightedPoints += tier * weight;
    minPossible += bounds.min * weight;
    maxPossible += bounds.max * weight;
  }

  return { rawPoints, weightedPoints, minPossible, maxPossible, filledCount };
}

export const POINT_SCALE_MIN = 5;
export const POINT_SCALE_MAX = 40;

// Maps a (possibly weighted) point sum back onto the fixed 5-40 scale the
// grade bands are defined on, so customizing weights doesn't require
// re-deriving the bands — with the default uniform weight=1 profile this is
// the identity function (min=5, max=40 already).
function normalizeToPointScale(points: EchoRatingPoints): number {
  const { weightedPoints, minPossible, maxPossible } = points;
  if (maxPossible <= minPossible) return POINT_SCALE_MIN;
  const ratio = (weightedPoints - minPossible) / (maxPossible - minPossible);
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return POINT_SCALE_MIN + clamped * (POINT_SCALE_MAX - POINT_SCALE_MIN);
}

export type RatingColor = "white" | "green" | "blue" | "purple" | "gold" | "red";

export interface RatingGradeBand {
  grade: string;
  min: number;
  max: number;
  color: RatingColor;
}

// Point-scale bands (5-40), per the issue's stated E/SSS anchors.
export const ECHO_RATING_GRADES: RatingGradeBand[] = [
  { grade: "E", min: 5, max: 12, color: "white" },
  { grade: "D", min: 13, max: 15, color: "green" },
  { grade: "C", min: 16, max: 17, color: "blue" },
  { grade: "B", min: 18, max: 19, color: "purple" },
  { grade: "A", min: 20, max: 21, color: "purple" },
  { grade: "S", min: 22, max: 23, color: "gold" },
  { grade: "SS", min: 24, max: 26, color: "gold" },
  { grade: "SSS", min: 27, max: 40, color: "red" },
];

// Equal-width percentage bands (0-100%) for the normalized Substat Score.
export const SUBSTAT_SCORE_GRADES: RatingGradeBand[] = [
  { grade: "E", min: 0, max: 12.5, color: "white" },
  { grade: "D", min: 12.5, max: 25, color: "green" },
  { grade: "C", min: 25, max: 37.5, color: "blue" },
  { grade: "B", min: 37.5, max: 50, color: "purple" },
  { grade: "A", min: 50, max: 62.5, color: "purple" },
  { grade: "S", min: 62.5, max: 75, color: "gold" },
  { grade: "SS", min: 75, max: 87.5, color: "gold" },
  { grade: "SSS", min: 87.5, max: 100, color: "red" },
];

function findGrade(bands: RatingGradeBand[], value: number): RatingGradeBand {
  for (const band of bands) {
    if (value <= band.max) return band;
  }
  return bands[bands.length - 1];
}

export interface EchoRating {
  grade: string;
  color: RatingColor;
  points: number; // normalized onto the 5-40 scale
  percent: number; // points re-expressed as 0-100%, for display alongside the letter
  provisional: boolean;
}

// The global, always-visible echo quality grade (E-SSS).
export function getEchoRatingGrade(
  echo: EchoSubStatsSource,
  weights: SubstatWeights = DEFAULT_SUBSTAT_WEIGHTS,
): EchoRating {
  const points = getEchoRatingPoints(echo, weights);
  const normalized = normalizeToPointScale(points);
  const band = findGrade(ECHO_RATING_GRADES, normalized);
  const percent =
    ((normalized - POINT_SCALE_MIN) / (POINT_SCALE_MAX - POINT_SCALE_MIN)) * 100;
  return {
    grade: band.grade,
    color: band.color,
    points: normalized,
    percent,
    provisional: points.filledCount < 5,
  };
}

export interface SubstatScore {
  grade: string;
  color: RatingColor;
  percent: number; // 0-100
  provisional: boolean;
}

// Grade/color for an already-computed percent (0-100) — used for rollups
// that average several echoes' individual Substat Scores rather than
// grading a single echo.
export function getGradeForSubstatScorePercent(
  percent: number,
): Pick<SubstatScore, "grade" | "color"> {
  const clamped = Math.min(Math.max(percent, 0), 100);
  const band = findGrade(SUBSTAT_SCORE_GRADES, clamped);
  return { grade: band.grade, color: band.color };
}

// The best achievable weighted point total across any possible 5-substat
// echo for a given weight profile: of the 13 possible substats, the 5 that
// would contribute the most if each were rolled at *its own* real maximum
// tier (weight × that stat's tier count — 8 for most, 4 for ATK_FLAT/
// DEF_FLAT). This is the Substat Score's fixed denominator — an echo is
// scored against the character's ideal echo, not just against itself.
// Scoring against only the substats this particular echo happens to have
// would silently exclude a missing top-priority stat from both sides of the
// ratio, so an echo could hit 100% while missing the character's single
// most important substat entirely. Picking the top 5 by weight × own tier
// count (rather than by weight alone) correctly values a low-granularity
// stat like ATK_FLAT/DEF_FLAT below an equally-weighted 8-tier stat, since
// no real echo can roll it any higher than tier 4 regardless of weight.
function getBestPossibleWeightedTotal(weights: SubstatWeights): number {
  return subStats
    .map((stat) => (weights[stat] ?? 0) * getSubstatTierCount(stat))
    .sort((a, b) => b - a)
    .slice(0, 5)
    .reduce((sum, potential) => sum + potential, 0);
}

// The per-character weighted Substat Score (0-100%).
export function getSubstatScoreGrade(
  echo: EchoSubStatsSource,
  characterWeights: SubstatWeights,
): SubstatScore {
  const points = getEchoRatingPoints(echo, characterWeights);
  const maxPossible = getBestPossibleWeightedTotal(characterWeights);
  const percent =
    maxPossible <= 0
      ? 0
      : Math.min(Math.max(points.weightedPoints / maxPossible, 0), 1) * 100;
  const band = findGrade(SUBSTAT_SCORE_GRADES, percent);
  return {
    grade: band.grade,
    color: band.color,
    percent,
    provisional: points.filledCount < 5,
  };
}
