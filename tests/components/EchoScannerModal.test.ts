import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount, flushPromises, type VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import EchoScannerModal from "../../src/components/EchoScannerModal.vue";
import type { ScanSaveOptions } from "../../src/components/EchoScannerCapture.vue";
import { mapParsedEchoes } from "../../src/echoes/parsedEchoMapping";
import { useInventoryStore } from "../../src/stores/inventory";
import type { ParsedEchoSlot } from "../../src/scanner/types";

// The capture step (screen share, OCR workers) is replaced by a stub the test emits from.
vi.mock("../../src/components/EchoScannerCapture.vue", () => ({
  default: defineComponent({ name: "EchoScannerCapture", emits: ["echoes-parsed"], render: () => h("div") }),
}));

const applyLoadoutWrites = vi.fn();
vi.mock("../../src/composables/useWavescanLoadouts", () => ({
  SCANNED_BUILD_NAME: "Scanned",
  useWavescanLoadouts: () => ({ buildTarget: ref("active"), applyLoadoutWrites }),
}));

const setEchoLocked = vi.fn();
const setEchoTrash = vi.fn();
vi.mock("../../src/composables/useEchoInventory", () => ({
  useEchoInventory: () => ({ setEchoLocked, setEchoTrash }),
}));

const showToast = vi.fn();
vi.mock("../../src/composables/useToast", () => ({ useToast: () => ({ showToast }) }));

const slot = (echo: string, cost: number, crit: string, marks: Partial<ParsedEchoSlot> = {}): ParsedEchoSlot => ({
  echo,
  cost,
  set: "WishesofQuietSnowfall",
  mainStatLabel: "ATK",
  substats: [
    { subStat: "Crit. Rate", subStatValue: crit },
    { subStat: "Crit. DMG", subStatValue: "15.0%" },
  ],
  locked: false,
  trash: false,
  ...marks,
});

const ALL_ON: ScanSaveOptions = { equipWearers: true, copyMarks: true, keepTrash: false };

let wrapper: VueWrapper<any>;

async function scan(slots: ParsedEchoSlot[], options: Partial<ScanSaveOptions> = {}) {
  wrapper = mount(EchoScannerModal, { attachTo: document.body });
  await (wrapper.vm as any).triggerOpenModal();
  await nextTick();
  wrapper.findComponent({ name: "EchoScannerCapture" }).vm.$emit("echoes-parsed", slots, true, { ...ALL_ON, ...options });
  await flushPromises();
}

const toast = () => showToast.mock.calls.at(-1)?.[0] as string;
const savedEchoNames = () => useInventoryStore().echoes.map((echo: { echo: string }) => echo.echo);

