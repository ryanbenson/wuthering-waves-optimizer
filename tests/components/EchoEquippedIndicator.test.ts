import { describe, it, expect } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render } from "@testing-library/vue";
import EchoEquippedIndicator from "../../src/components/EchoEquippedIndicator.vue";
import { useInventoryStore } from "../../src/stores/inventory";
import { useCharacterStore } from "../../src/stores/character";

function renderIndicator(echoId: string | null) {
  return render(EchoEquippedIndicator, {
    props: { echoId },
    global: { directives: { tooltip: () => {} } },
  });
}

function equippedEl(container: HTMLElement, echoId: string) {
  return container.querySelector(
    `[data-test-optimizer-result-echo-equipped="${echoId}"]`,
  );
}

describe("EchoEquippedIndicator", () => {
  it("renders nothing when there is no echoId", () => {
    setActivePinia(createPinia());
    const { container } = renderIndicator(null);
    expect(
      container.querySelector("[data-test-optimizer-result-echo-equipped]"),
    ).toBeNull();
  });

  it("renders nothing when there is no active character", () => {
    setActivePinia(createPinia());
    const inventoryStore = useInventoryStore();
    inventoryStore.setEquippedData("echo-1", { Carlotta: 0 });
    const { container } = renderIndicator("echo-1");
    expect(equippedEl(container, "echo-1")).toBeNull();
  });

  it("renders nothing when the echo is not equipped by the active character", () => {
    setActivePinia(createPinia());
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    characterStore.activeCharacter = "Carlotta";
    inventoryStore.setEquippedData("echo-1", { Jinhsi: 0 });
    const { container } = renderIndicator("echo-1");
    expect(equippedEl(container, "echo-1")).toBeNull();
  });

  it("shows the indicator when the echo is equipped by the active character", () => {
    setActivePinia(createPinia());
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    characterStore.activeCharacter = "Carlotta";
    inventoryStore.setEquippedData("echo-1", { Carlotta: 2 });
    const { container } = renderIndicator("echo-1");
    expect(equippedEl(container, "echo-1")).not.toBeNull();
  });

  it("shows the indicator when the echo is equipped by the active character among others", () => {
    setActivePinia(createPinia());
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    characterStore.activeCharacter = "Carlotta";
    inventoryStore.setEquippedData("echo-1", { Jinhsi: 1, Carlotta: 3 });
    const { container } = renderIndicator("echo-1");
    expect(equippedEl(container, "echo-1")).not.toBeNull();
  });
});
