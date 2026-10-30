<template>
  <div class="card bg-base-100 p-3 flex flex-col gap-2 text-sm" data-test-rotation-action-end-editor @click.stop>
    <div class="flex flex-wrap items-end gap-3">
      <label class="flex flex-col gap-1">
        <span class="text-xs opacity-70">Ends with</span>
        <select
          class="select select-bordered select-sm"
          :value="end?.type ?? 'full'"
          data-test-rotation-action-end-type
          @change="onTypeChange(($event.target as HTMLSelectElement).value as ActionEnd['type'])">
          <option v-for="option in typeOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </label>
      <label v-if="end && end.type !== 'full'" class="flex flex-col gap-1">
        <span class="text-xs opacity-70">At frame</span>
        <input
          type="number"
          min="0"
          class="input input-bordered input-sm w-24"
          :value="end.frame ?? ''"
          :placeholder="String(defaultFrame(end.type))"
          data-test-rotation-action-end-frame
          @change="onFrameChange(($event.target as HTMLInputElement).value)" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs opacity-70">Then wait (frames)</span>
        <input
          type="number"
          min="0"
          class="input input-bordered input-sm w-24"
          :value="end?.wait ?? ''"
          placeholder="0"
          data-test-rotation-action-end-wait
          @change="onWaitChange(($event.target as HTMLInputElement).value)" />
      </label>
      <button
        v-if="end"
        type="button"
        class="btn btn-ghost btn-xs"
        data-test-rotation-action-end-reset
        @click="emit('update:end', null)">
        Reset
      </button>
    </div>
    <div v-if="frames" class="text-xs opacity-70 font-mono" data-test-rotation-action-end-hints>
      full {{ frames.total }}f
      <template v-if="frames.cancel"> · earliest cancel {{ frames.cancel }}f</template>
      <template v-if="frames.noSwap"> · swap from {{ frames.noSwap }}f</template>
      <template v-if="frames.timeStop"> · time stop {{ frames.timeStop[0] }}–{{ frames.timeStop[1] }}f</template>
    </div>
    <div v-else class="text-xs text-warning">No frame data for this action, so it counts as 0s.</div>
    <div class="text-xs opacity-60">
      Dash cancels add {{ DASH_CANCEL_FRAMES }}f and jump cancels {{ JUMP_CANCEL_FRAMES }}f. A swap never happens
      before the "swap from" frame, and the character still finishes the attack after you swap.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AttackFrames } from "../calculator/frameData";
import {
  ACTION_END_LABELS,
  DASH_CANCEL_FRAMES,
  DEFAULT_SWAP_FRAME,
  JUMP_CANCEL_FRAMES,
  normalizeActionEnd,
  type ActionEnd,
} from "../calculator/rotationTiming";

const props = defineProps<{
  end: ActionEnd | null;
  frames: AttackFrames | null;
}>();

const emit = defineEmits<{ "update:end": [end: ActionEnd | null] }>();

const typeOptions = (Object.keys(ACTION_END_LABELS) as ActionEnd["type"][]).map((value) => ({
  value,
  label: ACTION_END_LABELS[value],
}));

function defaultFrame(type: ActionEnd["type"]): number {
  if (type === "swap") return DEFAULT_SWAP_FRAME;
  return props.frames?.cancel || props.frames?.total || 0;
}

function update(patch: Partial<ActionEnd>) {
  const next = normalizeActionEnd({ type: "full", ...props.end, ...patch });
  // A plain "plays out" with no wait is the default: store nothing.
  emit("update:end", next && (next.type !== "full" || next.wait) ? next : null);
}

function onTypeChange(type: ActionEnd["type"]) {
  // Frames mean different things per type, so a new type starts on its default.
  update({ type, frame: undefined });
}

function onFrameChange(value: string) {
  update({ frame: value === "" ? undefined : Number(value) });
}

function onWaitChange(value: string) {
  update({ wait: value === "" ? undefined : Number(value) });
}
</script>
