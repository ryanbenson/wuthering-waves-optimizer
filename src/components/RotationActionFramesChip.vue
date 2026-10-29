<template>
  <button
    type="button"
    class="badge badge-sm font-mono cursor-pointer"
    :class="timing?.missing ? 'badge-warning' : 'badge-outline'"
    :title="title"
    :data-test-rotation-action-frames="actionId"
    @click.stop="emit('toggle')">
    {{ text }}
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { framesToSeconds, type ActionEnd, type ActionTimingSummary } from "../calculator/rotationTiming";

const props = defineProps<{
  actionId: string;
  /** This action's length in the rotation, summed over its count. */
  timing: ActionTimingSummary | null;
  end: ActionEnd | null;
}>();

const emit = defineEmits<{ toggle: [] }>();

const text = computed(() => {
  const timing = props.timing;
  if (!timing || timing.missing) return "no frames";
  const suffix = props.end && props.end.type !== "full" ? ` · ${props.end.type}` : "";
  const stopped = timing.realFrames - timing.gameFrames;
  const stop = stopped > 0 ? ` (+${stopped}f time stop)` : "";
  return `${timing.gameFrames}f · ${framesToSeconds(timing.gameFrames).toFixed(2)}s${stop}${suffix}`;
});

const title = computed(() =>
  props.timing?.missing
    ? "No frame data for this action, so it counts as 0s. Click to set how it ends."
    : "Time this action takes in the rotation (game time). Click to set how it ends.",
);
</script>
