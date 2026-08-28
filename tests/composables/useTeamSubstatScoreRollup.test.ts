import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useTeamSubstatScoreRollup } from "../../src/composables/useTeamSubstatScoreRollup";
import { useCharacterStore } from "../../src/stores/character";
import { useInventoryStore } from "../../src/stores/inventory";

const PERFECT_ROLL_STATS = {
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

describe("useTeamSubstatScoreRollup", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("is null when the character has no equipped echoes", () => {
    const characterStore = useCharacterStore();
    characterStore.setCharacterData("Carlotta", {});
    const { rollup } = useTeamSubstatScoreRollup(() => "Carlotta");
    expect(rollup.value).toBeNull();
  });

  it("is null when characterId is falsy", () => {
    const { rollup } = useTeamSubstatScoreRollup(() => null);
    expect(rollup.value).toBeNull();
  });

  it("averages the Substat Score across equipped echoes and is provisional when fewer than 5 are equipped", () => {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    inventoryStore.echoes = [
      { echoId: "e1", ...PERFECT_ROLL_STATS },
      { echoId: "e2", ...PERFECT_ROLL_STATS },
    ];
    characterStore.setCharacterData("Carlotta", {
      echoes: {
        0: { echoId: "e1" },
        1: { echoId: "e2" },
      },
    });

    const { rollup } = useTeamSubstatScoreRollup(() => "Carlotta");
    // Carlotta's curated weights are CritRate 4, CritDMG 2.5, EnergyRegen 1,
    // ATK 2, ResonanceSkillDMGBonus 1.5, ATK_FLAT 1. These echoes have
    // HP/DEF (weight 0 for her) instead of her other 2 priority stats, so
    // even perfectly rolled they can't reach 100% — scored against her
    // ideal echo (top 5 of weight×tier-count across all 6 weighted stats:
    // 8×(4+2.5+2+1.5+1) [EnergyRegen makes the cut; ATK_FLAT's 4-tier flat
    // stat doesn't] = 88), not just against the substats these particular
    // echoes happen to have.
    expect(rollup.value?.percent).toBeCloseTo(77.27, 1);
    expect(rollup.value?.grade).toBe("SS");
    expect(rollup.value?.provisional).toBe(true); // only 2 of 5 slots equipped
  });

  it("is not provisional once all 5 slots are equipped with fully-revealed echoes", () => {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    const echoIds = ["e1", "e2", "e3", "e4", "e5"];
    inventoryStore.echoes = echoIds.map((id) => ({ echoId: id, ...PERFECT_ROLL_STATS }));
    characterStore.setCharacterData("Carlotta", {
      echoes: Object.fromEntries(echoIds.map((id, i) => [i, { echoId: id }])),
    });

    const { rollup } = useTeamSubstatScoreRollup(() => "Carlotta");
    expect(rollup.value?.provisional).toBe(false);
  });

  it("falls back to the character-embedded echo data when the echo isn't a standalone inventory item", () => {
    // Echoes equipped directly onto a character (e.g. importing straight
    // onto a brand-new character) aren't always also saved as standalone
    // inventory items, so the rollup must not silently skip them just
    // because inventoryStore.getEchoById can't find a match.
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    inventoryStore.echoes = [];
    const echoIds = ["orphan-1", "orphan-2", "orphan-3", "orphan-4", "orphan-5"];
    characterStore.setCharacterData("Carlotta", {
      echoes: Object.fromEntries(echoIds.map((id, i) => [i, { echoId: id, ...PERFECT_ROLL_STATS }])),
    });

    const { rollup } = useTeamSubstatScoreRollup(() => "Carlotta");
    expect(rollup.value).not.toBeNull();
    expect(rollup.value?.provisional).toBe(false);
  });

  it("scores slots that have no echoId at all as long as they carry substat data", () => {
    // Echoes added directly to a character's build without also being
    // saved to standalone inventory (e.g. the importer's "don't add to
    // inventory" branch) end up with echoId explicitly null, but still
    // carry echo/substat data straight on the slot. The echo type field,
    // not echoId, is the canonical "is this slot equipped" signal (see
    // useEchoCardStats.ts's isEchoIncomplete).
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    inventoryStore.echoes = [];
    characterStore.setCharacterData("Carlotta", {
      echoes: Object.fromEntries(
        [0, 1, 2, 3, 4].map((i) => [i, { echoId: null, echo: "AbyssalGladius", ...PERFECT_ROLL_STATS }]),
      ),
    });

    const { rollup } = useTeamSubstatScoreRollup(() => "Carlotta");
    expect(rollup.value).not.toBeNull();
    expect(rollup.value?.provisional).toBe(false);
  });
});
