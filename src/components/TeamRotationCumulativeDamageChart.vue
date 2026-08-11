<template>
  <div
    v-if="points.length"
    class="team-rotation-cumulative-damage-chart h-72 relative"
    data-test-team-rotation-cumulative-damage-chart>
    <canvas :id="chartId" ref="chartCanvas"></canvas>
  </div>
  <div v-else class="opacity-70 text-sm" data-test-team-rotation-cumulative-damage-chart-empty>
    Add actions and a duration to see cumulative damage over time.
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Chart from "chart.js/auto";
import { getCharacterRosterDisplayName } from "../characters/characters";
import { displayDamage } from "../utils/numbers";
import { palette } from "../utils/chartColors";
import type { TimelinePoint } from "../calculator/teamRotation";

const props = defineProps<{
  points: TimelinePoint[];
}>();

const chartId = `team-rotation-cumulative-damage-chart-${Math.random().toString(36).slice(2)}`;
const chartCanvas = ref<HTMLCanvasElement | null>(null);

function toFillColor(borderColor: string) {
  return borderColor.replace("rgb(", "rgba(").replace(")", ", 0.4)");
}

// Running per-character total at each action's timestamp (in the same
// chronological order calcRotationTimeline already produced), so each
// dataset shows that character's contribution stacking up toward the
// team's total over the course of the rotation — complements the two
// "damage at this instant" timeline charts with a "damage so far" view.
const cumulativeRows = computed(() => {
  const characterIds = Array.from(new Set(props.points.map((p) => p.characterId)));
  const running: Record<string, number> = {};
  for (const id of characterIds) running[id] = 0;

  return props.points.map((point) => {
    running[point.characterId] = (running[point.characterId] ?? 0) + point.avgDamage;
    return { time: point.time, totals: { ...running } };
  });
});

const characterIds = computed(() => Array.from(new Set(props.points.map((p) => p.characterId))));

function initChart() {
  if (!chartCanvas.value) return;
  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;
  Chart.getChart(chartCanvas.value)?.destroy();

  if (!props.points.length) return;

  const rows = cumulativeRows.value;

  new Chart(ctx, {
    type: "line",
    data: {
      datasets: characterIds.value.map((characterId, index) => {
        const color = palette[index % palette.length];
        return {
          label: getCharacterRosterDisplayName(characterId),
          data: rows.map((row) => ({ x: row.time, y: row.totals[characterId] ?? 0 })),
          borderColor: color,
          backgroundColor: toFillColor(color),
          fill: true,
          stepped: true,
          tension: 0,
        };
      }),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "linear",
          min: 0,
          title: { display: true, text: "Time (s)" },
        },
        y: {
          stacked: true,
          title: { display: true, text: "Cumulative Damage" },
          ticks: {
            callback: (value) => displayDamage(Number(value)).toLocaleString(),
          },
        },
      },
      plugins: {
        // chartjs-plugin-datalabels is registered globally (see
        // TeamRotationDamageChart.vue) and must be opted out per-chart.
        datalabels: { display: false },
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: (context) => {
              const parsed = context.parsed as { x: number; y: number };
              return `${context.dataset.label}: ${displayDamage(parsed.y).toLocaleString()} by ${parsed.x.toFixed(1)}s`;
            },
          },
        },
      },
    },
  });
}

// flush: "post" matters here — see TeamRotationTimelineChart.vue for why.
watch(() => props.points, initChart, { deep: true, flush: "post" });
onMounted(() => initChart());
onBeforeUnmount(() => {
  if (chartCanvas.value) {
    Chart.getChart(chartCanvas.value)?.destroy();
  }
});
</script>
