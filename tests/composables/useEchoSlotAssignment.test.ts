import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { nextTick, watch } from "vue";
import { useEchoSlotAssignment } from "../../src/composables/useEchoSlotAssignment";
import { useCharacterStore } from "../../src/stores/character";
import { useInventoryStore } from "../../src/stores/inventory";

function seedEcho(inventoryStore: ReturnType<typeof useInventoryStore>, echoId: string) {
  inventoryStore.saveEcho({
    echoId,
    echo: "Dreamless",
    echoSet: "MidnightVeil",
    rank: 5,
    type: 4,
    stat: "CritRate",
    echoSubStatsType1: "ATK",
    echoSubStatsValue1: 30,
  });
}

describe("useEchoSlotAssignment", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // Regression test for a real reported bug: equipping a same-set
  // replacement echo made the Live Result Bar's delta pill flash a number
  // matching the character's *entire set-bonus contribution*, not the real
  // swap. Root cause traced to the old two-step "clear the slot, then set
  // it" sequence genuinely, if briefly, setting echoId to null — which any
  // reactive watcher on the slot's resolved echoId (or the echoSet derived
  // from it, as every mounted echo tile keeps) can observe mid-swap. This
  // test watches the store's own reactive state exactly the way a real
  // component would, and proves that observed sequence never passes
  // through null.
  it("swaps a slot atomically — a reactive watcher never observes the slot go empty mid-swap", async () => {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    seedEcho(inventoryStore, "old-echo");
    seedEcho(inventoryStore, "new-echo");
    characterStore.setCharacterData("Iuno", { echoes: { 0: { echoId: "old-echo" } } });
    await nextTick();

    const observed: Array<string | null | undefined> = [];
    watch(
      () => characterStore.characters?.Iuno?.echoes?.[0]?.echoId,
      (value) => observed.push(value),
      { immediate: true },
    );

    const { assignEchoToCharacterSlot } = useEchoSlotAssignment();
    const result = await assignEchoToCharacterSlot("Iuno", 0, "new-echo");
    await nextTick();

    expect(result).toEqual({ ok: true });
    expect(observed).not.toContain(null);
    expect(observed[observed.length - 1]).toBe("new-echo");
  });

  it("leaves the final slot state correct — same as the old two-step sequence would have", async () => {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    seedEcho(inventoryStore, "old-echo");
    seedEcho(inventoryStore, "new-echo");
    characterStore.setCharacterData("Iuno", {
      echoes: { 0: { echoId: "old-echo", echo: "Dreamless", echoSet: "MidnightVeil", stat: "CritRate" } },
    });

    const { assignEchoToCharacterSlot } = useEchoSlotAssignment();
    await assignEchoToCharacterSlot("Iuno", 0, "new-echo");

    const slot = characterStore.characters.Iuno.echoes[0];
    expect(slot.echoId).toBe("new-echo");
    // Every other field is a cleared pointer — the real stats come from the
    // linked inventory echo via resolveCharacterEchoes, not this record.
    expect(slot.echo).toBeNull();
    expect(slot.echoSet).toBeNull();
    expect(slot.stat).toBeNull();
  });

  it("refuses to equip an echo already equipped elsewhere on the same character", async () => {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    seedEcho(inventoryStore, "echo-a");
    characterStore.setCharacterData("Iuno", { echoes: { 1: { echoId: "echo-a" } } });

    const { assignEchoToCharacterSlot } = useEchoSlotAssignment();
    const result = await assignEchoToCharacterSlot("Iuno", 0, "echo-a");

    expect(result).toEqual({ ok: false, reason: "already-equipped" });
  });

  it("refuses to equip an echoId that isn't in the inventory", async () => {
    const { assignEchoToCharacterSlot } = useEchoSlotAssignment();
    const result = await assignEchoToCharacterSlot("Iuno", 0, "does-not-exist");

    expect(result).toEqual({ ok: false, reason: "missing-echo" });
  });

  it("marks the new echo equipped in inventory bookkeeping", async () => {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    seedEcho(inventoryStore, "new-echo");
    characterStore.setCharacterData("Iuno", {});

    const { assignEchoToCharacterSlot } = useEchoSlotAssignment();
    await assignEchoToCharacterSlot("Iuno", 2, "new-echo");

    expect(inventoryStore.getEchoEquippedChars("new-echo")).toContain("Iuno");
  });
});
