<template>
  <!-- Looks like a button (caret, hover ring) and always names how the
  action ends, so it reads as "click to change how this ends". -->
  <button
    type="button"
    class="badge size-max font-mono cursor-pointer gap-1 transition-shadow hover:ring-2 focus-visible:ring-2 focus-visible:outline-none"
    :class="timing?.missing ? 'badge-warning hover:ring-warning/50 focus-visible:ring-warning/50' : 'badge-info hover:ring-info/50 focus-visible:ring-info/50'"
    :title="title"
    :aria-label="title"
    :aria-expanded="open"
    :data-test-rotation-action-frames="actionId"
    @click.stop="emit('toggle')">
    <span>{{ text }}</span>
    <span class="font-sans" data-test-rotation-action-frames-end>· {{ endLabel }}</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="size-3 transition-transform"
      :class="{ 'rotate-180': open }"
      aria-hidden="true">
      <path
        fill-rule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clip-rule="evenodd" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  ACTION_END_LABELS,
  framesToSeconds,
  type ActionEnd,
  type ActionTimingSummary,
} from "../calculator/rotationTiming";

const props = withDefaults(
  defineProps<{
    actionId: string;
    /** This action's length in the rotation, summed over its count. */
    timing: ActionTimingSummary | null;
    end: ActionEnd | null;
    /** Whether the "Ends with" editor is open under the action. */
    open?: boolean;
  }>(),
  { open: false },
);

const emit = defineEmits<{ toggle: [] }>();

const text = computed(() => {
  const timing = props.timing;
  if (!timing || timing.missing) return "no frames";
  const stopped = timing.realFrames - timing.gameFrames;
  const stop = stopped > 0 ? ` (+${stopped}f time stop)` : "";
  return `${timing.gameFrames}f · ${framesToSeconds(timing.gameFrames).toFixed(2)}s${stop}`;
});

const endLabel = computed(() => {
  const label = ACTION_END_LABELS[props.end?.type ?? "full"];
  return props.end?.wait ? `${label} +${props.end.wait}f` : label;
});

const title = computed(() =>
  props.timing?.missing
    ? "No frame data for this action, so it counts as 0s. Click to set how it ends."
    : `Ends with: ${endLabel.value}. Click to change how this action ends (plays out, cancel, dash, jump or swap out).`,
);
</script>
