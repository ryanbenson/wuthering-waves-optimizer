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
    const deltaLines = container.querySelectorAll("[data-test-stat-delta-total] [data-delta-tone]");
    expect(deltaLines.length).toBe(6);
  });

  it("shows an unchanged stat as a neutral 0.0% with no sign (#703)", () => {
    const { container } = render(OptimizerWorkspaceResultHighlights, {
      // DEF unchanged; ATK up by a rounding-error amount.
      props: baseProps({ totalDef: 1200, totalAtk: 2999.99 }),
    });
    const neutral = Array.from(container.querySelectorAll('[data-delta-tone="neutral"]'));
    expect(neutral.map((el) => el.textContent?.trim())).toEqual(["0.0%", "0.0%"]);
    expect(neutral.every((el) => el.classList.contains("opacity-60"))).toBe(true);
    expect(container.textContent).not.toContain("+0.0%");
    expect(container.textContent).not.toContain("-0.0%");
  });

  // Issue #746: under the total, how much the stat itself moves.
  function tile(container: Element, label: string): Element {
    const tiles = Array.from(
      container.querySelectorAll("[data-test-optimizer-workspace-result-highlights] > div"),
    );
    const found = tiles.find((t) => t.querySelector(".truncate")?.textContent === label);
    if (!found) throw new Error(`no ${label} tile`);
    return found;
  }
  function parts(el: Element): string[] {
    return Array.from(el.querySelectorAll("[data-test-stat-delta-part]")).map((p) =>
      Array.from(p.querySelectorAll("span"))
        .map((s) => s.textContent?.trim())
        .join(" "),
    );
  }

  it("shows Crit Rate's change in points under its total change (the issue's numbers)", () => {
    const { container } = render(OptimizerWorkspaceResultHighlights, {
      props: baseProps({
        finalStats: { ...baseProps().finalStats, totalCritRate: 0.721 },
        totalCritRate: 0.802,
      }),
    });
    const cr = tile(container, "Crit Rate");
    expect(cr.querySelector("[data-test-stat-delta-total]")?.textContent).toContain("-10.1%");
    expect(parts(cr)).toEqual(["Stat -8.1%"]);
    expect(parts(tile(container, "Crit DMG"))).toEqual(["Stat +20.0%"]);
    expect(parts(tile(container, "Energy Regen"))).toEqual(["Stat +10.0%"]);
  });

  it("splits HP, ATK and DEF into their % and flat changes", () => {
    const { container } = render(OptimizerWorkspaceResultHighlights, {
      props: baseProps({
        finalStats: {
          ...baseProps().finalStats,
          hpPercent: 20,
          hpFlat: 2580,
          attackPercent: 60.8,
          attackFlat: 400,
          defPercent: 10,
          defFlat: 0,
        },
        currentStatParts: {
          hpPercent: 30.1,
          hpFlat: 2580,
          attackPercent: 60,
          attackFlat: 350,
          defPercent: 21.8,
          defFlat: 0,
        },
      }),
    });
    expect(parts(tile(container, "HP"))).toEqual(["HP% -10.1%", "Flat 0"]);
    expect(parts(tile(container, "ATK"))).toEqual(["ATK% +0.8%", "Flat +50"]);
    expect(parts(tile(container, "DEF"))).toEqual(["DEF% -11.8%", "Flat 0"]);
    const flatZero = tile(container, "HP").querySelectorAll("[data-test-stat-delta-part] [data-delta-tone]")[1];
    expect(flatZero.getAttribute("data-delta-tone")).toBe("neutral");
  });

  it("leaves out the HP/ATK/DEF split when the current build's isn't known", () => {
    const { container } = render(OptimizerWorkspaceResultHighlights, { props: baseProps() });
    expect(tile(container, "ATK").querySelector("[data-test-stat-delta-parts]")).toBeNull();
    expect(tile(container, "ATK").textContent).toContain("+20.0%");
  });
});
