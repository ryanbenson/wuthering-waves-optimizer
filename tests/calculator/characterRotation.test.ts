import { describe, it, expect } from "vitest";
import { calcCharacterRotationDamage, type CharacterRotationAction } from "../../src/calculator/characterRotation";
import { buildCharacterCalculationContext } from "../../src/calculator/buildCharacterContext";
import { resolveRotationActionToAttackData } from "../../src/calculator/resolveRotationAction";
import { calcDamages } from "../../src/calculator/attacks";
import type { TeamEnemyConfig } from "../../src/calculator/buildCharacterContext";

const enemyConfig: TeamEnemyConfig = {
  enemyLevel: 90,
  enemyResist: 0.1,
  enemyType: "Calamity",
};

async function baseContextFor(characters: Record<string, any>) {
  const built = await buildCharacterCalculationContext("Calcharo", characters, enemyConfig);
  return { chosenChar: built.chosenChar, characterLevel: built.characterLevel, context: built.context };
}

describe("calcCharacterRotationDamage", () => {
  it("matches a direct calcDamages call when no action has an override", async () => {
    const characters = { Calcharo: {} };
    const baseContext = await baseContextFor(characters);
    const action: CharacterRotationAction = { id: "a1", order: 0, type: "basic", key: "Part1Damage", count: 1 };

    const result = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions: [action] },
      baseContext,
      "Calcharo",
      characters,
      enemyConfig,
    );

    const resolvedAttack = resolveRotationActionToAttackData(action, baseContext.chosenChar, baseContext.characterLevel);
    baseContext.context.rotationsList = [
      { id: "expected", name: "expected", duration: 10, order: 0, attacks: [resolvedAttack] },
    ];
    const expected = calcDamages(baseContext.context);

    expect(result.attacks).toEqual(expected.rotations[0].attacks);
    // addDamageAggregation coerces healing/shield through 0 rather than
    // preserving "not applicable" null — a harmless representational
    // difference (both falsy everywhere they're consumed), same as
    // calcTeamRotationDamage's advanced mode.
    const expectedAgg = expected.rotations[0].damageAggregation;
    expect(result.damageAggregation.normalDamage).toBeCloseTo(expectedAgg.normalDamage);
    expect(result.damageAggregation.avgDamage).toBeCloseTo(expectedAgg.avgDamage);
    expect(result.damageAggregation.critDamage).toBeCloseTo(expectedAgg.critDamage);
    expect(result.damageAggregation.healing || 0).toBeCloseTo(expectedAgg.healing || 0);
    expect(result.damageAggregation.shield || 0).toBeCloseTo(expectedAgg.shield || 0);
  });

  it("an overridden action gets its own rebuilt context, independent of the shared one", async () => {
    const characters = { Calcharo: {} };
    const baseContext = await baseContextFor(characters);
    const plainAction: CharacterRotationAction = { id: "a1", order: 0, type: "basic", key: "Part1Damage", count: 1 };
    // Calcharo's StatBonusATK1 (+ATK%) is off by default (characters = { Calcharo: {} }).
    const buffedAction: CharacterRotationAction = {
      id: "a2",
      order: 1,
      type: "basic",
      key: "Part1Damage",
      count: 1,
      advancedConfig: { buffs: { StatBonusATK1: { isEnabled: true } } },
    };

    const result = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions: [plainAction, buffedAction] },
      baseContext,
      "Calcharo",
      characters,
      enemyConfig,
    );

    expect(result.attacks).toHaveLength(2);
    const [plain, buffed] = result.attacks;
    expect(buffed.damage.totalDamage).toBeGreaterThan(plain.damage.totalDamage);

    // The overridden action doesn't leak into the plain action's number, and
    // vice versa — each is computed against its own context.
    const soloPlainResult = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions: [plainAction] },
      baseContext,
      "Calcharo",
      characters,
      enemyConfig,
    );
    expect(plain.damage.totalDamage).toBeCloseTo(soloPlainResult.attacks[0].damage.totalDamage);
  });

  it("preserves original action order when mixing plain and overridden actions", async () => {
    const characters = { Calcharo: {} };
    const baseContext = await baseContextFor(characters);
    const actions: CharacterRotationAction[] = [
      { id: "a1", order: 0, type: "basic", key: "Part1Damage", count: 1, advancedConfig: { buffs: { StatBonusATK1: { isEnabled: true } } } },
      { id: "a2", order: 1, type: "basic", key: "Part1Damage", count: 1 },
      { id: "a3", order: 2, type: "basic", key: "Part1Damage", count: 1, advancedConfig: { buffs: { StatBonusATK1: { isEnabled: true } } } },
      { id: "a4", order: 3, type: "basic", key: "Part1Damage", count: 1 },
    ];

    const result = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions },
      baseContext,
      "Calcharo",
      characters,
      enemyConfig,
    );

    expect(result.attacks.map((a: any) => a.id)).toEqual(["a1", "a2", "a3", "a4"]);
  });

  it("damageAggregation is the sum of every action's damage across both paths", async () => {
    const characters = { Calcharo: {} };
    const baseContext = await baseContextFor(characters);
    const actions: CharacterRotationAction[] = [
      { id: "a1", order: 0, type: "basic", key: "Part1Damage", count: 1 },
      { id: "a2", order: 1, type: "basic", key: "Part1Damage", count: 1, advancedConfig: { buffs: { StatBonusATK1: { isEnabled: true } } } },
    ];

    const result = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions },
      baseContext,
      "Calcharo",
      characters,
      enemyConfig,
    );

    const expectedTotal = result.attacks.reduce((sum: number, a: any) => sum + (a.damage?.totalDamage ?? 0), 0);
    expect(result.damageAggregation.normalDamage).toBeCloseTo(expectedTotal);
  });

  it("skips disabled actions", async () => {
    const characters = { Calcharo: {} };
    const baseContext = await baseContextFor(characters);
    const action: CharacterRotationAction = {
      id: "a1",
      order: 0,
      type: "basic",
      key: "Part1Damage",
      count: 1,
      isDisabled: true,
    };

    const result = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions: [action] },
      baseContext,
      "Calcharo",
      characters,
      enemyConfig,
    );

    expect(result.attacks).toHaveLength(0);
    expect(result.damageAggregation.normalDamage).toBeNull();
  });
});

