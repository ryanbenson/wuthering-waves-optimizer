import { describe, it, expect } from "vitest";
import { resolveCharactersForBuild, resolveCharactersForBuildPreview } from "../../src/calculator/buildOverride";

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

  it("returns the characters map unchanged when buildId is the character's own active build, even if its stored builds[] entry is stale", () => {
    // Regression for issue #534: a Team Rotation slot can be pinned to a
    // build that also happens to be currently active (e.g. picked explicitly
    // from the build picker rather than left on "Follow active build").
    // `builds[]` is only refreshed on switch-away (see `equipBuild` in
    // `stores/character.js`), so live edits made while it stays active
    // (team buffs, weapon passives, etc.) must still be visible here.
    const characters = {
      Mornye: {
        weapon: "LiveWeapon", // the true current state
        teamBuffs: { selectedCharacter1: "Aemeath", selectedCharacter2: "Lynae", buffs: { PrismaticOverblast: { isEnabled: true } } },
        activeBuildId: "build-active",
        builds: [
          // stale — doesn't reflect the live weapon/teamBuffs above, because
          // equipBuild only refreshes this on switch-away, not on every edit
          { id: "build-active", name: "Aemeath Team", weapon: "StaleWeapon", teamBuffs: { selectedCharacter1: "Aemeath", selectedCharacter2: "Lynae" } },
          { id: "build-other", name: "Other", weapon: "OtherWeapon" },
        ],
      },
    };

    const result = resolveCharactersForBuild(characters, "Mornye", "build-active");

    expect(result).toBe(characters);
    expect(result.Mornye.weapon).toBe("LiveWeapon");
    expect(result.Mornye.teamBuffs.buffs.PrismaticOverblast.isEnabled).toBe(true);
  });
});

describe("resolveCharactersForBuildPreview", () => {
  it("returns the characters map unchanged for the active build, even if its stored builds[] entry is stale", () => {
    const characters = {
      Carlotta: {
        weapon: "LiveWeapon", // the true current state
        activeBuildId: "build-active",
        builds: [
          // stale — doesn't reflect "LiveWeapon" because equipBuild only
          // refreshes this on switch-away, not on every live edit
          { id: "build-active", name: "Active", weapon: "StaleWeapon" },
          { id: "build-other", name: "Other", weapon: "OtherWeapon" },
        ],
      },
    };

    const result = resolveCharactersForBuildPreview(characters, "Carlotta", "build-active");

    expect(result).toBe(characters);
    expect(result.Carlotta.weapon).toBe("LiveWeapon");
  });

  it("resolves a non-active build's stored data, same as resolveCharactersForBuild", () => {
    const characters = {
      Carlotta: {
        weapon: "LiveWeapon",
        activeBuildId: "build-active",
        builds: [
          { id: "build-active", name: "Active", weapon: "StaleWeapon" },
          { id: "build-other", name: "Other", weapon: "OtherWeapon" },
        ],
      },
    };

    const result = resolveCharactersForBuildPreview(characters, "Carlotta", "build-other");

    expect(result.Carlotta.weapon).toBe("OtherWeapon");
  });

  it("falls back to the characters map unchanged when the buildId doesn't match any stored build", () => {
    const characters = {
      Carlotta: { weapon: "LiveWeapon", activeBuildId: "build-active", builds: [] },
    };

    expect(resolveCharactersForBuildPreview(characters, "Carlotta", "no-such-build")).toBe(characters);
  });
});
