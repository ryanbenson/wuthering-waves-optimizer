import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import CalculatorEchoTile from "../../src/components/CalculatorEchoTile.vue";
import { useCharacterStore } from "../../src/stores/character";
import { useInventoryStore } from "../../src/stores/inventory";

const CHARACTER = "TestChar";

function setInlineEcho(index: number, overrides: Record<string, unknown> = {}) {
  const characterStore = useCharacterStore() as any;
  characterStore.setCharacterData(CHARACTER, {
    echoes: {
      [index]: {
        echo: "AeroDrake",
        echoSet: "MoltenRift",
        type: 1,
        rank: "5",
        stat: "CritRate",
        echoSubStatsType1: "CritRate",
        echoSubStatsValue1: 7.5,
        ...overrides,
      },
    },
  });
}

function renderTile(index = 0) {
  return render(CalculatorEchoTile, {
    props: { character: CHARACTER, index },
    global: { directives: { tooltip: () => {} } },
  });
}

describe("CalculatorEchoTile action buttons", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders Reset/Save/Browse as always-visible buttons, not hidden behind a menu", () => {
    setInlineEcho(0);
    const { container } = renderTile(0);
    expect(container.querySelector('[data-test-echo-item-reset="0"]')).not.toBeNull();
    expect(container.querySelector('[data-test-echo-item-save="0"]')).not.toBeNull();
    expect(container.querySelector('[data-test-echo-item-browse="0"]')).not.toBeNull();
    // the old "..." overflow trigger for these three actions is gone
    expect(container.querySelector('[data-test-echo-item-menu="0"]')).toBeNull();
  });

  it("clicking Browse emits open-echoes-browser with this tile's index, without opening a menu first", async () => {
    setInlineEcho(2);
    const { container, emitted } = renderTile(2);
    const browseBtn = container.querySelector('[data-test-echo-item-browse="2"]') as HTMLElement;
    await fireEvent.click(browseBtn);
    expect(emitted("open-echoes-browser")?.[0]).toEqual([2]);
  });

  it("clicking Reset clears the character's echo slot and emits on-echo-removed", async () => {
    setInlineEcho(0);
    const characterStore = useCharacterStore() as any;
    const { container, emitted } = renderTile(0);
    const resetBtn = container.querySelector('[data-test-echo-item-reset="0"]') as HTMLElement;
    await fireEvent.click(resetBtn);
    expect(emitted("on-echo-removed")).toBeTruthy();
    expect(characterStore.characters[CHARACTER].echoes[0].echo).toBeFalsy();
  });

  it("clicking Save persists the current echo as a standalone, equipped inventory record", async () => {
    setInlineEcho(0);
    const characterStore = useCharacterStore() as any;
    const inventoryStore = useInventoryStore() as any;
    const { container } = renderTile(0);
    const saveBtn = container.querySelector('[data-test-echo-item-save="0"]') as HTMLElement;
    await fireEvent.click(saveBtn);

    const newEchoId = characterStore.characters[CHARACTER].echoes[0].echoId;
    expect(newEchoId).toBeTruthy();
    const savedEcho = inventoryStore.getEchoById(newEchoId);
    expect(savedEcho?.echo).toBe("AeroDrake");
    expect(savedEcho?.echoSubStatsType1).toBe("CritRate");
    expect(inventoryStore.getEquippedEchoData(newEchoId)?.[CHARACTER]).toBe(0);
  });
});

describe("CalculatorEchoTile saved state", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("shows no saved indicator and a non-disabled Save button for an empty slot", () => {
    const { container } = renderTile(0);
    expect(container.querySelector("[data-test-echo-item-saved-indicator]")).toBeNull();
    const saveBtn = container.querySelector('[data-test-echo-item-save="0"]') as HTMLButtonElement;
    expect(saveBtn.disabled).toBe(false);
  });

  it("shows an active Save button and no saved indicator for inline (not-yet-saved) echo data", () => {
    setInlineEcho(0); // no echoId — live character-inline data only
    const { container } = renderTile(0);
    expect(container.querySelector("[data-test-echo-item-saved-indicator]")).toBeNull();
    const saveBtn = container.querySelector('[data-test-echo-item-save="0"]') as HTMLButtonElement;
    expect(saveBtn.disabled).toBe(false);
    expect(saveBtn.className).toContain("btn-primary");
  });

  it("shows the saved indicator and a disabled Save button once the echo is a real inventory record", () => {
    const inventoryStore = useInventoryStore() as any;
    const characterStore = useCharacterStore() as any;
    inventoryStore.saveEcho({
      echoId: "e1",
      echo: "AeroDrake",
      echoSet: "MoltenRift",
      type: 1,
      rank: 5,
      stat: "CritRate",
      echoSubStatsType1: "CritRate",
      echoSubStatsValue1: 7.5,
    });
    characterStore.setCharacterData(CHARACTER, { echoes: { 0: { echoId: "e1" } } });

    const { container } = renderTile(0);
    expect(container.querySelector("[data-test-echo-item-saved-indicator]")).not.toBeNull();
    const saveBtn = container.querySelector('[data-test-echo-item-save="0"]') as HTMLButtonElement;
    expect(saveBtn.disabled).toBe(true);
    expect(saveBtn.className).toContain("btn-ghost");
  });
});
