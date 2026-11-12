import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import {
  EMPTY_WEAPON_BROWSER_FILTERS,
  parseWeaponBrowserFilters,
  useWeaponBrowserFilters,
} from "../../src/composables/useWeaponBrowserFilters";

describe("parseWeaponBrowserFilters", () => {
  it("reads valid saved filters", () => {
    const saved = { rarity: 5, mainStat: "Crit Rate", sortBy: "name" };
    expect(parseWeaponBrowserFilters(saved)).toEqual(saved);
  });

  it("treats missing or malformed values as unfiltered with the impact sort", () => {
    expect(parseWeaponBrowserFilters(null)).toEqual(EMPTY_WEAPON_BROWSER_FILTERS);
    expect(parseWeaponBrowserFilters({ rarity: "5", mainStat: 1, sortBy: "price" })).toEqual(
      EMPTY_WEAPON_BROWSER_FILTERS,
    );
  });
});

describe("useWeaponBrowserFilters", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("remembers filters per character and keeps the sort on clear", () => {
    const jinhsi = useWeaponBrowserFilters("Jinhsi");
    jinhsi.rarityFilter.value = 4;
    jinhsi.sortBy.value = "name";
    expect(useWeaponBrowserFilters("Camellya").rarityFilter.value).toBeNull();
    expect(useWeaponBrowserFilters("Jinhsi").rarityFilter.value).toBe(4);

    jinhsi.resetWeaponBrowserFilters();
    expect(jinhsi.rarityFilter.value).toBeNull();
    expect(jinhsi.sortBy.value).toBe("name");
  });
});
