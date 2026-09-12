import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render } from "@testing-library/vue";
import CalculatorBuildCardEchoCard from "../../src/components/CalculatorBuildCardEchoCard.vue";

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

function renderCard(props: Record<string, unknown> = {}) {
  return render(CalculatorBuildCardEchoCard, { props: baseProps(props) });
}

describe("CalculatorBuildCardEchoCard substat rows", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("gives a filled substat row the roll-quality border and gradient wash", () => {
    const { container } = renderCard();
    const row = container.querySelector(".build-card-echo__substat");
    // CritRate at 7.5 lands in the score-50 (blue) bucket — see
    // subStatsTableRollValue in src/echoes/stats.ts.
    expect(row?.className).toContain("border-l-blue-500/50");
    expect(row?.className).toContain("bg-gradient-to-r");
    expect(row?.className).toContain("from-blue-500/10");
  });

  it("does not render a row for an unfilled substat slot", () => {
    const { container } = renderCard({ echoSubStatsType5: "none" });
    const rows = container.querySelectorAll(".build-card-echo__substat");
    expect(rows.length).toBe(4);
  });
});
