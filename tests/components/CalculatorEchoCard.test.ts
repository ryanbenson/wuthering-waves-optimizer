import { describe, it, expect } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render } from "@testing-library/vue";
import CalculatorEchoCard from "../../src/components/CalculatorEchoCard.vue";

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

function renderCard(props: Record<string, unknown>) {
  return render(CalculatorEchoCard, {
    props,
    global: {
      stubs: { EchoFavoriteButton: true },
      directives: { tooltip: () => {} },
    },
  });
}

function hasIndicator(container: HTMLElement) {
  return container.querySelector("[data-test-incomplete-echo]") !== null;
}

describe("CalculatorEchoCard incomplete echo indicator", () => {
  it("does not show the indicator when the echo, set, main stat, and all substats are set", () => {
    setActivePinia(createPinia());
    const { container } = renderCard(baseProps());
    expect(hasIndicator(container)).toBe(false);
  });

  it("shows the indicator when no echo is chosen", () => {
    setActivePinia(createPinia());
    const { container } = renderCard(baseProps({ echo: "" }));
    expect(hasIndicator(container)).toBe(true);
  });

  it("shows the indicator when no echo set is chosen", () => {
    setActivePinia(createPinia());
    const { container } = renderCard(baseProps({ echoSet: "" }));
    expect(hasIndicator(container)).toBe(true);
  });

  it("shows the indicator when the main stat is not set", () => {
    setActivePinia(createPinia());
    const { container } = renderCard(baseProps({ stat: "none" }));
    expect(hasIndicator(container)).toBe(true);
  });

  it("shows the indicator when fewer than 5 substats are configured", () => {
    setActivePinia(createPinia());
    const { container } = renderCard(baseProps({ echoSubStatsType5: "none" }));
    expect(hasIndicator(container)).toBe(true);
  });

  it("shows the indicator in the compact layout too", () => {
    setActivePinia(createPinia());
    const { container } = renderCard(baseProps({ stat: "none", compact: true }));
    expect(hasIndicator(container)).toBe(true);
  });
});

describe("CalculatorEchoCard rating badges", () => {
  it("shows the Echo Rating grade but not a Substat Score when no characterId is given", () => {
    setActivePinia(createPinia());
    const { getByText, queryByText } = renderCard(baseProps());
    // perfect-tier substats aren't used here, so just assert *a* grade renders
    expect(getByText(/^[EDCBAS]+\*?$/)).toBeTruthy();
    expect(queryByText(/^Score \d+%/)).toBeNull();
  });

  it("shows a Substat Score badge when characterId is given", () => {
    setActivePinia(createPinia());
    const { getByText } = renderCard(baseProps({ characterId: "Camellya" }));
    expect(getByText(/^Score \d+%\*?$/)).toBeTruthy();
  });

  it("marks the grade provisional (asterisk) when fewer than 5 substats are revealed", () => {
    setActivePinia(createPinia());
    const { getByText } = renderCard(baseProps({ echoSubStatsType5: "none" }));
    expect(getByText(/\*$/)).toBeTruthy();
  });
});
