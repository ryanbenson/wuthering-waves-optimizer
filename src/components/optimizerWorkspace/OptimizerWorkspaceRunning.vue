<template>
  <div class="flex flex-col gap-4" data-test-optimizer-workspace-running>
    <!-- Phase tracker: the total loadout count isn't known upfront — the
         generator worker discovers it while it runs — so this makes the
         two overlapping phases visible instead of implying a fixed total
         existed from the start. -->
    <div class="bg-base-200 rounded-xl p-3 flex items-center gap-3">
      <div class="flex items-center gap-2">
        <span
          class="size-4 rounded-full flex items-center justify-center shrink-0"
          :class="optimizerSearchComplete ? 'bg-success' : 'bg-primary'">
          <svg
            v-if="optimizerSearchComplete"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#050505"
            stroke-width="3.5"
            stroke-linecap="round"
            stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          <span v-else class="size-1.5 rounded-full bg-primary-content"></span>
        </span>
        <div class="text-sm">
          <span class="font-semibold">
            {{ optimizerSearchComplete ? "Search complete" : "Searching for loadouts" }}
          </span>
          <span class="opacity-60">
            &middot;
            {{
              optimizerSearchComplete
                ? `${displayInt(totalCombos)} found`
                : `${displayInt(totalCombos)} found so far`
            }}
          </span>
        </div>
      </div>
      <div class="flex-1 h-px bg-base-300"></div>
      <div class="flex items-center gap-2">
        <span
          class="size-4 rounded-full flex items-center justify-center shrink-0"
          :class="optimizerSearchComplete ? 'bg-primary' : 'bg-base-300'">
          <span class="size-1.5 rounded-full bg-primary-content"></span>
        </span>
        <div class="text-sm">
          <span class="font-semibold">Scoring loadouts</span>
          <span class="opacity-60">&middot; {{ optimizerSearchComplete ? "in progress" : "waiting" }}</span>
        </div>
      </div>
    </div>

    <!-- Progress hero -->
    <div class="bg-base-200 rounded-xl p-6 flex flex-col sm:flex-row gap-6 sm:items-center">
      <div class="relative size-40 shrink-0 mx-auto sm:mx-0">
        <svg width="100%" height="100%" viewBox="0 0 184 184">
          <circle cx="92" cy="92" r="80" fill="none" class="stroke-base-300" stroke-width="14" />
          <circle
            cx="92"
            cy="92"
            r="80"
            fill="none"
            class="stroke-primary"
            stroke-width="14"
            stroke-linecap="round"
            :stroke-dasharray="ringCircumference"
            :stroke-dashoffset="ringOffset"
            transform="rotate(-90 92 92)" />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div class="font-mono text-2xl font-bold">{{ progressPercent }}%</div>
          <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">
            {{ optimizerSearchComplete ? "scored" : "processing" }}
          </div>
        </div>
      </div>

      <div class="flex-1 flex flex-col gap-4 min-w-0">
        <div>
          <div class="font-mono text-sm font-semibold">
            {{ displayInt(processedCombos) }}
            <span class="opacity-45 font-normal">
              / {{ displayInt(totalCombos) }}{{ optimizerSearchComplete ? "" : "+" }} loadouts scored
            </span>
          </div>
          <div class="h-2 rounded-full bg-base-300 mt-2 overflow-hidden">
            <div class="h-full rounded-full bg-primary" :style="{ width: `${progressPercent}%` }"></div>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <div class="card card-bordered bg-base-100 px-4 py-2.5">
            <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">Elapsed</div>
            <div class="font-mono font-bold">{{ formattedElapsed }}</div>
          </div>
          <div class="card card-bordered bg-base-100 px-4 py-2.5">
            <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">Rate</div>
            <div class="font-mono font-bold">{{ rateDisplay }}<span class="text-xs opacity-50 font-normal">/sec</span></div>
          </div>
          <div v-if="optimizerSearchComplete" class="card card-bordered bg-base-100 px-4 py-2.5">
            <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">Est. remaining</div>
            <div class="font-mono font-bold">{{ etaDisplay }}</div>
          </div>
        </div>
      </div>

      <button class="btn btn-outline btn-error self-start" data-test-optimizer-workspace-cancel-btn @click="emit('cancel')">
        Cancel
      </button>
    </div>

    <!-- Live best -->
    <div v-if="liveBestResult" class="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
      <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <div class="text-xs font-bold uppercase tracking-wider opacity-50">Best loadout found so far</div>
          <span class="badge badge-success">live</span>
        </div>
        <OptimizerWorkspaceEchoAvatarStack
          size="md"
          :loadout="liveBestResult?.loadout ?? []"></OptimizerWorkspaceEchoAvatarStack>
        <div>
          <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">{{ liveBestLabel }}</div>
          <div class="font-mono text-xl font-bold">{{ liveBestValueDisplay }}</div>
        </div>
        <p class="text-xs opacity-60">Only ever goes up &middot; updates every few seconds</p>
      </div>

      <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-2">
        <div class="text-xs font-bold uppercase tracking-wider opacity-50">Best score over time</div>
        <svg width="100%" height="110" viewBox="0 0 420 110" preserveAspectRatio="none" class="overflow-visible">
          <line x1="0" y1="109" x2="420" y2="109" class="stroke-base-300" stroke-width="1" />
          <polyline :points="sparklinePoints" fill="none" class="stroke-primary" stroke-width="3" stroke-linejoin="round" />
        </svg>
        <div class="flex justify-between text-xs opacity-60">
          <span>0:00</span>
          <span>{{ formattedElapsed }} &middot; now</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { displayInt } from "../../utils/numbers";
