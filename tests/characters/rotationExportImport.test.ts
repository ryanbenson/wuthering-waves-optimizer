import { describe, it, expect } from "vitest";
import {
  buildRotationExportPayload,
  generateRotationExportFilename,
  parseRotationImportPayload,
} from "../../src/characters/rotationExportImport";

const sampleRotation = {
  name: "My Burst Rotation",
  description: "Opener into burst",
  duration: 20,
  echo: "Jué",
  echoRank: 5,
  actions: [
    {
      id: "a1",
      type: "basic",
      order: 1,
      count: 1,
      buffs: [{ id: "b1", key: "Foo", isEnabled: true }],
    },
  ],
};

describe("buildRotationExportPayload", () => {
  it("wraps the rotation's own fields in a meta envelope, without any ids", () => {
    const payload = buildRotationExportPayload(sampleRotation);

    expect(payload.meta).toEqual({ version: "1", source: "WutheringTools", type: "characterRotation" });
    expect(payload.data).toEqual({
      name: "My Burst Rotation",
      description: "Opener into burst",
      duration: 20,
      echo: "Jué",
      echoRank: 5,
      actions: [{ type: "basic", order: 1, count: 1, buffs: [{ key: "Foo", isEnabled: true }] }],
    });
    expect(payload.data).not.toHaveProperty("id");
    expect(payload.data.actions[0]).not.toHaveProperty("id");
    expect((payload.data.actions[0].buffs as unknown[])[0]).not.toHaveProperty("id");
  });

  it("defaults missing optional fields to null/empty", () => {
    const payload = buildRotationExportPayload({ name: "Bare", actions: [] });
    expect(payload.data).toEqual({
      name: "Bare",
      description: "",
      duration: null,
      echo: null,
      echoRank: null,
      actions: [],
    });
  });
});

describe("generateRotationExportFilename", () => {
  it("slugifies the rotation name into a .json filename", () => {
    expect(generateRotationExportFilename("My Cool Rotation!")).toBe("my-cool-rotation.json");
  });

  it("falls back to a generic name for an empty/unslugifiable name", () => {
    expect(generateRotationExportFilename("")).toBe("rotation.json");
  });
});

describe("parseRotationImportPayload", () => {
  it("round-trips a payload built by buildRotationExportPayload", () => {
    const payload = buildRotationExportPayload(sampleRotation);
    const parsed = parseRotationImportPayload(JSON.stringify(payload));

    expect(parsed).toEqual(payload.data);
  });

  it("accepts a bare rotation-data object directly (the shape used by presets)", () => {
    const parsed = parseRotationImportPayload(
      JSON.stringify({ name: "Bare", actions: [{ type: "basic" }] }),
    );
    expect(parsed).toEqual({
      name: "Bare",
      description: "",
      duration: null,
      echo: null,
      echoRank: null,
      actions: [{ type: "basic" }],
    });
  });

  it("defaults a missing/empty name to 'Imported Rotation'", () => {
    const parsed = parseRotationImportPayload(JSON.stringify({ actions: [] }));
    expect(parsed.name).toBe("Imported Rotation");
  });

  it("throws on invalid JSON", () => {
    expect(() => parseRotationImportPayload("{not json")).toThrow(/valid JSON/);
  });

  it("throws on a JSON array", () => {
    expect(() => parseRotationImportPayload(JSON.stringify([1, 2, 3]))).toThrow(/rotation export/);
  });

  it("throws when actions is missing entirely", () => {
    expect(() => parseRotationImportPayload(JSON.stringify({ name: "X" }))).toThrow(/actions/);
  });

  it("throws a specific error when meta.type identifies a different export kind", () => {
    const buildExport = { meta: { version: "1", source: "WutheringTools", type: "characterBuild" }, data: {} };
    expect(() => parseRotationImportPayload(JSON.stringify(buildExport))).toThrow(/different kind/);
  });

  it("throws a specific error for a whole-app export accidentally pasted in", () => {
    const wholeAppExport = {
      meta: { version: "8", source: "WutheringTools" },
      data: { character: "{}", inventory: "{}" },
    };
    expect(() => parseRotationImportPayload(JSON.stringify(wholeAppExport))).toThrow(/different kind/);
  });
});
