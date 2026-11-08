<template>
  <span
    v-if="loading && !gain"
    class="skeleton h-3 w-12 shrink-0"
    aria-hidden="true"
    data-test-echo-insights-roll-gain-loading></span>
  <template v-else-if="gain">
    <span
      v-if="gain.delta > 0"
      class="echo-insights-gain text-right shrink-0"
      :title="gainTitle"
      :data-test-echo-insights-roll-gain="type"
      :data-test-echo-insights-roll-gain-kind="gain.kind">
      <span class="font-mono font-bold text-success" data-test-echo-insights-roll-gain-value>{{
        formatRollGain(gain.delta)
      }}</span>
      <span class="opacity-60 ml-1">{{ gain.kind === "max" ? "if maxed" : "per roll" }}</span>
    </span>
    <span
      v-else-if="type === 'EnergyRegen'"
      class="text-[0.7rem] opacity-60 text-right shrink-0"
      title="Energy Regen doesn't add damage by itself, but your rotation may need it to run"
      :data-test-echo-insights-roll-gain="type">
      No direct damage
    </span>
    <span
      v-else
      class="echo-insights-gain text-right shrink-0"
      :title="zeroTitle"
      :data-test-echo-insights-roll-gain="type"
      :data-test-echo-insights-roll-gain-kind="gain.kind">
      <span class="font-mono opacity-50" data-test-echo-insights-roll-gain-value>+0</span>
    </span>
    <span v-if="gain.delta > 0" class="echo-insights-gain__bar basis-full" aria-hidden="true">
      <!-- Dimmed for "if maxed": a different kind of gain from one more roll. -->
      <span
        class="block h-full rounded bg-success"
        :class="{ 'opacity-40': gain.kind === 'max' }"
        :style="{ width: barWidth }"></span>
    </span>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatRollGain, type SubstatRollGain } from "../echoes/substatRollValue";

const props = defineProps<{
  type: string;
  gain?: SubstatRollGain;
  /** The best gain on the panel; bars are scaled to it. */
  maxDelta: number;
  /** What the gain was measured on, for the tooltip. */
  label: string;
  loading?: boolean;
}>();

const barWidth = computed(() => {
  if (!props.gain || !(props.maxDelta > 0)) return "0%";
  return `${Math.max(2, Math.min(100, (props.gain.delta / props.maxDelta) * 100)).toFixed(1)}%`;
});

function formatPercent(pct: number): string {
  return `+${(pct * 100).toFixed(1)}%`;
}

const gainTitle = computed(() => {
  const gain = props.gain;
  if (!gain) return "";
  const added = `${formatRollGain(gain.delta)} damage (${formatPercent(gain.pct)}) to ${props.label}`;
  return gain.kind === "max"
    ? `Already on all 5 echoes. If every roll of it were a max roll, that adds ${added}.`
    : `One more average roll, on an echo that doesn't have it yet, adds ${added}.`;
});

const zeroTitle = computed(() =>
  props.gain?.kind === "max"
    ? `Already on all 5 echoes, and better rolls of it don't add damage to ${props.label}`
    : `Doesn't add damage to ${props.label}`,
);
</script>

<style scoped>
.echo-insights-gain {
  min-width: 3.5rem;
}

.echo-insights-gain__bar {
  display: block;
  height: 3px;
  border-radius: 0.25rem;
  background: oklch(var(--b3));
  overflow: hidden;
}
</style>