import { formatOptimizerElapsed } from "./formatElapsed";
import { formatTargetValue, getTargetLabel } from "./optimizerTargetDisplay";
import OptimizerWorkspaceEchoAvatarStack from "./OptimizerWorkspaceEchoAvatarStack.vue";

defineOptions({ name: "OptimizerWorkspaceRunning" });

const props = defineProps<{
  totalCombos: number;
  processedCombos: number;
  optimizerElapsedMs: number;
  optimizerSearchComplete: boolean;
  liveBestResult: any;
  targetType: string;
  targetValue: string;
}>();

const emit = defineEmits<{ cancel: [] }>();

const RING_RADIUS = 80;
const ringCircumference = 2 * Math.PI * RING_RADIUS;

const progressPercent = computed(() => {
  if (!props.totalCombos) return 0;
  return Math.min(100, Math.round((props.processedCombos / props.totalCombos) * 100));
});

const ringOffset = computed(() => ringCircumference * (1 - progressPercent.value / 100));

const formattedElapsed = computed(() => formatOptimizerElapsed(props.optimizerElapsedMs));

const rateDisplay = computed(() => {
  const seconds = props.optimizerElapsedMs / 1000;
  if (seconds <= 0) return "0";
  return displayInt(props.processedCombos / seconds);
});

const etaDisplay = computed(() => {
  const seconds = props.optimizerElapsedMs / 1000;
  if (seconds <= 0 || props.processedCombos <= 0) return "…";
  const rate = props.processedCombos / seconds;
  const remaining = props.totalCombos - props.processedCombos;
  if (remaining <= 0 || rate <= 0) return "0:00";
  return `≈ ${formatOptimizerElapsed((remaining / rate) * 1000)}`;
});

const liveBestLabel = computed(() =>
  getTargetLabel(props.targetType, props.targetValue, props.liveBestResult?.context),
);

const liveBestValueDisplay = computed(() =>
  props.liveBestResult
    ? formatTargetValue(props.targetType, props.targetValue, props.liveBestResult.targetValue)
    : "",
);

// Sparkline of the live-best value over time. Cleared whenever a fresh run
// starts (liveBestResult goes back to null — see Calculator.vue's resets).
const samples = ref<Array<{ elapsedMs: number; targetValue: number }>>([]);
const MAX_SAMPLES = 40;

watch(
  () => props.liveBestResult,
  (next) => {
    if (!next) {
      samples.value = [];
      return;
    }
    samples.value.push({
      elapsedMs: props.optimizerElapsedMs,
      targetValue: next.targetValue,
    });
    if (samples.value.length > MAX_SAMPLES) samples.value.shift();
  },
);

const sparklinePoints = computed(() => {
  if (samples.value.length === 0) return "";
  const values = samples.value.map((s) => s.targetValue);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;
  const maxElapsed = Math.max(1, props.optimizerElapsedMs);

  const points = samples.value.map((s) => {
    const x = (s.elapsedMs / maxElapsed) * 420;
    const y = 100 - ((s.targetValue - minValue) / valueRange) * 90;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  // Extend the line flat to "now" so it doesn't look stale between samples.
  const last = samples.value[samples.value.length - 1];
  points.push(`420,${(100 - ((last.targetValue - minValue) / valueRange) * 90).toFixed(1)}`);
  return points.join(" ");
});
</script>
