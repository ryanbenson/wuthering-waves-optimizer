<template>
  <table class="w-full text-sm" data-test-echo-resource-cost>
    <thead>
      <tr class="text-xs opacity-60">
        <th class="text-left font-normal pb-1"></th>
        <th class="text-right font-normal pb-1 pl-2">EXP</th>
        <th class="text-right font-normal pb-1 pl-2">Tuners</th>
        <th class="text-right font-normal pb-1 pl-2">Shell Credits</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in rows"
        :key="row.key"
        :class="{ 'font-semibold': row.emphasis }"
        :data-test-echo-resource-cost-row="row.key">
        <td class="py-0.5 pr-2" :class="{ 'opacity-80': !row.emphasis }">{{ row.label }}</td>
        <template v-if="row.resources">
          <td class="text-right tabular-nums pl-2" data-test-echo-resource-exp>{{ formatResourceAmount(row.resources.exp) }}</td>
          <td class="text-right tabular-nums pl-2" data-test-echo-resource-tuners>{{ Math.round(row.resources.tuners).toLocaleString("en-US") }}</td>
          <td class="text-right tabular-nums pl-2" data-test-echo-resource-credits>{{ formatResourceAmount(row.resources.shellCredits) }}</td>
        </template>
        <td v-else colspan="3" class="text-right opacity-60 pl-2">—</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import type { EchoResources } from "../echoes/levelingCost";

export interface EchoResourceCostRow {
  key: string;
  label: string;
  resources: EchoResources | null;
  emphasis?: boolean;
}
</script>

<script setup lang="ts">
// EXP / tuners / Shell Credits rows for the Odds dialog and the tuning
// planner. Numbers come from src/echoes/levelingCost.ts.
import { formatResourceAmount } from "../echoes/levelingCost";

defineOptions({ name: "EchoResourceCostTable" });

defineProps<{ rows: EchoResourceCostRow[] }>();
</script>
