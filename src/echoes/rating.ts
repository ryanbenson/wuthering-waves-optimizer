import { subStatsTable, subStats, getEchoSubStatEntries } from "./stats";
import type { EchoSubStatsSource } from "./stats";

export const SUBSTAT_WEIGHT_MIN = 0;
export const SUBSTAT_WEIGHT_MAX = 4;
export const SUBSTAT_WEIGHT_STEP = 0.5;

export type SubstatWeights = Partial<Record<string, number>>;

// Neutral profile (every substat weighted equally) — reproduces the plain
// 1-8 point-per-substat scale with no bias, used whenever no global or
// character-specific weight profile has been customized yet.
export const DEFAULT_SUBSTAT_WEIGHTS: Record<string, number> = Object.fromEntries(
  subStats.map((stat) => [stat, 1]),
);

export function clampSubstatWeight(weight: number): number {
  const clamped = Math.min(
    Math.max(weight, SUBSTAT_WEIGHT_MIN),
    SUBSTAT_WEIGHT_MAX,
  );
  return Math.round(clamped / SUBSTAT_WEIGHT_STEP) * SUBSTAT_WEIGHT_STEP;
}

// Layers weight sources onto the neutral default, later sources winning —
// e.g. resolveSubstatWeights(curatedCharacterDefaults, userOverrides).
export function resolveSubstatWeights(
  ...sources: Array<SubstatWeights | undefined | null>
): Record<string, number> {
  const resolved: Record<string, number> = { ...DEFAULT_SUBSTAT_WEIGHTS };
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

// 1-8 roll tier: position of the rolled value within that substat's 8
// possible values (matches the same subStatsTable used for RV, just
// reindexed as a point scale instead of a 30-100 score).
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
    rawPoints += tier;
    weightedPoints += tier * weight;
    minPossible += 1 * weight;
    maxPossible += 8 * weight;
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
  return {
    grade: band.grade,
    color: band.color,
    points: normalized,
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

// The per-character weighted Substat Score (0-100%).
export function getSubstatScoreGrade(
  echo: EchoSubStatsSource,
  characterWeights: SubstatWeights,
): SubstatScore {
  const points = getEchoRatingPoints(echo, characterWeights);
  const percent =
    points.maxPossible <= 0
      ? 0
      : Math.min(Math.max(points.weightedPoints / points.maxPossible, 0), 1) *
        100;
  const band = findGrade(SUBSTAT_SCORE_GRADES, percent);
  return {
    grade: band.grade,
    color: band.color,
    percent,
    provisional: points.filledCount < 5,
  };
}
