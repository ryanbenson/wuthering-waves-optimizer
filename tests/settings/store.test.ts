import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useSettingsStore } from "../../src/stores/settings";

describe("useSettingsStore echoRatingWeights", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("falls back to the neutral default when unconfigured", () => {
    const store = useSettingsStore();
    expect(store.echoRatingWeights.CritRate).toBe(1);
  });

  it("setEchoRatingWeights overrides the default", () => {
    const store = useSettingsStore();
    store.setEchoRatingWeights({ CritRate: 4, CritDMG: 4 });
    expect(store.echoRatingWeights.CritRate).toBe(4);
    expect(store.echoRatingWeights.ATK).toBe(1); // untouched stat keeps the neutral default
  });

  it("resetEchoRatingWeights reverts to the neutral default", () => {
    const store = useSettingsStore();
    store.setEchoRatingWeights({ CritRate: 4 });
    store.resetEchoRatingWeights();
    expect(store.echoRatingWeights.CritRate).toBe(1);
  });
});

describe("useSettingsStore addRecentEnemyKey", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("adds a key as the most recent entry", () => {
    const store = useSettingsStore();
    store.addRecentEnemyKey("crownless");
    expect(store.config.recentEnemyKeys).toEqual(["crownless"]);
  });

  it("moves a re-chosen key back to the front instead of duplicating it", () => {
    const store = useSettingsStore();
    store.addRecentEnemyKey("crownless");
    store.addRecentEnemyKey("dreamless");
    store.addRecentEnemyKey("crownless");
    expect(store.config.recentEnemyKeys).toEqual(["crownless", "dreamless"]);
  });

  it("caps the list at 6 entries, dropping the oldest", () => {
    const store = useSettingsStore();
    ["a", "b", "c", "d", "e", "f", "g"].forEach((key) => store.addRecentEnemyKey(key));
    expect(store.config.recentEnemyKeys).toEqual(["g", "f", "e", "d", "c", "b"]);
  });

  it("ignores an empty key", () => {
    const store = useSettingsStore();
    store.addRecentEnemyKey("");
    expect(store.config.recentEnemyKeys).toBeUndefined();
  });
});
