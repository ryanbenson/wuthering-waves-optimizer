import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useEchoInventory } from "../../src/composables/useEchoInventory";
import { useInventoryStore } from "../../src/stores/inventory";
import { useCharacterStore } from "../../src/stores/character";

describe("useEchoInventory", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("locked / trash / temp mutual exclusivity", () => {
    it("locking an echo clears trash and temp", () => {
      const inventoryStore = useInventoryStore();
      inventoryStore.saveEcho({ echoId: "e1", trash: true });
      const { setEchoLocked, getEchoFlags } = useEchoInventory();

      setEchoLocked("e1", true);

      expect(getEchoFlags("e1")).toMatchObject({
        locked: true,
        trash: false,
        temp: false,
      });
    });

    it("marking trash clears locked and temp", () => {
      const inventoryStore = useInventoryStore();
      inventoryStore.saveEcho({ echoId: "e1", locked: true });
      const { setEchoTrash, getEchoFlags } = useEchoInventory();

      setEchoTrash("e1", true);

      expect(getEchoFlags("e1")).toMatchObject({
        locked: false,
        trash: true,
        temp: false,
      });
    });

    it("marking temp clears locked and trash", () => {
      const inventoryStore = useInventoryStore();
      inventoryStore.saveEcho({ echoId: "e1", locked: true });
      const { setEchoTemp, getEchoFlags } = useEchoInventory();

      setEchoTemp("e1", true);

      expect(getEchoFlags("e1")).toMatchObject({
        locked: false,
        trash: false,
        temp: true,
      });
    });

    it("unsetting one of the three doesn't touch the others", () => {
      const inventoryStore = useInventoryStore();
      inventoryStore.saveEcho({ echoId: "e1", locked: false, favorite: true });
      const { setEchoLocked, getEchoFlags } = useEchoInventory();

      setEchoLocked("e1", false);

      expect(getEchoFlags("e1")).toMatchObject({
        locked: false,
        favorite: true,
      });
    });

    it("ignoreFromOptimizer (hidden) is independent of locked/trash/temp", () => {
      const inventoryStore = useInventoryStore();
      inventoryStore.saveEcho({ echoId: "e1" });
      const { setEchoLocked, setEchoIgnoreFromOptimizer, getEchoFlags } =
        useEchoInventory();

      setEchoIgnoreFromOptimizer("e1", true);
      setEchoLocked("e1", true);

      expect(getEchoFlags("e1")).toMatchObject({
        locked: true,
        ignoreFromOptimizer: true,
      });
    });

    it("bulkSetTemp marks temp and clears locked/trash for every id", () => {
      const inventoryStore = useInventoryStore();
      inventoryStore.saveEcho({ echoId: "e1", locked: true });
      inventoryStore.saveEcho({ echoId: "e2", trash: true });
      const { bulkSetTemp, getEchoFlags } = useEchoInventory();

      bulkSetTemp(["e1", "e2"], true);

      expect(getEchoFlags("e1")).toMatchObject({ locked: false, temp: true });
      expect(getEchoFlags("e2")).toMatchObject({ trash: false, temp: true });
    });
  });

  describe("locked blocks deletion; temp does not", () => {
    it("removeEchoFully refuses to delete a locked echo", async () => {
      const inventoryStore = useInventoryStore();
      inventoryStore.saveEcho({ echoId: "e1", locked: true });
      const { removeEchoFully } = useEchoInventory();

      const removed = await removeEchoFully("e1");

      expect(removed).toBe(false);
      expect(inventoryStore.getEchoById("e1")).toBeTruthy();
    });

    it("removeEchoFully deletes a temp echo like any normal echo", async () => {
      const inventoryStore = useInventoryStore();
      inventoryStore.saveEcho({ echoId: "e1", temp: true });
      const { removeEchoFully } = useEchoInventory();

      const removed = await removeEchoFully("e1");

      expect(removed).toBe(true);
      expect(inventoryStore.getEchoById("e1")).toBeFalsy();
    });
  });

  describe("removeEchoFully unequips the echo", () => {
    function setup() {
      const inventoryStore = useInventoryStore();
      const characterStore = useCharacterStore();
      inventoryStore.saveEcho({ echoId: "e1", echo: "AbyssalGladius" });
      characterStore.characters = {
        Jinhsi: {
          echoes: [
            { echoId: "other", echo: "Other" },
            { echoId: "e1", echo: "AbyssalGladius" },
          ],
        },
      };
      return { inventoryStore, characterStore };
    }

    it("clears the slot of every character that has it equipped", async () => {
      const { inventoryStore, characterStore } = setup();
      inventoryStore.setEquippedData("e1", { Jinhsi: 1 });

      await useEchoInventory().removeEchoFully("e1");

      expect(characterStore.characters.Jinhsi.echoes[1]).toMatchObject({
        echoId: null,
        echo: null,
      });
      expect(characterStore.characters.Jinhsi.echoes[0].echoId).toBe("other");
      expect(inventoryStore.equipped.e1).toBeUndefined();
    });

    it("leaves a slot alone when a stale mapping points at a different echo", async () => {
      const { inventoryStore, characterStore } = setup();
      inventoryStore.setEquippedData("e1", { Jinhsi: 0 });

      await useEchoInventory().removeEchoFully("e1");

      expect(characterStore.characters.Jinhsi.echoes[0].echoId).toBe("other");
    });

    it("ignores a mapping for a character that no longer exists", async () => {
      const { inventoryStore } = setup();
      inventoryStore.setEquippedData("e1", { Deleted: 0 });

      await expect(useEchoInventory().removeEchoFully("e1")).resolves.toBe(true);
      expect(inventoryStore.getEchoById("e1")).toBeFalsy();
    });
  });
});
