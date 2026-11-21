import { describe, expect, it } from "vitest";
import {
  summarizeEcho,
  summarizeSetBonuses,
} from "../../src/components/teamOptimizer/echoSummary";

describe("summarizeEcho (#737)", () => {
  it("names the echo, its cost, set and main stat, and lists substats with units", () => {
    const summary = summarizeEcho({
      echo: "Hecate",
      type: 4,
      echoSet: "MoonlitClouds",
      stat: "CritDMG",
      echoSubStatsType1: "ATK_FLAT",
      echoSubStatsValue1: 50,
      echoSubStatsType2: "CritRate",
      echoSubStatsValue2: 8.1,
      echoSubStatsType3: "none",
      echoSubStatsValue3: 0,
    });
    expect(summary.name).toBe("Hecate");
    expect(summary.meta).toMatch(/^4-cost · Moonlit Clouds · /);
    expect(summary.substats).toContain(" 50");
    expect(summary.substats).not.toContain("50%");
    expect(summary.substats).toContain("8.1%");
    expect(summary.substats.split(" · ")).toHaveLength(2);
  });

  it("copes with a missing or empty echo", () => {
    expect(summarizeEcho(null)).toEqual({
      name: "Unknown echo",
      meta: "",
      substats: "",
    });
  });
});

describe("summarizeSetBonuses", () => {
  it("lists the set bonuses a loadout activates, largest first", () => {
    const echo = (echoSet: string) => ({ echoSet });
    const five = summarizeSetBonuses(
      Array.from({ length: 5 }, () => echo("TrailblazingStar")),
    );
    expect(five[0].label).toBe("Trailblazing Star 5 Set");
    expect(five[0].setKey).toBe("TrailblazingStar");
    const mixed = summarizeSetBonuses([
      echo("ReelofSplicedMemories"),
      echo("ReelofSplicedMemories"),
      echo("ChromaticFoam"),
    ]);
    expect(mixed.map((set) => set.setKey)).toEqual(["ReelofSplicedMemories"]);
    expect(summarizeSetBonuses([])).toEqual([]);
    expect(summarizeSetBonuses(null)).toEqual([]);
  });
});
