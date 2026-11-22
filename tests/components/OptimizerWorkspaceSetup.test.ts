import { describe, it, expect, beforeEach } from "vitest";
import { nextTick } from "vue";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import OptimizerWorkspaceSetup from "../../src/components/optimizerWorkspace/OptimizerWorkspaceSetup.vue";
import { useCharacterStore } from "../../src/stores/character";

const stubs = {
  OptimizerWorkspaceRunBar: true,
  OptimizerWorkspaceTarget: true,
  CalculatorOptimizerMinStats: true,
  CalculatorOptimizerSettings: true,
  CalculatorOptimizerEchoSet: true,
  CalculatorOptimizerMainEcho: true,
};

async function renderSetup() {
  const view = render(OptimizerWorkspaceSetup, {
    props: { character: "Carlotta", suggestedEchoSets: ["FrostyResolve"] },
    global: { stubs, directives: { tooltip: {} } },
  });
  await nextTick(); // the setup renders once onMounted has read the saved settings
  return view;
}

const eligibleRow = (container: Element) =>
  container.querySelector("[data-test-optimizer-workspace-echo-sets]") as HTMLElement;
const eligibleSet = (container: Element, set: string) =>
  eligibleRow(container).querySelector(`[data-test-echo-set-toggle="${set}"]`) as HTMLElement;
const savedOptimizer = () => useCharacterStore().characters.Carlotta?.optimizer ?? {};

describe("OptimizerWorkspaceSetup eligible echo sets", () => {
  beforeEach(() => {
    // jsdom has no <dialog> methods; picking a main echo closes the picker.
    HTMLDialogElement.prototype.close = function () {};
    setActivePinia(createPinia());
    useCharacterStore().setCharacterData("Carlotta", { optimizer: { damageType: "Average" } });
  });

  it("uses the recommended sets while none are saved, without saving them", async () => {
    const { container } = await renderSetup();
    expect(eligibleSet(container, "FrostyResolve").getAttribute("aria-pressed")).toBe("true");

    // Another setting changes, so the setup saves: the sets stay unsaved.
    const pick = container.querySelector("[data-test-optimizer-workspace-pick-echo]") as HTMLElement;
    await fireEvent.click(pick);
    expect(savedOptimizer().mainEchoes).toEqual([pick.getAttribute("data-test-optimizer-workspace-pick-echo")]);
    expect(savedOptimizer().echoSets).toBeUndefined();
  });

  it("keeps a saved choice over the recommended sets", async () => {
    useCharacterStore().setCharacterData("Carlotta", { optimizer: { echoSets: ["MoltenRift"] } });
    const { container } = await renderSetup();
    expect(eligibleSet(container, "MoltenRift").getAttribute("aria-pressed")).toBe("true");
    expect(eligibleSet(container, "FrostyResolve").getAttribute("aria-pressed")).toBe("false");
  });

  it("saves the player's own picks, including dropping a set", async () => {
    useCharacterStore().setCharacterData("Carlotta", {
      optimizer: { echoSets: ["FrostyResolve", "MoltenRift"] },
    });
    const { container } = await renderSetup();
    await fireEvent.click(eligibleSet(container, "FrostyResolve"));
    expect(savedOptimizer().echoSets).toEqual(["MoltenRift"]);
  });
});
