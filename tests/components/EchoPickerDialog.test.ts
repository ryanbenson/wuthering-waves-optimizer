import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import EchoPickerDialog from "../../src/components/EchoPickerDialog.vue";
import { useCharacterStore } from "../../src/stores/character";
import type { EchoEditTarget } from "../../src/composables/useEchoEditFields";

const CHARACTER = "TestChar";

// A tiny host mirrors how real parents (CalculatorEchoEditPanel.vue) drive
// this dialog: a template ref calling the exposed openPicker/closePicker.
function renderWithHost(target: EchoEditTarget) {
  return render({
    components: { EchoPickerDialog },
    data() {
      return { target };
    },
    template: `
      <button @click="$refs.picker.openPicker()">open</button>
      <EchoPickerDialog ref="picker" :target="target" />
    `,
  });
}

describe("EchoPickerDialog", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // jsdom doesn't implement <dialog>.showModal()/.close().
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
    };
  });

  it("lists echoes once opened", async () => {
    const { getByText, container } = renderWithHost({ context: "build", character: CHARACTER, index: 0 });
    await fireEvent.click(getByText("open"));

    expect(container.querySelector(".modal-box")).not.toBeNull();
    getByText("Aero Drake");
  });

  it("search narrows the list to matching echo names", async () => {
    const { getByText, container } = renderWithHost({ context: "build", character: CHARACTER, index: 0 });
    await fireEvent.click(getByText("open"));

    const search = container.querySelector("[data-test-echo-picker-search]") as HTMLInputElement;
    await fireEvent.update(search, "Aero Drake");

    expect(container.querySelectorAll("[data-test-echo-picker-option]").length).toBe(1);
    getByText("Aero Drake");
  });

  it("cost filter narrows the list to that cost tier", async () => {
    const { getByText, container } = renderWithHost({ context: "build", character: CHARACTER, index: 0 });
    await fireEvent.click(getByText("open"));

    // Common-class echoes (Aero Drake included) cost 1.
    const costOneBtn = container.querySelector('[data-test-echo-picker-cost="1"]') as HTMLElement;
    await fireEvent.click(costOneBtn);

    expect(container.querySelector('[data-test-echo-picker-option="AeroDrake"]')).not.toBeNull();
    expect(container.querySelector('[data-test-echo-picker-option="BellBorneGeochelone"]')).toBeNull();
  });

  it("choosing an echo writes it through to the target and closes the dialog", async () => {
    const characterStore = useCharacterStore() as any;
    characterStore.setCharacterData(CHARACTER, { echoes: { 0: {} } });
    const { getByText, container } = renderWithHost({ context: "build", character: CHARACTER, index: 0 });
    await fireEvent.click(getByText("open"));

    const option = container.querySelector('[data-test-echo-picker-option="AeroDrake"]') as HTMLElement;
    await fireEvent.click(option);

    expect(characterStore.characters[CHARACTER].echoes[0].echo).toBe("AeroDrake");
    expect(container.querySelector(".modal-box")).toBeNull();
  });

  it("does not assign an echo when the current slot is locked", async () => {
    const characterStore = useCharacterStore() as any;
    characterStore.setCharacterData(CHARACTER, { echoes: { 0: { echoId: "e1" } } });
    const { useInventoryStore } = await import("../../src/stores/inventory");
    (useInventoryStore() as any).saveEcho({ echoId: "e1", locked: true });

    const { getByText, container } = renderWithHost({ context: "build", character: CHARACTER, index: 0 });
    await fireEvent.click(getByText("open"));

    const option = container.querySelector('[data-test-echo-picker-option="AeroDrake"]') as HTMLElement;
    await fireEvent.click(option);

    expect(characterStore.characters[CHARACTER].echoes[0].echo).toBeUndefined();
  });
});
