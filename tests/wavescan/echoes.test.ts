import { describe, it, expect } from "vitest";
import fixture from "../../fixtures/wavescan.json";
import { parseWavescanFile } from "../../src/wavescan/format";
import {
  mapWavescanEchoes,
  planWavescanEchoImport,
  type WavescanInventoryEcho,
} from "../../src/wavescan/echoes";

const validRow = {
  scanId: "scan-1",
  echo: "ReminiscenceSuhsintheInevitable",
  echoSet: "HeartofSwornVigil",
  cost: 4,
  rank: 5,
  level: 25,
  stat: "CritDMG",
  substats: [
    { type: "CritRate", value: 7.5 },
    { type: "ATK_FLAT", value: 50 },
  ],
  equippedBy: null,
};

describe("parseWavescanFile", () => {
  it("accepts the sample export", () => {
    const result = parseWavescanFile(JSON.stringify(fixture));
    expect(result.ok).toBe(true);
  });

  it("rejects invalid JSON, other formats, and newer versions", () => {
    expect(parseWavescanFile("{nope").ok).toBe(false);
    expect(parseWavescanFile(JSON.stringify({ format: "Other", version: 1 })).ok).toBe(false);
    const newer = parseWavescanFile(
      JSON.stringify({ format: "WutheringToolsScan", version: 2, echoes: [] }),
    );
    expect(newer).toMatchObject({ ok: false, error: expect.stringContaining("version 2") });
  });

  it("rejects a non-array echo list", () => {
    const result = parseWavescanFile(
      JSON.stringify({ format: "WutheringToolsScan", version: 1, echoes: {} }),
    );
    expect(result.ok).toBe(false);
  });
});

describe("mapWavescanEchoes", () => {
  it("maps every echo in the sample export", () => {
    const { echoes, skipped } = mapWavescanEchoes(fixture.echoes);
    expect(skipped).toEqual([]);
    expect(echoes).toHaveLength(fixture.echoes.length);
  });

  it("maps a row to the inventory echo shape, padding empty substat slots", () => {
    const { echoes } = mapWavescanEchoes([validRow]);
    expect(echoes[0]).toMatchObject({
      echo: "ReminiscenceSuhsintheInevitable",
      echoSet: "HeartofSwornVigil",
      type: 4,
      rank: 5,
      stat: "CritDMG",
      echoSubStatsType1: "CritRate",
      echoSubStatsValue1: 7.5,
      echoSubStatsType2: "ATK_FLAT",
      echoSubStatsValue2: 50,
      echoSubStatsType3: null,
      echoSubStatsValue3: null,
      echoSubStatsType5: null,
      echoSubStatsValue5: null,
    });
    expect(typeof echoes[0].echoId).toBe("string");
  });

  it("never reuses a taken echo id", () => {
    const { echoes } = mapWavescanEchoes([validRow, validRow, validRow], ["a", "b"]);
    const ids = echoes.map((echo) => echo.echoId);
    expect(new Set(ids).size).toBe(3);
    expect(ids).not.toContain("a");
  });

  it.each([
    ["unknown echo", { echo: "NotAnEcho" }, "Unknown echo"],
    ["unknown set", { echoSet: "NotASet" }, "Unknown echo set"],
    ["set the echo can't roll", { echoSet: "FreezingFrost" }, "can't roll"],
    ["wrong cost", { cost: 3 }, "doesn't match"],
    ["main stat not valid for cost", { stat: "Fusion" }, "isn't a valid main stat"],
    ["unsupported rarity", { rank: 1 }, "Rarity 1"],
    ["unknown substat", { substats: [{ type: "Luck", value: 1 }] }, "Unknown substat"],
    [
      "duplicate substat",
      { substats: [{ type: "CritRate", value: 7.5 }, { type: "CritRate", value: 8.1 }] },
      "appears twice",
    ],
    ["out-of-range 5-star roll", { substats: [{ type: "CritRate", value: 75 }] }, "outside its roll range"],
    ["non-numeric value", { substats: [{ type: "CritRate", value: "7.5" }] }, "invalid value"],
  ])("skips a row with %s", (_label, override, reason) => {
    const { echoes, skipped } = mapWavescanEchoes([{ ...validRow, ...override }]);
    expect(echoes).toEqual([]);
    expect(skipped).toHaveLength(1);
    expect(skipped[0]).toMatchObject({ position: 1, scanId: "scan-1" });
    expect(skipped[0].reason).toContain(reason);
  });

  it("skips non-object rows without throwing", () => {
    const { skipped } = mapWavescanEchoes([null, "echo"]);
    expect(skipped.map((s) => s.position)).toEqual([1, 2]);
  });
});

describe("planWavescanEchoImport", () => {
  const [scanned] = mapWavescanEchoes([validRow]).echoes;
  const owned = (echoId: string, extra: object = {}) => ({
    ...scanned,
    echoId,
    // Older inventory rows can store cost as a string; identity still matches.
    type: "4",
    ...extra,
  });
  const other: WavescanInventoryEcho = {
    ...scanned,
    echoId: "other",
    stat: "CritRate",
  };

  it("append keeps the inventory and skips echoes already owned", () => {
    const plan = planWavescanEchoImport([scanned, other], [owned("x")], "append");
    expect(plan.toRemoveIds).toEqual([]);
    expect(plan.toAdd).toEqual([other]);
    expect(plan.alreadyOwnedCount).toBe(1);
  });

  it("counts identical copies instead of collapsing them", () => {
    const copy = { ...scanned, echoId: "copy" };
    const plan = planWavescanEchoImport([scanned, copy], [owned("x")], "append");
    expect(plan.toAdd).toEqual([copy]);
  });

  it("replace removes unlocked echoes and keeps locked ones", () => {
    const inventory = [owned("locked", { locked: true }), owned("unlocked"), { ...other, echoId: "u2" }];
    const plan = planWavescanEchoImport([scanned, other], inventory, "replace");
    expect(plan.toRemoveIds).toEqual(["unlocked", "u2"]);
    expect(plan.keptLockedCount).toBe(1);
    // The scanned copy of the locked echo isn't added a second time.
    expect(plan.toAdd).toEqual([other]);
    expect(plan.alreadyOwnedCount).toBe(1);
  });
});
