import { describe, it, expect } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render } from "@testing-library/vue";
import EchoCardSubstatList from "../../src/components/EchoCardSubstatList.vue";
import { useSettingsStore } from "../../src/stores/settings";

interface EchoCardSubstatSlot {
  index: number;
  type: string;
  value: number | string;
  display: string | number | null;
  icon: string;
  filled: boolean;
}

function filledSlot(overrides: Partial<EchoCardSubstatSlot> = {}): EchoCardSubstatSlot {
  return {
    index: 0,
    type: "CritRate",
    value: "6.9",
    display: "6.9%",
    icon: "icon.png",
    filled: true,
    ...overrides,
  };
}

function emptySlot(index = 0): EchoCardSubstatSlot {
  return { index, type: "none", value: 0, display: null, icon: "", filled: false };
}

function renderList(slots: EchoCardSubstatSlot[]) {
  return render(EchoCardSubstatList, { props: { slots } });
}

describe("EchoCardSubstatList", () => {
  it("gives a filled slot a neutral border when the liveResultBar flag is off", () => {
    setActivePinia(createPinia());
    const { container } = renderList([filledSlot()]);
    const row = container.querySelector("[data-test-echo-card-substat='0']");
    expect(row?.className).toContain("border-l-base-300");
    expect(row?.className).not.toContain("border-l-emerald-500/50");
  });

  it("colors a filled slot by roll quality — toned-down border + gradient wash — when the flag is on", () => {
    setActivePinia(createPinia());
    useSettingsStore().labs = { liveResultBar: { isEnabled: true } };
    const { container } = renderList([filledSlot()]);
    const row = container.querySelector("[data-test-echo-card-substat='0']");
    expect(row?.className).toContain("border-l-emerald-500/50");
    expect(row?.className).toContain("bg-gradient-to-r");
    expect(row?.className).toContain("from-emerald-500/10");
  });

  it("gives an empty slot a neutral border regardless of the flag", () => {
    setActivePinia(createPinia());
    useSettingsStore().labs = { liveResultBar: { isEnabled: true } };
    const { container } = renderList([emptySlot()]);
    const row = container.querySelector("[data-test-echo-card-substat='0']");
    expect(row?.className).toContain("border-l-base-300");
    expect(row?.textContent).toContain("Empty");
  });
});
