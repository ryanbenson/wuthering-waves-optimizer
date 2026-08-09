import { describe, it, expect } from "vitest";
import {
  getEchoBuffEffects,
  getMainEchoBuffs,
  getMainEchoBuffStacks,
  isMainEchoBuffEnabled,
  mergeMainEchoBuffStats,
  migrateLegacyMainEchoBuffState,
} from "./mainEchoBuffs";

describe("getMainEchoBuffs", () => {
  it("returns empty for missing echo or empty modifiers", () => {
    expect(getMainEchoBuffs(null)).toEqual([]);
    expect(
      getMainEchoBuffs({ key: "Foo", details: "d", modifiers: [] }),
    ).toEqual([]);
  });

  it("synthesizes one buff for legacy unkeyed modifiers", () => {
    const buffs = getMainEchoBuffs({
      key: "SentryConstruct",
      details: "full details",
      hasStacks: false,
      modifiers: [
        { modifier: "Glacio", modifierValue: 0.12 },
        { modifier: "ResonanceSkillDMGBonus", modifierValue: 0.12 },
      ],
    });

    expect(buffs).toHaveLength(1);
    expect(buffs[0].key).toBe("SentryConstruct");
    expect(buffs[0].details).toBe("full details");
    expect(buffs[0].effects).toEqual([
      {
        modifier: "Glacio",
        modifierValue: 0.12,
        modifySpecificTalents: undefined,
        specificCharacters: undefined,
        modifierValueTalentRef: undefined,
        modifierTalentKey: undefined,
      },
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.12,
        modifySpecificTalents: undefined,
        specificCharacters: undefined,
        modifierValueTalentRef: undefined,
        modifierTalentKey: undefined,
      },
    ]);
  });

  it("keeps echo-level stacks on the synthesized legacy buff", () => {
    const buffs = getMainEchoBuffs({
      key: "LampylumenMyriad",
      details: "details",
      hasStacks: true,
      minStacks: 0,
      maxStacks: 3,
      modifiers: [
        { modifier: "Glacio", modifierValue: 0.04 },
        { modifier: "ResonanceSkillDMGBonus", modifierValue: 0.04 },
      ],
    });

    expect(buffs).toHaveLength(1);
    expect(buffs[0].hasStacks).toBe(true);
    expect(buffs[0].maxStacks).toBe(3);
  });

  it("lists each keyed modifier as its own buff", () => {
    const buffs = getMainEchoBuffs({
      key: "_Staytuned1",
      details: "echo details",
      modifiers: [
        {
          key: "_Staytuned1AeroMain",
          details: "main aero",
          modifier: "Aero",
          modifierValue: 0.1,
        },
        {
          key: "_Staytuned1TuneStrain",
          details: "tune strain",
          modifier: "Aero",
          modifierValue: 0.1,
        },
      ],
    });

    expect(buffs).toHaveLength(2);
    expect(buffs[0].key).toBe("_Staytuned1AeroMain");
    expect(buffs[0].details).toBe("main aero");
    expect(buffs[1].key).toBe("_Staytuned1TuneStrain");
    expect(buffs[1].details).toBe("tune strain");
  });

  it("falls back to echo details when keyed buff omits details", () => {
    const buffs = getMainEchoBuffs({
      key: "Foo",
      details: "echo details",
      modifiers: [
        { key: "FooA", modifier: "ATK", modifierValue: 0.1 },
      ],
    });
    expect(buffs[0].details).toBe("echo details");
  });
});

describe("getEchoBuffEffects", () => {
  it("prefers nested effects array", () => {
    expect(
      getEchoBuffEffects({
        key: "Grouped",
        effects: [
          { modifier: "Aero", modifierValue: 0.1 },
          { modifier: "ATK", modifierValue: 0.2 },
        ],
      }),
    ).toEqual([
      { modifier: "Aero", modifierValue: 0.1 },
      { modifier: "ATK", modifierValue: 0.2 },
    ]);
  });

  it("wraps a flat single-stat modifier", () => {
    expect(
      getEchoBuffEffects({
        modifier: "Fusion",
        modifierValue: 0.12,
      }),
    ).toMatchObject([{ modifier: "Fusion", modifierValue: 0.12 }]);
  });
});

