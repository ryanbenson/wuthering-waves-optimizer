import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useEchoInventory } from "../../src/composables/useEchoInventory";
import { useInventoryStore } from "../../src/stores/inventory";

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
});
