import { describe, it, expect } from "vitest";
import { subStats, subStatsTable } from "../../src/echoes/stats";
import {
  getSubStatRollDistribution,
  subStatRollRates,
} from "../../src/echoes/substatRollRates";
import {
  ECHO_SUBSTAT_SLOTS,
  FULL_TUNE_COST,
  TOTAL_SUBSTAT_TYPES,
  chanceWithinEchoes,
  echoesForConfidence,
  formatTuningChance,
  getLowerRollValue,
  getTuningGoalKey,
  getTuningVerdict,
  goalLevers,
  goalOdds,
  rollChanceAtLeast,
  wantedDrawOdds,
  type TunedSubstats,
  type TuningGoal,
} from "../../src/echoes/tuningOdds";

// C(11,3) / C(13,5): both crit substats among an echo's 5 of 13.
const DOUBLE_CRIT_ANY = 165 / 1287;

describe("subStatRollRates", () => {
  it("has a weight row for every substat, matching its roll-value tiers", () => {
    for (const stat of subStats) {
      expect(subStatRollRates[stat], stat).toBeDefined();
      expect(subStatRollRates[stat].length, stat).toBe(subStatsTable[stat].length);
    }
  });

  it("each row sums to 100% within the published rounding", () => {
    for (const stat of subStats) {
      const total = subStatRollRates[stat].reduce((a, b) => a + b, 0);
      expect(Math.abs(total - 100), stat).toBeLessThanOrEqual(0.02);
    }
  });

  it("normalizes each distribution to exactly 1", () => {
    for (const stat of subStats) {
      const total = getSubStatRollDistribution(stat).reduce((a, t) => a + t.chance, 0);
      expect(total, stat).toBeCloseTo(1, 12);
    }
  });

  it("returns an empty distribution for unknown stats", () => {
    expect(getSubStatRollDistribution("Glacio")).toEqual([]);
  });
});

describe("rollChanceAtLeast", () => {
  it("is 1 for any roll and for the lowest tier", () => {
    expect(rollChanceAtLeast("CritRate", null)).toBe(1);
    expect(rollChanceAtLeast("CritRate", 6.3)).toBeCloseTo(1, 12);
  });

  it("sums the tiers at or above the minimum", () => {
    // Crit Rate >= 8.1: 8 + 8 + 8 + 3 + 3 of 99.99.
    expect(rollChanceAtLeast("CritRate", 8.1)).toBeCloseTo(30 / 99.99, 10);
    // Top tier only.
    expect(rollChanceAtLeast("CritDMG", 21)).toBeCloseTo(3 / 99.99, 10);
    expect(rollChanceAtLeast("ATK_FLAT", 60)).toBeCloseTo(0.0291, 10);
  });

  it("is 0 above the top tier", () => {
    expect(rollChanceAtLeast("CritRate", 11)).toBe(0);
  });
});

describe("goalOdds — fresh echo", () => {
  it("double crit at any roll is C(11,3)/C(13,5) = 12.82%", () => {
    const { chance } = goalOdds([], [
      { stat: "CritRate", min: null },
      { stat: "CritDMG", min: null },
    ]);
    expect(chance).toBeCloseTo(DOUBLE_CRIT_ANY, 12);
    expect(formatTuningChance(chance)).toBe("12.8%");
  });

  it("one substat at any roll is 5/13", () => {
    expect(goalOdds([], [{ stat: "EnergyRegen", min: null }]).chance).toBeCloseTo(5 / 13, 12);
  });

  it("an empty goal always succeeds at no cost", () => {
    expect(goalOdds([], [])).toEqual({ chance: 1, expectedTuners: 0 });
  });

  it("six goal lines are impossible", () => {
    const goal: TuningGoal = subStats.slice(0, 6).map((stat) => ({ stat, min: null }));
    expect(goalOdds([], goal).chance).toBe(0);
  });

  it("five goal lines at any roll is 1 / C(13,5)", () => {
    const goal: TuningGoal = subStats.slice(0, 5).map((stat) => ({ stat, min: null }));
    expect(goalOdds([], goal).chance).toBeCloseTo(1 / 1287, 12);
  });

  it("thresholds multiply into the any-roll chance", () => {
    const p = rollChanceAtLeast("CritRate", 8.1) * rollChanceAtLeast("CritDMG", 16.2);
    const { chance } = goalOdds([], [
      { stat: "CritRate", min: 8.1 },
      { stat: "CritDMG", min: 16.2 },
    ]);
    expect(chance).toBeCloseTo(DOUBLE_CRIT_ANY * p, 12);
  });

  it("ignores duplicate lines and substats an echo can't roll", () => {
    const { chance } = goalOdds([], [
      { stat: "CritRate", min: 9.9 },
      { stat: "CritRate", min: null },
      { stat: "Glacio", min: null },
      { stat: "CritDMG", min: null },
    ]);
    expect(chance).toBeCloseTo(DOUBLE_CRIT_ANY, 12);
  });
});

