import { describe, it, expect } from "vitest";
import { getEchoStats, flatBonusesByRankByType, statsTable } from "../../src/echoes/stats";

describe("getEchoStats", () => {
  it("applies the main stat and guaranteed flat bonus when rank is explicitly set", () => {
    const echo = { type: 3, rank: 5, stat: "Glacio" };
    const stats = getEchoStats(echo as any);

    expect(stats.ATK_FLAT).toBe(flatBonusesByRankByType[3][5]);
    expect(stats.Glacio).toBe(statsTable[3].Glacio[5]);
  });

  it("defaults a missing rank to 5 (max), matching CalculatorEcho.vue's live behavior", () => {
    // Echoes with full embedded stats but no `rank` field occur when data is
    // pasted/OCR'd directly onto a character record rather than equipped via
    // the Inventory page. The live Calculator page's per-echo `rank`
    // computed getter defaults a missing rank to 5 — this must match, or the
    // main stat and flat bonus silently drop to zero.
    const echoWithRank = { type: 3, rank: 5, stat: "Glacio" };
    const echoWithoutRank = { type: 3, stat: "Glacio" };

    expect(getEchoStats(echoWithoutRank as any)).toEqual(getEchoStats(echoWithRank as any));
  });

  it("does not fabricate stats for an empty/unequipped slot", () => {
    const emptySlot = { type: null };
    expect(getEchoStats(emptySlot as any)).toEqual({});
  });

  it("still sums substats even when rank/main-stat data is entirely absent", () => {
    const echo = { type: null, echoSubStatsType1: "ATK", echoSubStatsValue1: 8.6 };
    expect(getEchoStats(echo as any)).toEqual({ ATK: 8.6 });
  });
});
