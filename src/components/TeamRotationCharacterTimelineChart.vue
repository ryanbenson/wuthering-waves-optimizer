<template>
  <div
    v-if="points.length"
    class="team-rotation-character-timeline-chart h-72 relative"
    data-test-team-rotation-character-timeline-chart>
    <canvas :id="chartId" ref="chartCanvas"></canvas>
  </div>
  <div v-else class="opacity-70 text-sm" data-test-team-rotation-character-timeline-chart-empty>
    Add actions and a duration to see damage over time by character.
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Chart from "chart.js/auto";
import { getCharacterRosterDisplayName } from "../characters/characters";
import { displayDamage } from "../utils/numbers";
import { palette } from "../utils/chartColors";
import type { TimelinePoint } from "../calculator/teamRotation";
import { CHART_DAMAGE_METRIC_OPTIONS, type ChartDamageMetric } from "../utils/chartPreferences";

const props = withDefaults(
  defineProps<{
    points: TimelinePoint[];
    metric?: ChartDamageMetric;
  }>(),
  { metric: "average" },
);

function metricValue(p: TimelinePoint) {
  if (props.metric === "normal") return p.normalDamage;
  if (props.metric === "crit") return p.critDamage;
  return p.avgDamage;
}

const metricLabel = computed(
  () => CHART_DAMAGE_METRIC_OPTIONS.find((o) => o.value === props.metric)?.label ?? "Average",
);

const chartId = `team-rotation-character-timeline-chart-${Math.random().toString(36).slice(2)}`;
const chartCanvas = ref<HTMLCanvasElement | null>(null);

// Plots a single metric (not all 3) — one line per character already gives
// up to 3 lines; adding normal/avg/crit for each would be 9 lines,
// unreadable. Which metric is shown is controlled by the `metric` prop.
const byCharacter = computed(() => {
  const characterIds = Array.from(new Set(props.points.map((p) => p.characterId)));
  return characterIds.map((characterId) => ({
    characterId,
    label: getCharacterRosterDisplayName(characterId),
    points: props.points.filter((p) => p.characterId === characterId),
  }));
});

function initChart() {
  if (!chartCanvas.value) return;
  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;
  Chart.getChart(chartCanvas.value)?.destroy();

  if (!props.points.length) return;

  new Chart(ctx, {
    type: "line",
    data: {
      datasets: byCharacter.value.map((entry, index) => ({
        label: entry.label,
        data: entry.points.map((p) => ({ x: p.time, y: metricValue(p) })),
        borderColor: palette[index % palette.length],
        backgroundColor: palette[index % palette.length],
        tension: 0.1,
      })),
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
          title: { display: true, text: `${metricLabel.value} Damage` },
          ticks: {
            callback: (value) => displayDamage(Number(value)).toLocaleString(),
          },
        },
      },
      plugins: {
        // See TeamRotationTimelineChart.vue — chartjs-plugin-datalabels is
        // registered globally and must be opted out per-chart.
        datalabels: { display: false },
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: (context) => {
              const parsed = context.parsed as { x: number; y: number };
              return `${context.dataset.label}: ${displayDamage(parsed.y).toLocaleString()} at ${parsed.x.toFixed(1)}s`;
            },
          },
        },
      },
    },
  });
}

// flush: "post" matters here — see TeamRotationTimelineChart.vue for why.
watch(() => [props.points, props.metric], initChart, { deep: true, flush: "post" });
onMounted(() => initChart());
onBeforeUnmount(() => {
  if (chartCanvas.value) {
    Chart.getChart(chartCanvas.value)?.destroy();
  }
});
</script>
