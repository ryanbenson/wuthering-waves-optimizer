import { describe, it, expect } from "vitest";
import {
  getRecommendedTeams,
  getRecommendedTeamTags,
  isCurrentTeam,
} from "../../src/characters/recommendedTeams";
import { isTeamTag } from "../../src/characters/teamTags";
import { characterPickerRoster } from "../../src/characters/characters";

// Issue #663: curated teams for the Team Buffs tab.
describe("getRecommendedTeams", () => {
  it("returns teams with names, rarity and known tags in tag order", () => {
    const [team] = getRecommendedTeams("Augusta", [
      { members: ["Iuno", "Sanhua"], tags: ["Budget", "Quickswap", "Made up"] },
    ]);
    expect(team.members).toEqual([
      { key: "Iuno", name: "Iuno", rarity: 5 },
      { key: "Sanhua", name: "Sanhua", rarity: 4 },
    ]);
    expect(team.tags).toEqual(["Quickswap", "Budget"]);
  });

  it.each([
    ["an unknown or unreleased teammate", { members: ["NotACharacter", "Verina"] }],
    ["the main character", { members: ["Augusta", "Verina"] }],
    ["the same teammate twice", { members: ["Verina", "Verina"] }],
    ["the wrong number of teammates", { members: ["Verina"] }],
  ])("drops a team with %s", (_label, team) => {
    expect(getRecommendedTeams("Augusta", [team])).toEqual([]);
  });

  it("drops a repeated team, whatever the order", () => {
    const teams = getRecommendedTeams("Augusta", [
      { members: ["Iuno", "Verina"] },
      { members: ["Verina", "Iuno"] },
    ]);
    expect(teams).toHaveLength(1);
  });

  it("handles a character with no teams", () => {
    expect(getRecommendedTeams("Augusta", undefined)).toEqual([]);
  });
});

describe("isCurrentTeam", () => {
  const [team] = getRecommendedTeams("Augusta", [{ members: ["Iuno", "Verina"] }]);

  it("matches the slots in either order", () => {
    expect(isCurrentTeam(team, "Iuno", "Verina")).toBe(true);
    expect(isCurrentTeam(team, "Verina", "Iuno")).toBe(true);
  });

  it("doesn't match when a slot differs or is empty", () => {
    expect(isCurrentTeam(team, "Iuno", "Shorekeeper")).toBe(false);
    expect(isCurrentTeam(team, "Iuno", null)).toBe(false);
  });
});

describe("getRecommendedTeamTags", () => {
  it("lists the tags in use, in the fixed tag order", () => {
    const teams = getRecommendedTeams("Augusta", [
      { members: ["Iuno", "Verina"], tags: ["Budget"] },
      { members: ["Iuno", "Shorekeeper"], tags: ["Hypercarry"] },
    ]);
    expect(getRecommendedTeamTags(teams)).toEqual(["Hypercarry", "Budget"]);
  });
});

// Every character's hand-written data must use real, released characters and
// known tags, so a typo fails here instead of silently hiding a team.
describe("suggestedTeams data", () => {
  const modules = import.meta.glob("../../src/characters/*/basic.ts", { eager: true }) as Record<
    string,
    { getCharacterBasicInfo: () => { suggestedTeams?: Array<{ members: string[]; tags?: string[] }> } }
  >;
  const roster = new Set([...characterPickerRoster.five, ...characterPickerRoster.four].map((c) => c.key));

  for (const [path, mod] of Object.entries(modules)) {
    const character = path.split("/").at(-2) as string;
    const teams = mod.getCharacterBasicInfo().suggestedTeams;
    if (!teams?.length) continue;

    it(`${character}'s teams are all usable`, () => {
      for (const team of teams) {
        expect(team.members, `${character}: ${team.members.join(" + ")}`).toHaveLength(2);
        for (const member of team.members) {
          expect(roster.has(member), `${character}: unknown teammate ${member}`).toBe(true);
          expect(member, `${character} lists themself`).not.toBe(character);
        }
        for (const tag of team.tags ?? []) {
          expect(isTeamTag(tag), `${character}: unknown tag ${tag}`).toBe(true);
        }
      }
      expect(getRecommendedTeams(character, teams)).toHaveLength(teams.length);
    });
  }
});
