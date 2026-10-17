import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import CalculatorEchoesPresets from "../../src/components/CalculatorEchoesPresets.vue";
import { useInventoryStore } from "../../src/stores/inventory";
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
const stubs = { EchoPresetV3Card: { template: "<div data-test-card />" }, EchoCustomPreset: true };

function renderWithHost(options?: Record<string, unknown>) {
  return render(
    {
      components: { CalculatorEchoesPresets },
      data() {
        return { options };
      },
      template: `
        <button @click="$refs.presets.triggerOpenModal(options)">open</button>
        <CalculatorEchoesPresets ref="presets" character="TestChar" />
      `,
    },
    { global: { stubs } },
  );
}

// The modal is teleported to <body>, so queries go through baseElement, not container.
function activeTab(container: Element) {
  const checked = container.querySelector("[data-test-echo-presets-tab]:checked");
  return checked?.getAttribute("data-test-echo-presets-tab");
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
    const { getByText, baseElement } = renderWithHost();
    await flushPromises();
    await fireEvent.click(getByText("open"));

    expect(activeTab(baseElement)).toBe("community");
    expect(baseElement.querySelector("[data-test-echo-presets-community-intro]")).not.toBeNull();
  });

  it("v3 opens on my presets when the player has saved presets", async () => {
    useInventoryStore().echoPresets = [SAVED_PRESET] as any;
    const { getByText, baseElement } = renderWithHost();
    await flushPromises();
    await fireEvent.click(getByText("open"));

    expect(activeTab(baseElement)).toBe("mine");
  });

  it("v3 falls back to my presets when the character has no theorycrafter builds", async () => {
    communityPresets.list = [];
    const { getByText, baseElement } = renderWithHost();
    await flushPromises();
    await fireEvent.click(getByText("open"));

    expect(activeTab(baseElement)).toBe("mine");
    expect(baseElement.querySelector("[data-test-echo-presets-mine-empty]")).not.toBeNull();
    expect(baseElement.querySelector("[data-test-echo-presets-browse-community]")).toBeNull();
  });

  it("opens the requested tab and links an empty my-presets tab to theorycrafter builds", async () => {
    const { getByText, baseElement } = renderWithHost({ tab: "mine" });
    await flushPromises();
    await fireEvent.click(getByText("open"));

    expect(activeTab(baseElement)).toBe("mine");
    const browse = baseElement.querySelector("[data-test-echo-presets-browse-community]") as HTMLElement;
    expect(browse.textContent).toContain("Browse 1 theorycrafter build");

    await fireEvent.click(browse);
    expect(activeTab(baseElement)).toBe("community");
  });

  it("classic keeps its labels and always opens on my presets", async () => {
    useSettingsStore().addToConfig({ useClassicUi: true });
    const { getByText, baseElement } = renderWithHost();
    await flushPromises();
    await fireEvent.click(getByText("open"));

    expect(activeTab(baseElement)).toBe("mine");
    expect(baseElement.querySelector('[aria-label="Other Presets"]')).not.toBeNull();
    getByText("No echo presets available");
  });
});
