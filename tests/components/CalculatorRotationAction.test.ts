import { describe, it, expect, beforeEach } from "vitest";
import { nextTick } from "vue";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import CalculatorRotationAction from "../../src/components/CalculatorRotationAction.vue";
import { useSettingsStore } from "../../src/stores/settings";

function renderAction(canReorder = false, overrideProps: Record<string, unknown> = {}) {
  return render(CalculatorRotationAction, {
    props: {
      character: "Carlotta",
      id: "action-1",
      order: 1,
      count: 1,
      canReorder,
      ...overrideProps,
    },
    global: {
      directives: { tooltip: () => {} },
    },
  });
}

function enableRotationFlow() {
  useSettingsStore().labs = { rotationFlow: { isEnabled: true } };
}

describe("CalculatorRotationAction drag handle", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("does not render a drag handle when canReorder is false", () => {
    const { container } = renderAction(false);
    expect(container.querySelector("[data-test-rotation-action-drag-handle]")).toBeNull();
  });

  it("renders a drag handle when canReorder is true", () => {
    const { container } = renderAction(true);
    expect(container.querySelector("[data-test-rotation-action-drag-handle]")).not.toBeNull();
  });

  it("emits drag-reorder-start with dataTransfer populated, and drag-reorder-end", async () => {
    const { container, emitted } = renderAction(true);
    const handle = container.querySelector("[data-test-rotation-action-drag-handle]")!;

    const dataTransfer = {
      effectAllowed: "",
      setData: (_type: string, _val: string) => {},
    } as unknown as DataTransfer;
    const dragStartEvent = new Event("dragstart", { bubbles: true }) as DragEvent;
    Object.defineProperty(dragStartEvent, "dataTransfer", { value: dataTransfer });
    handle.dispatchEvent(dragStartEvent);

    expect(emitted("drag-reorder-start")).toBeTruthy();
    expect(dataTransfer.effectAllowed).toBe("move");

    handle.dispatchEvent(new Event("dragend", { bubbles: true }));
    expect(emitted("drag-reorder-end")).toBeTruthy();
  });

  it("does not toggle edit mode when the drag handle is clicked", async () => {
    const { container } = renderAction(true);
    const handle = container.querySelector("[data-test-rotation-action-drag-handle]")!;

    handle.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

    expect(container.querySelector(".rotation__action__edit")).toBeNull();
  });
});

describe("CalculatorRotationAction Rotation Flow (Labs)", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("keeps the legacy Configure Stats UI and hides the new controls when the flag is off", () => {
    const { container } = renderAction();
    expect(container.querySelector("[data-test-rotation-action-configure-stats]")).not.toBeNull();
    expect(container.querySelector("[data-test-rotation-action-manage-buffs]")).toBeNull();
    expect(container.querySelector("[data-test-rotation-action-duplicate]")).toBeNull();
  });

  it("shows a duplicate button that emits duplicate-action with this action's id when the flag is on", async () => {
    enableRotationFlow();
    const { container, emitted } = renderAction();
    const duplicateBtn = container.querySelector("[data-test-rotation-action-duplicate]") as HTMLElement;
    expect(duplicateBtn).not.toBeNull();

    await fireEvent.click(duplicateBtn);

    expect(emitted("duplicate-action")).toEqual([[{ id: "action-1" }]]);
  });

  it("replaces Configure Stats with a Manage Buffs toggle that emits open/closed state", async () => {
    enableRotationFlow();
    const { container, emitted } = renderAction();
    expect(container.querySelector("[data-test-rotation-action-configure-stats]")).toBeNull();
    const manageBtn = container.querySelector("[data-test-rotation-action-manage-buffs]") as HTMLElement;
    expect(manageBtn).not.toBeNull();

    await fireEvent.click(manageBtn);
    expect(emitted("toggle-manage-buffs")).toEqual([[{ open: true }]]);

    await fireEvent.click(manageBtn);
    expect(emitted("toggle-manage-buffs")![1]).toEqual([{ open: false }]);
  });

  it("renders custom buffs and wrapper-provided advancedConfig chips in one unified list", async () => {
    enableRotationFlow();
    const { container } = renderAction(false, {
      buffs: [{ id: "b1", modifier: "CritRate", modifierValue: 30 }],
      advancedBuffChips: [{ category: "buffs", key: "someBuff", label: "Moonlit Clouds" }],
    });
    // buffData is seeded from props.buffs in onMounted, so the chip driven by
    // it only appears after the resulting reactive re-render flushes.
    await nextTick();

    const customChip = container.querySelector("[data-test-rotation-action-unified-chip-custom]");
    const liveChip = container.querySelector("[data-test-rotation-action-unified-chip-live]");
    expect(customChip?.textContent).toContain("CritRate");
    expect(liveChip?.textContent).toContain("Moonlit Clouds");
  });

  it("emits toggle-advanced-buff (not a local mutation) when a live chip is removed", async () => {
    enableRotationFlow();
    const { container, emitted } = renderAction(false, {
      advancedBuffChips: [{ category: "buffs", key: "someBuff", label: "Moonlit Clouds" }],
    });

    const removeBtn = container.querySelector(
      "[data-test-rotation-action-unified-chip-live] .unified-chip__remove",
    ) as HTMLElement;
    await fireEvent.click(removeBtn);

    expect(emitted("toggle-advanced-buff")).toEqual([[{ category: "buffs", key: "someBuff" }]]);
  });
});