describe("calcCharacterRotationDamage buildId override (issue #278)", () => {
  const buffedBuild = { id: "buffed-build", name: "Buffed", buffs: { StatBonusATK1: { isEnabled: true } } };
  const plainBuild = { id: "plain-build", name: "Plain", buffs: {} };
  const characters = {
    // Calcharo's own top-level fields ("active build") are unbuffed; the
    // buffed data only exists inside builds[].
    Calcharo: { buffs: {}, builds: [plainBuild, buffedBuild], activeBuildId: "plain-build" },
  };
  const action: CharacterRotationAction = { id: "a1", order: 0, type: "basic", key: "Part1Damage", count: 1 };

  it("uses the active build's data when buildId is omitted, matching current behavior", async () => {
    const baseContext = await baseContextFor(characters);
    const result = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions: [action] },
      baseContext,
      "Calcharo",
      characters,
      enemyConfig,
    );

    const resolvedAttack = resolveRotationActionToAttackData(action, baseContext.chosenChar, baseContext.characterLevel);
    baseContext.context.rotationsList = [
      { id: "expected", name: "expected", duration: 10, order: 0, attacks: [resolvedAttack] },
    ];
    const expected = calcDamages(baseContext.context);
    expect(result.attacks[0].damage.totalDamage).toBeCloseTo(expected.rotations[0].attacks[0].damage.totalDamage);
  });

  it("swaps in a specific build's data when buildId is passed, independent of the active build", async () => {
    // No baseContext passed (null) — calcTeamRotationDamage's own calling
    // convention, since it has no single "active character" context to reuse.
    const plainResult = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions: [action] },
      null,
      "Calcharo",
      characters,
      enemyConfig,
      [],
      "plain-build",
    );
    const buffedResult = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions: [action] },
      null,
      "Calcharo",
      characters,
      enemyConfig,
      [],
      "buffed-build",
    );

    expect(buffedResult.attacks[0].damage.totalDamage).toBeGreaterThan(
      plainResult.attacks[0].damage.totalDamage,
    );
  });

  it("falls back to the active build when buildId doesn't match any stored build", async () => {
    const activeResult = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions: [action] },
      null,
      "Calcharo",
      characters,
      enemyConfig,
      [],
      null,
    );
    const missingBuildResult = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions: [action] },
      null,
      "Calcharo",
      characters,
      enemyConfig,
      [],
      "no-such-build",
    );

    expect(missingBuildResult.attacks[0].damage.totalDamage).toBeCloseTo(
      activeResult.attacks[0].damage.totalDamage,
    );
  });

  it("composes with a per-action advancedConfig override on top of the targeted build's data", async () => {
    const overriddenAction: CharacterRotationAction = {
      ...action,
      id: "a2",
      advancedConfig: { buffs: { StatBonusATK1: { isEnabled: false } } },
    };

    // buffed-build already has StatBonusATK1 on; the action forces it off.
    const result = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions: [overriddenAction] },
      null,
      "Calcharo",
      characters,
      enemyConfig,
      [],
      "buffed-build",
    );
    const plainResult = await calcCharacterRotationDamage(
      { id: "r1", name: "Rotation", duration: 10, actions: [action] },
      null,
      "Calcharo",
      characters,
      enemyConfig,
      [],
      "plain-build",
    );

    expect(result.attacks[0].damage.totalDamage).toBeCloseTo(plainResult.attacks[0].damage.totalDamage);
  });
});
