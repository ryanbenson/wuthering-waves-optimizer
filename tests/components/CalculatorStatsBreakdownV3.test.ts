import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import CalculatorStatsBreakdownV3 from "../../src/components/CalculatorStatsBreakdownV3.vue";
import { splitStat, type StatSourceInputs } from "../../src/calculator/statSplit";

function inputs(overrides: Partial<StatSourceInputs> = {}): StatSourceInputs {
  return {
    baseHp: 10000,
    baseAtk: 412,
    baseDef: 1000,
    weaponData: { attack: 588, modifier: null, modifierValue: 0, weaponPassiveStats: { ATK: 0.12 } },
    selfBuffs: {},
    resonanceChains: {},
    echoStats: { ATK: 68, ATK_FLAT: 200 },
    echoSetAdditionalBase: {},
    customBuffs: {},
    teamBuffs: {},
    tuneBreakBoost: { base: 0, selfBuffs: 0, resonanceChains: 0, teamBuffs: 0, echoes: 0 },
    ...overrides,
  };
}

function renderAtk(liveOverrides: Partial<StatSourceInputs>, live: number) {
  const split = splitStat("totalAtk", {
    build: { inputs: inputs(), value: 2000 },
    live: { inputs: inputs(liveOverrides), value: live },
  })!;
  return render(CalculatorStatsBreakdownV3, { props: { stat: "ATK", split } });
}

const text = (container: Element, selector: string) => container.querySelector(selector)?.textContent?.trim();

describe("CalculatorStatsBreakdownV3", () => {
  it("shows build + buffs = live in the header", () => {
    const { container } = renderAtk({ selfBuffs: { ATK: 0.5 }, resonanceChains: { ATK: 0.3 }, teamBuffs: { ATK: 0.7 } }, 3500);
    expect(text(container, "[data-test-stat-split-build]")).toBe("2,000");
    expect(text(container, "[data-test-stat-split-buffs]")).toBe("+1,500");
    expect(text(container, "[data-test-stat-split-live]")).toBe("3,500");
  });

  it("groups sources into build and buffs", () => {
    const { container } = renderAtk({ teamBuffs: { ATK: 0.7 } }, 2700);
    const buildRows = container.querySelector("[data-test-stat-split-build-rows]")!;
    expect(buildRows.textContent).toContain("Character base ATK");
    expect(buildRows.querySelector('[data-test-stat-split-row="echoes"]')?.textContent).toContain("+68.0% · +200");
    const buffRows = container.querySelector("[data-test-stat-split-buff-rows]")!;
    expect(buffRows.querySelectorAll("[data-test-stat-split-row]")).toHaveLength(1);
    expect(buffRows.querySelector('[data-test-stat-split-row="teamBuffs"]')?.textContent).toContain("+70.0%");
  });

  it("says so when nothing is buffing the stat", () => {
    const { container } = renderAtk({}, 2000);
    expect(text(container, "[data-test-stat-split-buffs]")).toBe("+0");
    expect(container.querySelector("[data-test-stat-split-buff-rows]")?.textContent).toContain(
      "Nothing is raising this stat right now.",
    );
  });

  it("renders the formula for ATK", () => {
    const { container } = renderAtk({ teamBuffs: { ATK: 1.5 } }, 3500);
    expect(text(container, "[data-test-stat-split-formula]")?.replace(/\s+/g, " ")).toBe(
      "3,500 = (412 + 588) × (1 + 80.0% + 150.0%) + 200",
    );
  });
});
