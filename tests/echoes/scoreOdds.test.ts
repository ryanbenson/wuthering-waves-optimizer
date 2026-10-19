import { describe, it, expect } from "vitest";
import { subStats, subStatsTable } from "../../src/echoes/stats";
import { getSubStatRollDistribution } from "../../src/echoes/substatRollRates";
import { getSubstatScoreGrade } from "../../src/echoes/rating";
import { ECHO_LEVEL_EXP } from "../../src/echoes/levelingCost";
import { ECHO_SUBSTAT_SLOTS, rollChanceAtLeast, type TunedSubstats } from "../../src/echoes/tuningOdds";
import {
  SCORE_GRADES,
  betterEchoOdds,
  defaultScoreTarget,
  echoScorePoints,
  finalPointsDistribution,
  freshEchoPointsDistribution,
  freshShareBelow,
  gradeReachChances,
  scoreGradeIndex,
  scorePercent,
  scoreTargetOdds,
} from "../../src/echoes/scoreOdds";

const grade = (name: string) => SCORE_GRADES.indexOf(name);

const critOnly = Object.fromEntries(subStats.map((s) => [s, 0]));
critOnly.CritRate = 1;

// Brant's curated profile, spelled out so the test doesn't move with it.
const BRANT = Object.fromEntries(subStats.map((s) => [s, 0]));
Object.assign(BRANT, { CritRate: 4, CritDMG: 4, BasicAttackDMGBonus: 3, ATK: 2, EnergyRegen: 2, ATK_FLAT: 1 });

const BRANT_FINISHED: TunedSubstats = [
  ["CritRate", 8.1], ["CritDMG", 16.2], ["ATK", 8.6], ["HP", 7.9], ["DEF_FLAT", 50],
];
const BRANT_PARTIAL: TunedSubstats = [["CritRate", 8.1], ["ATK", 8.6]];

