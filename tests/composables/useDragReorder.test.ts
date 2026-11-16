import { describe, it, expect, vi } from "vitest";
import { setDragPreview, useDragReorder } from "../../src/composables/useDragReorder";

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

describe("setDragPreview (issue #723)", () => {
  function makeSource() {
    const source = document.createElement("div");
    source.id = "row";
    source.textContent = "Rotation 1";
    source.getBoundingClientRect = () => ({ left: 100, top: 50, width: 200, height: 300 }) as DOMRect;
    document.body.appendChild(source);
    return source;
  }

  function dragEvent(clientX: number, clientY: number, setDragImage = vi.fn()) {
    return { clientX, clientY, dataTransfer: { setDragImage } } as unknown as DragEvent;
  }

  it("uses an off-screen copy of the source, offset to where it was grabbed, then removes it", async () => {
    const source = makeSource();
    let previewInPage = false;
    const setDragImage = vi.fn((el: Element) => {
      previewInPage = document.body.contains(el);
    });

    setDragPreview(dragEvent(130, 70, setDragImage), source);

    expect(setDragImage).toHaveBeenCalledTimes(1);
    const [preview, x, y] = setDragImage.mock.calls[0] as [HTMLElement, number, number];
    expect(preview).not.toBe(source);
    expect(preview.textContent).toBe("Rotation 1");
    expect(preview.id).toBe("");
    expect(preview.style.width).toBe("200px");
    expect(preview.style.top).toBe("-10000px");
    expect([x, y]).toEqual([30, 20]);
    expect(previewInPage).toBe(true);

    await nextFrame();
    expect(document.body.contains(preview)).toBe(false);
    expect(document.body.contains(source)).toBe(true);
    source.remove();
  });

  it("crops to maxHeight and keeps the grab point inside the crop", () => {
    const source = makeSource();
    const setDragImage = vi.fn();

    setDragPreview(dragEvent(150, 250, setDragImage), source, { maxHeight: 60 });

    const [preview, x, y] = setDragImage.mock.calls[0] as [HTMLElement, number, number];
    expect(preview.style.maxHeight).toBe("60px");
    expect(preview.style.overflow).toBe("hidden");
    expect([x, y]).toEqual([50, 60]);
    source.remove();
  });

  it("leaves dialogs out of the copy, since a closed DaisyUI modal is still a full-screen layer", () => {
    const source = makeSource();
    const dialog = document.createElement("dialog");
    dialog.className = "modal";
    const modalDiv = document.createElement("div");
    modalDiv.className = "modal";
    source.append(dialog, modalDiv);
    const setDragImage = vi.fn();

    setDragPreview(dragEvent(130, 70, setDragImage), source);

    const preview = setDragImage.mock.calls[0][0] as HTMLElement;
    expect(preview.querySelector("dialog, .modal")).toBeNull();
    expect(preview.textContent).toBe("Rotation 1");
    expect(source.querySelectorAll("dialog, .modal")).toHaveLength(2);
    source.remove();
  });

  it("does nothing without a source or a dataTransfer", () => {
    const setDragImage = vi.fn();
    setDragPreview(dragEvent(0, 0, setDragImage), null);
    expect(setDragImage).not.toHaveBeenCalled();
    const source = makeSource();
    expect(() => setDragPreview({ clientX: 0, clientY: 0, dataTransfer: null } as DragEvent, source)).not.toThrow();
    source.remove();
  });
});