describe("EchoScannerModal's save step", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
      this.open = true;
    };
    HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
      this.open = false;
    };
    applyLoadoutWrites.mockReset().mockImplementation((writes: { characterKey: string }[]) => ({
      moved: [],
      kept: 0,
      buildNames: Object.fromEntries(writes.map((w) => [w.characterKey, "Scanned"])),
    }));
    setEchoLocked.mockReset();
    setEchoTrash.mockReset();
    showToast.mockReset();
  });

  afterEach(() => wrapper?.unmount());

  it("adds the game's marks when its box is ticked, and never clears the app's own", async () => {
    const lockedInApp = slot("ShadowStepper", 1, "6.9%");
    useInventoryStore().saveEcho({ ...mapParsedEchoes([lockedInApp], true)[0], locked: true });

    // The game shows it unlocked: the app's lock stays.
    await scan([slot("IceglintDancer", 1, "6.3%", { locked: true }), lockedInApp]);
    const save = wrapper.findAll("button").find((button) => button.text() === "Save 1 selected")!;
    await save.trigger("click");
    await flushPromises();

    const added = useInventoryStore().echoes.find((echo: { echo: string }) => echo.echo === "IceglintDancer");
    expect(setEchoLocked).toHaveBeenCalledTimes(1);
    expect(setEchoLocked).toHaveBeenCalledWith(added.echoId, true);
    expect(setEchoTrash).not.toHaveBeenCalled();
    expect(toast()).toContain("Locked 1 echo, as in game.");
  });

  it("leaves the marks alone when its box is unticked", async () => {
    await scan([slot("IceglintDancer", 1, "6.3%", { locked: true })], { copyMarks: false });

    expect(setEchoLocked).not.toHaveBeenCalled();
    expect(setEchoTrash).not.toHaveBeenCalled();
    expect(toast()).toBe("Saved 1 echo to your inventory.");
  });

  it("equips the wearers only when the equip box is ticked", async () => {
    const worn = slot("IceglintDancer", 1, "6.3%", { equippedBy: "Hsin" });

    await scan([worn], { equipWearers: false });
    expect(applyLoadoutWrites).not.toHaveBeenCalled();
    wrapper.unmount();

    setActivePinia(createPinia());
    await scan([worn]);
    expect(applyLoadoutWrites).toHaveBeenCalledTimes(1);
    const [writes] = applyLoadoutWrites.mock.calls[0];
    expect(writes).toEqual([expect.objectContaining({ characterKey: "Hsin" })]);
  });

  it("says in the toast who was equipped and which echoes moved off other characters", async () => {
    applyLoadoutWrites.mockReturnValue({
      moved: [{ echoId: "x", from: "Hiyuki", to: "Hsin" }],
      kept: 0,
      buildNames: { Hsin: "Scanned" },
    });

    await scan([slot("IceglintDancer", 1, "6.3%", { equippedBy: "Hsin" })]);

    expect(toast()).toBe(
      'Saved 1 echo to your inventory. Equipped on Hsin, each in its "Scanned" build. Moved 1 echo off Hiyuki, as in game.',
    );
    expect(toast()).not.toContain("unchanged");
  });

  it("leaves out echoes the game shows as discarded unless the player keeps them", async () => {
    const discarded = slot("ShadowStepper", 1, "6.9%", { trash: true });

    await scan([slot("IceglintDancer", 1, "6.3%"), discarded]);
    expect(savedEchoNames()).toEqual(["IceglintDancer"]);
    expect(toast()).toContain("Left out 1 echo marked as discard in game.");
    wrapper.unmount();

    setActivePinia(createPinia());
    await scan([discarded], { keepTrash: true });
    expect(savedEchoNames()).toEqual(["ShadowStepper"]);
    expect(setEchoTrash).toHaveBeenCalledWith(useInventoryStore().echoes[0].echoId, true);
  });

  it("marks an echo already in the inventory as discard without deleting it", async () => {
    const discarded = slot("ShadowStepper", 1, "6.9%", { trash: true });
    const [owned] = mapParsedEchoes([discarded], true);
    useInventoryStore().saveEcho(owned);

    await scan([discarded]);

    expect(useInventoryStore().echoes).toHaveLength(1);
    expect(setEchoTrash).toHaveBeenCalledWith(owned.echoId, true);
  });

  it("still equips and adds marks from \"Apply without saving\" on the duplicate review", async () => {
    const known = slot("IceglintDancer", 1, "6.3%", { locked: true, equippedBy: "Hsin" });
    const [owned] = mapParsedEchoes([known], true);
    useInventoryStore().saveEcho(owned);

    await scan([known]);
    expect(applyLoadoutWrites).not.toHaveBeenCalled();
    await wrapper.find("[data-test-duplicate-review-apply]").trigger("click");
    await flushPromises();

    expect(useInventoryStore().echoes).toHaveLength(1);
    expect(setEchoLocked).toHaveBeenCalledWith(owned.echoId, true);
    expect(applyLoadoutWrites).toHaveBeenCalledTimes(1);
    expect(toast()).toBe('No echoes were saved. Locked 1 echo, as in game. Equipped on Hsin, each in its "Scanned" build.');
  });

  it("names a build that isn't called \"Scanned\" and counts echoes kept from earlier scans", async () => {
    applyLoadoutWrites.mockReturnValue({ moved: [], kept: 2, buildNames: { Hsin: "Scanned (2)" } });

    await scan([slot("IceglintDancer", 1, "6.3%", { equippedBy: "Hsin" })]);

    expect(toast()).toBe(
      "Saved 1 echo to your inventory. Equipped on Hsin (build \"Scanned (2)\"). Kept 2 echoes from earlier scans that this one didn't show.",
    );
  });

  it("says when a game lock replaced a discard mark set in the app, and leaves temp echoes alone", async () => {
    const discardedHere = slot("IceglintDancer", 1, "6.3%", { locked: true });
    const tempHere = slot("ShadowStepper", 1, "6.9%", { trash: true });
    const [trashEcho] = mapParsedEchoes([discardedHere], true);
    const [tempEcho] = mapParsedEchoes([tempHere], true);
    useInventoryStore().saveEcho({ ...trashEcho, trash: true });
    useInventoryStore().saveEcho({ ...tempEcho, temp: true });

    await scan([discardedHere, tempHere]);
    await wrapper.find("[data-test-duplicate-review-apply]").trigger("click");
    await flushPromises();

    expect(setEchoLocked).toHaveBeenCalledWith(trashEcho.echoId, true);
    expect(setEchoTrash).not.toHaveBeenCalled();
    expect(toast()).toBe(
      "No echoes were saved. Left out 1 echo marked as discard in game. Locked 1 echo, as in game (1 was marked discard here).",
    );
  });
});