describe("goalOdds — partly tuned echo", () => {
  it("a goal already met is certain and costs nothing more", () => {
    const tuned: TunedSubstats = [["CritRate", 8.1], ["CritDMG", 17.4]];
    expect(goalOdds(tuned, [{ stat: "CritRate", min: 8.1 }, { stat: "CritDMG", min: 16.2 }]))
      .toEqual({ chance: 1, expectedTuners: 0 });
  });

  it("a goal line that already rolled too low is impossible", () => {
    const tuned: TunedSubstats = [["CritDMG", 13.8]];
    expect(goalOdds(tuned, [{ stat: "CritDMG", min: 15 }]).chance).toBe(0);
  });

  it("one wanted substat left in 3 tunes from 11 is 3/11", () => {
    const tuned: TunedSubstats = [["CritRate", 8.1], ["ATK", 8.6]];
    const { chance } = goalOdds(tuned, [
      { stat: "CritRate", min: null },
      { stat: "CritDMG", min: null },
    ]);
    expect(chance).toBeCloseTo(3 / 11, 12);
  });

  it("matches the canvas's worked example: 3/11 × P(CD ≥ 15)", () => {
    const tuned: TunedSubstats = [["CritRate", 8.1], ["ATK", 8.6]];
    const { chance } = goalOdds(tuned, [{ stat: "CritDMG", min: 15 }]);
    expect(chance).toBeCloseTo((3 / 11) * rollChanceAtLeast("CritDMG", 15), 12);
  });

  it("a fully tuned echo can't change", () => {
    const tuned: TunedSubstats = [
      ["HP_FLAT", 430], ["DEF", 10.9], ["ATK", 7.1], ["HP", 6.4], ["DEF_FLAT", 50],
    ];
    expect(goalOdds(tuned, [{ stat: "CritRate", min: null }]).chance).toBe(0);
  });
});

describe("goalOdds — expected tuners", () => {
  it("never exceeds tuning every slot", () => {
    const goals: TuningGoal[] = [
      [{ stat: "CritRate", min: null }],
      [{ stat: "CritRate", min: 9.9 }, { stat: "CritDMG", min: 19.8 }],
      subStats.slice(0, 5).map((stat) => ({ stat, min: null })),
    ];
    for (const goal of goals) {
      const { expectedTuners } = goalOdds([], goal);
      expect(expectedTuners).toBeGreaterThan(0);
      expect(expectedTuners).toBeLessThanOrEqual(FULL_TUNE_COST + 1e-9);
    }
  });

  it("an any-roll single-stat goal stops on the hit or after 5 tunes", () => {
    // P(stat first appears on tune t) = 1/13 for t = 1..5, else all 5 tunes run.
    const expected = 10 * ([1, 2, 3, 4, 5].reduce((a, t) => a + t / 13, 0) + 5 * (8 / 13));
    expect(goalOdds([], [{ stat: "CritRate", min: null }]).expectedTuners).toBeCloseTo(expected, 10);
  });
});

// Deterministic PRNG so the Monte Carlo cross-check never flakes.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function simulate(tuned: TunedSubstats, goal: TuningGoal, trials: number, seed: number) {
  const rand = mulberry32(seed);
  const dists = Object.fromEntries(subStats.map((s) => [s, getSubStatRollDistribution(s)]));
  let hits = 0;
  for (let t = 0; t < trials; t++) {
    const echo = new Map(tuned);
    const pool = subStats.filter((s) => !echo.has(s));
    while (echo.size < ECHO_SUBSTAT_SLOTS) {
      const stat = pool.splice(Math.floor(rand() * pool.length), 1)[0];
      let r = rand();
      let value = dists[stat].at(-1)!.value;
      for (const tier of dists[stat]) {
        if (r < tier.chance) { value = tier.value; break; }
        r -= tier.chance;
      }
      echo.set(stat, value);
    }
    if (goal.every((line) => echo.has(line.stat) && (line.min == null || echo.get(line.stat)! >= line.min))) {
      hits += 1;
    }
  }
  return hits / trials;
}

describe("goalOdds — Monte Carlo cross-check", () => {
  const cases: Array<{ name: string; tuned: TunedSubstats; goal: TuningGoal }> = [
    { name: "fresh double crit", tuned: [], goal: [{ stat: "CritRate", min: null }, { stat: "CritDMG", min: null }] },
    { name: "fresh good double crit", tuned: [], goal: [{ stat: "CritRate", min: 8.1 }, { stat: "CritDMG", min: 16.2 }] },
    { name: "fresh ER + Liberation", tuned: [], goal: [{ stat: "EnergyRegen", min: 9.2 }, { stat: "ResonanceLiberationDMGBonus", min: null }] },
    { name: "+10 echo needing CD", tuned: [["CritRate", 8.1], ["ATK", 8.6]], goal: [{ stat: "CritDMG", min: 15 }] },
    { name: "+5 echo, three lines", tuned: [["CritDMG", 17.4]], goal: [{ stat: "CritRate", min: null }, { stat: "ATK", min: 7.9 }, { stat: "CritDMG", min: 15 }] },
  ];

  for (const [i, c] of cases.entries()) {
    it(`agrees within 0.3 points: ${c.name}`, () => {
      const exact = goalOdds(c.tuned, c.goal).chance;
      const simulated = simulate(c.tuned, c.goal, 200_000, 1000 + i);
      expect(Math.abs(exact - simulated)).toBeLessThan(0.003);
    });
  }
});

