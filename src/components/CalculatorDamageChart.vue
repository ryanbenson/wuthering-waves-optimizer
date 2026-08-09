<template>
  <div class="damage-chart">
    <div
      class="damage-chart__controls flex flex-wrap items-center justify-center gap-3 my-2">
      <div class="join">
        <button
          v-for="option in CHART_DAMAGE_METRIC_OPTIONS"
          :key="option.value"
          type="button"
          class="btn btn-xs join-item"
          :class="{ 'btn-primary': damageMetric === option.value }"
          :data-test-chart-damage-metric="option.value"
          @click="damageMetric = option.value">
          {{ option.label }}
        </button>
      </div>
      <div class="join">
        <button
          v-for="option in chartGroupByOptions"
          :key="option.value"
          type="button"
          class="btn btn-xs join-item"
          :class="{ 'btn-primary': groupBy === option.value }"
          :data-test-chart-group-by="option.value"
          @click="groupBy = option.value">
          {{ option.label }}
        </button>
      </div>
    </div>
    <div class="flex justify-center items-center py-6">
      <div style="width: 320px">
        <canvas :id="uniqueKey" ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useSettingsStore } from "../stores/settings";
import {
  CHART_DAMAGE_METRIC_OPTIONS,
  resolveChartDamageMetric,
  resolveChartGroupBy,
  type ChartDamageMetric,
  type ChartGroupBy,
} from "../utils/chartPreferences";

Chart.register(ChartDataLabels);

const chartGroupByOptions: Array<{ value: ChartGroupBy; label: string }> = [
  { value: "damageType", label: "Damage type" },
  { value: "forte", label: "Forte" },
];

type ChartAttack = {
  type: string;
  key?: string;
  actionType?: string | null;
  requiresResonanceChain?: string | false;
  originalIsEnabled?: boolean;
  damage: Record<string, number>;
};

