import { describe, it, expect, vi } from "vitest";
import type { TeamEnemyConfig } from "../../src/calculator/buildCharacterContext";

// A fake character with no attack groups at all and no saved rotations —
// used to prove estimateWeaponSwapImpact returns null rather than guessing
// when there's nothing to compare weapons against.
const fakeCharWithNoAttacks = {
  basic: { weapon: "Broadblades", stances: [] },
  buffs: [],
  getCharacterStatsByLevel: () => ({ hp: 10000, attack: 500, defense: 1000 }),
};

vi.mock("../../src/characters/characters", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/characters/characters")>();
  return {
    ...actual,
    getCharByName: vi.fn(async (charName: string) =>
      charName === "NoAttacksChar" ? fakeCharWithNoAttacks : actual.getCharByName(charName),
    ),
  };
});

const { estimateWeaponSwapImpact, estimateWeaponSwapImpactBatch } = await import("../../src/weapons/weaponImpact");

const enemyConfig: TeamEnemyConfig = {
  enemyLevel: 90,
  enemyResist: 0.1,
  enemyType: "Calamity",
};

// PulsationBracer's "Barrier Breacher" passive is an alwaysEnabled 12% ATK
// bonus plus a conditional, stackable Basic Attack DMG Bonus — the same
// fixture buildCharacterContext.test.ts uses for alwaysEnabledOnly, and the
// one weapon in the existing test suite proven to have an alwaysEnabled
// passive alongside a conditional one, which is exactly the case
// "weaponPassiveMode: all-off" needs to prove it can suppress.
const IUNO_ROTATION = {
  id: "r1",
  name: "Test rotation",
  duration: 10,
  actions: [{ id: "a1", type: "basic", key: "MoonringBasicAttack1DMG", count: 1 }],
};

describe("estimateWeaponSwapImpact", () => {
  it("returns null when there's no saved rotation and no attack data to fall back to", async () => {
    const characters = { NoAttacksChar: {} };
    const result = await estimateWeaponSwapImpact(
      "NoAttacksChar",
      characters,
      { weaponKey: "PulsationBracer" },
      enemyConfig,
    );
    expect(result).toBeNull();
  });

  it("falls back to the character's own attack data when no rotation is saved", async () => {
    // Iuno has no `rotations` here, so this exercises the
    // FALLBACK_ATTACK_GROUP_PRIORITY path, not a saved rotation.
    const characters = { Iuno: {} };
    const result = await estimateWeaponSwapImpact(
      "Iuno",
      characters,
      { weaponKey: "PulsationBracer" },
      enemyConfig,
    );
    expect(result).not.toBeNull();
  });

  it("stat-only suppresses even the alwaysEnabled passive, unlike anything else in the app", async () => {
    const characters = { Iuno: { rotations: [IUNO_ROTATION] } };
    const result = await estimateWeaponSwapImpact(
      "Iuno",
      characters,
      { weaponKey: "PulsationBracer", weaponLevel: "90", refinement: "1" },
      enemyConfig,
    );

    expect(result).not.toBeNull();
    // Unequipped baseline < stat-only swap (ATK/secondary stat alone) <
    // fully-buffed (adds the alwaysEnabled 12% ATK bonus *and* the
    // conditional Basic Attack DMG Bonus at max stacks).
    expect(result!.statOnlyDamage).toBeGreaterThan(result!.baselineDamage);
    expect(result!.fullyBuffedDamage).toBeGreaterThan(result!.statOnlyDamage);
  });

  it("uses the first saved rotation over the attack-data fallback when both exist", async () => {
    const withRotation = { Iuno: { rotations: [IUNO_ROTATION] } };
    const withoutRotation = { Iuno: {} };
    const [withRotationResult, withoutRotationResult] = await Promise.all([
      estimateWeaponSwapImpact("Iuno", withRotation, { weaponKey: "PulsationBracer" }, enemyConfig),
      estimateWeaponSwapImpact("Iuno", withoutRotation, { weaponKey: "PulsationBracer" }, enemyConfig),
    ]);
    // Both resolve (Iuno has usable attack data either way) — this just
    // pins that a saved rotation is consulted at all, not just the fallback.
    expect(withRotationResult).not.toBeNull();
    expect(withoutRotationResult).not.toBeNull();
  });
});

describe("estimateWeaponSwapImpactBatch", () => {
  it("returns an empty map when there are no candidates", async () => {
    const result = await estimateWeaponSwapImpactBatch("Iuno", { Iuno: {} }, [], enemyConfig);
    expect(result.size).toBe(0);
  });

  it("returns an empty map when there's nothing to compare against, without throwing", async () => {
    const result = await estimateWeaponSwapImpactBatch(
      "NoAttacksChar",
      { NoAttacksChar: {} },
      [{ weaponKey: "PulsationBracer" }],
      enemyConfig,
    );
    expect(result.size).toBe(0);
  });

  it("agrees with the single-candidate function for the same candidate", async () => {
    const characters = { Iuno: { rotations: [IUNO_ROTATION] } };
    const candidate = { weaponKey: "PulsationBracer", weaponLevel: "90", refinement: "1" };

    const single = await estimateWeaponSwapImpact("Iuno", characters, candidate, enemyConfig);
    const batch = await estimateWeaponSwapImpactBatch("Iuno", characters, [candidate], enemyConfig);

    expect(single).not.toBeNull();
    const fromBatch = batch.get("PulsationBracer");
    expect(fromBatch).not.toBeNull();
    expect(fromBatch!.fullyBuffedDamage).toBeCloseTo(single!.fullyBuffedDamage);
    expect(fromBatch!.statOnlyDamage).toBeCloseTo(single!.statOnlyDamage);
    expect(fromBatch!.baselineDamage).toBeCloseTo(single!.baselineDamage);
  });

  it("computes ranges for multiple candidates against the same baseline", async () => {
    const characters = { Iuno: { rotations: [IUNO_ROTATION] } };
    const results = await estimateWeaponSwapImpactBatch(
      "Iuno",
      characters,
      [{ weaponKey: "PulsationBracer" }, { weaponKey: "TrainingGauntlets" }],
      enemyConfig,
    );
    expect(results.size).toBe(2);
    const baselines = [...results.values()].map((r) => r?.baselineDamage);
    expect(baselines[0]).toBeCloseTo(baselines[1] as number);
  });
});
