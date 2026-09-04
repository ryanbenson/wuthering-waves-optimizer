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

const { estimateEchoSwapImpact, estimateEchoSwapImpactBatch, resolveNewlyActiveSetPassivesOverride } =
  await import("../../src/echoes/echoImpact");

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

describe("estimateEchoSwapImpact — comparison target", () => {
  // Regression test for a second real reported bug: even after the
  // set-bonus fix, an estimate for a same-set/same-main-echo substat-only
  // swap still disagreed sharply with the real in-game damage change. Root
  // cause — resolveComparisonRotation always used the character's *first*
  // saved rotation, but the number the user was actually watching (the
  // Live Result Bar) can be pinned to a *different* saved rotation or a
  // single attack, persisted separately in
  // settingsStore.config.liveResultBarByCharacter. A stat like Crit Rate
  // can swing very differently on one rotation than another (e.g. pushing
  // some attacks over the 100% crit cap on one but not the other), so
  // measuring the wrong rotation produces a plausible-looking but wrong
  // number. These tests prove an explicit `target` is honored over the
  // "first saved rotation" guess.
  const ROTATION_R1 = {
    id: "r1",
    name: "First rotation",
    duration: 10,
    actions: [{ id: "a1", type: "basic", key: "MoonringBasicAttack1DMG", count: 1 }],
  };
  const ROTATION_R2 = {
    id: "r2",
    name: "Second rotation",
    duration: 10,
    actions: [{ id: "a1", type: "skill", key: "PulseofOriginsDMG", count: 1 }],
  };

  function charactersWithTwoRotations() {
    return {
      Iuno: {
        rotations: [ROTATION_R1, ROTATION_R2],
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

  it("defaults to the first saved rotation when no target is given", async () => {
    const withoutTarget = await estimateEchoSwapImpact(
      "Iuno",
      charactersWithTwoRotations(),
      { echoId: "strong4", slotIndex: 0 },
      enemyConfig,
      INVENTORY,
    );
    const explicitlyR1 = await estimateEchoSwapImpact(
      "Iuno",
      charactersWithTwoRotations(),
      { echoId: "strong4", slotIndex: 0 },
      enemyConfig,
      INVENTORY,
      { target: "Rotation:r1" },
    );
    expect(withoutTarget!.baselineDamage).toBeCloseTo(explicitlyR1!.baselineDamage);
  });

  it("uses the explicit target's rotation instead of the first saved one", async () => {
    const r1Result = await estimateEchoSwapImpact(
      "Iuno",
      charactersWithTwoRotations(),
      { echoId: "strong4", slotIndex: 0 },
      enemyConfig,
      INVENTORY,
      { target: "Rotation:r1" },
    );
    const r2Result = await estimateEchoSwapImpact(
      "Iuno",
      charactersWithTwoRotations(),
      { echoId: "strong4", slotIndex: 0 },
      enemyConfig,
      INVENTORY,
      { target: "Rotation:r2" },
    );
    // Different attacks (basic vs skill) — different baseline damage proves
    // the target actually selected a different rotation, not just ignored.
    expect(r1Result!.baselineDamage).not.toBeCloseTo(r2Result!.baselineDamage, -1);
  });

  it("uses an explicit single-attack target instead of a rotation", async () => {
    const attackResult = await estimateEchoSwapImpact(
      "Iuno",
      charactersWithTwoRotations(),
      { echoId: "strong4", slotIndex: 0 },
      enemyConfig,
      INVENTORY,
      { target: "Attack:skillAttacks|PulseofOriginsDMG" },
    );
    const rotationR2Result = await estimateEchoSwapImpact(
      "Iuno",
      charactersWithTwoRotations(),
      { echoId: "strong4", slotIndex: 0 },
      enemyConfig,
      INVENTORY,
      { target: "Rotation:r2" },
    );
    // r2 is a single-action rotation wrapping the same attack, so a direct
    // Attack: target on that same attack should agree with it.
    expect(attackResult!.baselineDamage).toBeCloseTo(rotationR2Result!.baselineDamage);
  });

  it("falls through to the default when the target is stale (deleted rotation)", async () => {
    const result = await estimateEchoSwapImpact(
      "Iuno",
      charactersWithTwoRotations(),
      { echoId: "strong4", slotIndex: 0 },
      enemyConfig,
      INVENTORY,
      { target: "Rotation:no-such-id" },
    );
    const defaultResult = await estimateEchoSwapImpact(
      "Iuno",
      charactersWithTwoRotations(),
      { echoId: "strong4", slotIndex: 0 },
      enemyConfig,
      INVENTORY,
    );
    expect(result!.baselineDamage).toBeCloseTo(defaultResult!.baselineDamage);
  });
});

describe("estimateEchoSwapImpact — echo-set-bonus recomputation", () => {
  // Regression test for a real reported bug: swapping in a candidate that
  // *completes* a 2pc set bonus was scored using the pre-swap (no-bonus)
  // echoSetBonus, making the estimate far more negative than reality. Danjin
  // is Havoc, and Midnight Veil's 2pc bonus is an alwaysEnabled +10% Havoc
  // DMG (src/echoes/sets.ts) — a bonus this fixture can actually observe.
  const DANJIN_ROTATION = {
    id: "r1",
    name: "Test rotation",
    duration: 10,
    actions: [{ id: "a1", type: "basic", key: "Part1DMG", count: 1 }],
  };

  const OFF_SET_MAIN = {
    echo: "Main4", type: 4, echoId: "off-set", echoSet: "OtherSet", rank: 5, stat: "ATK",
    echoSubStatsType1: "ATK", echoSubStatsValue1: 50,
  };
  // Same raw stat line as OFF_SET_MAIN — isolates the set-bonus completion
  // as the only variable between the two candidates.
  const COMPLETES_SET_MAIN = {
    echo: "Main4", type: 4, echoId: "completes-set", echoSet: "MidnightVeil", rank: 5, stat: "ATK",
    echoSubStatsType1: "ATK", echoSubStatsValue1: 50,
  };
  const OTHER_MIDNIGHT_VEIL_ECHO = {
    echo: "ThreeA", type: 3, echoId: "existing-mv", echoSet: "MidnightVeil", rank: 5, stat: "ATK",
    echoSubStatsType1: "ATK", echoSubStatsValue1: 30,
  };
  const REST = [
    { echo: "ThreeB", type: 3, echoId: "rest-3b", echoSet: "OtherSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 30 },
    { echo: "OneA", type: 1, echoId: "rest-1a", echoSet: "OtherSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 10 },
    { echo: "OneB", type: 1, echoId: "rest-1b", echoSet: "OtherSet", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 10 },
  ];
  const DANJIN_INVENTORY = [OFF_SET_MAIN, COMPLETES_SET_MAIN, OTHER_MIDNIGHT_VEIL_ECHO, ...REST];

  // Slot 0 starts off-set; slot 1 already carries the character's only other
  // Midnight Veil echo, so swapping slot 0 to a Midnight Veil echo takes the
  // build from 1 (no bonus) to 2 (2pc bonus active).
  function danjinWearingOffSetMain() {
    return {
      Danjin: {
        rotations: [DANJIN_ROTATION],
        echoes: {
          0: { echoId: "off-set" },
          1: { echoId: "existing-mv" },
          2: { echoId: "rest-3b" },
          3: { echoId: "rest-1a" },
          4: { echoId: "rest-1b" },
        },
      },
    };
  }

  it("credits a swap that completes a 2pc set bonus, not just the raw substat swing", async () => {
    const characters = danjinWearingOffSetMain();

    // Same-set substat-only swap: identical ATK line, both off-set, so this
    // isolates "how much does the raw substat swing alone move the needle".
    const substatOnlyResult = await estimateEchoSwapImpact(
      "Danjin",
      characters,
      { echoId: "off-set", slotIndex: 0 },
      enemyConfig,
      DANJIN_INVENTORY,
    );
    expect(substatOnlyResult!.delta).toBeCloseTo(0);

    // The real candidate: same raw ATK substat, but completes the 2pc bonus.
    const setCompletingResult = await estimateEchoSwapImpact(
      "Danjin",
      characters,
      { echoId: "completes-set", slotIndex: 0 },
      enemyConfig,
      DANJIN_INVENTORY,
    );

    expect(setCompletingResult).not.toBeNull();
    // The whole point: completing the set bonus must show up as a *gain*,
    // not get scored against the stale pre-swap (no-bonus) baseline as a
    // wash or a loss.
    expect(setCompletingResult!.delta).toBeGreaterThan(0);
    // +10% Havoc DMG, alwaysEnabled — should be close to a flat 10% swing
    // on top of the (~zero) substat-only baseline.
    expect(setCompletingResult!.pct).toBeCloseTo(0.1, 1);
  });

  it("leaves echoSetBonus alone when the character has a manual override pinned", async () => {
    const characters = danjinWearingOffSetMain();
    (characters.Danjin as any).setOverride = true;
    (characters.Danjin as any).echoSetBonus = {
      setBonusOnePiece: null,
      setBonusOne: null,
      setBonusTwo: null,
    };

    const result = await estimateEchoSwapImpact(
      "Danjin",
      characters,
      { echoId: "completes-set", slotIndex: 0 },
      enemyConfig,
      DANJIN_INVENTORY,
    );

    // With the override pinned to "no bonus", completing the 2pc set on
    // paper must NOT grant the 10% Havoc DMG — the override wins.
    expect(result).not.toBeNull();
    expect(result!.delta).toBeCloseTo(0);
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

describe("resolveNewlyActiveSetPassivesOverride", () => {
  // Regression test for a third real reported bug: a swap that restored a
  // 5pc set bonus was estimated at "+2,315 · +2.4%" against a real ~+80K.
  // The set-bonus *label* (echoSetBonus) was already being recomputed
  // correctly (see the describe block above), but a conditional bonus's
  // passives (most 5pc/3pc bonuses; alwaysEnabled: false) still resolve
  // against characterData.echoSetPassives — a per-passive-key toggle/stacks
  // config the player sets by hand once the bonus's card exists in the UI.
  // A synthetic swap has no such interaction, so the newly-unlocked bonus's
  // passives were scoring as off/zero-stacked even though echoSetBonus
  // correctly named them as active.
  it("force-enables a newly-applicable bonus's passives at max stacks", () => {
    const override = resolveNewlyActiveSetPassivesOverride(
      {},
      { setBonusOnePiece: null, setBonusOne: null, setBonusTwo: null },
      { setBonusOnePiece: null, setBonusOne: "Freezing Frost 2 Set", setBonusTwo: "Freezing Frost 5 Set" },
    );

    // Freezing Frost 2 Set's own passive is alwaysEnabled, so it needs no
    // override — resolveEchoSetPassiveInstance forces it on regardless.
    // Freezing Frost 5 Set's passive is the conditional one this fix exists
    // for: hasStacks, maxStacks: 3, alwaysEnabled: false.
    expect(override.FreezingFrost5SetGlacio).toEqual({ isEnabled: true, stacks: 3 });
  });

  it("leaves a bonus's passives alone when the swap doesn't change that slot", () => {
    const override = resolveNewlyActiveSetPassivesOverride(
      { SomeOtherPassive: { isEnabled: false, stacks: 1 } },
      { setBonusOnePiece: null, setBonusOne: "Freezing Frost 2 Set", setBonusTwo: "Freezing Frost 5 Set" },
      { setBonusOnePiece: null, setBonusOne: "Freezing Frost 2 Set", setBonusTwo: "Freezing Frost 5 Set" },
    );

    // Same bonus before and after this swap (e.g. a within-set substat-only
    // swap) — nothing about it is "newly" active, so the player's real
    // stored toggle/stacks must be preserved untouched, not force-maxed.
    expect(override).toEqual({ SomeOtherPassive: { isEnabled: false, stacks: 1 } });
  });

  it("preserves untouched stored passives alongside a newly-forced one", () => {
    const override = resolveNewlyActiveSetPassivesOverride(
      { UnrelatedPassive: { isEnabled: true, stacks: 2 } },
      { setBonusOnePiece: null, setBonusOne: null, setBonusTwo: "Molten Rift 5 Set" },
      { setBonusOnePiece: null, setBonusOne: null, setBonusTwo: "Freezing Frost 5 Set" },
    );

    expect(override.UnrelatedPassive).toEqual({ isEnabled: true, stacks: 2 });
    expect(override.FreezingFrost5SetGlacio).toEqual({ isEnabled: true, stacks: 3 });
  });

  it("does nothing when no bonus slot actually changed", () => {
    const before = { setBonusOnePiece: null, setBonusOne: "Freezing Frost 2 Set", setBonusTwo: "Freezing Frost 5 Set" };
    const override = resolveNewlyActiveSetPassivesOverride(
      { FreezingFrost5SetGlacio: { isEnabled: true, stacks: 1 } },
      before,
      { ...before },
    );

    // The player's own real stack count (1, not maxed) is respected when
    // this specific swap didn't touch that bonus at all.
    expect(override.FreezingFrost5SetGlacio).toEqual({ isEnabled: true, stacks: 1 });
  });
});

describe("estimateEchoSwapImpact — conditional 5pc set-bonus passive", () => {
  // End-to-end version of the same bug: Carlotta (Glacio) going from 4x
  // Freezing Frost + 1 off-set echo to a full 5x Freezing Frost build.
  // Freezing Frost 2 Set is alwaysEnabled (+10% Glacio); Freezing Frost 5
  // Set is the conditional one this fix targets (hasStacks, maxStacks: 3,
  // alwaysEnabled: false, +10% Glacio per stack).
  const CARLOTTA_ROTATION = {
    id: "r1",
    name: "Test rotation",
    duration: 10,
    actions: [{ id: "a1", type: "basic", key: "BasicAttackStage1DMG", count: 1 }],
  };

  const OFF_SET_MAIN = {
    echo: "Main4", type: 4, echoId: "off-set", echoSet: "OtherSet", rank: 5, stat: "ATK",
    echoSubStatsType1: "ATK", echoSubStatsValue1: 50,
  };
  const COMPLETES_5PC_MAIN = {
    echo: "Main4", type: 4, echoId: "completes-5pc", echoSet: "FreezingFrost", rank: 5, stat: "ATK",
    echoSubStatsType1: "ATK", echoSubStatsValue1: 50,
  };
  const OTHER_FREEZING_FROST = [
    { echo: "ThreeA", type: 3, echoId: "ff-3a", echoSet: "FreezingFrost", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 30 },
    { echo: "ThreeB", type: 3, echoId: "ff-3b", echoSet: "FreezingFrost", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 30 },
    { echo: "OneA", type: 1, echoId: "ff-1a", echoSet: "FreezingFrost", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 10 },
    { echo: "OneB", type: 1, echoId: "ff-1b", echoSet: "FreezingFrost", rank: 5, stat: "ATK", echoSubStatsType1: "ATK", echoSubStatsValue1: 10 },
  ];
  const CARLOTTA_INVENTORY = [OFF_SET_MAIN, COMPLETES_5PC_MAIN, ...OTHER_FREEZING_FROST];

  function carlottaWearingOffSetMain() {
    return {
      Carlotta: {
        rotations: [CARLOTTA_ROTATION],
        echoes: {
          0: { echoId: "off-set" },
          1: { echoId: "ff-3a" },
          2: { echoId: "ff-3b" },
          3: { echoId: "ff-1a" },
          4: { echoId: "ff-1b" },
        },
      },
    };
  }

  it("credits the conditional 5pc passive, not just the always-enabled 2pc portion", async () => {
    const result = await estimateEchoSwapImpact(
      "Carlotta",
      carlottaWearingOffSetMain(),
      { echoId: "completes-5pc", slotIndex: 0 },
      enemyConfig,
      CARLOTTA_INVENTORY,
    );

    expect(result).not.toBeNull();
    expect(result!.delta).toBeGreaterThan(0);
    // 2pc alone (+10% Glacio) was already correctly credited before this
    // fix (it's alwaysEnabled). The 5pc's own +30% (3 stacks x 10%) on top
    // of that roughly quadruples the total Glacio-DMG-bonus swing — a
    // generous but real lower bound that a 2pc-only credit could not reach.
    expect(result!.pct).toBeGreaterThan(0.2);
  });
});
