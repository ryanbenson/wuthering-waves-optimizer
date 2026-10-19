// What leveling and tuning a 5★ echo costs: EXP, tuners and Shell Credits.
// Values from the game (as tabulated on the community wiki's Echo/Leveling
// page, https://wutheringwaves.fandom.com/wiki/Echo/Leveling):
// - EXP to reach each level (cumulative, 5★);
// - 0.1 Shell Credit per EXP applied (tubes and fed echoes alike);
// - each tune: 10 tuners (of the echo's rarity) and 2,000 Shell Credits;
// - feeding a leveled echo into another returns 75% of its EXP and 30% of
//   its tuners; Shell Credits aren't returned.
// Pure TS. Used by tuningOdds.ts and the Odds / planner cost readouts — see
// docs/adr/0044-echo-tuning-odds.md.

/** Cumulative EXP to reach each level of a 5★ echo, +0 through +25. */
export const ECHO_LEVEL_EXP: readonly number[] = [
  0, 400, 1000, 1900, 3000, 4400, 6100, 8100, 10500, 13300, 16500, 20100, 24200, 28800, 33900,
  39600, 46000, 53100, 60900, 69600, 79100, 89600, 101100, 113700, 127500, 142600,
];

export const ECHO_MAX_LEVEL = 25;
/** A tune unlocks every 5 levels (+5, +10, ... +25). */
export const LEVELS_PER_TUNE = 5;
export const TUNERS_PER_TUNE = 10;
export const SHELL_CREDITS_PER_EXP = 0.1;
export const SHELL_CREDITS_PER_TUNE = 2000;
export const FEED_EXP_REFUND = 0.75;
export const FEED_TUNER_REFUND = 0.3;
export const PREMIUM_SEALED_TUBE_EXP = 5000;

export interface EchoResources {
  exp: number;
  tuners: number;
  shellCredits: number;
}

/** EXP to level from tune `index` (0 = +0) up to the next tune (+5). */
export function tuneStepExp(index: number): number {
  const from = Math.min(index * LEVELS_PER_TUNE, ECHO_MAX_LEVEL);
  const to = Math.min((index + 1) * LEVELS_PER_TUNE, ECHO_MAX_LEVEL);
  return ECHO_LEVEL_EXP[to] - ECHO_LEVEL_EXP[from];
}

/** Resources for `exp` EXP applied and `tuners` spent tuning. */
export function echoResources(exp: number, tuners: number): EchoResources {
  return {
    exp,
    tuners,
    shellCredits: exp * SHELL_CREDITS_PER_EXP + (tuners / TUNERS_PER_TUNE) * SHELL_CREDITS_PER_TUNE,
  };
}

/** Leveling a 5★ echo from +0 to +25 and tuning all 5 slots. */
export const FULL_TUNE_RESOURCES: EchoResources = echoResources(
  ECHO_LEVEL_EXP[ECHO_MAX_LEVEL],
  (ECHO_MAX_LEVEL / LEVELS_PER_TUNE) * TUNERS_PER_TUNE,
);

/**
 * Expected resources per success when each attempt independently succeeds
 * with `chance`. `perAttempt` is the expected spend of one attempt;
 * `onSuccess` is the spend weighted by success (E[cost × 1{success}]).
 * With `feedFailures`, every failed attempt is fed into the next one,
 * returning 75% of its EXP and 30% of its tuners. EXP rounding on refunds
 * (the game returns whole tubes) is ignored.
 */
export function resourcesPerSuccess(
  perAttempt: EchoResources,
  onSuccess: EchoResources,
  chance: number,
  feedFailures: boolean,
): EchoResources | null {
  if (chance <= 0) return null;
  const exp = perAttempt.exp / chance;
  const tuners = perAttempt.tuners / chance;
  const shellCredits = perAttempt.shellCredits / chance;
  if (!feedFailures) return { exp, tuners, shellCredits };
  const failedExp = (perAttempt.exp - onSuccess.exp) / chance;
  const failedTuners = (perAttempt.tuners - onSuccess.tuners) / chance;
  return {
    exp: exp - FEED_EXP_REFUND * failedExp,
    tuners: tuners - FEED_TUNER_REFUND * failedTuners,
    shellCredits,
  };
}

/** Resources per success when every attempt is leveled and tuned to +25. */
export function fullTuneResourcesPerSuccess(chance: number, feedFailures: boolean) {
  const onSuccess = scaleResources(FULL_TUNE_RESOURCES, chance);
  return resourcesPerSuccess(FULL_TUNE_RESOURCES, onSuccess, chance, feedFailures);
}

export function scaleResources(r: EchoResources, factor: number): EchoResources {
  return { exp: r.exp * factor, tuners: r.tuners * factor, shellCredits: r.shellCredits * factor };
}

/** "142.6K", "1.2M": compact, for EXP and Shell Credits. */
export function formatResourceAmount(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded < 10000) return rounded.toLocaleString("en-US");
  return rounded.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 });
}
