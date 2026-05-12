<template>
  <div class="flex justify-center items-center py-6">
    <div style="width: 320px">
      <canvas :id="uniqueKey" ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

type ChartAttack = {
  type: string;
  key?: string;
  requiresResonanceChain?: string | false;
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

const colorByType: Record<string, string> = {
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
  // Forte Glacio Bite (type GlacioChafe); separate from rotation negative-status Glacio Chafe
  GlacioBite: "rgb(156, 84, 180)",
};

const bucketChartLabel: Record<string, string> = {
  GlacioBite: "Glacio Bite",
};

const chartData = computed(() => {
      const attacks = props.rotation?.attacks ?? [];
      const attackDamagesByType: Record<string, number> = {
        Basic: 0,
        Skill: 0,
        Liberation: 0,
        Intro: 0,
        Heavy: 0,
        Outro: 0,
        Utility: 0,
        Shield: 0,
        Healing: 0,
        Echo: 0,
        TuneBreak: 0,
        NegativeStatus: 0,
        GlacioBite: 0,
      };
      attacks.forEach((attack) => {
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
            return;
          }
        }
        if (attack.type === "Shield") {
          attackDamagesByType[attack.type] += attack.damage.shieldAmount;
        } else if (attack.type === "Healing") {
          attackDamagesByType[attack.type] += attack.damage.healAmount;
        } else if (attack.type === "ElementalEffect") {
          // Rotation negative status (Frazzle, Chafe, etc.) — not kit forte "GlacioChafe" type
          let val = 0;
          if (attack.damage?.avgDamage !== undefined) {
            val = attack.damage.avgDamage;
          } else if (attack.damage?.damage !== undefined) {
            val = attack.damage.damage;
          }
          attackDamagesByType.NegativeStatus += val;
        } else if (attack.type === "GlacioChafe") {
          // e.g. Hiyuki Glacio Bite DMG (forte); same bucket name would double-count with rotation Chafe
          let val = 0;
          if (attack.damage?.avgDamage !== undefined) {
            val = attack.damage.avgDamage;
          } else if (attack.damage?.damage !== undefined) {
            val = attack.damage.damage;
          }
          attackDamagesByType.GlacioBite += val;
        } else {
          attackDamagesByType[attack.type] += attack.damage.avgDamage;
        }
      });
      // remove any keys that are 0
      Object.keys(attackDamagesByType).forEach((key) => {
        if (attackDamagesByType[key as keyof typeof attackDamagesByType] === 0) {
          delete attackDamagesByType[key as keyof typeof attackDamagesByType];
        }
      });
      const data = Object.keys(attackDamagesByType).map((key) => ({
        label: bucketChartLabel[key] ?? key,
        value: attackDamagesByType[key as keyof typeof attackDamagesByType],
        color: colorByType[key],
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

onMounted(() => initChart());
onBeforeUnmount(() => {
  if (chartCanvas.value) {
    Chart.getChart(chartCanvas.value)?.destroy();
  }
});
</script>
