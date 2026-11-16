import { ref } from "vue";

/**
 * Native HTML5 drag-and-drop index tracking for a reorderable list.
 *
 * The drag source must set `event.dataTransfer` synchronously during its own
 * `dragstart` handler (required by Safari/Firefox) and emit up to whatever
 * owns the list, which then calls `onDragStart` with the source index.
 */
export function useDragReorder(onReorder: (fromIndex: number, toIndex: number) => void) {
  const dragIndex = ref<number | null>(null);
  const dropIndex = ref<number | null>(null);
  // Non-reactive source index — reading this during drop avoids races with rAF UI updates
  let activeDragIndex: number | null = null;

  function onDragStart(index: number) {
    activeDragIndex = index;
    // Defer reactive UI updates so Vue doesn't patch the drag source mid-dragstart
    // (that cancels HTML5 drag in Chromium).
    requestAnimationFrame(() => {
      if (activeDragIndex !== index) {
        return;
      }
      dragIndex.value = index;
      dropIndex.value = index;
    });
  }

  function onDragEnter(index: number) {
    if (activeDragIndex === null) {
      return;
    }
    dropIndex.value = index;
  }

  function onDragOver(index: number, event: DragEvent) {
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
    if (activeDragIndex === null) {
      return;
    }
    dropIndex.value = index;
  }

  function onDrop(index: number) {
    const from = activeDragIndex;
    onDragEnd();
    if (from === null || from === index) {
      return;
    }
    onReorder(from, index);
  }

  function onDragEnd() {
    activeDragIndex = null;
    dragIndex.value = null;
    dropIndex.value = null;
  }

  return { dragIndex, dropIndex, onDragStart, onDragEnter, onDragOver, onDrop, onDragEnd };
}

/**
 * Use a copy of `source` as the drag preview (issue #723). Without an explicit
 * image Chrome snapshots far more than the dragged node — often the whole
 * screen — so the drop target is hard to see. Call it from the `dragstart`
 * handler. `maxHeight` crops a tall source (an open rotation card) to its
 * header. The copy sits off-screen and is removed on the next frame; browsers
 * only read it while the drag starts. Dialogs are dropped from the copy: a
 * closed DaisyUI `.modal` (each echo tile holds its echo picker) is still a
 * full-screen fixed layer, which made Chrome capture the whole screen and take
 * 1–2s to show the preview.
 */
export function setDragPreview(
  event: DragEvent,
  source: HTMLElement | null | undefined,
  options: { maxHeight?: number } = {},
) {
  const dataTransfer = event.dataTransfer;
  if (!source || !dataTransfer || typeof dataTransfer.setDragImage !== "function") {
    return;
  }
  const rect = source.getBoundingClientRect();
  const preview = source.cloneNode(true) as HTMLElement;
  preview.querySelectorAll("dialog, .modal").forEach((el) => el.remove());
  preview.removeAttribute("id");
  Object.assign(preview.style, {
    position: "fixed",
    top: "-10000px",
    left: "-10000px",
    width: `${rect.width}px`,
    margin: "0",
    pointerEvents: "none",
    opacity: "1",
  });
  if (options.maxHeight != null) {
    preview.style.maxHeight = `${options.maxHeight}px`;
    preview.style.overflow = "hidden";
  }
  document.body.appendChild(preview);

  const height = options.maxHeight != null ? Math.min(rect.height, options.maxHeight) : rect.height;
  const x = clamp(event.clientX - rect.left, 0, rect.width);
  const y = clamp(event.clientY - rect.top, 0, height);
  dataTransfer.setDragImage(preview, x, y);
  requestAnimationFrame(() => preview.remove());
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
