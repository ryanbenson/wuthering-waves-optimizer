import { describe, it, expect } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render } from "@testing-library/vue";
import EchoEquippedByOthers from "../../src/components/EchoEquippedByOthers.vue";
import { useInventoryStore } from "../../src/stores/inventory";
import { useCharacterStore } from "../../src/stores/character";

const tooltips: Record<string, string> = {};

function renderOthers(echoId: string | null) {
  return render(EchoEquippedByOthers, {
    props: { echoId },
    global: {
      directives: {
        tooltip: (el: HTMLElement, binding: { value: string }) => {
          tooltips[el.getAttribute("data-test-optimizer-result-echo-equipped-others") ?? ""] = binding.value;
        },
      },
    },
  });
}

function othersEl(container: HTMLElement, echoId: string) {
  return container.querySelector(
    `[data-test-optimizer-result-echo-equipped-others="${echoId}"]`,
  );
}

function setup(active: string, map: Record<string, number>) {
  setActivePinia(createPinia());
  useCharacterStore().activeCharacter = active;
  useInventoryStore().setEquippedData("echo-1", map);
}

describe("EchoEquippedByOthers", () => {
  it("renders nothing when only the active resonator wears the echo", () => {
    setup("Carlotta", { Carlotta: 0 });
    const { container } = renderOthers("echo-1");
    expect(othersEl(container, "echo-1")).toBeNull();
  });

  it("renders nothing when nobody wears the echo", () => {
    setActivePinia(createPinia());
    useCharacterStore().activeCharacter = "Carlotta";
    const { container } = renderOthers("echo-1");
    expect(othersEl(container, "echo-1")).toBeNull();
  });

  it("names the one other resonator", () => {
    setup("Carlotta", { Carlotta: 0, Zani: 1 });
    const { container } = renderOthers("echo-1");
    const el = othersEl(container, "echo-1");
    expect(el?.textContent?.trim()).toBe("Also on Zani");
    expect(el?.querySelectorAll("img")).toHaveLength(1);
    expect(tooltips["echo-1"]).toBe(
      "Also equipped on Zani. Equipping this loadout keeps it on them too.",
    );
  });

  it("shows the first name plus a count, up to three portraits, and everyone in the tooltip", () => {
    setup("Carlotta", { Zani: 0, Phoebe: 1, Shorekeeper: 2, Jinhsi: 3 });
    const { container } = renderOthers("echo-1");
    const el = othersEl(container, "echo-1");
    expect(el?.textContent?.trim()).toBe("Also on Zani +3");
    expect(el?.querySelectorAll("img")).toHaveLength(3);
    expect(tooltips["echo-1"]).toBe(
      "Also equipped on Zani, Phoebe, Shorekeeper and Jinhsi. Equipping this loadout keeps it on them too.",
    );
  });
});
