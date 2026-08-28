import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useEchoRating, type EchoRatingProps } from "../../src/composables/useEchoRating";
import { useSettingsStore } from "../../src/stores/settings";
import { useCharacterStore } from "../../src/stores/character";

function makeProps(overrides: Partial<EchoRatingProps> = {}): EchoRatingProps {
  return {
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
    ...overrides,
  };
}

describe("useEchoRating", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("grades a perfect echo as SSS using the global default weights", () => {
    const { echoRating } = useEchoRating(makeProps());
    expect(echoRating.value.grade).toBe("SSS");
    expect(echoRating.value.provisional).toBe(false);
  });

  it("reflects a customized global weight profile", () => {
    const settingsStore = useSettingsStore();
    settingsStore.setEchoRatingWeights({ CritRate: 0, CritDMG: 0, ATK: 0, HP: 0, DEF: 0 });
    const { echoRating } = useEchoRating(makeProps());
    // all weights zeroed -> maxPossible === minPossible -> floor grade
    expect(echoRating.value.grade).toBe("E");
  });

  it("returns provisional true for a partially-revealed echo", () => {
    const { echoRating } = useEchoRating(
      makeProps({ echoSubStatsType5: "none", echoSubStatsValue5: 0 }),
    );
    expect(echoRating.value.provisional).toBe(true);
  });

  it("returns a badge class array for the echo rating", () => {
    const { echoRatingBadgeClass } = useEchoRating(makeProps());
    expect(Array.isArray(echoRatingBadgeClass.value)).toBe(true);
    expect(echoRatingBadgeClass.value.length).toBeGreaterThan(0);
  });

  describe("substatScore", () => {
    it("is null when no characterId is provided", () => {
      const { substatScore, substatScoreBadgeClass } = useEchoRating(makeProps());
      expect(substatScore.value).toBeNull();
      expect(substatScoreBadgeClass.value).toBeNull();
    });

    it("scores against the curated character weight profile when one exists", () => {
      const characterStore = useCharacterStore();
      characterStore.setCharacterData("Camellya", {});
      const { substatScore } = useEchoRating(makeProps({ characterId: "Camellya" }));
      // Camellya's curated weights are CritRate 3, CritDMG 4, EnergyRegen 1,
      // ATK 2, BasicAttackDMGBonus 1, ATK_FLAT 1. This echo only has 3 of
      // her weighted stats (CritRate/CritDMG/ATK, perfectly rolled) — HP/DEF
      // (weight 0 for her) fill the other 2 slots instead of two of her
      // other priority stats, so it can't reach 100%: it's scored against
      // her ideal 5-substat echo (top 5 of weight×tier-count across all 6
      // weighted stats: 8×(3+4+2+1+1) [EnergyRegen and BasicAttackDMGBonus
      // both make the cut; ATK_FLAT's 4-tier flat stat doesn't] = 88), not
      // just against the substats it happens to have.
      expect(substatScore.value?.percent).toBeCloseTo(81.82, 1);
      expect(substatScore.value?.grade).toBe("SS");
    });

    it("penalizes an echo missing the character's single highest-priority substat entirely", () => {
      // Regression test for a real reported bug: the old formula's
      // denominator only summed the weight of substats *present on this
      // echo*, so a missing top-priority stat was excluded from both sides
      // of the ratio instead of correctly dragging the score down — see
      // docs/adr/0012 for the full investigation (including why this
      // deliberately diverges from a reference site's ~32.1% for the same
      // echo: that reference scores flat substats — ATK_FLAT here — as a
      // constant "3" regardless of actual roll granularity, including for
      // HP_FLAT which has the same 8-tier range as any %-stat; this
      // implementation uses each substat's own real tier count instead).
      const characterStore = useCharacterStore();
      characterStore.setCharacterData("Aemeath", {});
      const { substatScore } = useEchoRating(
        makeProps({
          characterId: "Aemeath",
          echoSubStatsType1: "CritDMG",
          echoSubStatsValue1: 15,
          echoSubStatsType2: "ATK",
          echoSubStatsValue2: 8.6,
          echoSubStatsType3: "EnergyRegen",
          echoSubStatsValue3: 10,
          echoSubStatsType4: "ResonanceLiberationDMGBonus",
          echoSubStatsValue4: 10.9,
          echoSubStatsType5: "ResonanceSkillDMGBonus",
          echoSubStatsValue5: 11.6,
        }),
      );
      // no Crit Rate substat at all, despite it being tied for Aemeath's
      // single highest-weighted stat
      expect(substatScore.value?.percent).toBeCloseTo(35.5, 1);
      expect(substatScore.value?.grade).toBe("C");
    });

    it("reflects a per-character weight override", () => {
      const characterStore = useCharacterStore();
      characterStore.setCharacterData("Camellya", {});
      characterStore.setCharacterSubstatWeights("Camellya", {
        CritRate: 0,
        CritDMG: 0,
        ATK: 0,
        HP: 0,
        DEF: 0,
      });
      const { substatScore } = useEchoRating(makeProps({ characterId: "Camellya" }));
      expect(substatScore.value?.percent).toBe(0);
    });

    it("falls back to the neutral default for an uncurated character", () => {
      const characterStore = useCharacterStore();
      characterStore.setCharacterData("SomeUncuratedCharacter", {});
      const { substatScore } = useEchoRating(
        makeProps({ characterId: "SomeUncuratedCharacter" }),
      );
      // Under the neutral (all-1) profile, the ideal-echo ceiling picks the
      // 5 highest weight×tierCount stats — 5 of the eleven 8-tier stats
      // (HP_FLAT included; only ATK_FLAT/DEF_FLAT are capped at tier 4) —
      // giving 8×5=40, exactly matching a perfect 5-substat echo.
      expect(substatScore.value?.percent).toBe(100);
    });
  });
});
