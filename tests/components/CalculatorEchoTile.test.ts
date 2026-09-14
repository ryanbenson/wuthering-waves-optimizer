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

function renderTile(index = 0, isExpanded = false) {
  return render(CalculatorEchoTile, {
    props: { character: CHARACTER, index, isExpanded },
    global: {
      stubs: { AppRichSelect: true },
      directives: { tooltip: () => {} },
    },
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

  it("labels the Save button 'Save' and leaves it enabled for an empty slot", () => {
    const { container } = renderTile(0);
    const saveBtn = container.querySelector('[data-test-echo-item-save="0"]') as HTMLButtonElement;
    expect(saveBtn.disabled).toBe(false);
    expect(saveBtn.textContent).toContain("Save");
    expect(saveBtn.textContent).not.toContain("Saved");
  });

  it("labels the Save button 'Save' (active/primary) for inline (not-yet-saved) echo data", () => {
    setInlineEcho(0); // no echoId — live character-inline data only
    const { container } = renderTile(0);
    const saveBtn = container.querySelector('[data-test-echo-item-save="0"]') as HTMLButtonElement;
    expect(saveBtn.disabled).toBe(false);
    expect(saveBtn.className).toContain("btn-primary");
    expect(saveBtn.textContent).toContain("Save");
    expect(saveBtn.textContent).not.toContain("Saved");
  });

  it("relabels the Save button 'Saved' and disables it once the echo is a real inventory record", () => {
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
    const saveBtn = container.querySelector('[data-test-echo-item-save="0"]') as HTMLButtonElement;
    expect(saveBtn.disabled).toBe(true);
    expect(saveBtn.className).toContain("btn-ghost");
    expect(saveBtn.textContent).toContain("Saved");
  });

  it("shows the same Save button, in the same states, in the expanded (edit-mode) footer", () => {
    const inventoryStore = useInventoryStore() as any;
    const characterStore = useCharacterStore() as any;
    inventoryStore.saveEcho({ echoId: "e1", echo: "AeroDrake", type: 1, rank: 5, stat: "CritRate" });
    characterStore.setCharacterData(CHARACTER, { echoes: { 0: { echoId: "e1" } } });

    const { container } = renderTile(0, true);
    const saveBtn = container.querySelector('.btn[disabled]') as HTMLButtonElement;
    expect(saveBtn).not.toBeNull();
    expect(saveBtn.textContent).toContain("Saved");
    expect(container.textContent).toContain("Changes save automatically");
  });
});

describe("CalculatorEchoTile locked substats notice", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("shows a visible 'Substats locked' notice on a collapsed, locked tile", () => {
    const inventoryStore = useInventoryStore() as any;
    const characterStore = useCharacterStore() as any;
    inventoryStore.saveEcho({ echoId: "e1", echo: "AeroDrake", type: 1, rank: 5, stat: "CritRate", locked: true });
    characterStore.setCharacterData(CHARACTER, { echoes: { 0: { echoId: "e1" } } });

    const { container, getByText } = renderTile(0, false);
    expect(container.querySelector("[data-test-echo-item-locked-notice]")).not.toBeNull();
    getByText("Substats locked — unlock to edit");
  });

  it("shows no locked notice on an unlocked tile", () => {
    setInlineEcho(0);
    const { container } = renderTile(0, false);
    expect(container.querySelector("[data-test-echo-item-locked-notice]")).toBeNull();
  });
});

describe("CalculatorEchoTile inline expand-in-place editing", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // jsdom doesn't implement <dialog>.showModal()/.close() — EchoPickerDialog
    // is always mounted as a sibling of the tile regardless of expanded state.
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
    };
  });

  it("collapsed: shows the summary view, not the field editor", () => {
    setInlineEcho(0);
    const { container } = renderTile(0, false);
    expect(container.querySelector('[data-test-echo-edit-rank="4"]')).toBeNull();
    expect(container.querySelector('[data-test-echo-item-substat="0"]')).not.toBeNull();
  });

  it("expanded: shows the field editor (rank buttons, substat slots) instead of the summary view", () => {
    setInlineEcho(0);
    const { container } = renderTile(0, true);
    expect(container.querySelector('[data-test-echo-edit-rank="4"]')).not.toBeNull();
    expect(container.querySelector('[data-test-echo-item-substat="0"]')).toBeNull();
  });

  it("clicking Edit on a collapsed tile emits toggle-edit with this tile's index", async () => {
    setInlineEcho(1);
    const { container, emitted } = renderTile(1, false);
    const editBtn = container.querySelector('[data-test-echo-item-edit="1"]') as HTMLElement;
    await fireEvent.click(editBtn);
    expect(emitted("toggle-edit")?.[0]).toEqual([1]);
  });

  it("clicking anywhere on a collapsed tile also emits toggle-edit (whole-card affordance)", async () => {
    setInlineEcho(0);
    const { container, emitted } = renderTile(0, false);
    await fireEvent.click(container.querySelector(".echo__tile") as HTMLElement);
    expect(emitted("toggle-edit")?.[0]).toEqual([0]);
  });

  it("pressing Enter on a collapsed tile emits toggle-edit (keyboard parity with the old button root)", async () => {
    setInlineEcho(0);
    const { container, emitted } = renderTile(0, false);
    await fireEvent.keyDown(container.querySelector(".echo__tile") as HTMLElement, { key: "Enter" });
    expect(emitted("toggle-edit")?.[0]).toEqual([0]);
  });

  it("clicking the collapse button on an expanded tile emits toggle-edit", async () => {
    setInlineEcho(0);
    const { container, emitted } = renderTile(0, true);
    const collapseBtn = container.querySelector("[data-test-echo-item-collapse]") as HTMLElement;
    await fireEvent.click(collapseBtn);
    expect(emitted("toggle-edit")?.[0]).toEqual([0]);
  });

  it("clicking inside the expanded editor does not also emit toggle-edit (no accidental double-collapse)", async () => {
    setInlineEcho(0);
    const { container, emitted } = renderTile(0, true);
    // Clicking the tile's own background while expanded must not toggle —
    // only the explicit collapse button does.
    await fireEvent.click(container.querySelector(".echo__tile") as HTMLElement);
    expect(emitted("toggle-edit")).toBeUndefined();
  });

  it("editing inline still writes through to the character store, same as the old docked panel did", async () => {
    setInlineEcho(0);
    const characterStore = useCharacterStore() as any;
    const { container } = renderTile(0, true);

    const rank4Btn = container.querySelector('[data-test-echo-edit-rank="4"]') as HTMLElement;
    await fireEvent.click(rank4Btn);

    expect(String(characterStore.characters[CHARACTER].echoes[0].rank)).toBe("4");
  });
});
