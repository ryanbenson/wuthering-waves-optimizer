import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import EchoEditFields from "../../src/components/EchoEditFields.vue";
import { useCharacterStore } from "../../src/stores/character";
import { useInventoryStore } from "../../src/stores/inventory";
import type { EchoEditTarget } from "../../src/composables/useEchoEditFields";

const CHARACTER = "TestChar";

function setInlineEcho(overrides: Record<string, unknown> = {}) {
  const characterStore = useCharacterStore() as any;
  characterStore.setCharacterData(CHARACTER, {
    echoes: {
      0: {
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

function renderFields(target: EchoEditTarget = { context: "build", character: CHARACTER, index: 0 }) {
  return render(EchoEditFields, {
    props: { target },
    global: {
      stubs: { AppRichSelect: true },
      directives: { tooltip: () => {} },
    },
  });
}

describe("EchoEditFields", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("selecting a rank writes through to the character's echo slot", async () => {
    setInlineEcho();
    const characterStore = useCharacterStore() as any;
    const { container } = renderFields();

    const rank4Btn = container.querySelector('[data-test-echo-edit-rank="4"]') as HTMLElement;
    await fireEvent.click(rank4Btn);

    expect(String(characterStore.characters[CHARACTER].echoes[0].rank)).toBe("4");
  });

  it("reveals the substat slider only for a filled slot, not an empty one", () => {
    setInlineEcho(); // slot 0 filled with CritRate, slots 1-4 empty
    const { container } = renderFields();

    expect(container.querySelector('[data-test-echo-edit-slot-value="0"]')).not.toBeNull();
    expect(container.querySelector('[data-test-echo-edit-slot-value="1"]')).toBeNull();
  });

  it("disables rank, main stat, and substat controls, and shows a notice, when the echo is locked", () => {
    setInlineEcho({ echoId: "e1" });
    const inventoryStore = useInventoryStore() as any;
    inventoryStore.saveEcho({ echoId: "e1", locked: true });
    const characterStore = useCharacterStore() as any;
    characterStore.setCharacterData(CHARACTER, { echoes: { 0: { echoId: "e1" } } });

    const { container, getByText } = renderFields();

    expect(container.querySelector('[data-test-echo-edit-locked-notice]')).not.toBeNull();
    getByText("This echo is locked — unlock it to change its stats.");

    const rank4Btn = container.querySelector('[data-test-echo-edit-rank="4"]') as HTMLButtonElement;
    expect(rank4Btn.disabled).toBe(true);

    const mainStat = container.querySelector('[data-test="echo-edit-main-stat"]');
    expect(mainStat?.getAttribute("disabled")).not.toBeNull();
  });

  it("does not disable controls or show the locked notice for an unlocked echo", () => {
    setInlineEcho();
    const { container } = renderFields();

    expect(container.querySelector('[data-test-echo-edit-locked-notice]')).toBeNull();
    const rank4Btn = container.querySelector('[data-test-echo-edit-rank="4"]') as HTMLButtonElement;
    expect(rank4Btn.disabled).toBe(false);
  });

  it("renders without the scroll wrapper when scrollable=false, for inline hosts", () => {
    setInlineEcho();
    const { container } = render(EchoEditFields, {
      props: { target: { context: "build", character: CHARACTER, index: 0 }, scrollable: false },
      global: { stubs: { AppRichSelect: true }, directives: { tooltip: () => {} } },
    });
    expect(container.querySelector(".overflow-y-auto")).toBeNull();
  });
});
