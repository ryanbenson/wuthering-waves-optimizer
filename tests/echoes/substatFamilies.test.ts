import { describe, it, expect } from "vitest";
import { subStats } from "../../src/echoes/stats";
import { getSubstatFamily, SUBSTAT_FAMILY } from "../../src/echoes/substatFamilies";

describe("substatFamilies", () => {
  it("classifies every substat in the canonical list", () => {
    subStats.forEach((key) => {
      expect(SUBSTAT_FAMILY[key]).toBeDefined();
    });
  });

  it("groups crit stats", () => {
    expect(getSubstatFamily("CritRate")).toBe("crit");
    expect(getSubstatFamily("CritDMG")).toBe("crit");
  });

  it("groups the four attack-type DMG bonuses", () => {
    expect(getSubstatFamily("BasicAttackDMGBonus")).toBe("dmg");
    expect(getSubstatFamily("HeavyAttackDMGBonus")).toBe("dmg");
    expect(getSubstatFamily("ResonanceSkillDMGBonus")).toBe("dmg");
    expect(getSubstatFamily("ResonanceLiberationDMGBonus")).toBe("dmg");
  });

  it("groups Energy Regen as utility", () => {
    expect(getSubstatFamily("EnergyRegen")).toBe("util");
  });

  it("groups the flat/percent HP, ATK, and DEF stats", () => {
    ["HP", "HP_FLAT", "ATK", "ATK_FLAT", "DEF", "DEF_FLAT"].forEach((key) => {
      expect(getSubstatFamily(key)).toBe("flat");
    });
  });

  it("falls back to flat for unknown or missing stats", () => {
    expect(getSubstatFamily("SomethingUnknown")).toBe("flat");
    expect(getSubstatFamily(null)).toBe("flat");
    expect(getSubstatFamily(undefined)).toBe("flat");
  });
});
