import { describe, it, expect } from "vitest";
import {
  applyAdvancedOverrides,
  applyAdvancedConfigOverride,
  applyBulkAdvancedConfigOverride,
  buildAdvancedConfigSnapshot,
  countOverriddenAdvancedConfigFields,
  countPossibleAdvancedConfigFields,
  getAdvancedConfigSyncState,
  hasAdvancedConfigOverrides,
  mergeAdvancedConfigForDisplay,
  mergeBuffConfig,
  removeAdvancedConfigOverride,
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

  it("produces the same shape as applyAdvancedConfigOverride for a single action", () => {
    const existing: RotationAdvancedConfig = { buffs: { OtherBuff: { isEnabled: true } } };
    const bulkResult = applyBulkAdvancedConfigOverride(
      [{ id: "a", advancedConfig: existing }],
      ["a"],
      "buffs",
      "SomeBuff",
      { isEnabled: false },
    );
    const directResult = applyAdvancedConfigOverride(existing, "buffs", "SomeBuff", { isEnabled: false });
    expect(bulkResult[0].advancedConfig).toEqual(directResult);
  });
});

describe("applyAdvancedConfigOverride", () => {
  it("writes only the named field, starting from undefined", () => {
    const result = applyAdvancedConfigOverride(undefined, "buffs", "SomeBuff", { isEnabled: true });
    expect(result).toEqual({ buffs: { SomeBuff: { isEnabled: true } } });
  });

  it("adds a second key without touching the first, across separate calls", () => {
    const first = applyAdvancedConfigOverride(undefined, "buffs", "BuffA", { isEnabled: true });
    const second = applyAdvancedConfigOverride(first, "weaponPassives", "PassiveB", { isEnabled: false });
    expect(second).toEqual({
      buffs: { BuffA: { isEnabled: true } },
      weaponPassives: { PassiveB: { isEnabled: false } },
    });
    // Never introduces keys the caller didn't pass — this is the direct
    // regression test for the "one toggle bakes every buff" bug.
    expect(Object.keys(second.buffs ?? {})).toEqual(["BuffA"]);
  });

  it("replaces the whole mainEchoBuff field rather than merging per-sub-key", () => {
    const existing: RotationAdvancedConfig = { mainEchoBuff: { isEnabled: true, stacks: 1 } };
    const result = applyAdvancedConfigOverride(existing, "mainEchoBuff", null, { isEnabled: false });
    expect(result.mainEchoBuff).toEqual({ isEnabled: false });
  });
});

