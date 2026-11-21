import { describe, it, expect, beforeEach } from "vitest";
import { ref } from "vue";
import { createPinia, setActivePinia } from "pinia";
import { useWavescanLoadouts, SCANNED_BUILD_NAME } from "../../src/composables/useWavescanLoadouts";
import { useCharacterStore } from "../../src/stores/character";
import { useInventoryStore } from "../../src/stores/inventory";

const echo = (echoId: string, type = 4) => ({
  echoId,
  echo: "BellBorneGeochelone",
  echoSet: "FreezingFrost",
  rank: 5,
  stat: "CritRate",
  type,
});

function scanner() {
  const loadouts = useWavescanLoadouts({ mapped: ref(null), meta: ref(null), mode: ref("append") });
  loadouts.buildTarget.value = "scanned";
  return loadouts;
}

const write = (characterKey: string, echoIds: (string | null)[]) => ({
  characterKey,
  echoIds: [...echoIds, ...Array(5 - echoIds.length).fill(null)],
  mainEcho: null,
});

const slotIds = (characterKey: string) =>
  [0, 1, 2, 3, 4].map((i) => useCharacterStore().characters[characterKey]?.echoes?.[i]?.echoId ?? null);
const buildNames = (characterKey: string) => useCharacterStore().getBuilds(characterKey).map((b: { name: string }) => b.name);

