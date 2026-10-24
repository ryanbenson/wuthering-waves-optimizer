import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import CalculatorOptimizerResultStats from "../../src/components/CalculatorOptimizerResultStats.vue";

const finalStats = {
  totalHp: 14860.7,
  totalAtk: 2436,
  totalDef: 1404,
  totalCritRate: 0.843,
  totalCritDMG: 2.714,
  energyRegen: 1.208,
  basicAttackDMGBonus: 8.6,
  heavyAttackDMGBonus: 10.1,
  resonanceSkillDMGBonus: 0,
  resonanceLiberationDMGBonus: 39.4,
  glacio: 92,
  healingBonus: 0,
};

function renderStats(currentStats?: Record<string, number>) {
  return render(CalculatorOptimizerResultStats, {
    props: { finalStats, characterElement: "Glacio", targetValue: "", currentStats },
  });
}

describe("CalculatorOptimizerResultStats", () => {
  it("shows each stat as VALUE (+/-DELTA) in the stat's own unit", () => {
    const { container } = renderStats({
      ...finalStats,
      totalHp: 15362.2, // displayed 14,860 vs 15,362
      totalCritRate: 0.843,
      energyRegen: 1.308,
      glacio: 89,
    });
    const row = (cls: string) => container.querySelector(`.${cls}`)!.textContent!.replace(/\s+/g, " ");

    expect(row("stat-hp")).toContain("14,860 (-502)");
    expect(row("stat-er")).toContain("120.8% (-10.0%)");
    expect(row("stat-glacio")).toContain("92.0% (+3.0%)");
    expect(row("stat-cr")).toContain("84.3% (+0.0%)");
    expect(container.querySelector(".stat-er [data-test-optimizer-result-stat-delta]")!.className).toContain("text-error");
    expect(container.querySelector(".stat-glacio [data-test-optimizer-result-stat-delta]")!.className).toContain("text-success");
  });

  it("shows no delta when the current build's stats are not given", () => {
    const { container } = renderStats();
    expect(container.querySelectorAll("[data-test-optimizer-result-stat-delta]").length).toBe(0);
    expect(container.querySelector(".stat-liberation")!.textContent).toContain("39.4%");
  });
});
