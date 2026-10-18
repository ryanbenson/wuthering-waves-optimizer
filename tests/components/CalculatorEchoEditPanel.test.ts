import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import CalculatorEchoEditPanel from "../../src/components/CalculatorEchoEditPanel.vue";
import { useCharacterStore } from "../../src/stores/character";
import { useInventoryStore } from "../../src/stores/inventory";

const CHARACTER = "TestChar";

function renderPanel(props: Record<string, unknown>) {
  return render(CalculatorEchoEditPanel, {
    props: { isOpen: true, echoId: null, ...props },
    global: {
      stubs: { AppRichSelect: true, RouterLink: true },
      directives: { tooltip: () => {} },
    },
  });
}

describe("CalculatorEchoEditPanel wiring", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
    };
  });

  it("build context: renders the header and the extracted EchoEditFields body, with a Browse button", () => {
    const characterStore = useCharacterStore() as any;
    characterStore.setCharacterData(CHARACTER, {
      echoes: { 0: { echo: "AeroDrake", type: 1, rank: "5", stat: "CritRate" } },
    });
    const { container, getByText } = renderPanel({ context: "build", character: CHARACTER, index: 0 });

    getByText("Aero Drake");
    expect(container.querySelector("[data-test-echo-edit-browse]")).not.toBeNull();
    expect(container.querySelector('[data-test-echo-edit-rank="4"]')).not.toBeNull();
  });

  it("inventory context: renders the field body but no Browse button", () => {
    const inventoryStore = useInventoryStore() as any;
    inventoryStore.saveEcho({ echoId: "e1", echo: "AeroDrake", type: 1, rank: 5, stat: "CritRate" });
    const { container, getByText } = renderPanel({ context: "inventory", echoId: "e1" });

    getByText("Aero Drake");
    expect(container.querySelector("[data-test-echo-edit-browse]")).toBeNull();
    expect(container.querySelector('[data-test-echo-edit-rank="4"]')).not.toBeNull();
  });

  it("clicking Find opens the extracted EchoPickerDialog", async () => {
    const characterStore = useCharacterStore() as any;
    characterStore.setCharacterData(CHARACTER, { echoes: { 0: {} } });
    const { container, getByText } = renderPanel({ context: "build", character: CHARACTER, index: 0 });

    await fireEvent.click(getByText("Find"));

    expect(container.querySelector(".modal-box")).not.toBeNull();
  });

  it("inventory context: the header's Odds button opens the echo's odds in a dialog", async () => {
    const inventoryStore = useInventoryStore() as any;
    inventoryStore.saveEcho({
      echoId: "e1", echo: "AeroDrake", type: 1, rank: 5, stat: "CritRate",
      echoSubStatsType1: "CritRate", echoSubStatsValue1: 8.1,
    });
    const { container } = renderPanel({ context: "inventory", echoId: "e1" });

    expect(container.querySelector("[data-test-echo-edit-tab]")).toBeNull();
    expect(document.querySelector("[data-test-echo-tune-odds]")).toBeNull();
    await fireEvent.click(container.querySelector("[data-test-echo-edit-odds]")!);

    expect(document.querySelector("[data-test-echo-tune-odds]")).not.toBeNull();
  });

  it("renders nothing when isOpen is false", () => {
    const { container } = renderPanel({ context: "build", character: CHARACTER, index: 0, isOpen: false });
    expect(container.querySelector("[data-test-echo-edit-panel]")).toBeNull();
  });
});