describe("legacy enable/stacks fallbacks", () => {
  it("reads per-buff map when present", () => {
    const state = {
      buffs: {
        Foo: { isEnabled: true, stacks: 2 },
        Bar: { isEnabled: false },
      },
      isEnabled: false,
      stacks: 9,
    };
    expect(isMainEchoBuffEnabled(state, "Foo")).toBe(true);
    expect(isMainEchoBuffEnabled(state, "Bar")).toBe(false);
    expect(getMainEchoBuffStacks(state, "Foo")).toBe(2);
  });

  it("falls back to legacy isEnabled/stacks when buffs map is missing", () => {
    const state = { isEnabled: true, stacks: 3 };
    expect(isMainEchoBuffEnabled(state, "SentryConstruct")).toBe(true);
    expect(getMainEchoBuffStacks(state, "SentryConstruct")).toBe(3);
  });
});

describe("migrateLegacyMainEchoBuffState", () => {
  it("returns null when already migrated or disabled with no stacks", () => {
    expect(
      migrateLegacyMainEchoBuffState(
        { buffs: { Foo: { isEnabled: true } } },
        [{ key: "Foo", details: "", alwaysEnabled: false, hasStacks: false, minStacks: 0, maxStacks: 0, effects: [] }],
      ),
    ).toBeNull();
    expect(
      migrateLegacyMainEchoBuffState(
        { isEnabled: false },
        [{ key: "Foo", details: "", alwaysEnabled: false, hasStacks: false, minStacks: 0, maxStacks: 0, effects: [] }],
      ),
    ).toBeNull();
  });

  it("expands legacy enabled state onto all resolved buffs", () => {
    const result = migrateLegacyMainEchoBuffState(
      { isEnabled: true, stacks: 2 },
      [
        {
          key: "A",
          details: "",
          alwaysEnabled: false,
          hasStacks: true,
          minStacks: 0,
          maxStacks: 3,
          effects: [],
        },
        {
          key: "B",
          details: "",
          alwaysEnabled: false,
          hasStacks: false,
          minStacks: 0,
          maxStacks: 0,
          effects: [],
        },
      ],
    );
    expect(result).toEqual({
      A: { isEnabled: true, stacks: 2 },
      B: { isEnabled: true },
    });
  });
});

describe("mergeMainEchoBuffStats", () => {
  it("sums numeric stats across multiple enabled buffs", () => {
    const result = mergeMainEchoBuffStats({
      buffA: { ATK: 10 },
      buffB: { ATK: 5, CritRate: 2 },
    });
    expect(result).toEqual({ ATK: 15, CritRate: 2 });
  });

  it("merges into an existing target object rather than replacing it", () => {
    const target = { ATK_FLAT: 100 };
    const result = mergeMainEchoBuffStats({ buffA: { ATK_FLAT: 50 } }, target);
    expect(result).toBe(target);
    expect(result).toEqual({ ATK_FLAT: 150 });
  });

  it("merges (does not overwrite) specificTalentBuffs across buffs", () => {
    const result = mergeMainEchoBuffStats({
      buffA: { specificTalentBuffs: { skillDMGBonus: 0.2 } },
      buffB: { specificTalentBuffs: { basicDMGBonus: 0.1 } },
    });
    expect(result.specificTalentBuffs).toEqual({
      skillDMGBonus: 0.2,
      basicDMGBonus: 0.1,
    });
  });

  it("overwrites (does not sum) EnableAttack", () => {
    const result = mergeMainEchoBuffStats({
      buffA: { EnableAttack: ["fromA"] },
      buffB: { EnableAttack: ["fromB"] },
    });
    expect(result.EnableAttack).toEqual(["fromB"]);
  });

  it("concatenates modifySpecificTalents and talentModifierMultiply across buffs", () => {
    const result = mergeMainEchoBuffStats({
      buffA: { modifySpecificTalents: ["a"], talentModifierMultiply: ["x"] },
      buffB: { modifySpecificTalents: ["b"], talentModifierMultiply: ["y"] },
    });
    expect(result.modifySpecificTalents).toEqual(["a", "b"]);
    expect(result.talentModifierMultiply).toEqual(["x", "y"]);
  });
});
