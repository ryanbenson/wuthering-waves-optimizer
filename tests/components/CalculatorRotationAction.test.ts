import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render } from "@testing-library/vue";
import CalculatorRotationAction from "../../src/components/CalculatorRotationAction.vue";

function renderAction(canReorder = false) {
  return render(CalculatorRotationAction, {
    props: {
      character: "Carlotta",
      id: "action-1",
      order: 1,
      count: 1,
      canReorder,
    },
    global: {
      directives: { tooltip: () => {} },
    },
  });
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
