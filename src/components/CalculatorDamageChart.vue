<template>
  <div class="flex justify-center items-center py-6">
    <div style="width: 320px">
      <canvas :id="uniqueKey" ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

export default {
  props: {
    character: {
      type: String,
      required: true,
    },
    rotation: {
      type: Object,
      required: true,
    },
    uniqueKey: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    charBuffsData: {
      type: Object,
      required: true,
    },
    charResonanceChainsData: {
      type: Object,
      required: true,
    },
  },
  watch: {
    rotation: {
      handler: function (updatedRotation) {
        this.initChart(updatedRotation);
      },
      deep: true,
    },
  },
  data() {
    return {
      chartObj: null,
    };
  },
  computed: {
    chartData() {
      const attacks = this.rotation?.attacks ?? [];
      const attackDamagesByType = {
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
      };
      attacks.forEach((attack) => {
        // if this attack requires a resonance chain to be unlocked, verify it's enabled
        const requiresResonanceChain = attack?.requiresResonanceChain ?? false;
        if (requiresResonanceChain) {
          const resonanceChainsEnabledAttacks =
            this.charResonanceChainsData?.value?.EnableAttack ?? [];
          const charBuffsEnabledAttacks =
            this.charBuffsData?.value?.EnableAttack ?? [];
          // merge all possible enabled attack arrays together
          const enabledAttacks = []
            .concat(resonanceChainsEnabledAttacks)
            .concat(charBuffsEnabledAttacks);
          const isAttackEnabled = enabledAttacks.includes(
            attack.requiresResonanceChain,
          );
          if (!isAttackEnabled) {
            return;
          }
        }
        if (attack.type === "Shield") {
          attackDamagesByType[attack.type] += attack.damage.shieldAmount;
        } else if (attack.type === "Healing") {
          attackDamagesByType[attack.type] += attack.damage.healAmount;
        } else {
          attackDamagesByType[attack.type] += attack.damage.avgDamage;
        }
      });
      // remove any keys that are 0
      Object.keys(attackDamagesByType).forEach((key) => {
        if (attackDamagesByType[key] === 0) {
          delete attackDamagesByType[key];
        }
      });
      // convert to array of objects
      const data = Object.keys(attackDamagesByType).map((key) => ({
        label: key,
        value: attackDamagesByType[key],
        color: this.colorByType[key],
      }));
      // sort the data so it shows highest -> lowest damages
      data.sort((a, b) => b.value - a.value);
      return data;
    },
    colorByType() {
      return {
        Basic: "rgb(255, 99, 132)", // Muted Red
        Skill: "rgb(255, 159, 64)", // Muted Orange
        Liberation: "rgb(255, 205, 125)", // Muted Yellow
        Intro: "rgb(153, 102, 255)", // Muted Purple
        Heavy: "rgb(75, 192, 192)", // Teal
        Outro: "rgb(201, 203, 207)", // Soft Gray
        Utility: "rgb(120, 120, 120)", // Dark Gray
        Shield: "rgb(0, 173, 255)", // Blue
        Healing: "rgb(59, 234, 59)", // Green
        Echo: "rgb(255, 99, 255)", // Magenta
        TuneBreak: "rgb(72, 61, 139)", // Muted Indigo
      };
    },
  },
  methods: {
    initChart(rotationData) {
      if (!this.$refs.chartCanvas) return;
      const ctx = this.$refs.chartCanvas.getContext("2d");

      // Destroy existing chart instance if it exists
      let chartStatus = Chart.getChart(this.$refs.chartCanvas);
      if (chartStatus) {
        chartStatus.destroy();
      }

      const labels = this.chartData.map((data) => data.label);
      const values = this.chartData.map((data) => Math.round(data.value));
      const total = values.reduce((a, b) => a + b, 0);
      const colors = this.chartData.map((data) => data.color);

      this.chartObj = new Chart(ctx, {
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
                weight: "bold",
              },
              formatter: (value, context) => {
                const percentage = (value / total) * 100;
                return percentage >= 8 ? `${percentage.toFixed(1)}%` : null;
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed;
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
    },
  },
  mounted() {
    this.initChart(this.rotation);
  },
  beforeUnmount() {
    let chartStatus = Chart.getChart(this.$refs.chartCanvas);
    if (chartStatus) {
      chartStatus.destroy();
    }
  },
};
</script>
