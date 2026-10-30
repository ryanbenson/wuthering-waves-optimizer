import { ref } from "vue";
import { ACTION_END_LABELS } from "../calculator/rotationTiming";
import type { StripBlock } from "../calculator/rotationTimelineStrip";
import type { ReadoutItem } from "../components/RotationChartReadout.vue";
import { fullNumber, secondsText } from "../utils/rotationChart";

/** What the readout says about one action; `who` names its character on a team. */
export function describeBlock(block: StripBlock, who?: string | null): ReadoutItem {
  const title = who ? `${who}: ${block.label}` : block.label;
  const amount = `${fullNumber(block.value)} ${block.isDamage ? "damage" : "healing or shield"}`;
  let detail: string;
  if (block.missing) detail = `No frame data, so it takes no time · ${amount}`;
  else if (block.frames === 0) detail = `Lands at ${secondsText(block.landingFrame)} · no field time · ${amount}`;
  else {
    const span = `${secondsText(block.startFrame)}–${secondsText(block.startFrame + block.frames)}`;
    detail = `${span} (${secondsText(block.frames)}) · ${amount} · ${ACTION_END_LABELS[block.end]}`;
  }
  return { title, detail, actionId: block.id };
}

/**
 * Hover, tap and keyboard handling for the rotation charts' marks (ADR 0049).
 * The readout under the chart shows the hovered, tapped or focused mark. A
 * mouse click or Enter jumps to the action; a tap only shows its details,
 * since the readout has a "Go to action" link and a tap that scrolled away
 * would hide them.
 */
export function useRotationChartReadout(describe: (block: StripBlock) => ReadoutItem, select: (id: string) => void) {
  const active = ref<ReadoutItem | null>(null);
  let lastPointer = "mouse";

  function clear(event: PointerEvent) {
    if (event.pointerType === "mouse") active.value = null;
  }

  /** `primary` is false for a second mark of the same action (the Detailed
   * view's damage bar), which stays out of the tab order and test ids. */
  function markAttrs(block: StripBlock, primary = true) {
    if (!primary) return { "aria-hidden": true as const };
    const item = describe(block);
    return {
      tabindex: 0,
      role: "button",
      "aria-label": `${item.title}: ${item.detail}`,
      "data-test-rotation-timeline-block": block.id,
      "data-end": block.end,
    };
  }

  function markEvents(block: StripBlock) {
    return {
      pointerdown: (event: PointerEvent) => (lastPointer = event.pointerType),
      pointerenter: (event: PointerEvent) => {
        if (event.pointerType === "mouse") active.value = describe(block);
      },
      pointerleave: clear,
      focus: () => (active.value = describe(block)),
      click: () => {
        if (lastPointer === "mouse") select(block.id);
        else active.value = describe(block);
        lastPointer = "mouse";
      },
      keydown: (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select(block.id);
        }
      },
    };
  }

  return { active, clear, markAttrs, markEvents };
}
