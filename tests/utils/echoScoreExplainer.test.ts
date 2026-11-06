import { describe, it, expect } from "vitest";
import {
  ECHO_RATING_SCALE,
  SAMPLE_ECHO_SUBSTATS,
  getSampleEchoRolls,
  scoreSampleEcho,
} from "../../src/utils/echoScoreExplainer";
import { ECHO_RATING_GRADES } from "../../src/echoes/rating";

describe("scoreSampleEcho", () => {
  it("has 8 real rolls for every sample substat, so points are simply the sum of tiers", () => {
    SAMPLE_ECHO_SUBSTATS.forEach((_, index) => expect(getSampleEchoRolls(index)).toHaveLength(8));
    expect(scoreSampleEcho([4, 6, 5, 3, 4]).points).toBeCloseTo(22);
  });

  it("matches the scale's ends", () => {
    const worst = scoreSampleEcho([1, 1, 1, 1, 1]);
    expect(worst).toMatchObject({ grade: "E", percent: 0 });
    expect(worst.points).toBeCloseTo(5);

    const best = scoreSampleEcho([8, 8, 8, 8, 8]);
    expect(best).toMatchObject({ grade: "SSS", percent: 100 });
    expect(best.points).toBeCloseTo(40);
  });

  it("grades each band's edges", () => {
    // 22 points is the bottom of S, 21 the top of A.
    expect(scoreSampleEcho([4, 6, 5, 3, 4]).grade).toBe("S");
    expect(scoreSampleEcho([4, 6, 5, 3, 3]).grade).toBe("A");
    expect(scoreSampleEcho([4, 6, 5, 3, 4]).percent).toBe(49);
  });

  it("works out CV as Crit Rate × 2 + Crit DMG from the picked rolls", () => {
    const score = scoreSampleEcho([4, 6, 5, 3, 4]);
    expect(score.critRate).toBe(8.1);
    expect(score.critDamage).toBe(18.6);
    expect(score.critValue).toBeCloseTo(8.1 * 2 + 18.6);
  });
});

describe("ECHO_RATING_SCALE", () => {
  it("covers the whole 5-40 point scale with no gaps", () => {
    expect(ECHO_RATING_SCALE.reduce((sum, band) => sum + band.width, 0)).toBe(36);
    expect(ECHO_RATING_SCALE.map((band) => band.grade)).toEqual(ECHO_RATING_GRADES.map((band) => band.grade));
  });
});
