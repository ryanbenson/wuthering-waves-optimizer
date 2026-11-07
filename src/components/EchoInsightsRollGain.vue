<template>
  <span
    v-if="loading && !gain"
    class="skeleton h-3 w-12 shrink-0"
    aria-hidden="true"
    data-test-echo-insights-roll-gain-loading></span>
  <template v-else-if="gain">
    <span
      v-if="gain.delta > 0"
      class="echo-insights-gain font-mono font-bold text-success text-right shrink-0"
      :title="`One more average roll adds ${formatRollGain(gain.delta)} (${formatPercent(gain.pct)})`"
      :data-test-echo-insights-roll-gain="type">
      {{ formatRollGain(gain.delta) }}
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
      class="echo-insights-gain font-mono opacity-50 text-right shrink-0"
      :title="`Doesn't add damage to ${label}`"
      :data-test-echo-insights-roll-gain="type">
      +0
    </span>
    <span v-if="gain.delta > 0" class="echo-insights-gain__bar basis-full" aria-hidden="true">
      <span class="block h-full rounded bg-success" :style="{ width: barWidth }"></span>
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
