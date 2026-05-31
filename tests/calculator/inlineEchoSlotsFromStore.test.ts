import { describe, it, expect } from "vitest";
import {
  buildEchoStatsFromCharacterStore,
  echoSlotHasInlineBuildData,
} from "../../src/calculator/rotationPerformer";
import { countResolvedEchoSlots } from "../../src/calculator/performerBuildDebug";
import { computeCharacterBuildFromStore } from "../../src/calculator/computeCharacterBuildFromStore";

const chisaInlineEchoes = {
  "0": {
    type: 4,
    echo: "ReminiscenceThrenodianLeviathan",
    echoSet: "ThreadofSeveredFate",
    stat: "CritDMG",
    echoSubStatsType1: "CritRate",
    echoSubStatsValue1: 6.3,
    echoSubStatsType2: "CritDMG",
    echoSubStatsValue2: 12.6,
    echoSubStatsType3: "ATK",
    echoSubStatsValue3: 6.4,
    echoSubStatsType4: "ATK_FLAT",
    echoSubStatsValue4: 30,
    echoSubStatsType5: "HP",
    echoSubStatsValue5: 6.4,
  },
  "1": {
    type: 3,
    echo: "AbyssalGladius",
    echoSet: "ThreadofSeveredFate",
    stat: "Havoc",
    echoSubStatsType1: "CritRate",
    echoSubStatsValue1: 6.3,
    echoSubStatsType2: "CritDMG",
    echoSubStatsValue2: 12.6,
    echoSubStatsType3: "ATK",
    echoSubStatsValue3: 6.4,
    echoSubStatsType4: "ATK_FLAT",
    echoSubStatsValue4: 30,
    echoSubStatsType5: "HP",
    echoSubStatsValue5: 6.4,
  },
  "2": {
    type: 3,
    echo: "NightmareRoseshroom",
    echoSet: "ThreadofSeveredFate",
    stat: "Havoc",
    echoSubStatsType1: "CritRate",
    echoSubStatsValue1: 6.3,
    echoSubStatsType2: "CritDMG",
    echoSubStatsValue2: 12.6,
    echoSubStatsType3: "ATK",
    echoSubStatsValue3: 6.4,
    echoSubStatsType4: "ATK_FLAT",
    echoSubStatsValue4: 30,
    echoSubStatsType5: "HP",
    echoSubStatsValue5: 6.4,
  },
  "3": {
    type: 1,
    echo: "Excarat",
    echoSet: "SunSinkingEclipse",
    stat: "ATK",
    echoSubStatsType1: "CritDMG",
    echoSubStatsValue1: 12.6,
    echoSubStatsType2: "CritRate",
    echoSubStatsValue2: 6.3,
    echoSubStatsType3: "ATK",
    echoSubStatsValue3: 6.4,
    echoSubStatsType4: "ATK_FLAT",
    echoSubStatsValue4: 30,
    echoSubStatsType5: "HP",
    echoSubStatsValue5: 6.4,
  },
  "4": {
    type: 1,
    echo: "TickTack",
    echoSet: "SunSinkingEclipse",
    stat: "ATK",
    echoSubStatsType1: "CritRate",
    echoSubStatsValue1: 6.3,
    echoSubStatsType2: "CritDMG",
    echoSubStatsValue2: 12.6,
    echoSubStatsType3: "ATK",
    echoSubStatsValue3: 6.4,
    echoSubStatsType4: "ATK_FLAT",
    echoSubStatsValue4: 30,
    echoSubStatsType5: "HP",
    echoSubStatsValue5: 6.4,
  },
};

describe("inline echo slots without inventory or rank", () => {
  const charStore = {
    echoes: chisaInlineEchoes,
    echoSetPassives: {},
    mainEcho: { echo: "ReminiscenceThrenodianLeviathan", isEnabled: true, rank: 5 },
  };

  it("detects inline slots without rank field", () => {
    const slots = Object.values(chisaInlineEchoes);
    expect(slots.every((slot) => echoSlotHasInlineBuildData(slot))).toBe(true);
    const { resolvedEchoSlotCount, inventoryEchoLookups } =
      countResolvedEchoSlots(charStore);
    expect(resolvedEchoSlotCount).toBe(5);
    expect(inventoryEchoLookups).toBe(0);
  });

  it("includes substats and flat ATK from all five inline echoes", () => {
    const echoStats = buildEchoStatsFromCharacterStore("Chisa", charStore);
    expect(echoStats.ATK_FLAT).toBeGreaterThan(100);
    expect(echoStats.ATK).toBeGreaterThan(50);
  });

  it("raises teammate total ATK versus echo-set passives only", async () => {
    const build = await computeCharacterBuildFromStore(
      "Chisa",
      {
        ...charStore,
        weapon: "Kumokiri",
        weapons: { Kumokiri: { weaponLevel: "90", refinement: "1" } },
        weaponPassives: {
          ThreadofFateATK: { isEnabled: true },
          ThreadofFateAllAttribute: { isEnabled: true },
        },
        buffs: {},
        resonanceChains: {},
        characterLevel: "90",
      },
      { Chisa: charStore },
    );
    expect(build.calculated.finalStats.totalAtk).toBeGreaterThan(2100);
  });
});
