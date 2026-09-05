import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
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

const TWO_BUFF_DEFINITIONS = {
  ...DEFINITIONS,
  buffs: [
    { key: "someBuff", name: "Moonlit Clouds", hasStacks: false },
    { key: "otherBuff", name: "Sunlit Clouds", hasStacks: false },
  ],
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

describe("CalculatorRotationActionEditor — partial sync (issue #508)", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  function openBuffPanel(container: HTMLElement) {
    const configureBtn = container.querySelector("[data-test-rotation-action-configure-buffs]") as HTMLElement;
    return fireEvent.click(configureBtn);
  }

  it("toggling one buff persists only that field, leaving the sibling buff's live state out of advancedConfig", async () => {
    const { container, emitted } = renderEditor({
      action: { id: "action-1", order: 1, count: 1 },
      characterBuildData: { buffs: { someBuff: { isEnabled: true }, otherBuff: { isEnabled: true } } },
      definitions: TWO_BUFF_DEFINITIONS,
    });
    await openBuffPanel(container);

    const someBuffToggle = container.querySelector('[data-test-advanced-buff-toggle="buffs.someBuff"]') as HTMLInputElement;
    expect(someBuffToggle.checked).toBe(true);
    await fireEvent.click(someBuffToggle);

    const payload = emitted("action-update")!.at(-1)![0] as { advancedConfig?: { buffs?: Record<string, unknown> } };
    expect(Object.keys(payload.advancedConfig?.buffs ?? {})).toEqual(["someBuff"]);
    expect(payload.advancedConfig?.buffs?.someBuff).toEqual({ isEnabled: false });

    // The untouched sibling buff's checkbox still reflects the character's
    // live state — proving the display merge didn't collapse to blank once
    // the first override was persisted.
    const otherBuffToggle = container.querySelector('[data-test-advanced-buff-toggle="buffs.otherBuff"]') as HTMLInputElement;
    expect(otherBuffToggle.checked).toBe(true);
  });

  it("'Detach completely' bakes a full snapshot covering every known buff", async () => {
    const { container, emitted } = renderEditor({
      action: { id: "action-1", order: 1, count: 1 },
      characterBuildData: { buffs: { someBuff: { isEnabled: true }, otherBuff: { isEnabled: false } } },
      definitions: TWO_BUFF_DEFINITIONS,
    });
    await openBuffPanel(container);

    const detachBtn = container.querySelector("[data-test-rotation-action-detach]") as HTMLElement;
    await fireEvent.click(detachBtn);

    const payload = emitted("action-update")!.at(-1)![0] as { advancedConfig?: { buffs?: Record<string, unknown> } };
    expect(Object.keys(payload.advancedConfig?.buffs ?? {}).sort()).toEqual(["otherBuff", "someBuff"]);
  });

  it("the per-row 'Sync' control removes just that field's override", async () => {
    const { container, emitted } = renderEditor({
      action: { id: "action-1", order: 1, count: 1, advancedConfig: { buffs: { someBuff: { isEnabled: false } } } },
      characterBuildData: { buffs: { someBuff: { isEnabled: true }, otherBuff: { isEnabled: true } } },
      definitions: TWO_BUFF_DEFINITIONS,
    });
    await openBuffPanel(container);

    const resetBtn = container.querySelector('[data-test-advanced-buff-reset="buffs.someBuff"]') as HTMLElement;
    expect(resetBtn).not.toBeNull();
    await fireEvent.click(resetBtn);

    const payload = emitted("action-update")!.at(-1)![0] as { advancedConfig?: unknown };
    expect(payload.advancedConfig).toBeUndefined();
  });

  it("does not show the per-row 'Sync' control for a field that isn't overridden", async () => {
    const { container } = renderEditor({
      action: { id: "action-1", order: 1, count: 1 },
      characterBuildData: { buffs: { someBuff: { isEnabled: true } } },
      definitions: DEFINITIONS,
    });
    await openBuffPanel(container);

    expect(container.querySelector('[data-test-advanced-buff-reset="buffs.someBuff"]')).toBeNull();
  });
});
