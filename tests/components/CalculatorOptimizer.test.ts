import { describe, it, expect, beforeEach } from "vitest";
import { nextTick } from "vue";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import CalculatorOptimizer from "../../src/components/CalculatorOptimizer.vue";
import { useCharacterStore } from "../../src/stores/character";

// The classic optimizer reads and saves its eligible echo sets like the v3 setup
// (tests/components/OptimizerWorkspaceSetup.test.ts).
const stubs = {
  CalculatorOptimizerGuide: true,
  CalculatorOptimizerEchoSet: true,
  CalculatorOptimizerMainEcho: true,
  CalculatorOptimizerMinStats: true,
  CalculatorOptimizerTarget: true,
  CalculatorOptimizerDamageType: true,
  CalculatorOptimizerSettings: true,
  CalculatorOptimizerResults: true,
  OptimizerStaleResultsAlert: true,
};

async function renderOptimizer() {
  const view = render(CalculatorOptimizer, {
    props: { character: "Carlotta", characterElement: "Glacio", suggestedEchoSets: ["FrostyResolve"] },
    global: { stubs, directives: { tooltip: {} } },
  });
  await nextTick(); // renders once onMounted has read the saved settings
  return view;
}

const eligibleSet = (container: Element, set: string) =>
  container.querySelector(
    `[data-test-optimizer-echo-sets] [data-test-echo-set-toggle="${set}"]`,
  ) as HTMLElement;
const savedOptimizer = () => useCharacterStore().characters.Carlotta?.optimizer ?? {};

describe("CalculatorOptimizer (classic) eligible echo sets", () => {
  beforeEach(() => {
    // jsdom has no <dialog> methods; picking a main echo closes the picker.
    HTMLDialogElement.prototype.close = function () {};
    setActivePinia(createPinia());
    useCharacterStore().setCharacterData("Carlotta", { optimizer: { damageType: "Average" } });
  });

  it("uses the recommended sets while none are saved, without saving them", async () => {
    const { container, getAllByText } = await renderOptimizer();
    expect(eligibleSet(container, "FrostyResolve").getAttribute("aria-pressed")).toBe("true");
    expect(container.querySelector("[data-test-echo-set-recommended-only]")).not.toBeNull();

    // Another setting changes, so the optimizer saves: the sets stay unsaved.
    await fireEvent.click(getAllByText("Use echo")[0]!);
    expect(savedOptimizer().mainEchoes).toHaveLength(1);
    expect(savedOptimizer().echoSets).toBeUndefined();
  });

  it("keeps a saved choice over the recommended sets", async () => {
    useCharacterStore().setCharacterData("Carlotta", { optimizer: { echoSets: ["MoltenRift"] } });
    const { container } = await renderOptimizer();
    expect(eligibleSet(container, "MoltenRift").getAttribute("aria-pressed")).toBe("true");
    expect(eligibleSet(container, "FrostyResolve").getAttribute("aria-pressed")).toBe("false");
  });

  it("saves the player's own picks, including dropping a set", async () => {
    useCharacterStore().setCharacterData("Carlotta", {
      optimizer: { echoSets: ["FrostyResolve", "MoltenRift"] },
    });
    const { container } = await renderOptimizer();
    await fireEvent.click(eligibleSet(container, "FrostyResolve"));
    expect(savedOptimizer().echoSets).toEqual(["MoltenRift"]);
  });
});
