import { describe, it, expect } from "vitest";
import {
  calcTeamRotationDamage,
  calcRotationDps,
  calcStrongestHit,
  calcRotationTimeline,
  convertRotationActionsForSlot,
  type TeamRotationAction,
  type SourceRotationAction,
} from "../../src/calculator/teamRotation";
import { buildAdvancedConfigSnapshot } from "../../src/calculator/rotationAdvancedBuffs";
import { buildCharacterCalculationContext } from "../../src/calculator/buildCharacterContext";
import { resolveRotationActionToAttackData } from "../../src/calculator/resolveRotationAction";
import { calcDamages } from "../../src/calculator/attacks";
import { calcCharacterRotationDamage } from "../../src/calculator/characterRotation";
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

describe("calcStrongestHit", () => {
  function hit(
    order: number,
    damage: Partial<{ totalDamage: number; avgDamage: number; critDamage: number }>,
    type = "basic",
    label = `Action ${order}`,
  ) {
    return {
      characterId: "Calcharo",
      slot: 0 as const,
      order,
      attack: { type, label, damage },
    };
  }

  it("finds the max of each metric independently across all actions", () => {
    const result = calcStrongestHit([
      hit(0, { totalDamage: 100, avgDamage: 150, critDamage: 300 }),
      hit(1, { totalDamage: 500, avgDamage: 120, critDamage: 250 }),
    ]);
    expect(result.normal).toBe(500);
    expect(result.avg).toBe(150);
    expect(result.crit).toBe(300);
  });

  it("names the action behind the biggest crit hit", () => {
    const result = calcStrongestHit([
      hit(0, { critDamage: 300 }, "basic", "Basic Attack"),
      hit(1, { critDamage: 900 }, "basic", "Resonance Liberation"),
    ]);
    expect(result.strongestAction?.order).toBe(1);
    expect(result.strongestAction?.attack.label).toBe("Resonance Liberation");
  });

  it("excludes Healing and Shield actions", () => {
    const result = calcStrongestHit([
      hit(0, { totalDamage: 100, avgDamage: 100, critDamage: 100 }),
      hit(1, { totalDamage: 999999 }, "Healing"),
      hit(2, { totalDamage: 999999 }, "Shield"),
    ]);
    expect(result.normal).toBe(100);
  });

  it("returns zeros and a null strongestAction for an empty input", () => {
    expect(calcStrongestHit([])).toEqual({
      normal: 0,
      avg: 0,
      crit: 0,
      strongestAction: null,
    });
  });
});

describe("calcRotationTimeline", () => {
  function hit(order: number, totalDamage: number, type = "basic") {
    return {
      characterId: "Calcharo",
      slot: 0 as const,
      order,
      attack: { type, label: `Action ${order}`, damage: { totalDamage, avgDamage: totalDamage, critDamage: totalDamage } },
    };
  }

  it("evenly distributes N actions across the duration, centered within each slice", () => {
    const actions = [hit(0, 10), hit(1, 20), hit(2, 30), hit(3, 40), hit(4, 50)];
    const timeline = calcRotationTimeline(actions, 10);
    expect(timeline.map((p) => p.time)).toEqual([1, 3, 5, 7, 9]);
    expect(timeline.map((p) => p.normalDamage)).toEqual([10, 20, 30, 40, 50]);
  });

  it("coerces a string duration like calcRotationDps does", () => {
    const timeline = calcRotationTimeline([hit(0, 10)], "10");
    expect(timeline[0].time).toBe(5);
  });

  it("excludes Healing and Shield actions from the timeline", () => {
    const timeline = calcRotationTimeline(
      [hit(0, 10), hit(1, 999, "Healing"), hit(2, 999, "Shield")],
      10,
    );
    expect(timeline).toHaveLength(1);
  });

  it("returns an empty array when there are no actions or no duration", () => {
    expect(calcRotationTimeline([], 10)).toEqual([]);
    expect(calcRotationTimeline([hit(0, 10)], null)).toEqual([]);
    expect(calcRotationTimeline([hit(0, 10)], 0)).toEqual([]);
  });
});

