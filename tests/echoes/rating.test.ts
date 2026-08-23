import { describe, it, expect } from "vitest";
import {
  getSubstatRollTier,
  getEchoRatingPoints,
  getEchoRatingGrade,
  getSubstatScoreGrade,
  getGradeForSubstatScorePercent,
  resolveSubstatWeights,
  clampSubstatWeight,
  DEFAULT_SUBSTAT_WEIGHTS,
  ECHO_RATING_GRADES,
  SUBSTAT_SCORE_GRADES,
} from "../../src/echoes/rating";
import type { EchoSubStatsSource } from "../../src/echoes/stats";

// Perfect (max-roll, 8/8 tier) echo across all 5 substats -> 40 raw points.
const perfectEcho: EchoSubStatsSource = {
  echoSubStatsType1: "CritRate",
  echoSubStatsValue1: 10.5,
  echoSubStatsType2: "CritDMG",
  echoSubStatsValue2: 21,
  echoSubStatsType3: "ATK",
  echoSubStatsValue3: 11.6,
  echoSubStatsType4: "HP",
  echoSubStatsValue4: 11.6,
  echoSubStatsType5: "DEF",
  echoSubStatsValue5: 14.7,
};

// Worst (min-roll, 1/8 tier) echo across all 5 substats -> 5 raw points.
const worstEcho: EchoSubStatsSource = {
  echoSubStatsType1: "CritRate",
  echoSubStatsValue1: 6.3,
  echoSubStatsType2: "CritDMG",
  echoSubStatsValue2: 12.6,
  echoSubStatsType3: "ATK",
  echoSubStatsValue3: 6.4,
  echoSubStatsType4: "HP",
  echoSubStatsValue4: 6.4,
  echoSubStatsType5: "DEF",
  echoSubStatsValue5: 8.1,
};

function buildEcho(
  entries: Array<[string, number]>,
): EchoSubStatsSource {
  const echo: Record<string, unknown> = {};
  entries.forEach(([type, value], i) => {
    echo[`echoSubStatsType${i + 1}`] = type;
    echo[`echoSubStatsValue${i + 1}`] = value;
  });
  return echo as EchoSubStatsSource;
}

describe("getSubstatRollTier", () => {
  it("returns 1 for the lowest possible roll", () => {
    expect(getSubstatRollTier("CritRate", 6.3)).toBe(1);
  });

  it("returns 8 for the highest possible roll", () => {
    expect(getSubstatRollTier("CritRate", 10.5)).toBe(8);
  });

  it("returns 0 for an unrecognized value", () => {
    expect(getSubstatRollTier("CritRate", 999)).toBe(0);
  });

  it("returns 0 for an unknown stat", () => {
    expect(getSubstatRollTier("NotAStat", 6.3)).toBe(0);
  });

  it("handles the 4-tier flat substats correctly", () => {
    expect(getSubstatRollTier("ATK_FLAT", 30)).toBe(1);
    expect(getSubstatRollTier("ATK_FLAT", 60)).toBe(4);
  });
});

describe("getEchoRatingPoints", () => {
  it("sums raw tiers 1-8 across 5 filled substats", () => {
    const points = getEchoRatingPoints(perfectEcho);
    expect(points.rawPoints).toBe(40);
    expect(points.filledCount).toBe(5);
  });

  it("computes 5 raw points for an all-minimum-roll echo", () => {
    const points = getEchoRatingPoints(worstEcho);
    expect(points.rawPoints).toBe(5);
  });

  it("only counts revealed (filled) substats", () => {
    const partial = buildEcho([["CritRate", 10.5], ["CritDMG", 21]]);
    const points = getEchoRatingPoints(partial);
    expect(points.filledCount).toBe(2);
    expect(points.rawPoints).toBe(16);
  });

  it("ignores 'none' substat slots", () => {
    const echo = buildEcho([["CritRate", 10.5]]);
    (echo as any).echoSubStatsType2 = "none";
    (echo as any).echoSubStatsValue2 = 0;
    const points = getEchoRatingPoints(echo);
    expect(points.filledCount).toBe(1);
  });

  it("weights each substat's tier by the provided weight profile", () => {
    const echo = buildEcho([
      ["CritRate", 10.5], // tier 8
      ["ATK_FLAT", 30], // tier 1
    ]);
    const weights = { CritRate: 4, ATK_FLAT: 0 };
    const points = getEchoRatingPoints(echo, weights);
    expect(points.weightedPoints).toBe(8 * 4 + 1 * 0);
    expect(points.minPossible).toBe(1 * 4 + 1 * 0);
    expect(points.maxPossible).toBe(8 * 4 + 8 * 0);
  });
});

