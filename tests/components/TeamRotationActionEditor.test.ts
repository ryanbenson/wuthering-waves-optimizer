import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import TeamRotationActionEditor from "../../src/components/TeamRotationActionEditor.vue";
import { useSettingsStore } from "../../src/stores/settings";

function renderEditor(overrideProps: Record<string, unknown> = {}) {
  return render(TeamRotationActionEditor, {
    props: {
      action: { id: "action-1", slot: 0, order: 2, key: null, type: null, count: 1 },
      team: { characterIds: ["Carlotta", null, null] },
      chosenChars: {},
      mainEchoForSlot: {},
      mainEchoRankForSlot: {},
      ...overrideProps,
    },
    global: {
      stubs: { AppRichSelect: true, TeamRotationAdvancedBuffs: true },
      directives: { tooltip: () => {} },
    },
  });
}

const TWO_BUFF_DEFINITIONS = {
  buffs: [
    { key: "someBuff", name: "Moonlit Clouds", hasStacks: false },
    { key: "otherBuff", name: "Sunlit Clouds", hasStacks: false },
  ],
  weaponPassives: [],
  resonanceChains: [],
  echoSetPassivesOnePiece: [],
  echoSetPassivesOne: [],
  echoSetPassivesTwo: [],
  mainEchoDef: null,
  teamBuffs: [],
};

// These tests exercise the real advanced-buff panel (not stubbed), so the
// panel's checkboxes/reset controls are actually clickable.
function renderEditorWithRealPanel(overrideProps: Record<string, unknown> = {}) {
  return render(TeamRotationActionEditor, {
    props: {
      action: { id: "action-1", slot: 0, order: 2, key: null, type: null, count: 1 },
      team: { characterIds: ["Carlotta", null, null] },
      chosenChars: {},
      mainEchoForSlot: {},
      mainEchoRankForSlot: {},
      definitionsForSlot: { 0: TWO_BUFF_DEFINITIONS },
      characterDataForSlot: { 0: { buffs: { someBuff: { isEnabled: true }, otherBuff: { isEnabled: true } } } },
      ...overrideProps,
    },
    global: {
      stubs: { AppRichSelect: true },
      directives: { tooltip: () => {} },
    },
  });
}

describe("TeamRotationActionEditor", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("emits a distinct update:sequence event (not update) when the # field changes, so the team reorder handler runs", async () => {
    const { emitted, getByLabelText, container } = renderEditor();

    await fireEvent.click(container.querySelector(".rotation__action")!);
    const sequenceInput = getByLabelText("#") as HTMLInputElement;
    await fireEvent.update(sequenceInput, "1");

    expect(emitted("update")).toBeUndefined();
    const sequenceEmits = emitted("update:sequence");
    expect(sequenceEmits).toBeTruthy();
    const payload = sequenceEmits![0][0] as Record<string, unknown>;
    expect(payload).toMatchObject({ id: "action-1", order: "1", slot: 0 });
  });

  it("emits a plain update event (not update:sequence) for a non-reorder field change", async () => {
    const { emitted, getByLabelText, container } = renderEditor();

    await fireEvent.click(container.querySelector(".rotation__action")!);
    const hitsInput = getByLabelText("x") as HTMLInputElement;
    await fireEvent.update(hitsInput, "3");

    expect(emitted("update:sequence")).toBeUndefined();
    expect(emitted("update")).toBeTruthy();
  });

  it("passes canReorder through to the drag handle and forwards drag-reorder events", async () => {
    const { container, emitted } = renderEditor({ canReorder: true });
    const handle = container.querySelector("[data-test-rotation-action-drag-handle]");
    expect(handle).not.toBeNull();

    handle!.dispatchEvent(new Event("dragstart", { bubbles: true }));
    expect(emitted("drag-reorder-start")).toBeTruthy();

    handle!.dispatchEvent(new Event("dragend", { bubbles: true }));
    expect(emitted("drag-reorder-end")).toBeTruthy();
  });

  it("does not render a drag handle when canReorder is not set", () => {
    const { container } = renderEditor();
    expect(container.querySelector("[data-test-rotation-action-drag-handle]")).toBeNull();
  });
});