const props = defineProps<{
  character: string;
  rotation: { attacks?: ChartAttack[] } | null;
  uniqueKey: string;
  name: string;
  charBuffsData: Record<string, any>;
  charResonanceChainsData: Record<string, any>;
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const chartObj = ref<Chart | null>(null);

const settingsStore = useSettingsStore();
const { config } = storeToRefs(settingsStore);

type ChartPrefsConfig = {
  chartDamageMetric?: ChartDamageMetric;
  chartGroupBy?: ChartGroupBy;
};

const damageMetric = ref<ChartDamageMetric>(
  resolveChartDamageMetric(
    (config.value as ChartPrefsConfig)?.chartDamageMetric,
  ),
);
const groupBy = ref<ChartGroupBy>(
  resolveChartGroupBy((config.value as ChartPrefsConfig)?.chartGroupBy),
);

const colorByDamageType: Record<string, string> = {
  Basic: "rgb(255, 99, 132)",
  Skill: "rgb(255, 159, 64)",
  Liberation: "rgb(255, 205, 125)",
  Intro: "rgb(153, 102, 255)",
  Heavy: "rgb(75, 192, 192)",
  Outro: "rgb(201, 203, 207)",
  Utility: "rgb(120, 120, 120)",
  Shield: "rgb(0, 173, 255)",
  Healing: "rgb(59, 234, 59)",
  Echo: "rgb(255, 99, 255)",
  TuneBreak: "rgb(72, 61, 139)",
  NegativeStatus: "rgb(186, 104, 200)",
};

const colorByForte: Record<string, string> = {
  "Normal Attack": "rgb(255, 99, 132)",
  "Resonance Skill": "rgb(255, 159, 64)",
  "Resonance Liberation": "rgb(255, 205, 125)",
  "Forte Circuit": "rgb(75, 192, 192)",
  Intro: "rgb(153, 102, 255)",
  Outro: "rgb(201, 203, 207)",
  Echo: "rgb(255, 99, 255)",
  "Negative Status": "rgb(186, 104, 200)",
  "Tune Break": "rgb(72, 61, 139)",
  Utility: "rgb(120, 120, 120)",
  Shield: "rgb(0, 173, 255)",
  Healing: "rgb(59, 234, 59)",
};

const forteLabelByActionType: Record<string, string> = {
  basic: "Normal Attack",
  skill: "Resonance Skill",
  liberation: "Resonance Liberation",
  forteCircuit: "Forte Circuit",
  forte: "Forte Circuit",
  intro: "Intro",
  outro: "Outro",
  echoAttacks: "Echo",
  echoSetAttacks: "Echo",
  negativeStatus: "Negative Status",
  tuneBreak: "Tune Break",
  utilityAttacks: "Utility",
};

function isAttackIncluded(attack: ChartAttack): boolean {
  const requiresResonanceChain = attack?.requiresResonanceChain ?? false;
  if (requiresResonanceChain) {
    const resonanceChainsEnabledAttacks =
      props.charResonanceChainsData?.value?.EnableAttack ?? [];
    const charBuffsEnabledAttacks =
      props.charBuffsData?.value?.EnableAttack ?? [];
    const enabledAttacks: string[] = []
      .concat(resonanceChainsEnabledAttacks)
      .concat(charBuffsEnabledAttacks);
    const isAttackEnabled = enabledAttacks.includes(
      attack.requiresResonanceChain as string,
    );
    if (!isAttackEnabled) {
      return false;
    }
  }
  if (attack.originalIsEnabled === false) {
    return false;
  }
  return true;
}

function getAttackDamageValue(
  attack: ChartAttack,
  metric: ChartDamageMetric,
): number {
  if (attack.type === "Shield") {
    return attack.damage?.shieldAmount ?? 0;
  }
  if (attack.type === "Healing") {
    return attack.damage?.healAmount ?? 0;
  }
  if (attack.type === "ElementalEffect") {
    if (metric === "normal") {
      return (
        attack.damage?.totalDamage ??
        attack.damage?.damage ??
        attack.damage?.avgDamage ??
        0
      );
    }
    if (metric === "crit") {
      return (
        attack.damage?.critDamage ??
        attack.damage?.damage ??
        attack.damage?.avgDamage ??
        0
      );
    }
    return (
      attack.damage?.avgDamage ??
      attack.damage?.damage ??
      attack.damage?.totalDamage ??
      0
    );
  }
  if (metric === "normal") {
    return attack.damage?.totalDamage ?? 0;
  }
  if (metric === "crit") {
    return attack.damage?.critDamage ?? 0;
  }
  return attack.damage?.avgDamage ?? 0;
}

function getDamageTypeBucket(attack: ChartAttack): string {
  if (attack.type === "ElementalEffect") {
    return "NegativeStatus";
  }
  return attack.type;
}

function getForteBucket(attack: ChartAttack): string {
  if (attack.actionType && forteLabelByActionType[attack.actionType]) {
    return forteLabelByActionType[attack.actionType];
  }
  if (attack.type === "ElementalEffect") {
    return "Negative Status";
  }
  if (attack.type === "Echo") {
    return "Echo";
  }
  if (attack.type === "Shield") {
    return "Shield";
  }
  if (attack.type === "Healing") {
    return "Healing";
  }
  if (attack.type === "TuneBreak") {
    return "Tune Break";
  }
  if (attack.type === "Utility") {
    return "Utility";
  }
  return attack.type;
}

const chartData = computed(() => {
  const attacks = props.rotation?.attacks ?? [];
  const buckets: Record<string, number> = {};
  const colors =
    groupBy.value === "forte" ? colorByForte : colorByDamageType;

  attacks.forEach((attack) => {
    if (!isAttackIncluded(attack)) {
      return;
    }
    const value = getAttackDamageValue(attack, damageMetric.value);
    if (!value) {
      return;
    }
    const bucket =
      groupBy.value === "forte"
        ? getForteBucket(attack)
        : getDamageTypeBucket(attack);
    buckets[bucket] = (buckets[bucket] ?? 0) + value;
  });

  const data = Object.keys(buckets).map((key) => ({
    label: key,
    value: buckets[key],
    color: colors[key] ?? "rgb(120, 120, 120)",
  }));
  data.sort((a, b) => b.value - a.value);
  return data;
});

function initChart() {
  if (!chartCanvas.value) return;
  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;
  Chart.getChart(chartCanvas.value)?.destroy();

  const labels = chartData.value.map((data) => data.label);
  const values = chartData.value.map((data) => Math.round(data.value));
  const total = values.reduce((a, b) => a + b, 0);
  const colors = chartData.value.map((data) => data.color);

  chartObj.value = new Chart(ctx, {
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
          font: {
            weight: "bold" as const,
          },
          formatter: (value) => {
            const percentage = (value / total) * 100;
            return percentage >= 8 ? `${percentage.toFixed(1)}%` : null;
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.parsed as number;
              const percentage = ((value / total) * 100).toFixed(1);
              const label = context.label || "";
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
        legend: {
          labels: {
            color: "#7480ff",
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}

watch(
  () => props.rotation,
  () => initChart(),
  { deep: true },
);

watch([damageMetric, groupBy, chartData], () => initChart());

onMounted(() => initChart());
onBeforeUnmount(() => {
  if (chartCanvas.value) {
    Chart.getChart(chartCanvas.value)?.destroy();
  }
});
</script>
