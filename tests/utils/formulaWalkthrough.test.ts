import { describe, it, expect } from "vitest";
import { calcHitDamage } from "@wutheringtools/formulas";
import {
  SAMPLE_CRIT_DAMAGE,
  SAMPLE_LEVEL,
  SAMPLE_MOTION_VALUE,
  buildSampleHitSteps,
} from "../../src/utils/formulaWalkthrough";

const realHit = (attack: number, damageBonus: number, enemyResist: number) =>
  calcHitDamage(
    String(SAMPLE_LEVEL),
    SAMPLE_LEVEL,
    enemyResist,
    SAMPLE_MOTION_VALUE,
    attack,
    0,
    damageBonus,
  ) * SAMPLE_CRIT_DAMAGE;

describe("buildSampleHitSteps", () => {
  it.each([
    [2600, 0.6, 0.1],
    [500, 0, 0],
    [4000, 1.5, 0.4],
  ])("ends on the real damage function's result for ATK %d, bonus %d, resist %d", (attack, damageBonus, enemyResist) => {
    const steps = buildSampleHitSteps({ attack, damageBonus, enemyResist });
    expect(steps[steps.length - 1].total).toBeCloseTo(realHit(attack, damageBonus, enemyResist), 6);
  });

  it("matches a hand-worked example", () => {
    // Defense at level 90 vs 90: 1520 / (1520 + 1512).
    const steps = buildSampleHitSteps({ attack: 2600, damageBonus: 0.6, enemyResist: 0.1 });
    const defense = 1520 / 3032;
    expect(steps.map((s) => s.total)[3]).toBeCloseTo(2600 * 2 * 1.6 * 2.5);
    expect(steps[5].total).toBeCloseTo(2600 * 2 * 1.6 * 2.5 * defense * 0.9);
  });

  it("marks only the enemy's steps as reductions and labels each factor", () => {
    const steps = buildSampleHitSteps({ attack: 2600, damageBonus: 0.6, enemyResist: 0.1 });
    expect(steps.filter((s) => s.reduces).map((s) => s.label)).toEqual(["Enemy defense", "Enemy resistance"]);
    expect(steps.map((s) => s.factor)).toEqual(["", "× 200%", "× 160%", "× 250%", "× 50.1%", "× 90%"]);
  });
});
