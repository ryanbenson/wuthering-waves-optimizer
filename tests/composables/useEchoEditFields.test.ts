import { describe, it, expect, beforeEach } from "vitest";
import { nextTick } from "vue";
import { createPinia, setActivePinia } from "pinia";
import { useEchoEditFields, type EchoEditTarget } from "../../src/composables/useEchoEditFields";
import { useCharacterStore } from "../../src/stores/character";
import { useInventoryStore } from "../../src/stores/inventory";

describe("useEchoEditFields", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("build context — inline character data (no inventory echo)", () => {
    it("reads and writes through characterStore.setCharacterData", () => {
      const characterStore = useCharacterStore() as any;
      characterStore.setCharacterData("TestChar", {
        echoes: {
          0: {
            echoId: null,
            type: 4,
            rank: "5",
            stat: "CritRate",
            echoSubStatsType1: "ATK",
            echoSubStatsValue1: 100,
          },
        },
      });

      const target: EchoEditTarget = { context: "build", character: "TestChar", index: 0 };
      const fields = useEchoEditFields(() => target);

      expect(fields.stat.value).toBe("CritRate");
      expect(fields.slots[0].type.value).toBe("ATK");
      expect(fields.slots[0].value.value).toBe(100);

      fields.slots[0].value.value = 200;
      expect(characterStore.characters.TestChar.echoes[0].echoSubStatsValue1).toBe(200);
    });
  });

  describe("build context — a real inventory echo equipped to the slot", () => {
    it("reads and writes through inventoryStore.patchEcho, not setCharacterData", () => {
      const characterStore = useCharacterStore() as any;
      const inventoryStore = useInventoryStore() as any;
      inventoryStore.saveEcho({
        echoId: "e1",
        echo: "SomeEcho",
        type: 4,
        rank: 5,
        stat: "CritDMG",
        echoSubStatsType1: "HP",
        echoSubStatsValue1: 50,
      });
      characterStore.setCharacterData("TestChar", { echoes: { 1: { echoId: "e1" } } });

      const target: EchoEditTarget = { context: "build", character: "TestChar", index: 1 };
      const fields = useEchoEditFields(() => target);

      expect(fields.stat.value).toBe("CritDMG");
      expect(fields.slots[0].value.value).toBe(50);

      fields.slots[0].value.value = 999;
      expect(inventoryStore.getEchoById("e1").echoSubStatsValue1).toBe(999);
      // the character's own slot data is untouched — the write went to the
      // inventory item, not inline character data
      expect(characterStore.characters.TestChar.echoes[1].echoSubStatsValue1).toBeUndefined();
    });
  });

  describe("inventory context", () => {
    it("always writes through inventoryStore.patchEcho", () => {
      const inventoryStore = useInventoryStore() as any;
      inventoryStore.saveEcho({ echoId: "e2", echo: "AnotherEcho", type: 3, rank: 4, stat: "EnergyRegen" });

      const target: EchoEditTarget = { context: "inventory", echoId: "e2" };
      const fields = useEchoEditFields(() => target);

      expect(fields.rank.value).toBe(4);
      fields.rank.value = 2;
      expect(inventoryStore.getEchoById("e2").rank).toBe(2);
    });
  });

  describe("slot assignment", () => {
    it("assigns a slot directly by index, leaving the others untouched", () => {
      const characterStore = useCharacterStore() as any;
      characterStore.setCharacterData("TestChar", {
        echoes: {
          0: {
            echoSubStatsType1: "CritRate",
            echoSubStatsValue1: 8.7,
            echoSubStatsType2: "CritDMG",
            echoSubStatsValue2: 17.4,
          },
        },
      });
      const fields = useEchoEditFields(() => ({ context: "build", character: "TestChar", index: 0 }));

      fields.slots[2].type.value = "DEF";
      fields.slots[2].value.value = 10.9;

      expect(fields.slots[0].type.value).toBe("CritRate");
      expect(fields.slots[0].value.value).toBe(8.7);
      expect(fields.slots[1].type.value).toBe("CritDMG");
      expect(fields.slots[1].value.value).toBe(17.4);
      expect(fields.slots[2].type.value).toBe("DEF");
      expect(fields.slots[2].value.value).toBe(10.9);
      expect(fields.slots[3].type.value).toBe("none");
      expect(fields.slots[4].type.value).toBe("none");
    });
  });

  describe("stats", () => {
    it("sums the free stat, main stat, and substats", () => {
      // `echo` must be set alongside `type`/`stat` — the composable's own
      // data-integrity watcher (ported from CalculatorEcho.vue's
      // updateEchoChoice) resyncs `type` to the echo's real cost tier on
      // mount, so a fixture with `type` but no matching `echo` gets its
      // `type` reset to null (no echo selected -> no cost).
      const characterStore = useCharacterStore() as any;
      characterStore.setCharacterData("TestChar", {
        echoes: {
          0: {
            echo: "BellBorneGeochelone", // Calamity -> cost 4
            type: 4,
            rank: "5",
            stat: "CritRate",
            echoSubStatsType1: "ATK",
            echoSubStatsValue1: 100,
            echoSubStatsType2: "HP",
            echoSubStatsValue2: 200,
          },
        },
      });
      const fields = useEchoEditFields(() => ({ context: "build", character: "TestChar", index: 0 }));

      expect(fields.stats.value.ATK_FLAT).toBe(150); // flatBonusesByRankByType[4][5]
      expect(fields.stats.value.CritRate).toBe(22); // statsTable[4].CritRate[5]
      expect(fields.stats.value.ATK).toBe(100);
      expect(fields.stats.value.HP).toBe(200);
    });

    it("resets the main stat to none when the echo's cost tier changes", async () => {
      const characterStore = useCharacterStore() as any;
      characterStore.setCharacterData("TestChar", {
        echoes: { 0: { echo: "AbyssalGladius", type: 3, stat: "EnergyRegen" } }, // Elite -> cost 3
      });
      const fields = useEchoEditFields(() => ({ context: "build", character: "TestChar", index: 0 }));
      expect(fields.stat.value).toBe("EnergyRegen");

      // the reset happens inside a watcher, which Vue flushes asynchronously
      fields.echo.value = "BellBorneGeochelone"; // Calamity -> cost 4
      await nextTick();
      expect(fields.stat.value).toBe("none");
    });
  });

  describe("mainStatOptions", () => {
    it("is constrained to the echo's cost tier", () => {
      const characterStore = useCharacterStore() as any;
      characterStore.setCharacterData("TestChar", {
        echoes: { 0: { echo: "AeroDrake", type: 1 } }, // Common -> cost 1
      });
      const fields = useEchoEditFields(() => ({ context: "build", character: "TestChar", index: 0 }));
      const values = fields.mainStatOptions.value.map((o) => o.value);
      expect(values).toContain("ATK");
      expect(values).not.toContain("CritRate");
    });
  });
});