describe("getEchoRatingGrade", () => {
  it("grades a perfect echo as SSS", () => {
    const rating = getEchoRatingGrade(perfectEcho);
    expect(rating.grade).toBe("SSS");
    expect(rating.color).toBe("red");
    expect(rating.points).toBe(40);
    expect(rating.provisional).toBe(false);
  });

  it("grades a worst-roll echo as E", () => {
    const rating = getEchoRatingGrade(worstEcho);
    expect(rating.grade).toBe("E");
    expect(rating.color).toBe("white");
    expect(rating.points).toBe(5);
  });

  it("marks an echo with fewer than 5 revealed substats as provisional", () => {
    const partial = buildEcho([["CritRate", 10.5], ["CritDMG", 21]]);
    const rating = getEchoRatingGrade(partial);
    expect(rating.provisional).toBe(true);
  });

  it("does not mark a fully-revealed echo as provisional", () => {
    expect(getEchoRatingGrade(perfectEcho).provisional).toBe(false);
  });

  it("covers every band boundary exactly once (no gaps/overlaps across 5-40)", () => {
    for (let points = 5; points <= 40; points++) {
      const band = ECHO_RATING_GRADES.find((b) => points >= b.min && points <= b.max);
      expect(band, `no band matched ${points}`).toBeTruthy();
    }
  });

  it("with a non-uniform weight profile, still normalizes onto the 5-40 scale", () => {
    // All weight on CritRate; the other 4 filled substats are irrelevant to
    // this character, so a perfect CritRate + garbage everything-else roll
    // should still normalize to a high (SSS-caliber) grade.
    const echo = buildEcho([
      ["CritRate", 10.5], // tier 8, weight 4 -> max achievable for this stat
      ["ATK_FLAT", 30], // tier 1, weight 0
      ["DEF_FLAT", 40], // tier 1, weight 0
      ["HP_FLAT", 320], // tier 1, weight 0
      ["EnergyRegen", 6.8], // tier 1, weight 0
    ]);
    const weights = { ...DEFAULT_SUBSTAT_WEIGHTS, CritRate: 4, ATK_FLAT: 0, DEF_FLAT: 0, HP_FLAT: 0, EnergyRegen: 0 };
    const rating = getEchoRatingGrade(echo, weights);
    expect(rating.points).toBe(40);
    expect(rating.grade).toBe("SSS");
  });

  it("returns the floor grade (E, 5 pts) for an echo with no revealed substats", () => {
    const rating = getEchoRatingGrade({});
    expect(rating.grade).toBe("E");
    expect(rating.points).toBe(5);
    expect(rating.provisional).toBe(true);
  });
});

describe("getSubstatScoreGrade", () => {
  it("scores a perfect echo at 100%, SSS", () => {
    const score = getSubstatScoreGrade(perfectEcho, DEFAULT_SUBSTAT_WEIGHTS);
    expect(score.percent).toBe(100);
    expect(score.grade).toBe("SSS");
  });

  it("scores a worst-roll echo at 12.5%, E", () => {
    const score = getSubstatScoreGrade(worstEcho, DEFAULT_SUBSTAT_WEIGHTS);
    expect(score.percent).toBeCloseTo(12.5);
    expect(score.grade).toBe("E");
  });

  it("ignores substats the character has zero-weighted", () => {
    const echo = buildEcho([
      ["CritRate", 10.5], // tier 8, weighted
      ["ATK_FLAT", 30], // tier 1, zero-weighted -> should not drag the score down
    ]);
    const weights = { CritRate: 4, ATK_FLAT: 0 };
    const score = getSubstatScoreGrade(echo, weights);
    expect(score.percent).toBe(100);
  });

  it("returns 0% when every filled substat is zero-weighted", () => {
    const echo = buildEcho([["ATK_FLAT", 30]]);
    const score = getSubstatScoreGrade(echo, { ATK_FLAT: 0 });
    expect(score.percent).toBe(0);
  });

  it("returns 0% for an echo with no revealed substats", () => {
    const score = getSubstatScoreGrade({}, DEFAULT_SUBSTAT_WEIGHTS);
    expect(score.percent).toBe(0);
    expect(score.provisional).toBe(true);
  });

  it("covers every percentage band boundary exactly once (0-100)", () => {
    for (let pct = 0; pct <= 100; pct += 0.5) {
      const band = SUBSTAT_SCORE_GRADES.find((b) => pct >= b.min && pct <= b.max);
      expect(band, `no band matched ${pct}`).toBeTruthy();
    }
  });
});

describe("getGradeForSubstatScorePercent", () => {
  it("grades 100% as SSS", () => {
    expect(getGradeForSubstatScorePercent(100).grade).toBe("SSS");
  });

  it("grades 0% as E", () => {
    expect(getGradeForSubstatScorePercent(0).grade).toBe("E");
  });

  it("clamps out-of-range input", () => {
    expect(getGradeForSubstatScorePercent(150).grade).toBe("SSS");
    expect(getGradeForSubstatScorePercent(-10).grade).toBe("E");
  });

  it("matches getSubstatScoreGrade's band for the same percent", () => {
    const echo = perfectEcho;
    const direct = getSubstatScoreGrade(echo, DEFAULT_SUBSTAT_WEIGHTS);
    const viaPercent = getGradeForSubstatScorePercent(direct.percent);
    expect(viaPercent.grade).toBe(direct.grade);
    expect(viaPercent.color).toBe(direct.color);
  });
});

describe("resolveSubstatWeights", () => {
  it("falls back to the neutral default when no sources are given", () => {
    expect(resolveSubstatWeights()).toEqual(DEFAULT_SUBSTAT_WEIGHTS);
  });

  it("layers later sources over earlier ones", () => {
    const curated = { CritRate: 4, CritDMG: 3 };
    const userOverride = { CritRate: 2 };
    const resolved = resolveSubstatWeights(curated, userOverride);
    expect(resolved.CritRate).toBe(2);
    expect(resolved.CritDMG).toBe(3);
    expect(resolved.ATK).toBe(1); // untouched stat keeps the neutral default
  });

  it("ignores undefined/null sources", () => {
    expect(resolveSubstatWeights(undefined, null, { CritRate: 4 }).CritRate).toBe(4);
  });
});

describe("clampSubstatWeight", () => {
  it("clamps below the minimum", () => {
    expect(clampSubstatWeight(-1)).toBe(0);
  });

  it("clamps above the maximum", () => {
    expect(clampSubstatWeight(5)).toBe(4);
  });

  it("rounds to the nearest 0.5 step", () => {
    expect(clampSubstatWeight(2.3)).toBe(2.5);
    expect(clampSubstatWeight(2.2)).toBe(2);
  });
});
