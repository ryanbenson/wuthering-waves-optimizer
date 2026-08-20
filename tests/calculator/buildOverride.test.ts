import { describe, it, expect } from "vitest";
import { resolveCharactersForBuild } from "../../src/calculator/buildOverride";

describe("resolveCharactersForBuild", () => {
  const characters = {
    Carlotta: {
      characterLevel: "90",
      talents: { basic: 10, skill: 10, forte: 10, liberation: 10, intro: 10 },
      weapon: "ActiveWeapon",
      activeBuildId: "build-active",
      builds: [
        { id: "build-active", name: "Active", weapon: "ActiveWeapon" },
        { id: "build-other", name: "Other", weapon: "OtherWeapon" },
      ],
    },
    Danjin: { weapon: "DanjinWeapon" },
  };

  it("returns the characters map unchanged when buildId is null/undefined", () => {
    expect(resolveCharactersForBuild(characters, "Carlotta", null)).toBe(characters);
    expect(resolveCharactersForBuild(characters, "Carlotta", undefined)).toBe(characters);
  });

  it("returns the characters map unchanged when the buildId doesn't match any stored build", () => {
    expect(resolveCharactersForBuild(characters, "Carlotta", "no-such-build")).toBe(characters);
  });

  it("swaps in the named build's fields for the target character only", () => {
    const result = resolveCharactersForBuild(characters, "Carlotta", "build-other");

    expect(result.Carlotta.weapon).toBe("OtherWeapon");
    expect(result.Danjin).toBe(characters.Danjin);
  });

  it("preserves characterLevel/talents and the builds bookkeeping from the real record", () => {
    const result = resolveCharactersForBuild(characters, "Carlotta", "build-other");

    expect(result.Carlotta.characterLevel).toBe("90");
    expect(result.Carlotta.talents).toEqual({
      basic: 10,
      skill: 10,
      forte: 10,
      liberation: 10,
      intro: 10,
    });
    expect(result.Carlotta.builds).toBe(characters.Carlotta.builds);
    expect(result.Carlotta.activeBuildId).toBe("build-active");
  });

  it("does not mutate the original characters map", () => {
    resolveCharactersForBuild(characters, "Carlotta", "build-other");
    expect(characters.Carlotta.weapon).toBe("ActiveWeapon");
  });

  it("returns the characters map unchanged when the character has no builds array", () => {
    const noBuilds = { Danjin: { weapon: "DanjinWeapon" } };
    expect(resolveCharactersForBuild(noBuilds, "Danjin", "any-id")).toBe(noBuilds);
  });
});
