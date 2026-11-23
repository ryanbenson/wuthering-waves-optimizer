<template>
  <span data-test-optimizer-result-target-delta>
    <AppDeltaPercent :value="delta.totalPercent" parens />
    <template v-for="part in delta.parts" :key="part.label">
      <span class="ml-1 text-[.65rem] opacity-60">· {{ part.label }}</span>
      <span class="ml-1" :class="deltaToneTextClass(part.delta.tone)" :data-delta-tone="part.delta.tone">{{ part.delta.text }}</span>
    </template>
  </span>
</template>

<script setup lang="ts">
// The optimized-for stat's change in the optimizer stats table: the total vs
// now in parentheses, then the stat's own change (issue #746).
import AppDeltaPercent from "./AppDeltaPercent.vue";
import { deltaToneTextClass } from "../utils/signedDelta";
import type { StatDelta } from "../utils/statDeltas";

defineOptions({ name: "OptimizerTargetStatDelta" });

defineProps<{ delta: StatDelta }>();
</script>
