import { describe, it, expect, beforeEach } from "vitest";
import { ref } from "vue";
import { createPinia, setActivePinia } from "pinia";
import {
  EMPTY_ECHO_FINDER_FILTERS,
  parseEchoFinderFilters,
  useEchoFinderFilters,
} from "../../src/composables/useEchoFinderFilters";
import { useSettingsStore } from "../../src/stores/settings";

describe("parseEchoFinderFilters", () => {
  it("reads valid saved filters and rejects malformed ones", () => {
    expect(parseEchoFinderFilters({ echoSet: "Celestial Light", cost: 3 })).toEqual({
      echoSet: "Celestial Light",
      cost: 3,
    });
    expect(parseEchoFinderFilters({ echoSet: 1, cost: "3" })).toEqual(EMPTY_ECHO_FINDER_FILTERS);
  });
});

describe("useEchoFinderFilters", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("saves a build slot's filters for that character", () => {
    useEchoFinderFilters({ character: "Jinhsi" }).echoSetFilter.value = "Celestial Light";
    expect(useEchoFinderFilters({ character: "Jinhsi" }).echoSetFilter.value).toBe("Celestial Light");
    expect(useEchoFinderFilters({ character: "Camellya" }).echoSetFilter.value).toBeNull();
  });

  it("saves the inventory's filters globally, separate from any character", () => {
    const inventory = useEchoFinderFilters("inventory");
    inventory.echoCostFilter.value = 4;
    inventory.echoSetFilter.value = "Celestial Light";

    expect(useSettingsStore().config.inventoryEchoFinderFilters).toEqual({
      echoSet: "Celestial Light",
      cost: 4,
    });
    expect(useEchoFinderFilters("inventory").echoCostFilter.value).toBe(4);
    expect(useEchoFinderFilters({ character: "Jinhsi" }).echoCostFilter.value).toBeNull();

    inventory.resetEchoFinderFilters();
    expect(useEchoFinderFilters("inventory").echoSetFilter.value).toBeNull();
  });

  it("follows a scope change between characters", () => {
    const scope = ref<{ character: string }>({ character: "Jinhsi" });
    const filters = useEchoFinderFilters(scope);
    filters.echoCostFilter.value = 3;
    scope.value = { character: "Camellya" };
    expect(filters.echoCostFilter.value).toBeNull();
    scope.value = { character: "Jinhsi" };
    expect(filters.echoCostFilter.value).toBe(3);
  });

  it("doesn't save a build slot with no character yet", () => {
    const filters = useEchoFinderFilters({ character: "" });
    filters.echoCostFilter.value = 4;
    expect(filters.echoCostFilter.value).toBe(4);
    expect(useSettingsStore().config.characterFilters).toBeUndefined();
    expect(useSettingsStore().config.inventoryEchoFinderFilters).toBeUndefined();
  });
});
