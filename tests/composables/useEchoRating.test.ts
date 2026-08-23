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
      // perfect CritRate/CritDMG/ATK roll, Camellya weights those highly ->
      // near-max score even though HP/DEF (weight 1, neutral default) are
      // also perfect rolls
      expect(substatScore.value?.percent).toBe(100);
      expect(substatScore.value?.grade).toBe("SSS");
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
      expect(substatScore.value?.percent).toBe(100);
    });
  });
});
