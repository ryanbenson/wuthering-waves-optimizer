<template>
  <div>
    <CalculatorOptimizerMinStat
      v-for="stat in stats"
      :key="stat.id"
      :id="stat.id"
      :stat="stat.stat"
      :min-value="stat.minValue"
      :all-stats="stats"
      @updated-min-stat="handleUpdatedMinStats"
      @remove-min-stat="handleRemoveMinStat"
      class="mt-2"></CalculatorOptimizerMinStat>
    <button @click="addNewStat" class="btn btn-primary btn-sm mt-4">
      Add New Stat
    </button>
  </div>
</template>

<script>
import CalculatorOptimizerMinStat from "./CalculatorOptimizerMinStat.vue";
import { subStats, getReadableSubStatLabel } from "../echoes/stats";
import { randomString } from "../utils/strings";
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";

export default {
  name: "CalculatorOptimizerMinStats",
  props: {
    character: {
      type: String,
      required: true,
    },
    minStats: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CalculatorOptimizerMinStat,
  },
  data() {
    return {
      stats: [],
    };
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterOptimizerMinStats"]),
    addNewStat() {
      this.stats.push({ id: randomString(), stat: null, minValue: null });
    },
    handleUpdatedMinStats(data) {
      const index = this.stats.findIndex((stat) => stat.id === data.id);
      this.stats[index] = {
        id: data.id,
        stat: data.stat,
        minValue: data.minValue,
      };
      this.updatedMinStats();
    },
    handleRemoveMinStat({ id }) {
      const updatedStats = this.stats.filter((stat) => {
        return stat.id !== id;
      });
      this.stats = updatedStats;
      this.updatedMinStats();
    },
    async updatedMinStats() {
      await this.setCharacterOptimizerMinStats(this.character, this.stats);
      this.$emit("updated-min-stats", this.stats);
    },
  },
  mounted() {
    this.stats = this.minStats;
  },
};
</script>
