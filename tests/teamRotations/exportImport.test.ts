import { describe, it, expect } from "vitest";
import {
  buildTeamExportPayload,
  generateTeamExportFilename,
  parseTeamImportPayload,
} from "../../src/teamRotations/exportImport";

const sampleTeam = {
  name: "My Team",
  characterIds: ["Carlotta", "Shorekeeper", null],
  actions: [{ id: "a1", slot: 0, order: 1, key: "Foo", type: "basic" }],
  duration: 30,
  enemyConfig: { enemyLevel: 90, enemyResist: 0.1, enemyType: "Calamity" },
};

describe("buildTeamExportPayload", () => {
  it("wraps the team's own config in a meta envelope, without an id", () => {
    const payload = buildTeamExportPayload(sampleTeam);

    expect(payload.meta).toEqual({ version: "1", source: "WutheringTools", type: "teamRotation" });
    expect(payload.data).toEqual({
      name: "My Team",
      characterIds: ["Carlotta", "Shorekeeper", null],
      actions: sampleTeam.actions,
      duration: 30,
      enemyConfig: sampleTeam.enemyConfig,
    });
    expect(payload.data).not.toHaveProperty("id");
  });
});

describe("generateTeamExportFilename", () => {
  it("slugifies the team name into a .json filename", () => {
    expect(generateTeamExportFilename("My Cool Team!")).toBe("my-cool-team.json");
  });

  it("falls back to a generic name for an empty/unslugifiable name", () => {
    expect(generateTeamExportFilename("")).toBe("team.json");
  });
});

describe("parseTeamImportPayload", () => {
  it("round-trips a payload built by buildTeamExportPayload", () => {
    const payload = buildTeamExportPayload(sampleTeam);
    const parsed = parseTeamImportPayload(JSON.stringify(payload));
    expect(parsed).toEqual(sampleTeam);
  });

  it("accepts a bare team-data object (the shape used by preset `data` fields)", () => {
    const parsed = parseTeamImportPayload(JSON.stringify(sampleTeam));
    expect(parsed).toEqual(sampleTeam);
  });

  it("pads characterIds to exactly 3 slots and fills in sensible defaults for a lenient hand-authored payload", () => {
    const parsed = parseTeamImportPayload(
      JSON.stringify({ characterIds: ["Carlotta"], actions: [] }),
    );
    expect(parsed).toEqual({
      name: "Imported Team",
      characterIds: ["Carlotta", null, null],
      actions: [],
      duration: null,
      enemyConfig: {},
    });
  });

  it("throws on invalid JSON", () => {
    expect(() => parseTeamImportPayload("{not json")).toThrow(/valid JSON/);
  });

  it("throws when characterIds/actions are missing entirely", () => {
    expect(() => parseTeamImportPayload(JSON.stringify({ character: "x" }))).toThrow(
      /characterIds/,
    );
    expect(() =>
      parseTeamImportPayload(JSON.stringify({ characterIds: ["A", "B", "C"] })),
    ).toThrow(/actions/);
  });

  it("throws a specific error for a whole-app export accidentally pasted in", () => {
    const wholeAppExport = { meta: { version: "4", source: "WutheringTools" }, data: { character: "{}", inventory: "{}" } };
    expect(() => parseTeamImportPayload(JSON.stringify(wholeAppExport))).toThrow(/characterIds/);
  });

  it("throws a specific error when meta.type identifies a different export kind", () => {
    const otherExport = { meta: { type: "somethingElse" }, data: {} };
    expect(() => parseTeamImportPayload(JSON.stringify(otherExport))).toThrow(/different kind/);
  });

  it("strips pre-#401 exclude-buffs checkbox fields from imported actions, if a hand-edited export still carries them", () => {
    const parsed = parseTeamImportPayload(
      JSON.stringify({
        characterIds: ["Carlotta"],
        actions: [
          {
            id: "a1",
            slot: 0,
            order: 1,
            key: "Foo",
            type: "basic",
            excludeSelfBuffs: true,
            excludeTeamBuffs: true,
            excludeWeaponBuffs: true,
          },
        ],
      }),
    );
    expect(parsed.actions).toEqual([{ id: "a1", slot: 0, order: 1, key: "Foo", type: "basic" }]);
  });
});
