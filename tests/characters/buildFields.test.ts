import { describe, it, expect } from "vitest";
import { extractBuildFields, applyBuildFields, omitBuildMetadata } from "../../src/characters/buildFields";

describe("extractBuildFields", () => {
  it("drops characterLevel, talents, and bookkeeping keys", () => {
    const characterData = {
      characterLevel: "90",
      talents: { basic: 10, skill: 10, forte: 10, liberation: 10, intro: 10 },
      builds: [{ id: "old" }],
      activeBuildId: "old",
      weapon: "SwordOfVoid",
      buffs: { Foo: { isEnabled: true } },
    };

    const extracted = extractBuildFields(characterData);

    expect(extracted).not.toHaveProperty("characterLevel");
    expect(extracted).not.toHaveProperty("talents");
    expect(extracted).not.toHaveProperty("builds");
    expect(extracted).not.toHaveProperty("activeBuildId");
    expect(extracted).toEqual({
      weapon: "SwordOfVoid",
      buffs: { Foo: { isEnabled: true } },
    });
  });

  it("keeps every other field, including ones this file doesn't know about", () => {
    const characterData = {
      characterLevel: "80",
      talents: {},
      someFutureField: { nested: true },
    };

    expect(extractBuildFields(characterData)).toEqual({
      someFutureField: { nested: true },
    });
  });

  it("does not mutate the input or share references with it", () => {
    const echoes = { 0: { echoId: "abc" } };
    const characterData = { characterLevel: "90", talents: {}, echoes };

    const extracted = extractBuildFields(characterData);
    extracted.echoes[0].echoId = "changed";

    expect(echoes[0].echoId).toBe("abc");
  });

  it("handles a missing/undefined record", () => {
    expect(extractBuildFields(undefined as unknown as Record<string, any>)).toEqual({});
  });
});

describe("applyBuildFields", () => {
  it("replaces build fields while preserving the character's shared fields", () => {
    const characterData = {
      characterLevel: "90",
      talents: { basic: 10, skill: 10, forte: 10, liberation: 10, intro: 10 },
      builds: [{ id: "a" }, { id: "b" }],
      activeBuildId: "a",
      weapon: "OldWeapon",
      buffs: { Old: { isEnabled: true } },
    };
    const buildFields = { weapon: "NewWeapon", buffs: { New: { isEnabled: true } } };

    const result = applyBuildFields(characterData, buildFields);

    expect(result).toEqual({
      characterLevel: "90",
      talents: { basic: 10, skill: 10, forte: 10, liberation: 10, intro: 10 },
      builds: [{ id: "a" }, { id: "b" }],
      activeBuildId: "a",
      weapon: "NewWeapon",
      buffs: { New: { isEnabled: true } },
    });
  });

  it("does not mutate either input or share references with the build fields", () => {
    const characterData = { characterLevel: "90", talents: {} };
    const buildFields = { echoes: { 0: { echoId: "abc" } } };

    const result = applyBuildFields(characterData, buildFields);
    result.echoes[0].echoId = "changed";

    expect(buildFields.echoes[0].echoId).toBe("abc");
  });

  it("round-trips through extractBuildFields", () => {
    const original = {
      characterLevel: "90",
      talents: { basic: 10, skill: 10, forte: 10, liberation: 10, intro: 10 },
      weapon: "SwordOfVoid",
      echoes: { 0: { echoId: "abc" } },
    };

    const extracted = extractBuildFields(original);
    const reapplied = applyBuildFields(original, extracted);

    expect(reapplied).toEqual(original);
  });
});

describe("omitBuildMetadata", () => {
  it("drops id/name/createdAt/updatedAt but keeps everything else", () => {
    const build = {
      id: "abc123",
      name: "Default",
      createdAt: 1000,
      updatedAt: 2000,
      weapon: "SwordOfVoid",
      buffs: { Foo: { isEnabled: true } },
    };

    expect(omitBuildMetadata(build)).toEqual({
      weapon: "SwordOfVoid",
      buffs: { Foo: { isEnabled: true } },
    });
  });

  it("does not mutate the input", () => {
    const build = { id: "abc", name: "Default", createdAt: 1, updatedAt: 1, weapon: "X" };
    omitBuildMetadata(build);
    expect(build).toHaveProperty("id", "abc");
  });
});