describe("wantedDrawOdds", () => {
  it("fresh echo, 3 wanted substats: hypergeometric over 5 of 13", () => {
    const odds = wantedDrawOdds([], ["CritRate", "CritDMG", "EnergyRegen"]);
    expect(odds.remainingTunes).toBe(5);
    expect(odds.wantedLeft).toBe(3);
    expect(odds.next).toBeCloseTo(3 / 13, 12);
    // P(none) = C(10,5) / C(13,5) = 252 / 1287.
    expect(odds.atLeastOne).toBeCloseTo(1 - 252 / 1287, 12);
    // P(exactly 1) = 3 × C(10,4) / C(13,5) = 630 / 1287.
    expect(odds.atLeastTwo).toBeCloseTo(1 - 252 / 1287 - 630 / 1287, 12);
  });

  it("doesn't count wanted substats already revealed", () => {
    const odds = wantedDrawOdds([["CritRate", 8.1], ["ATK", 8.6]], ["CritRate", "CritDMG"]);
    expect(odds.wantedLeft).toBe(1);
    expect(odds.next).toBeCloseTo(1 / 11, 12);
    expect(odds.atLeastOne).toBeCloseTo(3 / 11, 12);
    expect(odds.atLeastTwo).toBe(0);
  });

  it("a fully tuned echo has nothing left", () => {
    const tuned: TunedSubstats = subStats.slice(0, 5).map((s) => [s, 1]);
    expect(wantedDrawOdds(tuned, ["CritRate"])).toMatchObject({
      remainingTunes: 0, next: 0, atLeastOne: 0, atLeastTwo: 0,
    });
  });
});

describe("echo-count helpers", () => {
  it("echoesForConfidence inverts chanceWithinEchoes", () => {
    const p = DOUBLE_CRIT_ANY;
    const half = echoesForConfidence(p, 0.5);
    expect(chanceWithinEchoes(p, half)).toBeGreaterThanOrEqual(0.5);
    expect(chanceWithinEchoes(p, half - 1)).toBeLessThan(0.5);
    expect(echoesForConfidence(1, 0.9)).toBe(1);
    expect(echoesForConfidence(0, 0.9)).toBe(Infinity);
  });
});

describe("goalLevers", () => {
  it("ranks the edits that raise the chance most", () => {
    const goal: TuningGoal = [{ stat: "CritRate", min: 8.1 }, { stat: "CritDMG", min: 16.2 }];
    const base = goalOdds([], goal).chance;
    const levers = goalLevers(goal);
    expect(levers).toHaveLength(3);
    for (let i = 1; i < levers.length; i++) {
      expect(levers[i - 1].chance).toBeGreaterThanOrEqual(levers[i].chance);
    }
    for (const lever of levers) expect(lever.chance).toBeGreaterThan(base);
    expect(levers.find((l) => l.kind === "loosen" && l.stat === "CritRate")?.min).toBe(7.5);
  });

  it("loosening the lowest tier means any roll", () => {
    expect(getLowerRollValue("CritRate", 6.3)).toBeNull();
    expect(goalLevers([{ stat: "CritRate", min: 6.9 }])[0]).toMatchObject({ kind: "loosen", min: 6.3 });
  });
});

describe("misc", () => {
  it("TOTAL_SUBSTAT_TYPES is 13", () => {
    expect(TOTAL_SUBSTAT_TYPES).toBe(13);
  });

  it("goal keys ignore order", () => {
    expect(getTuningGoalKey([{ stat: "CritDMG", min: 15 }, { stat: "CritRate", min: null }]))
      .toBe(getTuningGoalKey([{ stat: "CritRate", min: null }, { stat: "CritDMG", min: 15 }]));
  });

  it("verdict bands", () => {
    expect(getTuningVerdict(0.6)).toBe("likely");
    expect(getTuningVerdict(0.2)).toBe("worth-a-shot");
    expect(getTuningVerdict(0.1)).toBe("long-grind");
    expect(getTuningVerdict(0.01)).toBe("very-rare");
  });

  it("formats chances", () => {
    expect(formatTuningChance(0.0036)).toBe("0.36%");
    expect(formatTuningChance(0.0512)).toBe("5.12%");
    expect(formatTuningChance(0.05)).toBe("5.0%");
    expect(formatTuningChance(0.00001)).toBe("<0.01%");
    expect(formatTuningChance(1)).toBe("100%");
  });
});
