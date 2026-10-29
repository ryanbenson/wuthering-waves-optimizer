<template>
  <div class="rounded-lg bg-base-200 p-3 text-sm flex flex-col gap-2" data-test-rotation-frame-timing>
    <template v-if="hasFrameData">
      <div class="flex flex-wrap gap-x-6 gap-y-2">
        <div class="flex flex-col" data-test-rotation-frame-length>
          <span class="text-xs opacity-70">From frame data</span>
          <span>
            <b>{{ seconds(timing.gameFrames) }}s</b>
            <span class="font-mono text-xs opacity-60 ml-1">{{ timing.gameFrames }}f</span>
          </span>
          <span class="text-xs">
            DPS <b data-test-rotation-frame-dps>{{ formatDps(frameDps) }}</b>
          </span>
        </div>
        <div class="flex flex-col" data-test-rotation-typed-length>
          <span class="text-xs opacity-70">Your length</span>
          <span><b>{{ typedSeconds ? `${typedSeconds}s` : "—" }}</b></span>
          <span class="text-xs">
            DPS <b data-test-rotation-typed-dps>{{ formatDps(typedDps) }}</b>
          </span>
        </div>
      </div>
      <div class="flex flex-wrap gap-x-3 gap-y-1 text-xs opacity-70">
        <span v-if="timeStopFrames > 0">
          {{ seconds(timing.realFrames) }}s with time stop ({{ timeStopFrames }}f stopped)
        </span>
        <span v-if="timing.missing.length" class="text-warning" data-test-rotation-frame-missing>
          {{ timing.missing.length }} action{{ timing.missing.length === 1 ? "" : "s" }} without frame data,
          counted as 0s
        </span>
        <span>
          Frame data:
          <a href="https://wuwalab.com" target="_blank" rel="noopener noreferrer" class="link">wuwalab</a>
        </span>
      </div>
    </template>
    <span v-else class="text-xs opacity-70" data-test-rotation-frame-none>
      No frame data for {{ isTeam ? "these characters" : "this character" }} yet, so set the rotation length yourself
      to see DPS.
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { damagePerSecond, framesToSeconds, type RotationTiming } from "../calculator/rotationTiming";
import { displayDamage } from "../utils/numbers";

const props = defineProps<{
  timing: RotationTiming;
  hasFrameData: boolean;
  /** The rotation's total (average) damage. */
  damage: number | null;
  /** The optional length the user typed, in seconds. */
  typedDuration: string | number | null | undefined;
  /** A team rotation, for the wording when no slot has frame data. */
  isTeam?: boolean;
}>();

const typedSeconds = computed(() => {
  const value = Number(props.typedDuration);
  return Number.isFinite(value) && value > 0 ? value : null;
});

const timeStopFrames = computed(() => props.timing.realFrames - props.timing.gameFrames);
const frameDps = computed(() => (props.damage ? damagePerSecond(props.damage, props.timing.gameFrames) : 0));
const typedDps = computed(() => (props.damage && typedSeconds.value ? props.damage / typedSeconds.value : 0));

function seconds(frames: number): string {
  return framesToSeconds(frames).toFixed(2);
}

function formatDps(value: number): string {
  return value > 0 ? displayDamage(value).toLocaleString() : "—";
}
</script>
