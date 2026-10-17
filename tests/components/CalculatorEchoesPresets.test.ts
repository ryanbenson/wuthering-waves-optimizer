import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import CalculatorEchoesPresets from "../../src/components/CalculatorEchoesPresets.vue";
import { useInventoryStore } from "../../src/stores/inventory";
import { useCharacterStore } from "../../src/stores/character";
import { useSettingsStore } from "../../src/stores/settings";

const communityPresets = vi.hoisted(() => ({ list: [] as any[] }));

vi.mock("../../src/characters/characters", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    getCharByName: vi.fn(async () => ({ echoes: communityPresets.list })),
  };
});

const COMMUNITY_PRESET = {
  name: "Healer Baseline",
  description: "",
  author: "Someone",
  data: { echoes: {} },
};
const SAVED_PRESET = {
  presetId: "p1",
  name: "My build",
  echo1Id: null,
  echo2Id: null,
  echo3Id: null,
  echo4Id: null,
  echo5Id: null,
};

// The modal's cards run damage previews; they aren't what's under test here.
const stubs = {
  EchoPresetV3Card: {
    emits: ["apply", "delete"],
    template: `<div data-test-card><button data-test-stub-apply @click="$emit('apply')">apply</button><slot name="aside" /></div>`,
  },
  EchoCustomPreset: true,
};

function renderWithHost(options?: Record<string, unknown>) {
  return render(
    {
      components: { CalculatorEchoesPresets },
      data() {
        return { options, saved: false };
      },
      template: `
        <button @click="$refs.presets.triggerOpenModal(options)">open</button>
        <span v-if="saved">save requested</span>
        <CalculatorEchoesPresets ref="presets" character="TestChar" @save="saved = true" />
      `,
    },
    { global: { stubs } },
  );
}

// v3 uses pressed source buttons, classic uses radio tabs.
function activeTab(container: Element) {
  const active = container.querySelector(
    '[data-test-echo-presets-tab][aria-pressed="true"], [data-test-echo-presets-tab]:checked',
  );
  return active?.getAttribute("data-test-echo-presets-tab");
}

describe("CalculatorEchoesPresets", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    communityPresets.list = [COMMUNITY_PRESET];
    // jsdom doesn't implement <dialog>.showModal()/.close().
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
    };
  });

  it("v3 opens on theorycrafter builds when there are no saved presets", async () => {
    const { getByText, container } = renderWithHost();
    await flushPromises();
    await fireEvent.click(getByText("open"));

    expect(activeTab(container)).toBe("community");
    expect(container.querySelector("[data-test-echo-presets-community-intro]")).not.toBeNull();
  });

  it("v3 opens on my presets when the player has saved presets", async () => {
    useInventoryStore().echoPresets = [SAVED_PRESET] as any;
    const { getByText, container } = renderWithHost();
    await flushPromises();
    await fireEvent.click(getByText("open"));

    expect(activeTab(container)).toBe("mine");
  });

  it("v3 falls back to my presets when the character has no theorycrafter builds", async () => {
    communityPresets.list = [];
    const { getByText, container } = renderWithHost();
    await flushPromises();
    await fireEvent.click(getByText("open"));

    expect(activeTab(container)).toBe("mine");
    expect(container.querySelector("[data-test-echo-presets-mine-empty]")).not.toBeNull();
    expect(container.querySelector("[data-test-echo-presets-browse-community]")).toBeNull();
  });

  it("opens the requested tab and links an empty my-presets tab to theorycrafter builds", async () => {
    const { getByText, container } = renderWithHost({ tab: "mine" });
    await flushPromises();
    await fireEvent.click(getByText("open"));

    expect(activeTab(container)).toBe("mine");
    const browse = container.querySelector("[data-test-echo-presets-browse-community]") as HTMLElement;
    expect(browse.textContent).toContain("See theorycrafter builds");

    await fireEvent.click(browse);
    expect(activeTab(container)).toBe("community");
  });

  it("classic keeps its labels and always opens on my presets", async () => {
    useSettingsStore().addToConfig({ useClassicUi: true });
    const { getByText, container } = renderWithHost();
    await flushPromises();
    await fireEvent.click(getByText("open"));

    expect(activeTab(container)).toBe("mine");
    expect(container.querySelector('[aria-label="Other Presets"]')).not.toBeNull();
    getByText("No echo presets available");
  });

  it("v3 shows the current echoes and offers to save an unsaved build", async () => {
    useCharacterStore().setCharacterData("TestChar", { echoes: { 0: { echo: "SomeEcho", echoId: "e1" } } });
    const { getByText, findByText, container } = renderWithHost();
    await flushPromises();
    await fireEvent.click(getByText("open"));

    const current = container.querySelector("[data-test-echo-presets-current]") as HTMLElement;
    expect(current.textContent).toContain("Unsaved build");
    await fireEvent.click(container.querySelector("[data-test-echo-presets-save]") as HTMLElement);
    expect(document.getElementById("modal-echoes-presets")?.hasAttribute("open")).toBe(false);
    await findByText("save requested");
  });

  it("v3 marks the applied preset and shows when its echoes changed", async () => {
    useInventoryStore().echoPresets = [{ ...SAVED_PRESET, echo1Id: "e1" }] as any;
    useCharacterStore().setCharacterData("TestChar", {
      echoPresetId: "p1",
      echoes: { 0: { echo: "SomeEcho", echoId: "e2" } },
    });
    const { getByText, container } = renderWithHost();
    await flushPromises();
    await fireEvent.click(getByText("open"));

    expect(container.querySelector("[data-test-echo-presets-current]")?.textContent).toContain(
      "1 echo changed since you applied it",
    );
    expect(container.querySelector("[data-test-echo-preset-applied]")?.textContent).toContain("Applied, changed");
  });

  it("v3 remembers the theorycrafter build that was applied", async () => {
    useCharacterStore().setCharacterData("TestChar", { echoPresetId: "stale" });
    const { getByText, container } = renderWithHost({ tab: "community" });
    await flushPromises();
    await fireEvent.click(getByText("open"));

    await fireEvent.click(container.querySelector("[data-test-stub-apply]") as HTMLElement);
    await flushPromises();

    const record = useCharacterStore().characters.TestChar as any;
    expect(record.echoPresetId).toBeNull();
    expect(record.echoPresetSource).toEqual({ name: "Healer Baseline", author: "Someone" });
  });
});
