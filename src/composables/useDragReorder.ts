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