describe("TeamRotationActionEditor Rotation Flow (Labs)", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("forwards duplicate-action from the leaf as a plain `duplicate` id event", async () => {
    useSettingsStore().labs = { liveResultBar: { isEnabled: true } };
    const { container, emitted } = renderEditor();

    const duplicateBtn = container.querySelector("[data-test-rotation-action-duplicate]") as HTMLElement;
    expect(duplicateBtn).not.toBeNull();
    await fireEvent.click(duplicateBtn);

    expect(emitted("duplicate")).toEqual([["action-1"]]);
  });

  it("hides the legacy Configure Buffs button once the flag is on (unified panel takes over)", () => {
    useSettingsStore().labs = { liveResultBar: { isEnabled: true } };
    const { container } = renderEditor({ definitionsForSlot: { 0: { buffs: [] } } });

    expect(container.querySelector("[data-test-team-rotation-action-configure-buffs]")).toBeNull();
  });
});

describe("TeamRotationActionEditor — partial sync (issue #508)", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  function openBuffPanel(container: HTMLElement) {
    const configureBtn = container.querySelector("[data-test-team-rotation-action-configure-buffs]") as HTMLElement;
    return fireEvent.click(configureBtn);
  }

  it("toggling one buff persists only that field, leaving the sibling buff's live state out of advancedConfig", async () => {
    const { container, emitted } = renderEditorWithRealPanel();
    await openBuffPanel(container);

    const someBuffToggle = container.querySelector('[data-test-advanced-buff-toggle="buffs.someBuff"]') as HTMLInputElement;
    expect(someBuffToggle.checked).toBe(true);
    await fireEvent.click(someBuffToggle);

    const payload = emitted("update")!.at(-1)![0] as { advancedConfig?: { buffs?: Record<string, unknown> } };
    expect(Object.keys(payload.advancedConfig?.buffs ?? {})).toEqual(["someBuff"]);
    expect(payload.advancedConfig?.buffs?.someBuff).toEqual({ isEnabled: false });

    const otherBuffToggle = container.querySelector('[data-test-advanced-buff-toggle="buffs.otherBuff"]') as HTMLInputElement;
    expect(otherBuffToggle.checked).toBe(true);
  });

  it("'Detach completely' bakes a full snapshot covering every known buff", async () => {
    const { container, emitted } = renderEditorWithRealPanel();
    await openBuffPanel(container);

    const detachBtn = container.querySelector("[data-test-team-rotation-action-detach]") as HTMLElement;
    await fireEvent.click(detachBtn);

    const payload = emitted("update")!.at(-1)![0] as { advancedConfig?: { buffs?: Record<string, unknown> } };
    expect(Object.keys(payload.advancedConfig?.buffs ?? {}).sort()).toEqual(["otherBuff", "someBuff"]);
  });

  it("the per-row 'Sync' control removes just that field's override", async () => {
    const { container, emitted } = renderEditorWithRealPanel({
      action: {
        id: "action-1",
        slot: 0,
        order: 2,
        key: null,
        type: null,
        count: 1,
        advancedConfig: { buffs: { someBuff: { isEnabled: false } } },
      },
    });
    await openBuffPanel(container);

    const resetBtn = container.querySelector('[data-test-advanced-buff-reset="buffs.someBuff"]') as HTMLElement;
    expect(resetBtn).not.toBeNull();
    await fireEvent.click(resetBtn);

    const payload = emitted("update")!.at(-1)![0] as { advancedConfig?: unknown };
    expect(payload.advancedConfig).toBeUndefined();
  });

  it("'Stay synced with character' still resets every override at once", async () => {
    const { container, emitted } = renderEditorWithRealPanel({
      action: {
        id: "action-1",
        slot: 0,
        order: 2,
        key: null,
        type: null,
        count: 1,
        advancedConfig: { buffs: { someBuff: { isEnabled: false }, otherBuff: { isEnabled: false } } },
      },
    });
    await openBuffPanel(container);

    const resyncBtn = container.querySelector("[data-test-team-rotation-action-resync]") as HTMLElement;
    await fireEvent.click(resyncBtn);

    const payload = emitted("update")!.at(-1)![0] as { advancedConfig?: unknown };
    expect(payload.advancedConfig).toBeUndefined();
  });
});
