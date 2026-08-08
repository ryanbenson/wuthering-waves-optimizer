import { describe, it, expect } from "vitest";
import {
  calcTeamRotationDamage,
  calcRotationDps,
  type TeamRotationAction,
} from "../../src/calculator/teamRotation";
import { buildCharacterCalculationContext } from "../../src/calculator/buildCharacterContext";
import { resolveRotationActionToAttackData } from "../../src/calculator/resolveRotationAction";
import { calcDamages } from "../../src/calculator/attacks";
import type { TeamEnemyConfig } from "../../src/calculator/buildCharacterContext";

const enemyConfig: TeamEnemyConfig = {
  enemyLevel: 90,
  enemyResist: 0.1,
  enemyType: "Calamity",
};

describe("calcRotationDps", () => {
  it("divides each damage total by the duration", () => {
    const result = calcRotationDps(
      { normalDamage: 1000, avgDamage: 900, critDamage: 1800, healing: 0, shield: 0 },
      10,
    );
    expect(result).toEqual({ normal: 100, avg: 90, crit: 180 });
  });

  it("coerces a string duration like the live UI does", () => {
    const result = calcRotationDps(
      { normalDamage: 500, avgDamage: 500, critDamage: 500, healing: 0, shield: 0 },
      "5",
    );
    expect(result).toEqual({ normal: 100, avg: 100, crit: 100 });
  });
});

describe("calcTeamRotationDamage", () => {
  const characters = { Calcharo: {} };

  it("matches a direct single-character calcDamages call for one action in one slot", async () => {
    const action: TeamRotationAction = {
      id: "action-1",
      slot: 0,
      order: 0,
      type: "basic",
      key: "Part1Damage",
      count: 1,
    };

    const result = await calcTeamRotationDamage(
      { characterIds: ["Calcharo", null, null], actions: [action], duration: 10 },
      characters,
      enemyConfig,
    );

    const built = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);
    const resolvedAttack = resolveRotationActionToAttackData(action, built.chosenChar, built.characterLevel);
    built.context.rotationsList = [
      { id: "expected", name: "expected", duration: 10, order: 0, attacks: [resolvedAttack] },
    ];
    const expectedDamage = calcDamages(built.context);
    const expectedAggregation = expectedDamage?.rotations?.[0]?.damageAggregation;

    expect(result.perCharacter.Calcharo.damageAggregation).toEqual(expectedAggregation);
    expect(result.perCharacter.Calcharo.attacks).toEqual(
      expectedDamage?.rotations?.[0]?.attacks,
    );
    expect(result.actionResults).toHaveLength(1);
    expect(result.actionResults[0]).toMatchObject({ characterId: "Calcharo", slot: 0, order: 0 });
    // total starts damage fields at 0 rather than null (falsy either way for
    // display purposes), so compare the damage fields directly rather than
    // the whole object.
    expect(result.total.normalDamage).toEqual(expectedAggregation.normalDamage);
    expect(result.total.avgDamage).toEqual(expectedAggregation.avgDamage);
    expect(result.total.critDamage).toEqual(expectedAggregation.critDamage);
    expect(result.total.healing).toBeFalsy();
    expect(result.total.shield).toBeFalsy();
    expect(result.dps).toEqual(calcRotationDps(expectedAggregation, 10));
  });

  it("ignores actions whose slot has no assigned character", async () => {
    const action: TeamRotationAction = {
      id: "action-1",
      slot: 1,
      order: 0,
      type: "basic",
      key: "Part1Damage",
      count: 1,
    };

    const result = await calcTeamRotationDamage(
      { characterIds: ["Calcharo", null, null], actions: [action], duration: 10 },
      characters,
      enemyConfig,
    );

    expect(result.perCharacter).toEqual({});
    expect(result.total).toEqual({ normalDamage: 0, avgDamage: 0, critDamage: 0, healing: 0, shield: 0 });
  });

  it("advanced mode applies a per-action buff override on top of the character's own config", async () => {
    const plainAction: TeamRotationAction = {
      id: "action-1",
      slot: 0,
      order: 0,
      type: "basic",
      key: "Part1Damage",
      count: 1,
    };
    const buffedAction: TeamRotationAction = {
      id: "action-2",
      slot: 0,
      order: 1,
      type: "basic",
      key: "Part1Damage",
      count: 1,
      // Calcharo's StatBonusATK1 (+ATK%) is off by default (characters =
      // { Calcharo: {} }) — this action alone should get the boost.
      advancedConfig: { buffs: { StatBonusATK1: { isEnabled: true } } },
    };

    const result = await calcTeamRotationDamage(
      {
        characterIds: ["Calcharo", null, null],
        actions: [plainAction, buffedAction],
        duration: 10,
        mode: "advanced",
      },
      characters,
      enemyConfig,
    );

    expect(result.actionResults).toHaveLength(2);
    const plainResult = result.actionResults.find((r) => r.order === 0)!;
    const buffedResult = result.actionResults.find((r) => r.order === 1)!;
    expect(buffedResult.attack.damage.totalDamage).toBeGreaterThan(
      plainResult.attack.damage.totalDamage,
    );

    // The character-level total is the sum of both actions, not just the
    // buffed one and not just the plain one.
    const expectedTotal =
      plainResult.attack.damage.totalDamage + buffedResult.attack.damage.totalDamage;
    expect(result.perCharacter.Calcharo.damageAggregation.normalDamage).toBeCloseTo(expectedTotal);

    // The plain (non-advanced) action's damage matches what basic mode would
    // have produced for the exact same action — advanced mode only changes
    // the number when an override is actually present.
    const basicModeResult = await calcTeamRotationDamage(
      { characterIds: ["Calcharo", null, null], actions: [plainAction], duration: 10 },
      characters,
      enemyConfig,
    );
    expect(plainResult.attack.damage.totalDamage).toBeCloseTo(
      basicModeResult.actionResults[0].attack.damage.totalDamage,
    );
  });

  it("skips disabled actions", async () => {
    const action: TeamRotationAction = {
      id: "action-1",
      slot: 0,
      order: 0,
      type: "basic",
      key: "Part1Damage",
      count: 1,
      isDisabled: true,
    };

    const result = await calcTeamRotationDamage(
      { characterIds: ["Calcharo", null, null], actions: [action], duration: 10 },
      characters,
      enemyConfig,
    );

    expect(result.perCharacter).toEqual({});
  });
});
