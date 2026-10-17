import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import CalculatorEchoesPresets from "../../src/components/CalculatorEchoesPresets.vue";
import { useInventoryStore } from "../../src/stores/inventory";
import { useSettingsStore } from "../../src/stores/settings";
import { useConfirm } from "../../src/composables/useConfirm";

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

  it("v3 opens on my presets even when there are none, with save and browse offered", async () => {
    const { getByText, container } = renderWithHost();
    await flushPromises();
    await fireEvent.click(getByText("open"));

    expect(activeTab(container)).toBe("mine");
    expect(container.querySelector("[data-test-echo-presets-mine-empty-save]")).not.toBeNull();
    expect(container.querySelector("[data-test-echo-presets-browse-community]")).not.toBeNull();
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
    expect(browse.textContent).toContain("Browse 1 theorycrafter build");

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

  it("v3 asks before deleting a saved preset and keeps it on cancel", async () => {
    const inventory = useInventoryStore();
    inventory.echoPresets = [SAVED_PRESET] as any;
    const { getByText } = render(
      {
        components: { CalculatorEchoesPresets },
        template: `
          <button @click="$refs.presets.triggerOpenModal({ tab: 'mine' })">open</button>
          <CalculatorEchoesPresets ref="presets" character="TestChar" />
        `,
      },
      {
        global: {
          stubs: {
            EchoPresetV3Card: { template: `<button @click="$emit('delete')">delete card</button>`, emits: ["delete"] },
            EchoCustomPreset: true,
          },
        },
      },
    );
    await flushPromises();
    await fireEvent.click(getByText("open"));
    const { confirmRequest, settle } = useConfirm();

    await fireEvent.click(getByText("delete card"));
    expect(confirmRequest.value?.message).toContain('"My build"');
    settle(false);
    await flushPromises();
    expect(inventory.echoPresets).toHaveLength(1);

    await fireEvent.click(getByText("delete card"));
    settle(true);
    await flushPromises();
    expect(inventory.echoPresets).toHaveLength(0);
  });

  it("asks the Echoes screen to save the current echoes, from the header and the empty state", async () => {
    const saves: number[] = [];
    const { getByText, container } = render(
      {
        components: { CalculatorEchoesPresets },
        methods: { onSave: () => saves.push(1) },
        template: `
          <button @click="$refs.presets.triggerOpenModal({ tab: 'mine' })">open</button>
          <CalculatorEchoesPresets ref="presets" character="TestChar" @save-current="onSave" />
        `,
      },
      { global: { stubs } },
    );
    await flushPromises();
    await fireEvent.click(getByText("open"));

    await fireEvent.click(container.querySelector("[data-test-echo-presets-save-current]")!);
    await fireEvent.click(container.querySelector("[data-test-echo-presets-mine-empty-save]")!);
    expect(saves).toHaveLength(2);
  });
});
