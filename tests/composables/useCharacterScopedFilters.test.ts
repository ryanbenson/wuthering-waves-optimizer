import { describe, it, expect, beforeEach } from "vitest";
import { ref } from "vue";
import { createPinia, setActivePinia } from "pinia";
import {
  useCharacterScopedFilters,
  useSavedFilters,
} from "../../src/composables/useCharacterScopedFilters";
import { useSettingsStore } from "../../src/stores/settings";

type TestFilters = { set: string | null; substats: string[] };
const EMPTY: TestFilters = { set: null, substats: [] };

function parse(raw: unknown): TestFilters {
  if (!raw || typeof raw !== "object") return { ...EMPTY };
  const saved = raw as Record<string, unknown>;
  return {
    set: typeof saved.set === "string" ? saved.set : null,
    substats: Array.isArray(saved.substats)
      ? saved.substats.filter((s): s is string => typeof s === "string")
      : [],
  };
}

function useTestFilters(characterId: Parameters<typeof useCharacterScopedFilters>[0]["characterId"]) {
  return useCharacterScopedFilters({ surface: "echoBrowser", characterId, empty: EMPTY, parse });
}

describe("useCharacterScopedFilters", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("saves under characterFilters[character][surface]", () => {
    useTestFilters("Jinhsi").field("set").value = "Celestial Light";
    expect(useSettingsStore().config.characterFilters).toEqual({
      Jinhsi: { echoBrowser: { set: "Celestial Light", substats: [] } },
    });
  });

  it("starts unfiltered for a character with nothing saved", () => {
    useTestFilters("Jinhsi").field("set").value = "Celestial Light";
    expect(useTestFilters("Camellya").filters.value).toEqual(EMPTY);
  });

  it("swaps to the new character's filters when the scope changes", () => {
    const scope = ref("Jinhsi");
    const filters = useTestFilters(scope);
    const set = filters.field("set");
    set.value = "Celestial Light";

    scope.value = "Camellya";
    expect(set.value).toBeNull();
    set.value = "Sun-sinking Eclipse";

    scope.value = "Jinhsi";
    expect(set.value).toBe("Celestial Light");
  });

  it("replaces arrays rather than merging them", () => {
    const substats = useTestFilters("Jinhsi").field("substats");
    substats.value = ["Crit Rate", "Crit DMG", "ATK%"];
    substats.value = ["Crit DMG"];
    expect(useSettingsStore().config.characterFilters.Jinhsi.echoBrowser.substats).toEqual([
      "Crit DMG",
    ]);
  });

  it("reset clears only this character and surface", () => {
    const store = useSettingsStore();
    useTestFilters("Camellya").field("set").value = "Sun-sinking Eclipse";
    store.setCharacterFilters("Jinhsi", "weaponBrowser", { rarity: 5 });
    const filters = useTestFilters("Jinhsi");
    filters.field("set").value = "Celestial Light";

    filters.reset();
    expect(filters.filters.value).toEqual(EMPTY);
    expect(store.config.characterFilters.Jinhsi.weaponBrowser).toEqual({ rarity: 5 });
    expect(useTestFilters("Camellya").field("set").value).toBe("Sun-sinking Eclipse");
  });

  it("treats malformed saved data as unfiltered", () => {
    const store = useSettingsStore();
    store.config.characterFilters = { Jinhsi: { echoBrowser: "junk" } };
    expect(useTestFilters("Jinhsi").filters.value).toEqual(EMPTY);
    store.config.characterFilters = "junk";
    expect(useTestFilters("Jinhsi").filters.value).toEqual(EMPTY);
    // A write still works and repairs the shape.
    useTestFilters("Jinhsi").field("set").value = "Celestial Light";
    expect(store.config.characterFilters.Jinhsi.echoBrowser.set).toBe("Celestial Light");
  });

  it("keeps filters in unsaved local state when there is no character", () => {
    const filters = useTestFilters(null);
    filters.field("set").value = "Celestial Light";
    expect(filters.field("set").value).toBe("Celestial Light");
    expect(useSettingsStore().config.characterFilters).toBeUndefined();
    expect(useTestFilters(null).filters.value).toEqual(EMPTY);
  });
});

describe("useSavedFilters with a global location", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("saves under the global key, replacing it whole", () => {
    const filters = useSavedFilters({
      location: { globalKey: "inventoryEchoFinderFilters" },
      empty: EMPTY,
      parse,
    });
    filters.field("substats").value = ["Crit Rate", "ATK%"];
    filters.field("substats").value = ["Crit DMG"];
    expect(useSettingsStore().config.inventoryEchoFinderFilters).toEqual({
      set: null,
      substats: ["Crit DMG"],
    });
    expect(useSettingsStore().config.characterFilters).toBeUndefined();
  });

  it("treats a malformed global value as unfiltered", () => {
    useSettingsStore().config.inventoryEchoFinderFilters = 42;
    const filters = useSavedFilters({
      location: { globalKey: "inventoryEchoFinderFilters" },
      empty: EMPTY,
      parse,
    });
    expect(filters.filters.value).toEqual(EMPTY);
  });
});
