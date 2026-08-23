import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import InventoryEchoesBrowser from "../../src/components/InventoryEchoesBrowser.vue";
import { createEmptyEchoSlot } from "../../src/echoes/echoLoadout";
import { useInventoryStore } from "../../src/stores/inventory";

const ELITE_ECHO = "AbyssalGladius";
const COMMON_ECHO = "AeroDrake";

const FULL_SUB_STATS = {
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
};

function makeInventoryEcho(
  echoId: string,
  echo: string,
  type: number,
  stat: string | null,
  overrides: Record<string, unknown> = {},
) {
  return {
    ...createEmptyEchoSlot(echoId),
    echo,
    type,
    rank: 5,
    stat,
    echoSet: "MidnightVeil",
    ...overrides,
  };
}

function makeCompleteInventoryEcho(
  echoId: string,
  echo: string,
  type: number,
  stat: string,
) {
  return makeInventoryEcho(echoId, echo, type, stat, FULL_SUB_STATS);
}

function renderBrowser(stubs: Record<string, unknown> = {}) {
  return render(InventoryEchoesBrowser, {
    global: {
      stubs: {
        InventoryEchoEdit: true,
        CalculatorEchoImporter: true,
        EchoCvRvRangeFilters: true,
        EchoLockTrashActions: true,
        EchoOptimizerVisibilityIcon: true,
        AppRichSelect: true,
        PaginationControls: true,
        CalculatorEchoCard: {
          props: ["echoId"],
          template: `<div data-test-card :data-echo-id="echoId"><slot /></div>`,
        },
        ...stubs,
      },
      directives: { tooltip: () => {} },
    },
  });
}

describe("InventoryEchoesBrowser incomplete echoes filter", () => {
  let inventoryStore: ReturnType<typeof useInventoryStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    inventoryStore = useInventoryStore();
    inventoryStore.echoes = [
      makeCompleteInventoryEcho("complete-1", ELITE_ECHO, 3, "EnergyRegen"),
      makeInventoryEcho("incomplete-1", COMMON_ECHO, 1, "none"),
      makeInventoryEcho("incomplete-2", COMMON_ECHO, 1, null),
    ];
  });

  it("badges the incomplete filter button with the incomplete echo count", () => {
    const { getByText } = renderBrowser();
    const button = getByText("Incomplete echoes").closest("button");
    expect(button).not.toBeNull();
    expect(button?.textContent).toContain("2");
  });

  it("filters the list down to only incomplete echoes when toggled on", async () => {
    const { getByText, container } = renderBrowser();
    expect(container.querySelectorAll("[data-test-card]").length).toBe(3);

    const button = getByText("Incomplete echoes").closest("button")!;
    await fireEvent.click(button);

    const cards = container.querySelectorAll("[data-test-card]");
    expect(cards.length).toBe(2);
    const ids = Array.from(cards).map((el) => el.getAttribute("data-echo-id"));
    expect(ids.sort()).toEqual(["incomplete-1", "incomplete-2"]);
  });

  it("treats an echo missing its set or a substat as incomplete", async () => {
    inventoryStore.echoes = [
      makeCompleteInventoryEcho("complete-1", ELITE_ECHO, 3, "EnergyRegen"),
      makeInventoryEcho("no-set", ELITE_ECHO, 3, "EnergyRegen", {
        ...FULL_SUB_STATS,
        echoSet: null,
      }),
      makeInventoryEcho("missing-substat", ELITE_ECHO, 3, "EnergyRegen", {
        ...FULL_SUB_STATS,
        echoSubStatsType5: "none",
      }),
    ];

    const { getByText, container } = renderBrowser();
    const button = getByText("Incomplete echoes").closest("button");
    expect(button?.textContent).toContain("2");

    await fireEvent.click(button!);
    const ids = Array.from(container.querySelectorAll("[data-test-card]")).map(
      (el) => el.getAttribute("data-echo-id"),
    );
    expect(ids.sort()).toEqual(["missing-substat", "no-set"]);
  });
});

describe("InventoryEchoesBrowser rating filter", () => {
  let inventoryStore: ReturnType<typeof useInventoryStore>;

  const PERFECT_ROLL_STATS = {
    echoSubStatsType1: "CritRate",
    echoSubStatsValue1: 10.5,
    echoSubStatsType2: "CritDMG",
    echoSubStatsValue2: 21,
    echoSubStatsType3: "ATK",
    echoSubStatsValue3: 11.6,
    echoSubStatsType4: "HP",
    echoSubStatsValue4: 11.6,
    echoSubStatsType5: "DEF",
    echoSubStatsValue5: 14.7,
  };
  const WORST_ROLL_STATS = {
    echoSubStatsType1: "CritRate",
    echoSubStatsValue1: 6.3,
    echoSubStatsType2: "CritDMG",
    echoSubStatsValue2: 12.6,
    echoSubStatsType3: "ATK",
    echoSubStatsValue3: 6.4,
    echoSubStatsType4: "HP",
    echoSubStatsValue4: 6.4,
    echoSubStatsType5: "DEF",
    echoSubStatsValue5: 8.1,
  };

  beforeEach(() => {
    setActivePinia(createPinia());
    inventoryStore = useInventoryStore();
    inventoryStore.echoes = [
      makeInventoryEcho("perfect-roll", ELITE_ECHO, 3, "EnergyRegen", PERFECT_ROLL_STATS),
      makeInventoryEcho("worst-roll", ELITE_ECHO, 3, "EnergyRegen", WORST_ROLL_STATS),
    ];
  });

  it("excludes an SSS-grade echo when the max is dragged below its rating", async () => {
    // Don't stub EchoRatingRangeFilters/RangeMinMax here — we need the real
    // range inputs to drive the filter.
    const { container } = renderBrowser({ EchoRatingRangeFilters: false });
    expect(container.querySelectorAll("[data-test-card]").length).toBe(2);

    const maxInput = container.querySelector<HTMLInputElement>(
      "#echo-rating-filter-max",
    );
    expect(maxInput).not.toBeNull();
    maxInput!.value = "20";
    await fireEvent.input(maxInput!);

    const ids = Array.from(container.querySelectorAll("[data-test-card]")).map(
      (el) => el.getAttribute("data-echo-id"),
    );
    expect(ids).toEqual(["worst-roll"]);
  });
});
