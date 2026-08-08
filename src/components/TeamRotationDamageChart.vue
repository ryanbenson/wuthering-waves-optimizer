<template>
  <div v-if="chartData.length" class="team-rotation-damage-chart" data-test-team-rotation-damage-chart>
    <div class="flex justify-center items-center py-4">
      <div style="width: 220px">
        <canvas :id="chartId" ref="chartCanvas"></canvas>
      </div>
    </div>
    <ul class="flex flex-col gap-1 text-sm">
      <li
        v-for="(entry, index) in chartData"
        :key="entry.characterId"
        class="flex items-center justify-between gap-2"
        :data-test-team-rotation-damage-chart-entry="entry.characterId">
        <span class="flex items-center gap-2 min-w-0">
          <span class="size-3 rounded-full shrink-0" :style="{ backgroundColor: palette[index % palette.length] }"></span>
          <span class="truncate">{{ entry.label }}</span>
        </span>
        <span class="shrink-0 opacity-80">
          {{ displayDamage(entry.value) }} ({{ entry.percentage.toFixed(1) }}%)
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getCharacterRosterDisplayName } from "../characters/characters";
import { displayDamage } from "../utils/numbers";
import type { TeamRotationCharacterResult } from "../calculator/teamRotation";

Chart.register(ChartDataLabels);

const props = defineProps<{
  perCharacter: Record<string, TeamRotationCharacterResult>;
}>();

const chartId = `team-rotation-damage-chart-${Math.random().toString(36).slice(2)}`;
const chartCanvas = ref<HTMLCanvasElement | null>(null);

const palette = [
  "rgb(255, 99, 132)",
  "rgb(54, 162, 235)",
  "rgb(255, 206, 86)",
  "rgb(75, 192, 192)",
  "rgb(153, 102, 255)",
  "rgb(255, 159, 64)",
];

const chartData = computed(() => {
  const entries = Object.entries(props.perCharacter)
    .map(([characterId, data]) => ({
      characterId,
      label: getCharacterRosterDisplayName(characterId),
      value: data.damageAggregation.normalDamage ?? 0,
    }))
    .filter((entry) => entry.value > 0);
  const total = entries.reduce((sum, entry) => sum + entry.value, 0);
  entries.sort((a, b) => b.value - a.value);
  return entries.map((entry) => ({
    ...entry,
    percentage: total > 0 ? (entry.value / total) * 100 : 0,
  }));
});

function initChart() {
  if (!chartCanvas.value) return;
  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;
  Chart.getChart(chartCanvas.value)?.destroy();

  if (!chartData.value.length) return;

  const labels = chartData.value.map((d) => d.label);
  const values = chartData.value.map((d) => Math.round(d.value));
  const total = values.reduce((a, b) => a + b, 0);
  const colors = chartData.value.map((_, i) => palette[i % palette.length]);

  new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          color: "#fff",
          font: { weight: "bold" as const },
          formatter: (value: number) => {
            const percentage = total > 0 ? (value / total) * 100 : 0;
            return percentage >= 5 ? `${percentage.toFixed(1)}%` : null;
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.parsed as number;
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
              return `${context.label}: ${value.toLocaleString()} (${percentage}%)`;
            },
          },
        },
        legend: {
          display: false,
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}

watch(chartData, () => initChart(), { deep: true });
onMounted(() => initChart());
onBeforeUnmount(() => {
  if (chartCanvas.value) {
    Chart.getChart(chartCanvas.value)?.destroy();
  }
});
</script>
