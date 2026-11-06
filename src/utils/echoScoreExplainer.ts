import { ECHO_RATING_GRADES, POINT_SCALE_MAX, POINT_SCALE_MIN, getEchoRatingGrade } from "../echoes/rating";
import { getEchoCritValue, subStatsTable } from "../echoes/stats";

/**
 * The CV & Echo Rating page's "score an echo" sample. Each row picks one of a substat's
 * real rolls, and the result comes from the same functions the rest of the app grades
 * echoes with, so the page can't drift from what people see on their echoes.
 */
export const SAMPLE_ECHO_SUBSTATS = [
  { stat: "CritRate", label: "Crit Rate" },
  { stat: "CritDMG", label: "Crit DMG" },
  { stat: "ATK", label: "ATK%" },
  { stat: "EnergyRegen", label: "Energy Regen" },
  { stat: "ResonanceLiberationDMGBonus", label: "Resonance Liberation DMG Bonus" },
] as const;

export function getSampleEchoRolls(index: number): number[] {
  return subStatsTable[SAMPLE_ECHO_SUBSTATS[index].stat];
}

/** `tiers` holds one 1-8 roll per row of SAMPLE_ECHO_SUBSTATS. */
export function scoreSampleEcho(tiers: number[]) {
  const echo: Record<string, string | number> = {};
  SAMPLE_ECHO_SUBSTATS.forEach(({ stat }, index) => {
    echo[`echoSubStatsType${index + 1}`] = stat;
    echo[`echoSubStatsValue${index + 1}`] = getSampleEchoRolls(index)[tiers[index] - 1];
  });
  const rating = getEchoRatingGrade(echo as never);
  return {
    points: Math.round(rating.points),
    grade: rating.grade,
    color: rating.color,
    percent: Math.round(rating.percent),
    critValue: getEchoCritValue(echo as never),
    critRate: echo.echoSubStatsValue1 as number,
    critDamage: echo.echoSubStatsValue2 as number,
    /** The middle of this point total's slot on the scale drawn from ECHO_RATING_SCALE, 0-100. */
    scalePosition: ((rating.points - POINT_SCALE_MIN + 0.5) / (POINT_SCALE_MAX - POINT_SCALE_MIN + 1)) * 100,
  };
}

/** Echo Rating's bands, each with its share of the 5-40 point scale. */
export const ECHO_RATING_SCALE = ECHO_RATING_GRADES.map((band) => ({
  ...band,
  width: band.max - band.min + 1,
}));
