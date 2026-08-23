import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import EchoRatingWeightsEditor from "../../src/components/EchoRatingWeightsEditor.vue";
import { useSettingsStore } from "../../src/stores/settings";
import { useCharacterStore } from "../../src/stores/character";

function critRateInput(container: HTMLElement) {
  return container.querySelector<HTMLInputElement>("#echo-rating-weight-CritRate");
}

describe("EchoRatingWeightsEditor", () => {
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

  it("defaults to global mode, editing the settings store's echoRatingWeights", async () => {
    const settingsStore = useSettingsStore();
    const { container } = render(EchoRatingWeightsEditor);

    const input = critRateInput(container);
    expect(input).not.toBeNull();
    input!.value = "8"; // WEIGHT_VALUES[8] === 4
    await fireEvent.input(input!);

    expect(settingsStore.echoRatingWeights.CritRate).toBe(4);
  });

  it("resetEchoRatingWeights clears a customized global weight", async () => {
    const settingsStore = useSettingsStore();
    settingsStore.setEchoRatingWeights({ CritRate: 4 });
    const { getByText } = render(EchoRatingWeightsEditor);

    await fireEvent.click(getByText("Reset to Default"));

    expect(settingsStore.echoRatingWeights.CritRate).toBe(1);
  });

  it("in character mode, edits that character's substatWeights instead of the global profile", async () => {
    const characterStore = useCharacterStore();
    characterStore.setCharacterData("Carlotta", {});

    // Mirrors how real parent components (CalculatorEchoes.vue,
    // InventoryEchoesBrowser.vue) drive this modal: a template ref calling
    // the exposed triggerOpenModal.
    const { getByText, container } = render({
      components: { EchoRatingWeightsEditor },
      template: `
        <button @click="$refs.editor.triggerOpenModal({ mode: 'character', characterId: 'Carlotta' })">
          open
        </button>
        <EchoRatingWeightsEditor ref="editor" />
      `,
    });

    await fireEvent.click(getByText("open"));

    const input = critRateInput(container);
    expect(input).not.toBeNull();
    input!.value = "8";
    await fireEvent.input(input!);

    expect(characterStore.getCharacterSubstatWeights("Carlotta").CritRate).toBe(4);
    expect(useSettingsStore().echoRatingWeights.CritRate).toBe(1); // global untouched
  });
});
