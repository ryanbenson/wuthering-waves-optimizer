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
