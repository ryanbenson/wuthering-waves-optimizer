import { describe, expect, it } from "vitest";
import {
  fiveStarChance,
  FIVE_STAR_GUARANTEED_ON_PULL,
  MAX_PULLS_SINCE_LAST_FIVE,
  runMonteCarlo,
} from "../../src/convene/simulateConvene";

describe("fiveStarChance (empirical Wuwa model)", () => {
  it("is 0.8% for pulls 1–65", () => {
    expect(fiveStarChance(0)).toBe(0.008);
    expect(fiveStarChance(64)).toBe(0.008);
  });

  it("ramps +4% per pull for 66–70", () => {
    expect(fiveStarChance(65)).toBeCloseTo(0.048, 6);
    expect(fiveStarChance(69)).toBeCloseTo(0.208, 6);
  });

  it("ramps +8% per pull for 71–75", () => {
    expect(fiveStarChance(70)).toBeCloseTo(0.288, 6);
    expect(fiveStarChance(74)).toBeCloseTo(0.608, 6);
  });

  it("ramps +10% per pull for 76–78", () => {
    expect(fiveStarChance(75)).toBeCloseTo(0.708, 6);
    expect(fiveStarChance(77)).toBeCloseTo(0.908, 6);
  });

  it("is 100% on pull 79", () => {
    expect(fiveStarChance(78)).toBe(1);
    expect(fiveStarChance(79)).toBe(1);
  });

  it("exposes a consistent max pity counter", () => {
    expect(MAX_PULLS_SINCE_LAST_FIVE).toBe(FIVE_STAR_GUARANTEED_ON_PULL - 1);
  });
});

describe("runMonteCarlo", () => {
  it("returns 100% goal and no steps when no more copies are needed", () => {
    const r = runMonteCarlo(
      {
        wishes: 0,
        mode: "character",
        startingPity: 0,
        guaranteedNextFeatured: false,
        maxCopies: 0,
        copiesOwnedBefore: 7,
      },
      100,
    );
    expect(r.targetMetRate).toBe(1);
    expect(r.stepProbabilities).toHaveLength(0);
  });

  it("labels steps from copiesOwnedBefore (S3 → S6 needs three milestones)", () => {
    const r = runMonteCarlo(
      {
        wishes: 500,
        mode: "character",
        startingPity: 0,
        guaranteedNextFeatured: false,
        maxCopies: 3,
        copiesOwnedBefore: 4,
      },
      50,
    );
    expect(r.stepProbabilities).toHaveLength(3);
    expect(r.stepProbabilities[0]!.label).toBe("≥1 pull → S4+");
    expect(r.stepProbabilities[1]!.label).toBe("≥2 pulls → S5+");
    expect(r.stepProbabilities[2]!.label).toBe("≥3 pulls → S6+");
  });
});
