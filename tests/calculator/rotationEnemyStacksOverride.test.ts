import { describe, it, expect } from "vitest";
import {
  ENEMY_STACK_FIELDS,
  applyBulkEnemyStacksOverride,
  applyEnemyStacksOverride,
  countEnemyStacksOverrides,
  hasEnemyStacksOverride,
  mergeEnemyStacksOverride,
  removeEnemyStacksOverride,
  type EnemyStacksOverride,
} from "../../src/calculator/rotationEnemyStacksOverride";
import type { TeamEnemyConfig } from "../../src/calculator/buildCharacterContext";

describe("hasEnemyStacksOverride", () => {
  it("is false for undefined/null/empty/all-disabled overrides", () => {
    expect(hasEnemyStacksOverride(undefined)).toBe(false);
    expect(hasEnemyStacksOverride(null)).toBe(false);
    expect(hasEnemyStacksOverride({})).toBe(false);
    expect(hasEnemyStacksOverride({ strainStacks: { isEnabled: false, stacks: 5 } })).toBe(false);
  });

  it("is true when any field is enabled", () => {
    expect(hasEnemyStacksOverride({ havocBaneStacks: { isEnabled: true, stacks: 3 } })).toBe(true);
  });
});

describe("mergeEnemyStacksOverride", () => {
  const baseEnemyConfig: TeamEnemyConfig = {
    enemyLevel: 95,
    enemyResist: 0.15,
    enemyType: "Overlord",
    strainStacks: 2,
    havocBaneStacks: 1,
  };

  it("returns the base object unchanged when override is undefined", () => {
    expect(mergeEnemyStacksOverride(baseEnemyConfig, undefined)).toBe(baseEnemyConfig);
  });

  it("only replaces fields whose override is enabled with a defined stacks value", () => {
    const override: EnemyStacksOverride = {
      havocBaneStacks: { isEnabled: true, stacks: 7 },
      strainStacks: { isEnabled: false, stacks: 9 },
      spectroFrazzleStacks: { isEnabled: true, stacks: undefined },
    };
    const result = mergeEnemyStacksOverride(baseEnemyConfig, override);
    expect(result.havocBaneStacks).toBe(7);
    expect(result.strainStacks).toBe(2);
    expect(result.spectroFrazzleStacks).toBeUndefined();
  });

  it("never touches enemyLevel/enemyResist/enemyType, even defensively", () => {
    const override = {
      havocBaneStacks: { isEnabled: true, stacks: 9 },
    } as EnemyStacksOverride;
    const result = mergeEnemyStacksOverride(baseEnemyConfig, override);
    expect(result.enemyLevel).toBe(95);
    expect(result.enemyResist).toBe(0.15);
    expect(result.enemyType).toBe("Overlord");
  });

  it("works against a bare stack record (the Optimizer's non-TeamEnemyConfig shape)", () => {
    const baseStacks = { strainStacks: 0, havocBaneStacks: 0 };
    const result = mergeEnemyStacksOverride(baseStacks, { strainStacks: { isEnabled: true, stacks: 4 } });
    expect(result).toEqual({ strainStacks: 4, havocBaneStacks: 0 });
  });
});

describe("applyEnemyStacksOverride / removeEnemyStacksOverride", () => {
  it("adds a field without disturbing other existing overrides", () => {
    const existing: EnemyStacksOverride = { strainStacks: { isEnabled: true, stacks: 3 } };
    const result = applyEnemyStacksOverride(existing, "havocBaneStacks", { isEnabled: true, stacks: 5 });
    expect(result).toEqual({
      strainStacks: { isEnabled: true, stacks: 3 },
      havocBaneStacks: { isEnabled: true, stacks: 5 },
    });
  });

  it("removes exactly one field, returning undefined once empty (not {})", () => {
    const existing: EnemyStacksOverride = { strainStacks: { isEnabled: true, stacks: 3 } };
    expect(removeEnemyStacksOverride(existing, "strainStacks")).toBeUndefined();
  });

  it("removing a field leaves other fields intact", () => {
    const existing: EnemyStacksOverride = {
      strainStacks: { isEnabled: true, stacks: 3 },
      havocBaneStacks: { isEnabled: true, stacks: 5 },
    };
    expect(removeEnemyStacksOverride(existing, "strainStacks")).toEqual({
      havocBaneStacks: { isEnabled: true, stacks: 5 },
    });
  });

  it("removing from undefined is a no-op", () => {
    expect(removeEnemyStacksOverride(undefined, "strainStacks")).toBeUndefined();
  });
});

describe("applyBulkEnemyStacksOverride", () => {
  const actions = [
    { id: "a1", enemyStacksOverride: undefined as EnemyStacksOverride | undefined },
    { id: "a2", enemyStacksOverride: { havocBaneStacks: { isEnabled: true, stacks: 1 } } as EnemyStacksOverride },
    { id: "a3", enemyStacksOverride: undefined as EnemyStacksOverride | undefined },
  ];

  it("stamps the override into only the listed action ids", () => {
    const result = applyBulkEnemyStacksOverride(actions, ["a1", "a3"], "strainStacks", { isEnabled: true, stacks: 6 });
    expect(result[0].enemyStacksOverride).toEqual({ strainStacks: { isEnabled: true, stacks: 6 } });
    expect(result[1].enemyStacksOverride).toEqual({ havocBaneStacks: { isEnabled: true, stacks: 1 } });
    expect(result[2].enemyStacksOverride).toEqual({ strainStacks: { isEnabled: true, stacks: 6 } });
  });

  it("preserves other pre-existing override keys on target actions", () => {
    const result = applyBulkEnemyStacksOverride(actions, ["a2"], "strainStacks", { isEnabled: true, stacks: 6 });
    expect(result[1].enemyStacksOverride).toEqual({
      havocBaneStacks: { isEnabled: true, stacks: 1 },
      strainStacks: { isEnabled: true, stacks: 6 },
    });
  });
});

describe("countEnemyStacksOverrides", () => {
  it("counts only enabled fields", () => {
    expect(countEnemyStacksOverrides(undefined)).toBe(0);
    expect(
      countEnemyStacksOverrides({
        strainStacks: { isEnabled: true, stacks: 1 },
        havocBaneStacks: { isEnabled: false, stacks: 1 },
        spectroFrazzleStacks: { isEnabled: true, stacks: 2 },
      }),
    ).toBe(2);
  });
});

describe("ENEMY_STACK_FIELDS", () => {
  it("covers exactly the 8 documented stack fields with sane caps", () => {
    const keys = ENEMY_STACK_FIELDS.map((f) => f.key).sort();
    expect(keys).toEqual(
      [
        "aeroErosionStacks",
        "electroFlareStacks",
        "electroRageStacks",
        "fusionBurstStacks",
        "glacioChafeStacks",
        "havocBaneStacks",
        "spectroFrazzleStacks",
        "strainStacks",
      ].sort(),
    );
    ENEMY_STACK_FIELDS.forEach((field) => expect(field.max).toBeGreaterThan(0));
  });
});
