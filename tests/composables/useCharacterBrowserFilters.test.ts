import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import {
  parseCharacterBrowserFilters,
  useCharacterBrowserFilters,
} from "../../src/composables/useCharacterBrowserFilters";
import { useSettingsStore } from "../../src/stores/settings";

describe("parseCharacterBrowserFilters", () => {
  it("reads valid saved filters", () => {
    expect(
      parseCharacterBrowserFilters({
        element: "Electro",
        rarity: 5,
        weapon: "Sword",
        buildStatus: "finished",
        favorites: true,
      }),
    ).toEqual({ element: "Electro", rarity: 5, weapon: "Sword", buildStatus: "finished", favorites: true });
  });

  it("treats missing or malformed values as unfiltered", () => {
    const empty = { element: null, rarity: null, weapon: null, buildStatus: null, favorites: false };
    expect(parseCharacterBrowserFilters(undefined)).toEqual(empty);
    expect(parseCharacterBrowserFilters("nope")).toEqual(empty);
    expect(
      parseCharacterBrowserFilters({ element: 3, rarity: "5", buildStatus: "made-up", favorites: "yes" }),
    ).toEqual(empty);
  });
});

describe("useCharacterBrowserFilters", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("saves each filter to settings.config", () => {
    const filters = useCharacterBrowserFilters();
    filters.filterElement.value = "Havoc";
    filters.filterRarity.value = 4;
    filters.filterFavorites.value = true;

    expect(useSettingsStore().config.characterBrowserFilters).toEqual({
      element: "Havoc",
      rarity: 4,
      weapon: null,
      buildStatus: null,
      favorites: true,
    });
  });

  it("shares saved filters with a browser opened later", () => {
    useCharacterBrowserFilters().filterWeapon.value = "Rectifier";
    expect(useCharacterBrowserFilters().filterWeapon.value).toBe("Rectifier");
  });

  it("clears a filter without leaving the old value behind", () => {
    const filters = useCharacterBrowserFilters();
    filters.filterElement.value = "Havoc";
    filters.filterElement.value = null;
    expect(useSettingsStore().config.characterBrowserFilters.element).toBeNull();
  });

  it("resets every filter", () => {
    const filters = useCharacterBrowserFilters();
    filters.filterElement.value = "Havoc";
    filters.filterBuildStatus.value = "in-progress";
    filters.resetFilters();
    expect(useSettingsStore().config.characterBrowserFilters).toEqual({
      element: null,
      rarity: null,
      weapon: null,
      buildStatus: null,
      favorites: false,
    });
  });
});
