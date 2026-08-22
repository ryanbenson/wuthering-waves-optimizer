import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import TeamRotationActionEditor from "../../src/components/TeamRotationActionEditor.vue";

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
