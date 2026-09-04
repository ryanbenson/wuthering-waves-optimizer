import { describe, it, expect, vi } from "vitest";
import type { TeamEnemyConfig } from "../../src/calculator/buildCharacterContext";

// A fake character with no attack groups at all and no saved rotations —
// used to prove estimateEchoSwapImpact returns null rather than guessing
// when there's nothing to compare echoes against.
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

const { estimateEchoSwapImpact, estimateEchoSwapImpactBatch } = await import("../../src/echoes/echoImpact");

const enemyConfig: TeamEnemyConfig = {
  enemyLevel: 90,
  enemyResist: 0.1,
  enemyType: "Calamity",
};

const IUNO_ROTATION = {
  id: "r1",
  name: "Test rotation",
  duration: 10,
  actions: [{ id: "a1", type: "basic", key: "MoonringBasicAttack1DMG", count: 1 }],
};

// A standard 4+3+3+1+1 = 12 cost loadout, plus two interchangeable cost-4
// candidates for slot 0 that differ only in ATK substat value — so a swap
// between them isolates exactly one variable and the delta's sign is
// predictable.
const WEAK_MAIN = {
  echo: "Main4", type: 4, echoId: "weak4", echoSet: "TestSet", rank: 5, stat: "ATK",
  echoSubStatsType1: "ATK", echoSubStatsValue1: 10,
};
const STRONG_MAIN = {
  echo: "Main4", type: 4, echoId: "strong4", echoSet: "TestSet", rank: 5, stat: "ATK",
  echoSubStatsType1: "ATK", echoSubStatsValue1: 100,
};
const REST_OF_LOADOUT = [
  { echo: "ThreeA", type: 3, echoId: "t3a", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 30 },
  { echo: "ThreeB", type: 3, echoId: "t3b", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 30 },
  { echo: "OneA", type: 1, echoId: "o1a", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 10 },
  { echo: "OneB", type: 1, echoId: "o1b", echoSet: "TestSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 10 },
];
const INVENTORY = [WEAK_MAIN, STRONG_MAIN, ...REST_OF_LOADOUT];

/** Iuno wearing the weak cost-4 echo in slot 0, everything else fixed. */
function charactersWearingWeakMain() {
  return {
    Iuno: {
      rotations: [IUNO_ROTATION],
      echoes: {
        0: { echoId: "weak4" },
        1: { echoId: "t3a" },
        2: { echoId: "t3b" },
        3: { echoId: "o1a" },
        4: { echoId: "o1b" },
      },
    },
  };
}

describe("estimateEchoSwapImpact", () => {
  it("returns null when there's no saved rotation and no attack data to fall back to", async () => {
    const result = await estimateEchoSwapImpact(
      "NoAttacksChar",
      { NoAttacksChar: {} },
      { echoId: "strong4", slotIndex: 0 },
      enemyConfig,
      INVENTORY,
    );
    expect(result).toBeNull();
  });

  it("falls back to the character's own attack data when no rotation is saved", async () => {
    // Iuno has no `rotations` here, so this exercises the
    // FALLBACK_ATTACK_GROUP_PRIORITY path, not a saved rotation.
    const result = await estimateEchoSwapImpact(
      "Iuno",
      { Iuno: {} },
      { echoId: "strong4", slotIndex: 0 },
      enemyConfig,
      INVENTORY,
    );
    expect(result).not.toBeNull();
  });

  it("reports a positive delta for a strictly better echo in the same slot", async () => {
    const result = await estimateEchoSwapImpact(
      "Iuno",
      charactersWearingWeakMain(),
      { echoId: "strong4", slotIndex: 0 },
      enemyConfig,
      INVENTORY,
    );

    expect(result).not.toBeNull();
    expect(result!.damage).toBeGreaterThan(result!.baselineDamage);
    expect(result!.delta).toBeGreaterThan(0);
    expect(result!.pct).toBeGreaterThan(0);
  });

  it("reports a negative delta for a strictly worse echo in the same slot", async () => {
    const characters = charactersWearingWeakMain();
    characters.Iuno.echoes[0] = { echoId: "strong4" };

    const result = await estimateEchoSwapImpact(
      "Iuno",
      characters,
      { echoId: "weak4", slotIndex: 0 },
      enemyConfig,
      INVENTORY,
    );

    expect(result).not.toBeNull();
    expect(result!.delta).toBeLessThan(0);
    expect(result!.pct).toBeLessThan(0);
  });

  it("reports a ~zero delta for re-equipping the echo already in the slot", async () => {
    const result = await estimateEchoSwapImpact(
      "Iuno",
      charactersWearingWeakMain(),
      { echoId: "weak4", slotIndex: 0 },
      enemyConfig,
      INVENTORY,
    );

    expect(result).not.toBeNull();
    expect(result!.delta).toBeCloseTo(0);
  });

  it("does not mutate the caller's characters record", async () => {
    const characters = charactersWearingWeakMain();
    await estimateEchoSwapImpact(
      "Iuno",
      characters,
      { echoId: "strong4", slotIndex: 0 },
      enemyConfig,
      INVENTORY,
    );
    expect(characters.Iuno.echoes[0]).toEqual({ echoId: "weak4" });
  });
});

describe("estimateEchoSwapImpactBatch", () => {
  it("returns an empty map when there are no candidates", async () => {
    const result = await estimateEchoSwapImpactBatch("Iuno", { Iuno: {} }, [], enemyConfig, INVENTORY);
    expect(result.size).toBe(0);
  });

  it("returns an empty map when there's nothing to compare against, without throwing", async () => {
    const result = await estimateEchoSwapImpactBatch(
      "NoAttacksChar",
      { NoAttacksChar: {} },
      [{ echoId: "strong4", slotIndex: 0 }],
      enemyConfig,
      INVENTORY,
    );
    expect(result.size).toBe(0);
  });

  it("agrees with the single-candidate function for the same candidate", async () => {
    const characters = charactersWearingWeakMain();
    const candidate = { echoId: "strong4", slotIndex: 0 };

    const single = await estimateEchoSwapImpact("Iuno", characters, candidate, enemyConfig, INVENTORY);
    const batch = await estimateEchoSwapImpactBatch("Iuno", characters, [candidate], enemyConfig, INVENTORY);

    expect(single).not.toBeNull();
    const fromBatch = batch.get("strong4");
    expect(fromBatch).not.toBeNull();
    expect(fromBatch!.damage).toBeCloseTo(single!.damage);
    expect(fromBatch!.delta).toBeCloseTo(single!.delta);
    expect(fromBatch!.baselineDamage).toBeCloseTo(single!.baselineDamage);
  });

  it("computes every candidate against one shared baseline", async () => {
    const results = await estimateEchoSwapImpactBatch(
      "Iuno",
      charactersWearingWeakMain(),
      [
        { echoId: "strong4", slotIndex: 0 },
        { echoId: "weak4", slotIndex: 0 },
      ],
      enemyConfig,
      INVENTORY,
    );
    expect(results.size).toBe(2);
    const baselines = [...results.values()].map((r) => r?.baselineDamage);
    expect(baselines[0]).toBeCloseTo(baselines[1] as number);
    // And the ordering between them still holds through the batch path.
    expect(results.get("strong4")!.delta).toBeGreaterThan(results.get("weak4")!.delta);
  });
});
