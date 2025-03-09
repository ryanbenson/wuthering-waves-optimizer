<template>
  <tr>
    <td colspan="4" class="text-center">
      <div class="flex justify-center items-center py-6">
        <div style="width: 320px">
          <canvas :id="uniqueKey" ref="chartCanvas"></canvas>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import Chart from "chart.js/auto";
export default {
  props: {
    character: {
      type: String,
      required: true,
    },
    rotation: {
      type: Array,
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
      };
      attacks.forEach((attack) => {
        attackDamagesByType[attack.type] += attack.damage.totalDamage;
      });
      // remove any keys that are 0
      Object.keys(attackDamagesByType).forEach((key) => {
        if (attackDamagesByType[key] === 0) {
          delete attackDamagesByType[key];
        }
      });
      // convert to array of objects
      return Object.keys(attackDamagesByType).map((key) => ({
        label: key,
        value: attackDamagesByType[key],
      }));
    },
  },
  mounted() {
    if (!this.$refs.chartCanvas) return;

    const ctx = this.$refs.chartCanvas.getContext("2d");

    // Destroy existing chart instance if it exists
    let chartStatus = Chart.getChart(this.$refs.chartCanvas);
    if (chartStatus) {
      chartStatus.destroy();
    }

    const labels = this.chartData.map((data) => data.label);
    const values = this.chartData.map((data) => Math.round(data.value));

    this.chartObj = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            label: this.name,
            data: values,
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
            ],
            hoverOffset: 4,
          },
        ],
      },
    });
  },
  beforeUnmount() {
    if (this.chartObj) {
      this.chartObj.destroy();
    }
  },
};
</script>
