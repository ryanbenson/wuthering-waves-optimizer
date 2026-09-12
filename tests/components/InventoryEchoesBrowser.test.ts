import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import InventoryEchoesBrowser from "../../src/components/InventoryEchoesBrowser.vue";
import { createEmptyEchoSlot } from "../../src/echoes/echoLoadout";
import { useInventoryStore } from "../../src/stores/inventory";
import { useConfirm } from "../../src/composables/useConfirm";

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

describe("InventoryEchoesBrowser substat filter", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const inventoryStore = useInventoryStore();
    inventoryStore.echoes = [
      makeInventoryEcho("has-crit-rate", ELITE_ECHO, 3, "EnergyRegen", {
        echoSubStatsType1: "CritRate",
        echoSubStatsValue1: 7.5,
        echoSubStatsType2: "ATK",
        echoSubStatsValue2: 9.4,
      }),
      makeInventoryEcho("has-crit-dmg", ELITE_ECHO, 3, "EnergyRegen", {
        echoSubStatsType1: "CritDMG",
        echoSubStatsValue1: 16.2,
        echoSubStatsType2: "ATK",
        echoSubStatsValue2: 9.4,
      }),
      makeInventoryEcho("has-neither", ELITE_ECHO, 3, "EnergyRegen", {
        echoSubStatsType1: "HP",
        echoSubStatsValue1: 8,
        echoSubStatsType2: "DEF",
        echoSubStatsValue2: 8,
      }),
    ];
  });

  // Several AppRichSelect instances share the same option values (e.g.
  // "CritRate" is both a substat and a possible main stat), so option
  // lookups must be scoped to the substat filter's own dropdown root rather
  // than the whole container.
  async function openSubstatFilter(container: HTMLElement) {
    const trigger = container.querySelector<HTMLElement>(
      '[aria-label="Substat filter"]',
    )!;
    await fireEvent.click(trigger);
    return trigger.closest<HTMLElement>(".app-rich-select")!;
  }

  it("filters the list down to echoes carrying the selected substat", async () => {
    const { container } = renderBrowser({ AppRichSelect: false });
    expect(container.querySelectorAll("[data-test-card]").length).toBe(3);

    const substatRoot = await openSubstatFilter(container);
    const option = substatRoot.querySelector<HTMLElement>(
      '[data-test-rich-select-option="CritRate"]',
    )!;
    await fireEvent.click(option);

    const ids = Array.from(container.querySelectorAll("[data-test-card]")).map(
      (el) => el.getAttribute("data-echo-id"),
    );
    expect(ids).toEqual(["has-crit-rate"]);
  });

  it("matches ANY selected substat when more than one is chosen", async () => {
    const { container } = renderBrowser({ AppRichSelect: false });

    const substatRoot = await openSubstatFilter(container);
    await fireEvent.click(
      substatRoot.querySelector('[data-test-rich-select-option="CritRate"]')!,
    );
    await fireEvent.click(
      substatRoot.querySelector('[data-test-rich-select-option="CritDMG"]')!,
    );

    const ids = Array.from(container.querySelectorAll("[data-test-card]"))
      .map((el) => el.getAttribute("data-echo-id"))
      .sort();
    expect(ids).toEqual(["has-crit-dmg", "has-crit-rate"]);
  });

  it("resets the substat filter when Clear all is clicked", async () => {
    const { container, getByText } = renderBrowser({ AppRichSelect: false });

    const substatRoot = await openSubstatFilter(container);
    await fireEvent.click(
      substatRoot.querySelector('[data-test-rich-select-option="CritRate"]')!,
    );
    expect(container.querySelectorAll("[data-test-card]").length).toBe(1);

    const clearButton = getByText("Clear all").closest("button")!;
    await fireEvent.click(clearButton);

    expect(container.querySelectorAll("[data-test-card]").length).toBe(3);
  });
});

describe("InventoryEchoesBrowser bulk delete confirmation", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const inventoryStore = useInventoryStore();
    inventoryStore.echoes = [
      makeCompleteInventoryEcho("deletable-1", ELITE_ECHO, 3, "EnergyRegen"),
      makeCompleteInventoryEcho("deletable-2", COMMON_ECHO, 1, "ATK"),
      makeInventoryEcho("locked-1", ELITE_ECHO, 4, "CritRate", {
        ...FULL_SUB_STATS,
        locked: true,
      }),
    ];
  });

  it("lists the deletable echoes by name in the confirm dialog, skipping locked ones", async () => {
    const { container, getByText } = renderBrowser();

    for (const id of ["deletable-1", "deletable-2", "locked-1"]) {
      const checkbox = container.querySelector<HTMLInputElement>(
        `[data-test-echo-select="${id}"]`,
      )!;
      await fireEvent.click(checkbox);
    }

    const deleteButton = getByText("Delete", { selector: "[data-test-bulk-delete]" });
    await fireEvent.click(deleteButton);

    const { confirmRequest } = useConfirm();
    expect(confirmRequest.value?.items).toBeDefined();
    expect(confirmRequest.value?.items?.length).toBe(2);
    expect(confirmRequest.value?.items?.join(" | ")).toContain("Cost");
    expect(confirmRequest.value?.message).toContain("1 locked echo");
  });
});
