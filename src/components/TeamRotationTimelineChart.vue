<template>
  <div
    v-if="points.length"
    class="team-rotation-timeline-chart"
    data-test-team-rotation-timeline-chart>
    <canvas :id="chartId" ref="chartCanvas"></canvas>
  </div>
  <div v-else class="opacity-70 text-sm" data-test-team-rotation-timeline-chart-empty>
    Add actions and a duration to see damage over time.
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Chart from "chart.js/auto";
import { displayDamage } from "../utils/numbers";
import type { TimelinePoint } from "../calculator/teamRotation";

const props = defineProps<{
  points: TimelinePoint[];
  duration: number | string | null;
}>();

const chartId = `team-rotation-timeline-chart-${Math.random().toString(36).slice(2)}`;
const chartCanvas = ref<HTMLCanvasElement | null>(null);

const durationNum = computed(() => Number(props.duration) || undefined);

function initChart() {
  if (!chartCanvas.value) return;
  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;
  Chart.getChart(chartCanvas.value)?.destroy();

  if (!props.points.length) return;

  new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Normal",
          data: props.points.map((p) => ({ x: p.time, y: p.normalDamage })),
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgb(54, 162, 235)",
          tension: 0.1,
        },
        {
          label: "Average",
          data: props.points.map((p) => ({ x: p.time, y: p.avgDamage })),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
        {
          label: "Crit",
          data: props.points.map((p) => ({ x: p.time, y: p.critDamage })),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgb(255, 99, 132)",
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "linear",
          min: 0,
          max: durationNum.value,
          title: { display: true, text: "Time (s)" },
        },
        y: {
          title: { display: true, text: "Damage" },
          ticks: {
            callback: (value) => displayDamage(Number(value)).toLocaleString(),
          },
        },
      },
      plugins: {
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

watch(() => props.points, initChart, { deep: true });
onMounted(() => initChart());
onBeforeUnmount(() => {
  if (chartCanvas.value) {
    Chart.getChart(chartCanvas.value)?.destroy();
  }
});
</script>
