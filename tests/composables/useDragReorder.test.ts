import { describe, it, expect, vi } from "vitest";
import { useDragReorder } from "../../src/composables/useDragReorder";

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

describe("useDragReorder", () => {
  it("tracks drag/drop index across a drag gesture and reflects them reactively after a frame", async () => {
    const onReorder = vi.fn();
    const { dragIndex, dropIndex, onDragStart, onDragEnter } = useDragReorder(onReorder);

    expect(dragIndex.value).toBeNull();
    expect(dropIndex.value).toBeNull();

    onDragStart(1);
    await nextFrame();
    expect(dragIndex.value).toBe(1);
    expect(dropIndex.value).toBe(1);

    onDragEnter(3);
    expect(dropIndex.value).toBe(3);
  });

  it("calls onReorder with the source and target index on drop, then resets state", async () => {
    const onReorder = vi.fn();
    const { dragIndex, dropIndex, onDragStart, onDrop } = useDragReorder(onReorder);

    onDragStart(0);
    await nextFrame();

    onDrop(2);

    expect(onReorder).toHaveBeenCalledTimes(1);
    expect(onReorder).toHaveBeenCalledWith(0, 2);
    expect(dragIndex.value).toBeNull();
    expect(dropIndex.value).toBeNull();
  });

  it("does not call onReorder when dropped on its own source index", async () => {
    const onReorder = vi.fn();
    const { onDragStart, onDrop } = useDragReorder(onReorder);

    onDragStart(2);
    await nextFrame();
    onDrop(2);

    expect(onReorder).not.toHaveBeenCalled();
  });

  it("ignores dragenter/dragover before a drag has started", () => {
    const onReorder = vi.fn();
    const { dropIndex, onDragEnter } = useDragReorder(onReorder);

    onDragEnter(1);

    expect(dropIndex.value).toBeNull();
  });

  it("does not call onReorder for a drop with no active drag", () => {
    const onReorder = vi.fn();
    const { onDrop } = useDragReorder(onReorder);

    onDrop(1);

    expect(onReorder).not.toHaveBeenCalled();
  });

  it("sets dataTransfer.dropEffect to move on drag over", async () => {
    const onReorder = vi.fn();
    const { onDragStart, onDragOver } = useDragReorder(onReorder);
    onDragStart(0);
    await nextFrame();

    const dataTransfer = { dropEffect: "" } as DataTransfer;
    onDragOver(1, { dataTransfer } as unknown as DragEvent);

    expect(dataTransfer.dropEffect).toBe("move");
  });
});
