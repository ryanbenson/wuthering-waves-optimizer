import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render } from "@testing-library/vue";
import CalculatorRotationActionEditor from "../../src/components/CalculatorRotationActionEditor.vue";
import { useSettingsStore } from "../../src/stores/settings";

const DEFINITIONS = {
  buffs: [{ key: "someBuff", name: "Moonlit Clouds", hasStacks: false }],
  weaponPassives: [],
  resonanceChains: [],
  echoSetPassivesOnePiece: [],
  echoSetPassivesOne: [],
  echoSetPassivesTwo: [],
  mainEchoDef: null,
  teamBuffs: [],
};

function renderEditor(overrideProps: Record<string, unknown> = {}) {
  return render(CalculatorRotationActionEditor, {
    props: {
      action: { id: "action-1", order: 1, count: 1 },
      character: "Carlotta",
      characterData: {},
      characterBuildData: { buffs: { someBuff: { isEnabled: true } } },
      definitions: DEFINITIONS,
      ...overrideProps,
    },
    global: {
      stubs: { AppRichSelect: true },
      directives: { tooltip: () => {} },
    },
  });
}

describe("CalculatorRotationActionEditor Rotation Flow (Labs) — synced-buff visibility", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    useSettingsStore().labs = { liveResultBar: { isEnabled: true } };
  });

  it("hides the character's live buff chip while the action is still synced (no override)", () => {
    // No action.advancedConfig at all — displayedAdvancedConfig falls back to
    // the character's live snapshot (buffs.someBuff is enabled there), but
    // isCustomized is false, so the chip must NOT render — showing it here
    // would repeat the same "just how this character normally buffs" chip
    // on every single action in the rotation.
    const { container } = renderEditor();
    expect(container.querySelector("[data-test-rotation-action-unified-chip-live]")).toBeNull();
  });

  it("shows the buff chip once the action has a real override (customized)", () => {
    const { container } = renderEditor({
      action: {
        id: "action-1",
        order: 1,
        count: 1,
        advancedConfig: { buffs: { someBuff: { isEnabled: true } } },
      },
    });
    const chip = container.querySelector("[data-test-rotation-action-unified-chip-live]");
    expect(chip).not.toBeNull();
    expect(chip?.textContent).toContain("Moonlit Clouds");
  });

  it("still shows nothing when customized but every override is turned off", () => {
    const { container } = renderEditor({
      action: {
        id: "action-1",
        order: 1,
        count: 1,
        advancedConfig: { buffs: { someBuff: { isEnabled: false } } },
      },
    });
    // hasAdvancedConfigOverrides only checks key presence, not isEnabled, so
    // this action reads as "customized" (has an explicit override) even
    // though that override happens to be "off" — the chip list itself
    // still correctly shows nothing since no entry is isEnabled.
    expect(container.querySelector("[data-test-rotation-action-unified-chip-live]")).toBeNull();
  });
});
