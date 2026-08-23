import { describe, it, expect } from "vitest";
import {
  buildBuildExportPayload,
  generateBuildExportFilename,
  parseBuildImportPayload,
} from "../../src/characters/buildExportImport";

const sampleBuild = {
  id: "abc123",
  name: "My Burst Build",
  createdAt: 1,
  updatedAt: 2,
  weapon: "SwordOfVoid",
  echoes: [{ echoId: "e1" }, null, null, null, null],
  buffs: { Foo: { isEnabled: true } },
};

describe("buildBuildExportPayload", () => {
  it("wraps the build's own fields and name in a meta envelope, without id/createdAt/updatedAt", () => {
    const payload = buildBuildExportPayload(sampleBuild);

    expect(payload.meta).toEqual({ version: "1", source: "WutheringTools", type: "characterBuild" });
    expect(payload.data).toEqual({
      name: "My Burst Build",
      weapon: "SwordOfVoid",
      echoes: sampleBuild.echoes,
      buffs: sampleBuild.buffs,
    });
    expect(payload.data).not.toHaveProperty("id");
    expect(payload.data).not.toHaveProperty("createdAt");
    expect(payload.data).not.toHaveProperty("updatedAt");
  });
});

describe("generateBuildExportFilename", () => {
  it("slugifies the build name into a .json filename", () => {
    expect(generateBuildExportFilename("My Cool Build!")).toBe("my-cool-build.json");
  });

  it("falls back to a generic name for an empty/unslugifiable name", () => {
    expect(generateBuildExportFilename("")).toBe("build.json");
  });
});

describe("parseBuildImportPayload", () => {
  it("round-trips a payload built by buildBuildExportPayload", () => {
    const payload = buildBuildExportPayload(sampleBuild);
    const parsed = parseBuildImportPayload(JSON.stringify(payload));

    expect(parsed).toEqual({
      name: "My Burst Build",
      weapon: "SwordOfVoid",
      echoes: sampleBuild.echoes,
      buffs: sampleBuild.buffs,
    });
  });

  it("accepts a bare build-data object directly", () => {
    const parsed = parseBuildImportPayload(JSON.stringify({ name: "Bare", weapon: "SwordOfVoid" }));
    expect(parsed).toEqual({ name: "Bare", weapon: "SwordOfVoid" });
  });

  it("accepts a completely blank build (a legitimate 'blank' build has no fields)", () => {
    const parsed = parseBuildImportPayload(JSON.stringify({}));
    expect(parsed).toEqual({ name: "Imported Build" });
  });

  it("defaults a missing/empty name to 'Imported Build'", () => {
    expect(parseBuildImportPayload(JSON.stringify({ weapon: "X" }))).toEqual({
      name: "Imported Build",
      weapon: "X",
    });
    expect(parseBuildImportPayload(JSON.stringify({ name: "", weapon: "X" }))).toEqual({
      name: "Imported Build",
      weapon: "X",
    });
  });

  it("strips a pasted build entry's own id/createdAt/updatedAt and bookkeeping keys", () => {
    const parsed = parseBuildImportPayload(
      JSON.stringify({
        id: "old-id",
        name: "Whole Build",
        createdAt: 1,
        updatedAt: 2,
        builds: [{ id: "nested" }],
        activeBuildId: "nested",
        weapon: "SwordOfVoid",
      }),
    );
    expect(parsed).toEqual({ name: "Whole Build", weapon: "SwordOfVoid" });
  });

  it("throws on invalid JSON", () => {
    expect(() => parseBuildImportPayload("{not json")).toThrow(/valid JSON/);
  });

  it("throws on a JSON array", () => {
    expect(() => parseBuildImportPayload(JSON.stringify([1, 2, 3]))).toThrow(/build export/);
  });

  it("throws a specific error when meta.type identifies a different export kind", () => {
    const teamExport = { meta: { version: "1", source: "WutheringTools", type: "teamRotation" }, data: {} };
    expect(() => parseBuildImportPayload(JSON.stringify(teamExport))).toThrow(/different kind/);
  });

  it("throws a specific error for a whole-app export accidentally pasted in", () => {
    const wholeAppExport = {
      meta: { version: "8", source: "WutheringTools" },
      data: { character: "{}", inventory: "{}" },
    };
    expect(() => parseBuildImportPayload(JSON.stringify(wholeAppExport))).toThrow(/different kind/);
  });
});