function asEcho(tuned: TunedSubstats) {
  const echo: Record<string, string | number> = {};
  tuned.forEach(([stat, value], i) => {
    echo[`echoSubStatsType${i + 1}`] = stat;
    echo[`echoSubStatsValue${i + 1}`] = value;
  });
  return echo;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("Substat Score points and grades", () => {
  it("match the Substat Score badge (getSubstatScoreGrade)", () => {
    for (const tuned of [BRANT_FINISHED, BRANT_PARTIAL]) {
      const badge = getSubstatScoreGrade(asEcho(tuned), BRANT);
      const points = echoScorePoints(tuned, BRANT);
      expect(scorePercent(points, BRANT)).toBeCloseTo(badge.percent, 10);
      expect(SCORE_GRADES[scoreGradeIndex(points, BRANT)]).toBe(badge.grade);
    }
  });
});

describe("finalPointsDistribution", () => {
  it("sums to 1, fresh or partly tuned", () => {
    for (const tuned of [[], BRANT_PARTIAL] as TunedSubstats[]) {
      const total = finalPointsDistribution(tuned, BRANT).reduce((sum, [, p]) => sum + p, 0);
      expect(total).toBeCloseTo(1, 10);
    }
  });

  it("a finished echo has one outcome: its own points", () => {
    expect(finalPointsDistribution(BRANT_FINISHED, BRANT)).toEqual([[40, 1]]);
  });
});

describe("gradeReachChances", () => {
  it("starts at 1 (E) and never rises", () => {
    const reach = gradeReachChances(BRANT_PARTIAL, BRANT);
    expect(reach[0]).toBe(1);
    for (let i = 1; i < reach.length; i++) expect(reach[i]).toBeLessThanOrEqual(reach[i - 1] + 1e-12);
  });

  it("one weighted substat: S needs it drawn (5/13) at tier 6 or higher", () => {
    // Crit Rate is the whole ideal echo (8 points), so tier 6 = 75% = S
    // and tier 5 = 62.5% = A (bands are inclusive at the top).
    const reach = gradeReachChances([], critOnly);
    const tier6 = subStatsTable.CritRate[5];
    expect(reach[grade("S")]).toBeCloseTo((5 / 13) * rollChanceAtLeast("CritRate", tier6), 10);
  });
});

describe("scoreTargetOdds", () => {
  it("its chance equals the grade distribution's, grade by grade", () => {
    for (const tuned of [[], BRANT_PARTIAL] as TunedSubstats[]) {
      const reach = gradeReachChances(tuned, BRANT);
      SCORE_GRADES.forEach((_, g) => {
        expect(scoreTargetOdds(tuned, BRANT, { kind: "grade", grade: g }).chance).toBeCloseTo(reach[g], 12);
      });
    }
  });

  it("'any higher score' equals betterEchoOdds", () => {
    const { points, better } = betterEchoOdds(BRANT_FINISHED, BRANT);
    expect(scoreTargetOdds([], BRANT, { kind: "beat", points }).chance).toBeCloseTo(better, 12);
  });

  it("one weighted substat: tuning stops the moment it's drawn, so E[tunes] = 55/13", () => {
    // Crit Rate's position among the 13 is uniform: drawn at tune k (1-5)
    // with chance 1/13 each, else all 5 tunes run. Drawn high: S reached;
    // drawn low: out of reach. Either way the attempt stops.
    const odds = scoreTargetOdds([], critOnly, { kind: "grade", grade: grade("S") });
    expect(odds.expectedTuners).toBeCloseTo((10 * 55) / 13, 9);
    const exp = ([5, 10, 15, 20, 25].reduce((a, l) => a + ECHO_LEVEL_EXP[l], 0) + 8 * ECHO_LEVEL_EXP[25]) / 13;
    expect(odds.expectedExp).toBeCloseTo(exp, 6);
  });

  it("already at the target costs nothing; out of reach is 0", () => {
    const at = scoreTargetOdds(BRANT_FINISHED, BRANT, { kind: "grade", grade: grade("C") });
    expect(at).toEqual({ chance: 1, expectedTuners: 0, expectedExp: 0, successTuners: 0, successExp: 0 });
    expect(scoreTargetOdds(BRANT_FINISHED, BRANT, { kind: "grade", grade: grade("B") }).chance).toBe(0);
  });

  it("agrees with a seeded simulation of the stopping rule within 4 standard errors", () => {
    const target = { kind: "grade" as const, grade: grade("B") };
    const exact = scoreTargetOdds(BRANT_PARTIAL, BRANT, target);
    const dists = Object.fromEntries(subStats.map((s) => [s, getSubStatRollDistribution(s)]));
    const tierCount = (s: string) => dists[s].length;
    const rand = mulberry32(777);
    const trials = 100_000;
    let hits = 0;
    let tuners = 0;
    let tunersSq = 0;
    for (let t = 0; t < trials; t++) {
      const pool = subStats.filter((s) => !BRANT_PARTIAL.some(([r]) => r === s));
      let points = echoScorePoints(BRANT_PARTIAL, BRANT);
      let n = BRANT_PARTIAL.length;
      let spent = 0;
      for (;;) {
        if (scoreGradeIndex(points, BRANT) >= target.grade) { hits++; break; }
        if (n >= ECHO_SUBSTAT_SLOTS) break;
        const best = pool
          .map((s) => BRANT[s] * tierCount(s))
          .sort((a, b) => b - a)
          .slice(0, ECHO_SUBSTAT_SLOTS - n)
          .reduce((a, b) => a + b, 0);
        if (scoreGradeIndex(points + best, BRANT) < target.grade) break;
        const stat = pool.splice(Math.floor(rand() * pool.length), 1)[0];
        let r = rand();
        let tier = tierCount(stat);
        for (const [i, d] of dists[stat].entries()) {
          if (r < d.chance) { tier = i + 1; break; }
          r -= d.chance;
        }
        points += tier * BRANT[stat];
        spent += 10;
        n++;
      }
      tuners += spent;
      tunersSq += spent * spent;
    }
    const p = hits / trials;
    expect(Math.abs(exact.chance - p)).toBeLessThan(4 * Math.sqrt((p * (1 - p)) / trials));
    const mean = tuners / trials;
    const se = Math.sqrt((tunersSq / trials - mean * mean) / trials);
    expect(Math.abs(exact.expectedTuners - mean)).toBeLessThan(4 * se);
  });
});

describe("defaultScoreTarget", () => {
  it("a finished echo: the next grade up from its own", () => {
    // Brant's finished echo is C: 40 of the ideal echo's 120 points (33%).
    expect(SCORE_GRADES[scoreGradeIndex(40, BRANT)]).toBe("C");
    expect(defaultScoreTarget(BRANT_FINISHED, BRANT)).toEqual({ kind: "grade", grade: grade("B") });
  });

  it("a finished echo at the top grade: any higher score", () => {
    const perfect: TunedSubstats = [["CritRate", 10.5], ["HP", 7.9], ["DEF", 9], ["ATK", 7.1], ["HP_FLAT", 430]];
    expect(defaultScoreTarget(perfect, critOnly)).toEqual({ kind: "beat", points: 8 });
  });

  it("an unfinished echo: the lowest grade it reaches less than half the time", () => {
    const reach = gradeReachChances(BRANT_PARTIAL, BRANT);
    const target = defaultScoreTarget(BRANT_PARTIAL, BRANT);
    expect(target.kind).toBe("grade");
    const g = (target as { grade: number }).grade;
    expect(reach[g]).toBeLessThan(0.5);
    expect(reach[g - 1]).toBeGreaterThanOrEqual(0.5);
  });
});

describe("freshShareBelow", () => {
  it("is the complement of a fresh echo scoring at least as high", () => {
    const { points, atLeast } = betterEchoOdds(BRANT_FINISHED, BRANT);
    expect(freshShareBelow(points, BRANT)).toBeCloseTo(1 - atLeast, 12);
  });
});

describe("betterEchoOdds", () => {
  // Crit tiers above 7.5% (tier 3): 8 + 8 + 8 + 3 + 3 of the ~100 total.
  const critAboveTier3 = rollChanceAtLeast("CritRate", 8.1);

  it("the fresh-echo points distribution sums to 1", () => {
    const total = freshEchoPointsDistribution(critOnly).reduce((sum, [, p]) => sum + p, 0);
    expect(total).toBeCloseTo(1, 10);
  });

  it("one weighted substat: beating a tier-3 roll needs it drawn (5/13) and rolled higher", () => {
    const full: TunedSubstats = [["CritRate", 7.5], ["HP", 7.9], ["DEF", 9], ["ATK", 7.1], ["HP_FLAT", 430]];
    const odds = betterEchoOdds(full, critOnly);
    expect(odds.points).toBe(3);
    expect(odds.better).toBeCloseTo((5 / 13) * critAboveTier3, 10);
    expect(odds.atLeast).toBeCloseTo((5 / 13) * rollChanceAtLeast("CritRate", 7.5), 10);
  });

  it("an echo with nothing weighted is beaten by any fresh echo that draws a weighted substat", () => {
    const full: TunedSubstats = [["HP", 7.9], ["DEF", 9], ["ATK", 7.1], ["HP_FLAT", 430], ["DEF_FLAT", 50]];
    const odds = betterEchoOdds(full, critOnly);
    expect(odds.points).toBe(0);
    expect(odds.better).toBeCloseTo(5 / 13, 10);
    expect(odds.atLeast).toBeCloseTo(1, 10);
  });

  it("nothing beats a perfect echo", () => {
    const full: TunedSubstats = [["CritRate", 10.5], ["HP", 7.9], ["DEF", 9], ["ATK", 7.1], ["HP_FLAT", 430]];
    expect(betterEchoOdds(full, critOnly).better).toBe(0);
  });

  it("agrees with a seeded simulation for a curated-style profile within 0.3 points", () => {
    const full: TunedSubstats = [["CritRate", 8.1], ["CritDMG", 15], ["ATK", 8.6], ["HP", 7.9], ["DEF_FLAT", 50]];
    const exact = betterEchoOdds(full, BRANT);

    const rand = mulberry32(4242);
    const dists = Object.fromEntries(subStats.map((s) => [s, getSubStatRollDistribution(s)]));
    let better = 0;
    const trials = 200_000;
    for (let t = 0; t < trials; t++) {
      const pool = subStats.slice();
      let points = 0;
      for (let k = 0; k < ECHO_SUBSTAT_SLOTS; k++) {
        const stat = pool.splice(Math.floor(rand() * pool.length), 1)[0];
        let r = rand();
        let tier = dists[stat].length;
        for (const [i, d] of dists[stat].entries()) {
          if (r < d.chance) { tier = i + 1; break; }
          r -= d.chance;
        }
        points += tier * BRANT[stat];
      }
      if (points > exact.points + 1e-9) better += 1;
    }
    expect(Math.abs(exact.better - better / trials)).toBeLessThan(0.003);
  });
});
