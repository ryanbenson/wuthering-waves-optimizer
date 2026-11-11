<template>
  <!--
    What each substat adds (ADR 0057). One number per cell, no bars: Per 1%
    (per 10/100 for flat stats), a typical roll and the top roll. Below
    ~380px of panel width (the phone bar, the narrow end of the desktop
    sidebar) the Top roll column folds under Typical roll; a container
    query, since the panel's width and the viewport's don't track each other.
  -->
  <div class="echo-substat-table" data-test-echo-insights-substat-table>
    <table class="w-full text-xs border-separate border-spacing-y-1">
      <thead>
        <tr class="text-[0.65rem] font-semibold uppercase tracking-wide opacity-60">
          <th class="text-left font-semibold pb-0.5">Substat</th>
          <th v-if="showValues" class="text-right font-semibold px-2 pb-0.5">Per 1%</th>
          <th v-if="showValues" class="text-right font-semibold px-2 pb-0.5">Typical roll</th>
          <th v-if="showValues" class="echo-substat-table__top text-right font-semibold pl-2 pb-0.5">Top roll</th>
        </tr>
      </thead>
      <tbody v-for="group in groups" :key="group.key" :data-test-echo-insights-group="group.key">
        <tr v-if="group.label">
          <td
            :colspan="showValues ? 4 : 1"
            class="pt-2 text-[0.65rem] font-semibold uppercase tracking-wide opacity-60">
            {{ group.label }}
          </td>
        </tr>
        <tr
          v-for="row in group.rows"
          :key="row.type"
          class="echo-substat-table__row"
          :class="{ 'echo-substat-table__row--missing': row.missing }"
          :data-test-echo-insights-row="row.type"
          :data-test-echo-insights-row-missing="row.missing ? '' : undefined">
          <td>
            <div class="flex items-start gap-2">
              <img :src="row.icon" class="size-4 shrink-0 mt-px" alt="" />
              <div class="min-w-0">
                <div>{{ row.label }}</div>
                <div class="font-mono text-[0.65rem] opacity-60" data-test-echo-insights-row-have>
                  <span :class="{ 'text-error font-bold opacity-100': row.missing }">{{ row.count }}/5</span>
                  <template v-if="row.count > 0"> · {{ row.formattedTotal }}</template>
                </div>
              </div>
            </div>
          </td>

          <template v-if="showValues">
            <td v-if="!value(row.type)" colspan="3" class="text-right">
              <span class="skeleton h-3 w-24 inline-block" aria-hidden="true" data-test-echo-insights-value-loading></span>
            </td>
            <td
              v-else-if="value(row.type)!.typical.delta === 0"
              colspan="3"
              class="text-left opacity-60 text-[0.7rem]"
              :data-test-echo-insights-no-damage="row.type">
              {{ row.type === "EnergyRegen" ? "No direct damage. Your rotation may need it to run." : "Adds nothing to this target" }}
            </td>
            <template v-else>
              <td class="text-right px-2 align-top" :data-test-echo-insights-per-step="row.type">
                <div class="font-mono font-semibold">{{ formatRollGain(value(row.type)!.perStep) }}</div>
                <div v-if="value(row.type)!.step !== 1" class="font-mono text-[0.65rem] opacity-60">
                  per {{ value(row.type)!.step }}
                </div>
              </td>
              <td class="echo-substat-table__typical text-right px-2 align-top" :data-test-echo-insights-typical="row.type">
                <div class="font-mono font-semibold text-success">{{ formatRollGain(value(row.type)!.typical.delta) }}</div>
                <div class="font-mono text-[0.65rem] opacity-60">
                  {{ formatRollSize(row.type, value(row.type)!.typical.roll) }}
                </div>
                <div class="echo-substat-table__top-inline font-mono text-[0.65rem] opacity-60">
                  top {{ formatRollGain(value(row.type)!.top.delta) }} ·
                  {{ formatTopRollChance(value(row.type)!.top.chance) }}
                </div>
              </td>
              <td class="echo-substat-table__top text-right pl-2 align-top" :data-test-echo-insights-top="row.type">
                <div class="font-mono font-semibold">{{ formatRollGain(value(row.type)!.top.delta) }}</div>
                <div class="font-mono text-[0.65rem] opacity-60 whitespace-nowrap">
                  {{ formatRollSize(row.type, value(row.type)!.top.roll) }} ·
                  {{ formatTopRollChance(value(row.type)!.top.chance) }}
                </div>
              </td>
            </template>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { EchoInsightRow } from "../composables/useEchoInsights";
import {
  formatRollGain,
  formatRollSize,
  formatTopRollChance,
  type SubstatValue,
} from "../echoes/substatRollValue";

const props = defineProps<{
  /** Row groups, in order; a group's label shows as a sub-heading row. */
  groups: Array<{ key: string; label?: string; rows: EchoInsightRow[] }>;
  /** Per-substat values; left out, only the substat column shows. */
  values?: Record<string, SubstatValue>;
  loading?: boolean;
}>();

const showValues = computed(() => Boolean(props.values) || props.loading);

function value(type: string): SubstatValue | undefined {
  return props.values?.[type];
}
</script>

<style scoped>
.echo-substat-table {
  container-type: inline-size;
}

.echo-substat-table__row td {
  background: oklch(var(--b2));
  border-top: 1px solid oklch(var(--b3));
  border-bottom: 1px solid oklch(var(--b3));
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  vertical-align: top;
}

.echo-substat-table__row td:first-child {
  border-left: 1px solid oklch(var(--b3));
  border-radius: 0.5rem 0 0 0.5rem;
  padding-left: 0.55rem;
}

.echo-substat-table__row td:last-child {
  border-right: 1px solid oklch(var(--b3));
  border-radius: 0 0.5rem 0.5rem 0;
  padding-right: 0.55rem;
}

.echo-substat-table__row--missing td {
  border-style: dashed;
}

.echo-substat-table__top-inline {
  display: none;
}

@container (max-width: 380px) {
  .echo-substat-table__top {
    display: none;
  }

  .echo-substat-table__top-inline {
    display: block;
  }

  /* Typical roll is the last visible cell now, so it closes the row. */
  .echo-substat-table__row td.echo-substat-table__typical {
    border-right: 1px solid oklch(var(--b3));
    border-radius: 0 0.5rem 0.5rem 0;
    padding-right: 0.55rem;
  }
}

/* Substat icons are dark-line glyphs drawn for a dark background: same
   light-mode inversion as the rest of the panel. */
html[data-theme-style="light"] img {
  filter: contrast(0);
}
</style>
