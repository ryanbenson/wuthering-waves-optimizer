import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import OptimizerWorkspaceResultHighlights from "../../src/components/optimizerWorkspace/OptimizerWorkspaceResultHighlights.vue";

function baseProps(overrides: Record<string, unknown> = {}) {
  return {
    finalStats: {
      totalAtk: 3000,
      totalHp: 18000,
      totalDef: 1200,
      totalCritRate: 0.7,
      totalCritDMG: 2.2,
      energyRegen: 1.1,
    },
    totalAtk: 2500,
    totalHp: 20000,
    totalDef: 1000,
    totalCritRate: 0.6,
    totalCritDmg: 2.0,
    energyRegen: 1.0,
    ...overrides,
  };
}

describe("OptimizerWorkspaceResultHighlights", () => {
  it("orders tiles HP, ATK, DEF, Crit Rate, Crit DMG, Energy Regen", () => {
    const { container } = render(OptimizerWorkspaceResultHighlights, {
      props: baseProps(),
    });
    const labels = Array.from(
      container.querySelectorAll("[data-test-optimizer-workspace-result-highlights] > div"),
    ).map((tile) => tile.querySelector(".truncate")?.textContent);
    expect(labels).toEqual([
      "HP",
      "ATK",
      "DEF",
      "Crit Rate",
      "Crit DMG",
      "Energy Regen",
    ]);
  });

  it("shows a positive delta in green when a stat improved", () => {
    const { container } = render(OptimizerWorkspaceResultHighlights, {
      props: baseProps(),
    });
    const highlights = container.querySelector(
      "[data-test-optimizer-workspace-result-highlights]",
    ) as HTMLElement;
    expect(highlights.textContent).toContain("ATK");
    expect(highlights.textContent).toContain("+20.0%");
    expect(container.querySelector(".text-success")).not.toBeNull();
  });

  it("shows a negative delta in red when a stat regressed", () => {
    const { container } = render(OptimizerWorkspaceResultHighlights, {
      props: baseProps(),
    });
    // HP dropped from 20000 -> 18000 in baseProps
    expect(container.querySelector(".text-error")).not.toBeNull();
    expect(container.textContent).toContain("-10.0%");
  });

  it("shows exactly 6 tiles, all with a delta (no elemental DMG tile)", () => {
    const { container } = render(OptimizerWorkspaceResultHighlights, {
      props: baseProps(),
    });
    expect(container.textContent).not.toContain("DMG Bonus");
    const tiles = container.querySelectorAll(
      "[data-test-optimizer-workspace-result-highlights] > div",
    );
    expect(tiles.length).toBe(6);
    const deltaLines = container.querySelectorAll(".text-success, .text-error");
    expect(deltaLines.length).toBe(6);
  });
});
