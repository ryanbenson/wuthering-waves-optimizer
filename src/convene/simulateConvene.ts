/**
 * Monte Carlo simulation for featured 5★ on event banners (non-beginner).
 *
 * 5★ pity uses a large-sample empirical model (millions of player convenes):
 * pulls 1–65 fixed 0.8%; 66–70 +4% per pull; 71–75 +8% per pull; 76–78 +10% per pull;
 * pull 79 fixed 100%. Overall ~1.848% per pull, ~54.1 pulls expected to a 5★.
 *
 * The 4★ rule (9 consecutive non-4★ pulls force a 4★ if not a 5★, reset on 5★) is not
 * simulated: 5★ is resolved first, so that floor does not change per-pull 5★ probability
 * or the distribution of featured 5★ counts.
 *
 * Character: 50/50 on rate-up with carry-over guarantee. Weapon: every 5★ is promotional.
 */

export const ASTRITE_PER_WISH = 160;

/** 1-indexed pull number since last 5★ at which 5★ is guaranteed (empirical model). */
export const FIVE_STAR_GUARANTEED_ON_PULL = 79;

/**
 * Maximum `pullsSinceLastFive` in a valid state (78 failures → next pull is #79, 100% 5★).
 */
export const MAX_PULLS_SINCE_LAST_FIVE = FIVE_STAR_GUARANTEED_ON_PULL - 1;

/** Probability the next wish is a 5★, given pulls since last 5★ (0-based). */
export function fiveStarChance(pullsSinceLastFive: number): number {
  const n = pullsSinceLastFive + 1;
  if (n >= FIVE_STAR_GUARANTEED_ON_PULL) return 1;
  if (n <= 65) return 0.008;
  if (n <= 70) return 0.008 + (n - 65) * 0.04;
  if (n <= 75) return 0.208 + (n - 70) * 0.08;
  return 0.608 + (n - 75) * 0.1;
}

export type ConveneMode = "character" | "weapon";

export interface SimulateParams {
  wishes: number;
  mode: ConveneMode;
  /** Pulls already done without a 5★ (0–{@link MAX_PULLS_SINCE_LAST_FIVE}). */
  startingPity: number;
  /** Character only: if true, next 5★ is guaranteed featured. */
  guaranteedNextFeatured: boolean;
}

function random(): number {
  return Math.random();
}

/**
 * Featured 5★ copies obtained after exactly `wishes` pulls (full budget).
 */
export function simulateFeaturedCopies(params: SimulateParams): number {
  const { wishes, mode, startingPity, guaranteedNextFeatured } = params;
  let pity = Math.max(
    0,
    Math.min(MAX_PULLS_SINCE_LAST_FIVE, startingPity),
  );
  let featured = 0;
  let guaranteed = guaranteedNextFeatured;

  for (let used = 0; used < wishes; used++) {
    const p5 = fiveStarChance(pity);
    const roll = random();
    if (roll < p5) {
      if (mode === "weapon") {
        featured++;
      } else {
        if (guaranteed) {
          featured++;
          guaranteed = false;
        } else if (random() < 0.5) {
          featured++;
        } else {
          guaranteed = true;
        }
      }
      pity = 0;
    } else {
      pity++;
    }
  }

  return featured;
}

export interface StepProbability {
  label: string;
  /** P(at least `copies` featured) with current wishes */
  probability: number;
  copies: number;
}

export interface ConveneSimulationResult {
  /** P(obtain at least copiesNeeded featured) */
  targetMetRate: number;
  /** Mean featured copies across runs */
  meanFeatured: number;
  /** Per-step: P(at least 1), P(at least 2), … up to copiesNeeded */
  stepProbabilities: StepProbability[];
}

export interface MonteCarloParams extends SimulateParams {
  /** Additional promotional 5★ copies needed (already-owned progress is applied in the UI). */
  maxCopies: number;
  /**
   * Copies owned before this wish budget (0 = no copy). Resonance S_n needs `n + 1` copies.
   * Used only for chart labels (e.g. ≥1 pull → S0 when starting from 0 copies).
   */
  copiesOwnedBefore: number;
}

/**
 * @param iterations — Monte Carlo sample size (e.g. 20000)
 */
export function runMonteCarlo(
  params: MonteCarloParams,
  iterations: number,
): ConveneSimulationResult {
  const {
    wishes,
    mode,
    startingPity,
    guaranteedNextFeatured,
    maxCopies,
    copiesOwnedBefore,
  } = params;

  if (maxCopies <= 0) {
    let sumFeatured = 0;
    for (let i = 0; i < iterations; i++) {
      sumFeatured += simulateFeaturedCopies({
        wishes,
        mode,
        startingPity,
        guaranteedNextFeatured,
      });
    }
    return {
      targetMetRate: 1,
      meanFeatured: sumFeatured / iterations,
      stepProbabilities: [],
    };
  }

  const countsAtLeast: number[] = new Array(maxCopies + 1).fill(0);
  let sumFeatured = 0;
  let targetMet = 0;

  for (let i = 0; i < iterations; i++) {
    const got = simulateFeaturedCopies({
      wishes,
      mode,
      startingPity,
      guaranteedNextFeatured,
    });
    sumFeatured += got;
    if (got >= maxCopies) targetMet++;
    for (let k = 1; k <= maxCopies; k++) {
      if (got >= k) countsAtLeast[k]++;
    }
  }

  const stepProbabilities: StepProbability[] = [];
  for (let k = 1; k <= maxCopies; k++) {
    const idxAfter = copiesOwnedBefore + k - 1;
    const label =
      mode === "character"
        ? `≥${k} pull${k > 1 ? "s" : ""} → S${idxAfter}+`
        : `≥${k} pull${k > 1 ? "s" : ""} → R${idxAfter}+`;
    stepProbabilities.push({
      label,
      probability: countsAtLeast[k]! / iterations,
      copies: k,
    });
  }

  return {
    targetMetRate: targetMet / iterations,
    meanFeatured: sumFeatured / iterations,
    stepProbabilities,
  };
}
