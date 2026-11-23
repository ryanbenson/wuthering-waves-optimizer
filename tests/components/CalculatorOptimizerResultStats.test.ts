import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import CalculatorOptimizerResultStats from "../../src/components/CalculatorOptimizerResultStats.vue";

// Issue #746: the optimized-for row shows that stat's own change (it used to
// show the ATK change on every row), then how much the stat itself moves.
function props(targetValue: string) {
  return {
    characterElement: "Aero",
    targetValue,
    finalStats: {
      totalAtk: 2200,
      totalHp: 16118,
      totalDef: 1000,
      totalCritRate: 0.721,
      totalCritDMG: 2.558,
      energyRegen: 1.29,
      attackPercent: 60.8,
      attackFlat: 350,
    },
    totalAtk: 2000,
    totalHp: 17181,
    totalDef: 1105,
    totalCritRate: 0.802,
    totalCritDmg: 2.384,
    energyRegen: 1.306,
    currentStatParts: { attackPercent: 60, attackFlat: 300 },
  };
}

function targetText(container: Element): string {
  const root = container.querySelector("[data-test-optimizer-result-target-delta]");
  return Array.from(root?.children ?? [])
    .map((el) => el.textContent?.trim())
    .join(" ");
}

describe("CalculatorOptimizerResultStats", () => {
  it("shows the Crit Rate change, not the ATK change, when optimizing Crit Rate", () => {
    const { container } = render(CalculatorOptimizerResultStats, { props: props("totalCritRate") });
    expect(container.querySelectorAll("[data-test-optimizer-result-target-delta]").length).toBe(1);
    expect(targetText(container)).toBe("(-10.1%) · Stat -8.1%");
    expect(container.querySelector(".stat-cr [data-test-optimizer-result-target-delta]")).not.toBeNull();
  });

  it("splits ATK into % and flat when optimizing ATK", () => {
    const { container } = render(CalculatorOptimizerResultStats, { props: props("totalAtk") });
    expect(targetText(container)).toBe("(+10.0%) · ATK% +0.8% · Flat +50");
  });

  it("shows no stat delta for a damage target", () => {
    const { container } = render(CalculatorOptimizerResultStats, { props: props("Attack") });
    expect(container.querySelector("[data-test-optimizer-result-target-delta]")).toBeNull();
  });
});
