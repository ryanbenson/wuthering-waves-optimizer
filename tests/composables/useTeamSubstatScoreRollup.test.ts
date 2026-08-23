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
    expect(rollup.value?.percent).toBe(100);
    expect(rollup.value?.grade).toBe("SSS");
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
});
