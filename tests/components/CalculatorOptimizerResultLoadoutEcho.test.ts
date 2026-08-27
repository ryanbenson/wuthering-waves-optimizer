import { describe, it, expect } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render } from "@testing-library/vue";
import CalculatorOptimizerResultLoadoutEcho from "../../src/components/CalculatorOptimizerResultLoadoutEcho.vue";
import { useInventoryStore } from "../../src/stores/inventory";

const ECHO = "AeroDrake";

function baseProps(overrides: Record<string, unknown> = {}) {
  return {
    rank: 5,
    type: "4",
    echo: ECHO,
    echoId: "echo-1",
    echoSet: "MoltenRift",
    stat: "CritRate",
    echoSubStatsType1: "CritRate",
    echoSubStatsValue1: 7.5,
    echoSubStatsType2: "CritDMG",
    echoSubStatsValue2: 16.2,
    echoSubStatsType3: "ATK",
    echoSubStatsValue3: 9.4,
    echoSubStatsType4: "ATK_FLAT",
    echoSubStatsValue4: 50,
    echoSubStatsType5: "EnergyRegen",
    echoSubStatsValue5: 8,
    ...overrides,
  };
}

function renderResultEcho(props: Record<string, unknown>) {
  return render(CalculatorOptimizerResultLoadoutEcho, {
    props,
    global: {
      stubs: { EchoFavoriteButton: true },
      directives: { tooltip: () => {} },
    },
  });
}

function hasStatusBadge(container: HTMLElement) {
  return container.querySelector("[data-test-echo-status-badge]") !== null;
}

describe("CalculatorOptimizerResultLoadoutEcho trash/lock status badge", () => {
  it("does not show a status badge for an echo with no status flags", () => {
    setActivePinia(createPinia());
    useInventoryStore().saveEcho({ echoId: "echo-1" });
    const { container } = renderResultEcho(baseProps());
    expect(hasStatusBadge(container)).toBe(false);
  });

  it("warns the user with a badge when a suggested loadout echo is marked trash", () => {
    setActivePinia(createPinia());
    useInventoryStore().saveEcho({ echoId: "echo-1", trash: true });
    const { container } = renderResultEcho(baseProps());
    expect(hasStatusBadge(container)).toBe(true);
  });

  it("shows a status badge when the suggested echo is locked", () => {
    setActivePinia(createPinia());
    useInventoryStore().saveEcho({ echoId: "echo-1", locked: true });
    const { container } = renderResultEcho(baseProps());
    expect(hasStatusBadge(container)).toBe(true);
  });
});