describe("convertRotationActionsForSlot", () => {
  const sourceActions: SourceRotationAction[] = [
    {
      id: "stale-1",
      order: 1,
      key: "ArtofViolenceDMG",
      type: "skill",
      count: 1,
      buffs: [{ id: "stale-buff-1", modifier: "ATK", modifierValue: 0.1 }],
    },
    { id: "stale-2", order: 2, key: "ClosingRemarkDMG", type: "outro", count: 1 },
  ];

  it("assigns the target slot and a continuing order to every action", () => {
    const converted = convertRotationActionsForSlot(sourceActions, 1, 5);
    expect(converted.map((a) => a.slot)).toEqual([1, 1]);
    expect(converted.map((a) => a.order)).toEqual([5, 6]);
    expect(converted.map((a) => a.key)).toEqual(["ArtofViolenceDMG", "ClosingRemarkDMG"]);
  });

  it("regenerates action and buff ids rather than reusing the source's", () => {
    const converted = convertRotationActionsForSlot(sourceActions, 0, 1);
    expect(converted[0].id).not.toBe("stale-1");
    expect(converted[1].id).not.toBe("stale-2");
    expect(converted[0].buffs?.[0].id).not.toBe("stale-buff-1");
    expect(converted[0].buffs?.[0]).toMatchObject({ modifier: "ATK", modifierValue: 0.1 });
  });

  it("leaves actions with no buffs alone", () => {
    const converted = convertRotationActionsForSlot(sourceActions, 2, 1);
    expect(converted[1].buffs).toBeUndefined();
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

    // calcCharacterRotationDamage's damageAggregation always goes through
    // addDamageAggregation (even for a single plain action), which coerces
    // healing/shield through 0 rather than preserving calcDamages' own `null`
    // for "not applicable" — falsy either way for display purposes, so
    // compare the damage fields directly rather than the whole object.
    const perCharacterAgg = result.perCharacter.Calcharo.damageAggregation;
    expect(perCharacterAgg.normalDamage).toEqual(expectedAggregation.normalDamage);
    expect(perCharacterAgg.avgDamage).toEqual(expectedAggregation.avgDamage);
    expect(perCharacterAgg.critDamage).toEqual(expectedAggregation.critDamage);
    expect(perCharacterAgg.healing).toBeFalsy();
    expect(perCharacterAgg.shield).toBeFalsy();
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

  it("a per-action advancedConfig override applies on top of the character's own config", async () => {
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

    // The plain (unoverridden) action's damage matches what it would produce
    // scored alone — a real override on a sibling action never leaks into it.
    const soloPlainResult = await calcTeamRotationDamage(
      { characterIds: ["Calcharo", null, null], actions: [plainAction], duration: 10 },
      characters,
      enemyConfig,
    );
    expect(plainResult.attack.damage.totalDamage).toBeCloseTo(
      soloPlainResult.actionResults[0].attack.damage.totalDamage,
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

describe("buildAdvancedConfigSnapshot (via calcTeamRotationDamage)", () => {
  it("feeding a 'current' snapshot back through applyAdvancedOverrides (via calcTeamRotationDamage) reproduces the plain-action damage exactly", async () => {
    const characterData = { buffs: { StatBonusATK1: { isEnabled: true } } };
    const characters = { Calcharo: characterData };
    const built = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);
    const snapshot = buildAdvancedConfigSnapshot(characterData, built.definitions, "current");

    const action: TeamRotationAction = {
      id: "action-1",
      slot: 0,
      order: 0,
      type: "basic",
      key: "Part1Damage",
      count: 1,
      advancedConfig: snapshot,
    };

    const [overriddenResult, plainResult] = await Promise.all([
      calcTeamRotationDamage(
        { characterIds: ["Calcharo", null, null], actions: [action], duration: 10 },
        characters,
        enemyConfig,
      ),
      calcTeamRotationDamage(
        { characterIds: ["Calcharo", null, null], actions: [{ ...action, advancedConfig: undefined }], duration: 10 },
        characters,
        enemyConfig,
      ),
    ]);

    // The override path's per-action summation coerces healing/shield
    // through 0 rather than preserving the plain path's `null` for "not
    // applicable" — a harmless representational difference (both falsy,
    // summed the same way everywhere they're consumed), so compare the
    // damage numbers directly.
    const overriddenAgg = overriddenResult.perCharacter.Calcharo.damageAggregation;
    const plainAgg = plainResult.perCharacter.Calcharo.damageAggregation;
    expect(overriddenAgg.normalDamage).toBeCloseTo(plainAgg.normalDamage as number);
    expect(overriddenAgg.avgDamage).toBeCloseTo(plainAgg.avgDamage as number);
    expect(overriddenAgg.critDamage).toBeCloseTo(plainAgg.critDamage as number);
    expect(overriddenAgg.healing || 0).toBeCloseTo(plainAgg.healing || 0);
    expect(overriddenAgg.shield || 0).toBeCloseTo(plainAgg.shield || 0);
  });
});

describe("importing a Character Rotation's per-action buffs into a Team Rotation", () => {
  // The scenario a user asked about directly: a Character Rotation action
  // with its own per-buff advancedConfig customization, imported into a
  // Team Rotation slot via "Import Rotation" (TeamRotationTeamEditor.vue's
  // handleImportRotation -> convertRotationActionsForSlot). There's no team
  // "mode" left to worry about — every action is scored per its own
  // advancedConfig automatically, exactly like a Character Rotation already
  // does, so the imported numbers should match the source exactly.
  it("carries a per-action advancedConfig override through the import and honors it in the team's damage calc", async () => {
    const characters = { Calcharo: {} };
    const sourceActions: SourceRotationAction[] = [
      { id: "char-rotation-a1", order: 1, type: "basic", key: "Part1Damage", count: 1 },
      {
        id: "char-rotation-a2",
        order: 2,
        type: "basic",
        key: "Part1Damage",
        count: 1,
        // Off by default for Calcharo — this action alone should get boosted,
        // both before and after the import.
        advancedConfig: { buffs: { StatBonusATK1: { isEnabled: true } } },
      },
    ];

    // "Before": the source rotation scored directly as a Character Rotation.
    const sourceResult = await calcCharacterRotationDamage(
      { id: "r1", name: "Source Rotation", duration: 10, actions: sourceActions as any },
      null,
      "Calcharo",
      characters,
      enemyConfig,
    );
    const [sourcePlain, sourceOverridden] = sourceResult.attacks;
    expect(sourceOverridden.damage.totalDamage).toBeGreaterThan(sourcePlain.damage.totalDamage);

    // "Import": convert into a team slot, exactly like handleImportRotation.
    const converted = convertRotationActionsForSlot(sourceActions, 0, 1);
    expect(converted.map((a) => a.advancedConfig)).toEqual([
      undefined,
      { buffs: { StatBonusATK1: { isEnabled: true } } },
    ]);

    // "After": the imported actions scored as a Team Rotation.
    const teamResult = await calcTeamRotationDamage(
      { characterIds: ["Calcharo", null, null], actions: converted, duration: 10 },
      characters,
      enemyConfig,
    );
    expect(teamResult.actionResults).toHaveLength(2);
    const teamPlain = teamResult.actionResults.find((r) => r.order === 1)!;
    const teamOverridden = teamResult.actionResults.find((r) => r.order === 2)!;

    // The import must reproduce the source rotation's numbers exactly —
    // both the plain action and, critically, the overridden one.
    expect(teamPlain.attack.damage.totalDamage).toBeCloseTo(sourcePlain.damage.totalDamage);
    expect(teamOverridden.attack.damage.totalDamage).toBeCloseTo(sourceOverridden.damage.totalDamage);
    expect(teamOverridden.attack.damage.totalDamage).toBeGreaterThan(teamPlain.attack.damage.totalDamage);
  });
});
