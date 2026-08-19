import { describe, it, expect } from "vitest";
import {
  applyAdvancedOverrides,
  applyBulkAdvancedConfigOverride,
  buildAdvancedConfigSnapshot,
  hasAdvancedConfigOverrides,
  type RotationAdvancedConfig,
} from "../../src/calculator/rotationAdvancedBuffs";
import { buildCharacterCalculationContext } from "../../src/calculator/buildCharacterContext";
import type { TeamEnemyConfig } from "../../src/calculator/buildCharacterContext";

const enemyConfig: TeamEnemyConfig = {
  enemyLevel: 90,
  enemyResist: 0.1,
  enemyType: "Calamity",
};

describe("hasAdvancedConfigOverrides", () => {
  it("is false for undefined/null/empty configs", () => {
    expect(hasAdvancedConfigOverrides(undefined)).toBe(false);
    expect(hasAdvancedConfigOverrides(null)).toBe(false);
    expect(hasAdvancedConfigOverrides({})).toBe(false);
    expect(hasAdvancedConfigOverrides({ buffs: {}, weaponPassives: {} })).toBe(false);
  });

  it("is true when any category has a key", () => {
    expect(hasAdvancedConfigOverrides({ buffs: { SomeBuff: { isEnabled: true } } })).toBe(true);
    expect(hasAdvancedConfigOverrides({ resonanceChains: { SomeChain: { isEnabled: false } } })).toBe(true);
  });

  it("is true when mainEchoBuff is set", () => {
    expect(hasAdvancedConfigOverrides({ mainEchoBuff: { isEnabled: true } })).toBe(true);
  });
});

describe("applyAdvancedOverrides", () => {
  it("returns the character data unchanged when there is no override", () => {
    const characterData = { buffs: { SomeBuff: { isEnabled: true } } };
    expect(applyAdvancedOverrides(characterData, undefined)).toBe(characterData);
  });

  it("merges overrides into the matching category, leaving other keys and categories untouched", () => {
    const characterData = {
      buffs: { SomeBuff: { isEnabled: true }, OtherBuff: { isEnabled: false } },
      weaponPassives: { SomePassive: { isEnabled: true } },
    };
    const overrides: RotationAdvancedConfig = { buffs: { SomeBuff: { isEnabled: false } } };
    const result = applyAdvancedOverrides(characterData, overrides);
    expect(result.buffs).toEqual({
      SomeBuff: { isEnabled: false },
      OtherBuff: { isEnabled: false },
    });
    expect(result.weaponPassives).toEqual({ SomePassive: { isEnabled: true } });
  });

  it("overrides the main echo buff as a whole object, not merged per-key", () => {
    const characterData = { mainEcho: { echo: "SomeEcho", rank: 5, isEnabled: false } };
    const result = applyAdvancedOverrides(characterData, { mainEchoBuff: { isEnabled: true, stacks: 2 } });
    expect(result.mainEcho).toEqual({ echo: "SomeEcho", rank: 5, isEnabled: true, stacks: 2 });
  });

  it("merges team buffs into the nested teamBuffs.buffs shape", () => {
    const characterData = { teamBuffs: { selectedCharacter1: "Foo", buffs: { SomeTeamBuff: { isEnabled: true } } } };
    const result = applyAdvancedOverrides(characterData, { teamBuffs: { SomeTeamBuff: { isEnabled: false } } });
    expect(result.teamBuffs).toEqual({
      selectedCharacter1: "Foo",
      buffs: { SomeTeamBuff: { isEnabled: false } },
    });
  });
});

describe("applyBulkAdvancedConfigOverride", () => {
  function makeAction(id: string, existingConfig?: RotationAdvancedConfig) {
    return { id, key: "Foo", type: "skill", advancedConfig: existingConfig };
  }

  it("writes the override into the named buff for every listed action, leaving others untouched", () => {
    const actions = [makeAction("a"), makeAction("b"), makeAction("c")];
    const result = applyBulkAdvancedConfigOverride(actions, ["a", "b"], "buffs", "SomeBuff", {
      isEnabled: true,
      stacks: 3,
    });
    expect(result[0].advancedConfig?.buffs?.SomeBuff).toEqual({ isEnabled: true, stacks: 3 });
    expect(result[1].advancedConfig?.buffs?.SomeBuff).toEqual({ isEnabled: true, stacks: 3 });
    expect(result[2].advancedConfig).toBeUndefined();
  });

  it("merges into existing advancedConfig without clobbering other buffs", () => {
    const actions = [makeAction("a", { buffs: { OtherBuff: { isEnabled: true } } })];
    const result = applyBulkAdvancedConfigOverride(actions, ["a"], "buffs", "SomeBuff", { isEnabled: false });
    expect(result[0].advancedConfig?.buffs).toEqual({
      OtherBuff: { isEnabled: true },
      SomeBuff: { isEnabled: false },
    });
  });

  it("handles the mainEchoBuff category, which has no per-key map", () => {
    const actions = [makeAction("a")];
    const result = applyBulkAdvancedConfigOverride(actions, ["a"], "mainEchoBuff", null, { isEnabled: true, stacks: 2 });
    expect(result[0].advancedConfig?.mainEchoBuff).toEqual({ isEnabled: true, stacks: 2 });
  });
});

describe("buildAdvancedConfigSnapshot", () => {
  it("in 'current' mode, mirrors the character's real enabled state so advanced-mode checkboxes aren't misleadingly blank", async () => {
    const characterData = { buffs: { StatBonusATK1: { isEnabled: true } } };
    const built = await buildCharacterCalculationContext("Calcharo", { Calcharo: characterData }, enemyConfig);

    const snapshot = buildAdvancedConfigSnapshot(characterData, built.definitions, "current");

    expect(snapshot.buffs?.StatBonusATK1).toEqual({
      isEnabled: true,
      stacks: undefined,
      baseAttrValue: undefined,
    });
    // A buff never touched on the character page defaults to disabled, same
    // as the character store's own convention.
    const anotherBuffKey = built.definitions.buffs.find((d: any) => d.key !== "StatBonusATK1")?.key;
    expect(snapshot.buffs?.[anotherBuffKey]?.isEnabled).toBe(false);
  });

  it("in 'blank' mode, disables every known toggle regardless of the character's real config", async () => {
    const characterData = { buffs: { StatBonusATK1: { isEnabled: true } } };
    const built = await buildCharacterCalculationContext("Calcharo", { Calcharo: characterData }, enemyConfig);

    const snapshot = buildAdvancedConfigSnapshot(characterData, built.definitions, "blank");

    expect(snapshot.buffs?.StatBonusATK1).toEqual({ isEnabled: false });
    for (const def of built.definitions.buffs) {
      expect(snapshot.buffs?.[def.key]?.isEnabled).toBe(false);
    }
  });
});
