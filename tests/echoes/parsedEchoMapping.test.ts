import { describe, it, expect } from "vitest";
import {
  getSubstatType,
  getSubstatValue,
  mapParsedEchoes,
} from "../../src/echoes/parsedEchoMapping";

describe("getSubstatValue", () => {
  it("strips a percent sign", () => {
    expect(getSubstatValue("9.3%")).toBe(9.3);
  });

  it("parses a flat value", () => {
    expect(getSubstatValue("50")).toBe(50);
  });

  it("returns null for missing input", () => {
    expect(getSubstatValue(undefined)).toBeNull();
    expect(getSubstatValue("")).toBeNull();
  });
});

describe("getSubstatType", () => {
  it("maps a percent ATK/DEF/HP row to its percent key", () => {
    expect(getSubstatType({ subStat: "ATK", subStatValue: "7.9%" })).toBe("ATK");
    expect(getSubstatType({ subStat: "HP", subStatValue: "8.6%" })).toBe("HP");
  });

  it("maps a flat ATK/DEF/HP row to its _FLAT key", () => {
    expect(getSubstatType({ subStat: "ATK", subStatValue: "50" })).toBe("ATK_FLAT");
    expect(getSubstatType({ subStat: "HP", subStatValue: "580" })).toBe("HP_FLAT");
  });

  it("maps the DEF Y OCR quirk to DEF", () => {
    expect(getSubstatType({ subStat: "DEF Y", subStatValue: "9.0%" })).toBe("DEF");
  });

  it("maps a non-ambiguous label via verboseStatLabelMap", () => {
    expect(getSubstatType({ subStat: "Crit. Rate", subStatValue: "6.9%" })).toBe("CritRate");
    expect(getSubstatType({ subStat: "Energy Regen", subStatValue: "8.4%" })).toBe("EnergyRegen");
  });

  it("returns null for an unrecognized label or missing value", () => {
    expect(getSubstatType({ subStat: "Not A Stat", subStatValue: "1%" })).toBeNull();
    expect(getSubstatType({ subStat: "ATK", subStatValue: undefined })).toBeNull();
    expect(getSubstatType(undefined)).toBeNull();
  });
});

describe("mapParsedEchoes", () => {
  it("maps a full parsed echo to the inventory EchoObject shape", () => {
    const [mapped] = mapParsedEchoes(
      [
        {
          echo: "ThousandPuppetPavilion",
          set: "LingeringTunes",
          cost: 4,
          mainStatLabel: "Healing Bonus",
          substats: [
            { subStat: "DEF", subStatValue: "40" },
            { subStat: "HP", subStatValue: "8.6%" },
            { subStat: "Crit. DMG", subStatValue: "16.2%" },
            { subStat: "Energy Regen", subStatValue: "11.6%" },
            { subStat: "Resonance Skill DMG Bonus", subStatValue: "10.9%" },
          ],
        },
      ],
      false,
    );

    expect(mapped.echo).toBe("ThousandPuppetPavilion");
    expect(mapped.type).toBe(4);
    expect(mapped.rank).toBe(5); // defaults to 5 — the app doesn't track echo rarity today
    expect(mapped.stat).toBe("HealingBonus");
    expect(mapped.echoSubStatsType1).toBe("DEF_FLAT");
    expect(mapped.echoSubStatsValue1).toBe(40);
    expect(mapped.echoSubStatsType2).toBe("HP");
    expect(mapped.echoSubStatsValue2).toBe(8.6);
    expect(mapped.echoSubStatsType5).toBe("ResonanceSkillDMGBonus");
    expect(mapped.echoSubStatsValue5).toBe(10.9);
  });

  it("leaves unpopulated substat slots null, rather than inventing them", () => {
    const [mapped] = mapParsedEchoes(
      [
        {
          echo: "Test",
          set: null,
          cost: 3,
          mainStatLabel: "Electro DMG Bonus",
          substats: [
            { subStat: "HP", subStatValue: "470" },
            { subStat: "ATK", subStatValue: "40" },
            { subStat: "ATK", subStatValue: "9.4%" },
          ],
        },
      ],
      false,
    );

    expect(mapped.echoSubStatsType1).toBe("HP_FLAT");
    expect(mapped.echoSubStatsType2).toBe("ATK_FLAT");
    expect(mapped.echoSubStatsType3).toBe("ATK");
    expect(mapped.echoSubStatsType4).toBeNull();
    expect(mapped.echoSubStatsValue4).toBeNull();
    expect(mapped.echoSubStatsType5).toBeNull();
    expect(mapped.echoSubStatsValue5).toBeNull();
  });

  it("only assigns an echoId when saving to inventory", () => {
    const base = {
      echo: "Test",
      set: null,
      cost: 1,
      mainStatLabel: "ATK",
      substats: [],
    };
    const [notSaved] = mapParsedEchoes([base], false);
    const [saved] = mapParsedEchoes([base], true);
    expect(notSaved.echoId).toBeNull();
    expect(saved.echoId).toEqual(expect.any(String));
  });
});