describe("removeAdvancedConfigOverride", () => {
  it("returns undefined (not {}) when removing the only override", () => {
    const existing: RotationAdvancedConfig = { buffs: { SomeBuff: { isEnabled: true } } };
    const result = removeAdvancedConfigOverride(existing, "buffs", "SomeBuff");
    expect(result).toBeUndefined();
  });

  it("leaves other overrides intact when removing one of several", () => {
    const existing: RotationAdvancedConfig = {
      buffs: { BuffA: { isEnabled: true }, BuffB: { isEnabled: false } },
      weaponPassives: { PassiveA: { isEnabled: true } },
    };
    const result = removeAdvancedConfigOverride(existing, "buffs", "BuffA");
    expect(result).toEqual({
      buffs: { BuffB: { isEnabled: false } },
      weaponPassives: { PassiveA: { isEnabled: true } },
    });
  });

  it("removes mainEchoBuff while keeping other categories", () => {
    const existing: RotationAdvancedConfig = {
      mainEchoBuff: { isEnabled: true },
      buffs: { BuffA: { isEnabled: true } },
    };
    const result = removeAdvancedConfigOverride(existing, "mainEchoBuff", null);
    expect(result).toEqual({ buffs: { BuffA: { isEnabled: true } } });
  });

  it("round-trips with hasAdvancedConfigOverrides once the last field is removed", () => {
    const existing: RotationAdvancedConfig = { buffs: { SomeBuff: { isEnabled: true } } };
    const result = removeAdvancedConfigOverride(existing, "buffs", "SomeBuff");
    expect(hasAdvancedConfigOverrides(result)).toBe(false);
  });

  it("is a no-op on an already-undefined config", () => {
    expect(removeAdvancedConfigOverride(undefined, "buffs", "SomeBuff")).toBeUndefined();
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

describe("mergeAdvancedConfigForDisplay", () => {
  it("returns the snapshot unchanged when there are no persisted overrides", async () => {
    const characterData = { buffs: { StatBonusATK1: { isEnabled: true } } };
    const built = await buildCharacterCalculationContext("Calcharo", { Calcharo: characterData }, enemyConfig);
    const snapshot = buildAdvancedConfigSnapshot(characterData, built.definitions, "current");

    expect(mergeAdvancedConfigForDisplay(snapshot, undefined)).toEqual(snapshot);
  });

  it("shows the override for a touched key while a sibling key keeps reflecting the live snapshot", async () => {
    const characterData = {
      buffs: { StatBonusATK1: { isEnabled: true }, StatBonusATK2: { isEnabled: true } },
    };
    const built = await buildCharacterCalculationContext("Calcharo", { Calcharo: characterData }, enemyConfig);
    const snapshot = buildAdvancedConfigSnapshot(characterData, built.definitions, "current");

    const merged = mergeAdvancedConfigForDisplay(snapshot, { buffs: { StatBonusATK1: { isEnabled: false } } });

    expect(merged.buffs?.StatBonusATK1).toEqual({ isEnabled: false });
    // The untouched sibling still reflects the character's live value from
    // the snapshot — this is the direct regression test for the bug where
    // overriding one buff used to hide every other buff's live state.
    expect(merged.buffs?.StatBonusATK2).toEqual(snapshot.buffs?.StatBonusATK2);
  });

  it("overlays mainEchoBuff as a whole object, matching applyAdvancedOverrides' semantics", () => {
    const snapshot: RotationAdvancedConfig = { mainEchoBuff: { isEnabled: false, stacks: 0 } };
    const merged = mergeAdvancedConfigForDisplay(snapshot, { mainEchoBuff: { isEnabled: true } });
    expect(merged.mainEchoBuff).toEqual({ isEnabled: true, stacks: 0 });
  });

  it("matches mergeBuffConfig directly for a given category", async () => {
    const characterData = {
      buffs: { StatBonusATK1: { isEnabled: true }, StatBonusATK2: { isEnabled: false } },
    };
    const built = await buildCharacterCalculationContext("Calcharo", { Calcharo: characterData }, enemyConfig);
    const snapshot = buildAdvancedConfigSnapshot(characterData, built.definitions, "current");
    const overrides: RotationAdvancedConfig = { buffs: { StatBonusATK1: { isEnabled: false } } };

    const merged = mergeAdvancedConfigForDisplay(snapshot, overrides);
    expect(merged.buffs).toEqual(mergeBuffConfig(snapshot.buffs, overrides.buffs));
  });
});

describe("3-state sync derivation", () => {
  it("countOverriddenAdvancedConfigFields counts every category plus mainEchoBuff", () => {
    const config: RotationAdvancedConfig = {
      buffs: { A: {}, B: {} },
      weaponPassives: { C: {} },
      mainEchoBuff: { isEnabled: true },
    };
    expect(countOverriddenAdvancedConfigFields(config)).toBe(4);
    expect(countOverriddenAdvancedConfigFields(undefined)).toBe(0);
  });

  it("countPossibleAdvancedConfigFields sums every definition list plus mainEchoDef", async () => {
    const built = await buildCharacterCalculationContext("Calcharo", { Calcharo: {} }, enemyConfig);
    const echoSetPassiveCount =
      (built.definitions.echoSetPassivesOnePiece?.length ?? 0) +
      (built.definitions.echoSetPassivesOne?.length ?? 0) +
      (built.definitions.echoSetPassivesTwo?.length ?? 0);
    const expected =
      (built.definitions.buffs?.length ?? 0) +
      (built.definitions.weaponPassives?.length ?? 0) +
      echoSetPassiveCount +
      (built.definitions.teamBuffs?.length ?? 0) +
      (built.definitions.resonanceChains?.length ?? 0) +
      (built.definitions.mainEchoDef ? 1 : 0);

    expect(countPossibleAdvancedConfigFields(built.definitions)).toBe(expected);
    expect(countPossibleAdvancedConfigFields(null)).toBe(0);
  });

  it("getAdvancedConfigSyncState derives synced/partial/full-custom from override count", async () => {
    const built = await buildCharacterCalculationContext("Calcharo", { Calcharo: {} }, enemyConfig);
    const possible = countPossibleAdvancedConfigFields(built.definitions);

    expect(getAdvancedConfigSyncState(undefined, built.definitions)).toBe("synced");
    expect(getAdvancedConfigSyncState({}, built.definitions)).toBe("synced");

    const oneBuffKey = built.definitions.buffs[0]?.key;
    if (oneBuffKey) {
      expect(getAdvancedConfigSyncState({ buffs: { [oneBuffKey]: { isEnabled: true } } }, built.definitions)).toBe(
        possible > 1 ? "partial" : "full-custom",
      );
    }

    const fullSnapshot = buildAdvancedConfigSnapshot({}, built.definitions, "current");
    expect(getAdvancedConfigSyncState(fullSnapshot, built.definitions)).toBe("full-custom");
  });
});
