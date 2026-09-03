import { describe, it, expect } from "vitest";
import { getImportData, isJsonString } from "../../src/utils/settingsBackup";
import { CURRENT_DATA_VERSION } from "../../src/migrations";

describe("settingsBackup — getImportData", () => {
  it("treats a version-1 payload (no meta wrapper) as the raw character data", () => {
    const raw = JSON.stringify({ characters: {}, activeCharacter: "" });
    const result = getImportData(raw, true);

    expect(result.dataVersion).toBe(1);
    expect(result.character).toEqual({ characters: {}, activeCharacter: "" });
    expect(result.inventory).toEqual({ echoes: [], equipped: {} });
    expect(result.teamRotations).toBeUndefined();
  });

  it("unwraps a nested v2+ payload and reads its version", () => {
    const raw = JSON.stringify({
      meta: { version: "2", source: "WutheringTools" },
      data: { character: "char-json", inventory: "inv-json" },
    });
    const result = getImportData(raw, true);

    expect(result.dataVersion).toBe(2);
    expect(result.character).toBe("char-json");
    expect(result.inventory).toBe("inv-json");
    expect(result.teamRotations).toBeUndefined();
  });

  it("reads teamRotations from a v5+ payload", () => {
    const raw = JSON.stringify({
      meta: { version: String(CURRENT_DATA_VERSION), source: "WutheringTools" },
      data: { character: "c", inventory: "i", teamRotations: "t" },
    });
    const result = getImportData(raw, true);

    expect(result.dataVersion).toBe(CURRENT_DATA_VERSION);
    expect(result.teamRotations).toBe("t");
  });
});

describe("settingsBackup — isJsonString", () => {
  it("returns true for valid JSON", () => {
    expect(isJsonString('{"a":1}')).toBe(true);
  });

  it("returns false for invalid JSON", () => {
    expect(isJsonString("not json")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isJsonString(null)).toBe(false);
  });
});
