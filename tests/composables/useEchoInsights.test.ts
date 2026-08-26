import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useEchoInsights } from "../../src/composables/useEchoInsights";
import { useCharacterStore } from "../../src/stores/character";
import { useInventoryStore } from "../../src/stores/inventory";

// Carlotta's curated weights: CritRate 4, CritDMG 2.5, ATK 2,
// ResonanceSkillDMGBonus 1.5, ATK_FLAT 1 (see useTeamSubstatScoreRollup.test.ts).
const CARLOTTA_ECHO = {
  echoSubStatsType1: "CritRate",
  echoSubStatsValue1: 10.5,
  echoSubStatsType2: "CritDMG",
  echoSubStatsValue2: 21,
  echoSubStatsType3: "ATK",
  echoSubStatsValue3: 11.6,
  echoSubStatsType4: "HP",
  echoSubStatsValue4: 11.6,
  echoSubStatsType5: "DEF",
  echoSubStatsValue5: 14.7,
};

describe("useEchoInsights", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("is empty when characterId is falsy", () => {
    const { insights } = useEchoInsights(() => null);
    expect(insights.value).toEqual({
      equippedCount: 0,
      totalCV: 0,
      isCurated: false,
      priorityRows: [],
      otherRows: [],
      relevantRollPercent: null,
    });
  });

  it("is empty when the character has no equipped echoes", () => {
    const characterStore = useCharacterStore();
    characterStore.setCharacterData("Carlotta", {});
    const { insights } = useEchoInsights(() => "Carlotta");
    expect(insights.value.equippedCount).toBe(0);
    expect(insights.value.totalCV).toBe(0);
  });

  it("sums CV and per-substat roll counts/values across multiple equipped echoes", () => {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    inventoryStore.echoes = [
      { echoId: "e1", ...CARLOTTA_ECHO },
      { echoId: "e2", ...CARLOTTA_ECHO },
    ];
    characterStore.setCharacterData("Carlotta", {
      echoes: { 0: { echoId: "e1" }, 1: { echoId: "e2" } },
    });

    const { insights } = useEchoInsights(() => "Carlotta");
    expect(insights.value.equippedCount).toBe(2);
    // CV per echo = 10.5*2 + 21 = 42, x2 echoes = 84
    expect(insights.value.totalCV).toBeCloseTo(84, 5);

    const critRateRow = insights.value.priorityRows.find((r) => r.type === "CritRate");
    expect(critRateRow?.count).toBe(2);
    expect(critRateRow?.total).toBeCloseTo(21, 5);
  });

  it("orders priorityRows by weight descending for a curated character", () => {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    inventoryStore.echoes = [{ echoId: "e1", ...CARLOTTA_ECHO }];
    characterStore.setCharacterData("Carlotta", { echoes: { 0: { echoId: "e1" } } });

    const { insights } = useEchoInsights(() => "Carlotta");
    expect(insights.value.isCurated).toBe(true);
    const weights = insights.value.priorityRows.map((r) => r.weight);
    expect(weights).toEqual([...weights].sort((a, b) => b - a));
    // CritRate (4) should lead ahead of ATK (2)
    expect(insights.value.priorityRows[0].type).toBe("CritRate");
  });

  it("flags a zero-roll priority substat as missing", () => {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    // No ResonanceSkillDMGBonus rolled anywhere, but it's one of Carlotta's
    // curated priority stats (weight 1.5) — should still show up, flagged.
    inventoryStore.echoes = [{ echoId: "e1", ...CARLOTTA_ECHO }];
    characterStore.setCharacterData("Carlotta", { echoes: { 0: { echoId: "e1" } } });

    const { insights } = useEchoInsights(() => "Carlotta");
    const missingRow = insights.value.priorityRows.find((r) => r.type === "ResonanceSkillDMGBonus");
    expect(missingRow).toBeDefined();
    expect(missingRow?.count).toBe(0);
    expect(missingRow?.missing).toBe(true);
  });

  it("puts HP/DEF (weight 0 for Carlotta) into otherRows, not priorityRows", () => {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    inventoryStore.echoes = [{ echoId: "e1", ...CARLOTTA_ECHO }];
    characterStore.setCharacterData("Carlotta", { echoes: { 0: { echoId: "e1" } } });

    const { insights } = useEchoInsights(() => "Carlotta");
    expect(insights.value.priorityRows.some((r) => r.type === "HP")).toBe(false);
    const hpRow = insights.value.otherRows.find((r) => r.type === "HP");
    expect(hpRow).toBeDefined();
    expect(hpRow?.missing).toBe(false);
  });

  it("skips priority grouping/flagging entirely for an uncurated character", () => {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    inventoryStore.echoes = [{ echoId: "e1", ...CARLOTTA_ECHO }];
    characterStore.setCharacterData("NotARealCharacter", { echoes: { 0: { echoId: "e1" } } });

    const { insights } = useEchoInsights(() => "NotARealCharacter");
    expect(insights.value.isCurated).toBe(false);
    expect(insights.value.priorityRows).toEqual([]);
    // All 5 rolled substats land in otherRows instead, sorted by total desc.
    expect(insights.value.otherRows).toHaveLength(5);
    expect(insights.value.otherRows.every((r) => !r.missing)).toBe(true);
  });

  it("computes relevantRollPercent as the share of rolls that are priority stats", () => {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    // CritRate/CritDMG/ATK are priority for Carlotta; HP/DEF aren't — 3 of 5.
    inventoryStore.echoes = [{ echoId: "e1", ...CARLOTTA_ECHO }];
    characterStore.setCharacterData("Carlotta", { echoes: { 0: { echoId: "e1" } } });

    const { insights } = useEchoInsights(() => "Carlotta");
    expect(insights.value.relevantRollPercent).toBe(60);
  });

  it("relevantRollPercent is null with nothing rolled yet, or for an uncurated character", () => {
    const characterStore = useCharacterStore();
    characterStore.setCharacterData("Carlotta", {});
    const { insights: emptyInsights } = useEchoInsights(() => "Carlotta");
    expect(emptyInsights.value.relevantRollPercent).toBeNull();

    const inventoryStore = useInventoryStore();
    inventoryStore.echoes = [{ echoId: "e1", ...CARLOTTA_ECHO }];
    characterStore.setCharacterData("NotARealCharacter", { echoes: { 0: { echoId: "e1" } } });
    const { insights: uncuratedInsights } = useEchoInsights(() => "NotARealCharacter");
    expect(uncuratedInsights.value.relevantRollPercent).toBeNull();
  });

  it("falls back to character-embedded echo data when there's no standalone inventory item", () => {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    inventoryStore.echoes = [];
    characterStore.setCharacterData("Carlotta", {
      echoes: { 0: { echoId: null, echo: "AbyssalGladius", ...CARLOTTA_ECHO } },
    });

    const { insights } = useEchoInsights(() => "Carlotta");
    expect(insights.value.equippedCount).toBe(1);
    expect(insights.value.totalCV).toBeCloseTo(42, 5);
  });
});
