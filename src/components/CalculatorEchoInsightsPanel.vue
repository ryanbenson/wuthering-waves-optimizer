<template>
  <div class="echo-insights" data-test-echo-insights-panel>
    <div class="flex items-center justify-between gap-2 mb-3">
      <h3 class="text-sm font-semibold">Echo Insights</h3>
      <span class="text-xs opacity-60" data-test-echo-insights-equipped-count>
        {{ insights.equippedCount }}/5 echoes equipped
      </span>
    </div>

    <template v-if="insights.equippedCount === 0">
      <p class="text-xs opacity-60">Equip an echo to see build insights here.</p>
    </template>

    <template v-else>
      <div class="echo-insights__stat flex items-center justify-between mb-4">
        <span class="text-xs opacity-60">Total Crit Value</span>
        <span class="font-mono font-bold" data-test-echo-insights-total-cv>
          {{ insights.totalCV.toFixed(1) }}%
        </span>
      </div>

      <template v-if="insights.isCurated">
        <div v-if="insights.priorityRows.length" class="mb-4">
          <div class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1.5">
            Priority substats
          </div>
          <div class="flex flex-col gap-1">
            <div
              v-for="row in insights.priorityRows"
              :key="row.type"
              class="echo-insights__row flex items-center gap-2 text-xs"
              :class="{ 'echo-insights__row--missing': row.missing }"
              :data-test-echo-insights-row="row.type">
              <img :src="row.icon" class="size-4 shrink-0" />
              <span class="flex-1 min-w-0 truncate">{{ row.label }}</span>
              <template v-if="row.missing">
                <span class="echo-insights__missing-tag">0 rolls</span>
              </template>
              <template v-else>
                <span class="badge badge-xs badge-ghost font-mono">×{{ row.count }}</span>
                <span class="font-mono font-bold">{{ row.formattedTotal }}</span>
              </template>
            </div>
          </div>
        </div>

        <div v-if="insights.otherRows.length">
          <div class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1.5">
            Other rolled substats
          </div>
          <div class="flex flex-col gap-1">
            <div
              v-for="row in insights.otherRows"
              :key="row.type"
              class="echo-insights__row flex items-center gap-2 text-xs"
              :data-test-echo-insights-row="row.type">
              <img :src="row.icon" class="size-4 shrink-0" />
              <span class="flex-1 min-w-0 truncate">{{ row.label }}</span>
              <span class="badge badge-xs badge-ghost font-mono">×{{ row.count }}</span>
              <span class="font-mono font-bold">{{ row.formattedTotal }}</span>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <p class="text-xs opacity-60 mb-2">
          Substat priorities aren't set for this character — showing raw totals only.
        </p>
        <div class="flex flex-col gap-1">
          <div
            v-for="row in insights.otherRows"
            :key="row.type"
            class="echo-insights__row flex items-center gap-2 text-xs"
            :data-test-echo-insights-row="row.type">
            <img :src="row.icon" class="size-4 shrink-0" />
            <span class="flex-1 min-w-0 truncate">{{ row.label }}</span>
            <span class="badge badge-xs badge-ghost font-mono">×{{ row.count }}</span>
            <span class="font-mono font-bold">{{ row.formattedTotal }}</span>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useEchoInsights } from "../composables/useEchoInsights";

defineOptions({ name: "CalculatorEchoInsightsPanel" });

const props = defineProps<{ character: string }>();

const { insights } = useEchoInsights(() => props.character);
</script>

<style scoped>
.echo-insights__row {
  border: 1px solid oklch(var(--b3));
  border-radius: 0.5rem;
  padding: 0.4rem 0.55rem;
  background: oklch(var(--b2));
}

.echo-insights__row--missing {
  border-style: dashed;
  opacity: 0.7;
}

.echo-insights__missing-tag {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: oklch(var(--er));
}
</style>
