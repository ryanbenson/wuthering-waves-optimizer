<template>
  <div class="grid gap-1.5 text-xs" data-test-rotation-share-bars>
    <div v-for="bar in bars" :key="bar.label" class="grid grid-cols-[4.5rem_1fr] items-center gap-2">
      <span class="font-semibold">{{ bar.label }}</span>
      <div class="flex h-6 gap-[2px]">
        <div
          v-for="segment in bar.segments"
          :key="segment.key"
          class="share-bars__segment"
          :style="{ width: `${segment.pct}%`, background: segment.color, color: segment.ink }"
          :title="segment.title"
          :aria-label="segment.title"
          role="img"
          :data-test-rotation-share-segment="`${bar.label}:${segment.key}`">
          <span v-if="segment.pct >= 12">{{ Math.round(segment.pct) }}%</span>
        </div>
      </div>
    </div>
    <details class="mt-1">
      <summary class="cursor-pointer opacity-70 w-fit">Show as a table</summary>
      <div class="overflow-x-auto mt-1">
        <table class="table table-xs" data-test-rotation-share-table>
          <thead>
            <tr>
              <th>{{ groupLabel }}</th>
              <th class="text-right">Field time</th>
              <th class="text-right">Damage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.key">
              <td>
                <span class="share-bars__swatch" :style="{ background: row.color }"></span>{{ row.name }}
              </td>
              <td class="text-right font-mono">{{ row.time }}</td>
              <td class="text-right font-mono">{{ row.damage }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { fullNumber, secondsText } from "../utils/rotationChart";

export interface ShareBarRow {
  key: string;
  name: string;
  color: string;
  /** Text color on `color`; defaults to near-black. */
  ink?: string;
  frames: number;
  value: number;
}

const props = defineProps<{ rows: ShareBarRow[]; groupLabel: string }>();

const totals = computed(() => ({
  frames: props.rows.reduce((sum, row) => sum + row.frames, 0),
  value: props.rows.reduce((sum, row) => sum + row.value, 0),
}));

function share(part: number, whole: number): number {
  return whole > 0 ? (part / whole) * 100 : 0;
}

const bars = computed(() =>
  (
    [
      ["Field time", "frames"],
      ["Damage", "value"],
    ] as const
  ).map(([label, field]) => ({
    label,
    segments: props.rows
      .filter((row) => row[field] > 0)
      .map((row) => {
        const pct = share(row[field], totals.value[field]);
        const amount = field === "frames" ? secondsText(row.frames) : fullNumber(row.value);
        return {
          key: row.key,
          color: row.color,
          ink: row.ink,
          pct,
          title: `${row.name}: ${amount} · ${Math.round(pct)}% of ${label.toLowerCase()}`,
        };
      }),
  })),
);

const tableRows = computed(() =>
  props.rows.map((row) => ({
    ...row,
    time: `${secondsText(row.frames)} (${Math.round(share(row.frames, totals.value.frames))}%)`,
    damage: `${fullNumber(row.value)} (${Math.round(share(row.value, totals.value.value))}%)`,
  })),
);
</script>

<style scoped lang="scss">
.share-bars__segment {
  display: flex;
  align-items: center;
  min-width: 4px;
  padding-left: 0.375rem;
  border-radius: 0.25rem;
  overflow: hidden;
  color: #0b0b0b;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.share-bars__swatch {
  display: inline-block;
  width: 0.625rem;
  height: 0.625rem;
  margin-right: 0.375rem;
  border-radius: 2px;
  vertical-align: -1px;
}
</style>
