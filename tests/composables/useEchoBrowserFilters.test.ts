import { describe, it, expect, beforeEach } from "vitest";
import { ref } from "vue";
import { createPinia, setActivePinia } from "pinia";
import {
  EMPTY_ECHO_BROWSER_FILTERS,
  parseEchoBrowserFilters,
  useEchoBrowserFilters,
} from "../../src/composables/useEchoBrowserFilters";
import { ECHO_CV_MAX, ECHO_RV_MAX } from "../../src/echoes/stats";

describe("parseEchoBrowserFilters", () => {
  it("reads valid saved filters", () => {
    const saved = {
      cost: 4,
      echoSet: "Celestial Light",
      equipped: "any",
      mainStat: "Crit Rate",
      favorites: true,
      substats: ["Crit DMG", "ATK%"],
      cvMin: 10,
      cvMax: 30,
      rvMin: 0,
      rvMax: ECHO_RV_MAX,
      ratingMin: 50,
      ratingMax: 90,
      sortBy: "impact",
    };
    expect(parseEchoBrowserFilters(saved)).toEqual(saved);
  });

  it("treats missing or malformed values as unfiltered", () => {
    expect(parseEchoBrowserFilters(undefined)).toEqual(EMPTY_ECHO_BROWSER_FILTERS);
    expect(parseEchoBrowserFilters("junk")).toEqual(EMPTY_ECHO_BROWSER_FILTERS);
    expect(
      parseEchoBrowserFilters({
        cost: "4",
        equipped: "nobody",
        favorites: "yes",
        substats: "Crit DMG",
        sortBy: "random",
      }),
    ).toEqual(EMPTY_ECHO_BROWSER_FILTERS);
  });

  it("drops non-string substats", () => {
    expect(parseEchoBrowserFilters({ substats: ["Crit DMG", 3, null] }).substats).toEqual([
      "Crit DMG",
    ]);
  });

  it("falls back to the full range for an out-of-bounds or inverted range", () => {
    const parsed = parseEchoBrowserFilters({
      cvMin: -5,
      cvMax: 20,
      rvMin: 30,
      rvMax: 10,
      ratingMin: 0,
      ratingMax: 150,
    });
    expect([parsed.cvMin, parsed.cvMax]).toEqual([0, ECHO_CV_MAX]);
    expect([parsed.rvMin, parsed.rvMax]).toEqual([0, ECHO_RV_MAX]);
    expect([parsed.ratingMin, parsed.ratingMax]).toEqual([0, 100]);
  });
});

describe("useEchoBrowserFilters", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("swaps filters when the character changes", () => {
    const character = ref("Jinhsi");
    const filters = useEchoBrowserFilters(character);
    filters.echoSet.value = "Celestial Light";
    filters.costFilter.value = 4;

    character.value = "Camellya";
    expect(filters.echoSet.value).toBeNull();
    expect(filters.costFilter.value).toBeNull();

    character.value = "Jinhsi";
    expect(filters.echoSet.value).toBe("Celestial Light");
    expect(filters.costFilter.value).toBe(4);
  });

  it("clearing keeps the sort", () => {
    const filters = useEchoBrowserFilters("Jinhsi");
    filters.sortBy.value = "impact";
    filters.substatFilter.value = ["Crit Rate"];
    filters.resetEchoBrowserFilters();
    expect(filters.substatFilter.value).toEqual([]);
    expect(filters.sortBy.value).toBe("impact");
  });
});
