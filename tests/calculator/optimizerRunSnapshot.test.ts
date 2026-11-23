import { describe, it, expect } from "vitest";
import {
  buildOptimizerInputsKey,
  createOptimizerRunSnapshot,
  isOptimizerSnapshotStale,
  refreshOptimizerSnapshotBaseline,
  type OptimizerRunInputs,
} from "../../src/calculator/optimizerRunSnapshot";

// Issue #706: optimizer results compare against the build they were run on,
// and say so when the build's non-echo inputs have changed since.
function inputs(overrides: Partial<OptimizerRunInputs> = {}): OptimizerRunInputs {
  return {
    characterLevel: "90",
    talents: { basic: 10, skill: 10, forte: 10, liberation: 10, intro: 10 },
    weapon: { attack: 500, modifier: "CritRate", modifierValue: 0.36, refinement: "1", weaponPassiveStats: { ATK: 12 } },
    characterBuffs: { SchemataofRunes: { isEnabled: true } },
    resonanceChains: { SequenceNode1: { isEnabled: false } },
    teamBuffs: { Verina: { ATK: 20 } },
    customBuffs: { CritRate: 0 },
    enemy: { enemyLevel: 90, enemyResist: 0.1, enemyType: "Calamity", havocBaneStacks: 0 },
    stance: null,
    rotations: [{ id: "r1", actions: [{ key: "BasicAttackStage1DMG" }] }],
    ...overrides,
  };
}

const stats = { totalAtk: 2000, totalHp: 15000, totalDef: 1200, totalCritRate: 0.6, totalCritDMG: 2.2, energyRegen: 1.2 };

describe("buildOptimizerInputsKey", () => {
  it("doesn't depend on property order", () => {
    const reordered = inputs({ weapon: { refinement: "1", weaponPassiveStats: { ATK: 12 }, modifierValue: 0.36, modifier: "CritRate", attack: 500 } });
    expect(buildOptimizerInputsKey(reordered)).toBe(buildOptimizerInputsKey(inputs()));
  });

  it.each<[string, Partial<OptimizerRunInputs>]>([
    ["weapon", { weapon: { attack: 588, modifier: "CritDMG", modifierValue: 0.72, refinement: "1", weaponPassiveStats: {} } }],
    ["weapon refinement", { weapon: { attack: 500, modifier: "CritRate", modifierValue: 0.36, refinement: "5", weaponPassiveStats: { ATK: 12 } } }],
    ["a resonance chain", { resonanceChains: { SequenceNode1: { isEnabled: true } } }],
    ["a character buff", { characterBuffs: { SchemataofRunes: { isEnabled: false } } }],
    ["team buffs", { teamBuffs: { Verina: { ATK: 0 } } }],
    ["custom buffs", { customBuffs: { CritRate: 5 } }],
    ["enemy level", { enemy: { enemyLevel: 100, enemyResist: 0.1, enemyType: "Calamity", havocBaneStacks: 0 } }],
    ["character level", { characterLevel: "80" }],
    ["a skill level", { talents: { basic: 10, skill: 9, forte: 10, liberation: 10, intro: 10 } }],
    ["stance", { stance: "Ascension" }],
    ["rotations", { rotations: [{ id: "r1", actions: [{ key: "BasicAttackStage2DMG" }] }] }],
  ])("changes when %s changes", (_label, change) => {
    expect(buildOptimizerInputsKey(inputs(change))).not.toBe(buildOptimizerInputsKey(inputs()));
  });
});

describe("isOptimizerSnapshotStale", () => {
  it("is false with no snapshot (no results yet)", () => {
    expect(isOptimizerSnapshotStale(null, inputs())).toBe(false);
  });

  it("is false while the build's non-echo inputs are unchanged, e.g. after equipping a result", () => {
    // Echoes, the main echo and set/main echo buffs aren't inputs at all, so
    // equipping a result or syncing the optimizer's buffs can't flag the run.
    const snapshot = createOptimizerRunSnapshot(inputs(), stats, {});
    expect(isOptimizerSnapshotStale(snapshot, inputs())).toBe(false);
  });

  it("is true once a non-echo input changes", () => {
    const snapshot = createOptimizerRunSnapshot(inputs(), stats, {});
    expect(isOptimizerSnapshotStale(snapshot, inputs({ resonanceChains: { SequenceNode1: { isEnabled: true } } }))).toBe(true);
  });
});

describe("createOptimizerRunSnapshot", () => {
  it("copies the stats and damages so later changes to the live build don't reach it", () => {
    const liveStats = { ...stats };
    const liveDamages = { rotations: [{ id: "r1", damageAggregation: { avgDamage: 100 } }] };
    const snapshot = createOptimizerRunSnapshot(inputs(), liveStats, liveDamages);

    liveStats.totalAtk = 9999;
    liveDamages.rotations[0].damageAggregation.avgDamage = 5;

    expect(snapshot.stats.totalAtk).toBe(2000);
    expect(snapshot.allDamages).toEqual({ rotations: [{ id: "r1", damageAggregation: { avgDamage: 100 } }] });
  });
});

describe("refreshOptimizerSnapshotBaseline", () => {
  it("moves the baseline to the given build but keeps the run's inputs key", () => {
    const snapshot = createOptimizerRunSnapshot(inputs(), stats, { total: 100 });
    const liveDamages = { total: 140 };
    const refreshed = refreshOptimizerSnapshotBaseline(snapshot, { ...stats, totalAtk: 2300 }, liveDamages);

    liveDamages.total = 5;

    expect(refreshed.inputsKey).toBe(snapshot.inputsKey);
    expect(refreshed.stats.totalAtk).toBe(2300);
    expect(refreshed.allDamages).toEqual({ total: 140 });
    expect(snapshot.stats.totalAtk).toBe(2000);
  });
});

describe("snapshot stat parts (#746)", () => {
  it("keeps the %/flat HP, ATK and DEF pools through create and refresh", () => {
    const parts = { hpPercent: 30, hpFlat: 2580, attackPercent: 60, attackFlat: 350, defPercent: 20, defFlat: 0 };
    const snapshot = createOptimizerRunSnapshot(inputs(), { ...stats, ...parts }, {});
    expect(snapshot.stats).toMatchObject(parts);
    const refreshed = refreshOptimizerSnapshotBaseline(snapshot, { ...stats, ...parts, attackFlat: 400 }, {});
    expect(refreshed.stats.attackFlat).toBe(400);
  });
});