describe('the echo scanner\'s "Scanned" build', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const inventory = useInventoryStore();
    for (const id of ["e1", "e2", "e3", "e4", "e6", "e24"]) inventory.saveEcho(echo(id));
  });

  it("puts the scan in a Scanned build and leaves the build you were on as it was", () => {
    const characters = useCharacterStore();
    scanner().applyLoadoutWrites([write("Hsin", ["e1", "e2", "e3", "e6"])]);
    characters.renameBuild("Hsin", characters.getActiveBuildId("Hsin"), "My tuned build");

    scanner().applyLoadoutWrites([write("Hsin", ["e1", "e2", "e3", "e4"])]);

    expect(buildNames("Hsin")).toEqual(["My tuned build", SCANNED_BUILD_NAME]);
    expect(characters.getActiveBuild("Hsin").name).toBe(SCANNED_BUILD_NAME);
    expect(slotIds("Hsin")).toEqual(["e1", "e2", "e3", "e4", null]);

    characters.equipBuild("Hsin", characters.getBuilds("Hsin")[0].id);
    expect(slotIds("Hsin")).toEqual(["e1", "e2", "e3", "e6", null]);
  });

  it("updates the same Scanned build on every scan instead of adding builds", () => {
    const characters = useCharacterStore();
    scanner().applyLoadoutWrites([write("Hsin", ["e1", "e2", "e3", "e4"])]);
    scanner().applyLoadoutWrites([write("Hsin", ["e1", "e2", "e3", "e24"])]);
    scanner().applyLoadoutWrites([write("Hsin", ["e1", "e2", "e3", "e24"])]);

    expect(buildNames("Hsin")).toEqual([SCANNED_BUILD_NAME]);
    expect(characters.getActiveBuild("Hsin").name).toBe(SCANNED_BUILD_NAME);
    expect(slotIds("Hsin")).toEqual(["e1", "e2", "e3", "e24", null]);
  });

  it("switches back to the Scanned build when another build is active", () => {
    const characters = useCharacterStore();
    scanner().applyLoadoutWrites([write("Hsin", ["e1", "e2"])]);
    characters.createBuild("Hsin", "Experiment", { from: "active" });

    scanner().applyLoadoutWrites([write("Hsin", ["e1", "e2", "e3"])]);

    expect(buildNames("Hsin")).toEqual([SCANNED_BUILD_NAME, "Experiment"]);
    expect(characters.getActiveBuild("Hsin").name).toBe(SCANNED_BUILD_NAME);
    expect(slotIds("Hsin")).toEqual(["e1", "e2", "e3", null, null]);
  });

  it("treats a renamed Scanned build as the player's own and starts a new one", () => {
    const characters = useCharacterStore();
    scanner().applyLoadoutWrites([write("Hsin", ["e1"])]);
    characters.renameBuild("Hsin", characters.getActiveBuildId("Hsin"), "Kept");

    scanner().applyLoadoutWrites([write("Hsin", ["e2"])]);

    expect(buildNames("Hsin")).toEqual(["Kept", SCANNED_BUILD_NAME]);
  });

  it("never touches a build the player named \"Scanned\": the scanner's build is found by its flag", () => {
    const characters = useCharacterStore();
    characters.ensureCharacterBuilds("Hsin");
    characters.applyEchoLoadout("Hsin", { echoIds: ["e6"], presetId: null, fillSlots: 1 });
    characters.renameBuild("Hsin", characters.getActiveBuildId("Hsin"), SCANNED_BUILD_NAME);

    scanner().applyLoadoutWrites([write("Hsin", ["e1"])]);
    scanner().applyLoadoutWrites([write("Hsin", ["e2"])]);

    expect(buildNames("Hsin")).toEqual([SCANNED_BUILD_NAME, `${SCANNED_BUILD_NAME} (2)`]);
    expect(slotIds("Hsin")).toEqual(["e2", "e1", null, null, null]); // the rescan keeps e1
    characters.equipBuild("Hsin", characters.getBuilds("Hsin")[0].id);
    expect(slotIds("Hsin")).toEqual(["e6", null, null, null, null]);
  });

  it("keeps the flag on the scanner's build only, not on the live record or the build switched to", () => {
    const characters = useCharacterStore();
    scanner().applyLoadoutWrites([write("Hsin", ["e1"])]);
    characters.createBuild("Hsin", "Experiment", { from: "active" });
    characters.equipBuild("Hsin", characters.getBuilds("Hsin")[0].id);
    characters.equipBuild("Hsin", characters.getBuilds("Hsin")[1].id);

    const flags = characters.getBuilds("Hsin").map((b: { scanner?: boolean }) => Boolean(b.scanner));
    expect(flags).toEqual([true, false]);
    expect(characters.characters.Hsin.scanner).toBeUndefined();
  });

  it("returns the echoes it took off another character's active build", () => {
    const characters = useCharacterStore();
    characters.ensureCharacterBuilds("Hiyuki");
    characters.applyEchoLoadout("Hiyuki", { echoIds: ["e1", "e6"], presetId: null, fillSlots: 2 });

    const { moved } = scanner().applyLoadoutWrites([write("Hsin", ["e1", "e2"])]);

    expect(moved).toEqual([{ echoId: "e1", from: "Hiyuki", to: "Hsin" }]);
    expect(slotIds("Hiyuki")).toEqual([null, "e6", null, null, null]);
  });

  it("keeps the rest of the scanner's build when a rescan shows only some of a character's echoes", () => {
    const inventory = useInventoryStore();
    for (const [id, cost] of [["p4", 4], ["p3a", 3], ["p3b", 3], ["p1a", 1], ["p1b", 1], ["n4", 4], ["n3", 3]] as const) {
      inventory.saveEcho(echo(id, cost));
    }
    const characters = useCharacterStore();
    scanner().applyLoadoutWrites([write("Hsin", ["p4", "p3a", "p3b", "p1a", "p1b"])]);

    const partial = scanner().applyLoadoutWrites([write("Hsin", ["p4", "p3a"])]);
    expect(partial.kept).toBe(3);
    expect(slotIds("Hsin")).toEqual(["p4", "p3a", "p3b", "p1a", "p1b"]);

    // New 4- and 3-cost echoes: the older ones that still fit in 12 cost stay, the rest drop.
    const swapped = scanner().applyLoadoutWrites([write("Hsin", ["n4", "n3"])]);
    expect(swapped.kept).toBe(2);
    expect(slotIds("Hsin")).toEqual(["n4", "p4", "n3", "p1a", null]);
    expect(characters.characters.Hsin.mainEcho).toEqual({ echo: "BellBorneGeochelone", rank: 5 });
  });

  it("doesn't keep an echo another character is equipped with in the same scan", () => {
    const inventory = useInventoryStore();
    for (const [id, cost] of [["p3", 3], ["p1", 1]] as const) inventory.saveEcho(echo(id, cost));
    scanner().applyLoadoutWrites([write("Hsin", ["e1", "p3", "p1"])]);

    scanner().applyLoadoutWrites([write("Hsin", ["e1"]), write("Hiyuki", ["p1"])]);

    expect(slotIds("Hsin")).toEqual(["e1", "p3", null, null, null]);
    expect(slotIds("Hiyuki")).toEqual(["p1", null, null, null, null]);
  });

  it("names the build each character ends up on", () => {
    const characters = useCharacterStore();
    characters.ensureCharacterBuilds("Hsin");
    characters.renameBuild("Hsin", characters.getActiveBuildId("Hsin"), SCANNED_BUILD_NAME);

    const { buildNames } = scanner().applyLoadoutWrites([write("Hsin", ["e1"]), write("Hiyuki", ["e2"])]);

    expect(buildNames).toEqual({ Hsin: `${SCANNED_BUILD_NAME} (2)`, Hiyuki: SCANNED_BUILD_NAME });
  });
});
