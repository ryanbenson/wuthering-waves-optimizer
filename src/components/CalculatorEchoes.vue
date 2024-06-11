<template>
  <div>
    <div v-for="(echo, index) in echoes" :key="index" class="echo-selector">
      <label>Echo {{ index + 1 }}:</label>
      <select v-model="echo.type" @change="updateTotalStats">
        <option value="" disabled>Select Echo</option>
        <option value="1">1-Cost Echo</option>
        <option value="3">3-Cost Echo</option>
        <option value="4">4-Cost Echo</option>
      </select>
      <select
        v-model="echo.rank"
        @change="updateTotalStats"
        :disabled="!echo.type">
        <option value="" disabled>Select Rank</option>
        <option v-for="rank in [2, 3, 4, 5]" :key="rank" :value="rank">
          Rank {{ rank }}
        </option>
      </select>
      <select
        v-model="echo.stat"
        @change="updateTotalStats"
        :disabled="!echo.type">
        <option value="" disabled>Select Stat</option>
        <option v-for="stat in getStats(echo.type)" :key="stat" :value="stat">
          {{ getReadableLabel(stat) }}
        </option>
      </select>
      <div v-for="i in 5" :key="i" class="sub-stat-selector">
        <select v-model="echo.subStats[i - 1].type" @change="updateTotalStats">
          <option value="" disabled>Select Sub Stat</option>
          <option v-for="subStat in subStats" :key="subStat" :value="subStat">
            {{ getReadableLabel(subStat) }}
          </option>
        </select>
        <input
          v-model.number="echo.subStats[i - 1].value"
          :min="getSubStatRange(echo.subStats[i - 1].type).min"
          :max="getSubStatRange(echo.subStats[i - 1].type).max"
          type="number"
          :disabled="!echo.subStats[i - 1].type"
          @input="updateTotalStats" />
      </div>
    </div>
    <div class="total-cost">Total Cost: {{ totalCost }} / 12</div>
    <div v-if="false" class="total-stats">
      <h3>Total Stats:</h3>
      <div v-for="(value, key) in totalStats" :key="key">
        {{ key }}: {{ value }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      echoes: Array(5)
        .fill()
        .map(() => ({
          type: "",
          rank: "5",
          stat: "",
          subStats: Array(5)
            .fill()
            .map(() => ({ type: "", value: 0 })),
        })),
      statsTable: {
        1: {
          HP: { 2: 5.7, 3: 8.1, 4: 11.3, 5: 18.0 },
          ATK: { 2: 5.7, 3: 8.1, 4: 11.3, 5: 18.0 },
          DEF: { 2: 7.2, 3: 10.2, 4: 14.2, 5: 22.8 },
          HP_FLAT: { 2: 296, 3: 516, 4: 957, 5: 2280 },
        },
        3: {
          HP: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
          ATK: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
          DEF: { 2: 12.3, 3: 17.0, 4: 23.9, 5: 38 },
          Glacio: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
          Fusion: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
          Electro: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
          Aero: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
          Spectro: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
          Havoc: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
          EnergyRegen: { 2: 10, 3: 14.2, 4: 20.1, 5: 32.0 },
          ATK_FLAT: { 2: 31, 3: 44, 4: 63, 5: 100 },
        },
        4: {
          HP: { 2: 10.6, 3: 14.6, 4: 20.5, 5: 33.0 },
          ATK: { 2: 10.6, 3: 14.6, 4: 20.5, 5: 33.0 },
          DEF: { 2: 13.5, 3: 18.7, 4: 26.0, 5: 41.5 },
          CritRate: { 2: 7.1, 3: 9.8, 4: 13.8, 5: 22.0 },
          CritDMG: { 2: 14.3, 3: 19.7, 4: 27.7, 5: 44.0 },
          HealingBonus: { 2: 8.5, 3: 11.9, 4: 16.3, 5: 26.0 },
          ATK_FLAT: { 2: 46, 3: 68, 4: 92, 5: 150 },
        },
      },
      flatBonusesByRankByType: {
        1: {
          2: 296,
          3: 516,
          4: 957,
          5: 1696,
        },
        3: {
          2: 31,
          3: 44,
          4: 63,
          5: 100,
        },
        4: {
          2: 46,
          3: 68,
          4: 92,
          5: 150,
        },
      },
      subStats: [
        "HP_FLAT",
        "ATK_FLAT",
        "DEF_FLAT",
        "ATK",
        "HP",
        "DEF",
        "EnergyRegen",
        "CritRate",
        "CritDMG",
        "BasicAttackDMGBonus",
        "HeavyAttackDMGBonus",
        "ResonanceSkillDMGBonus",
        "ResonanceLiberationDMGBonus",
      ],
      subStatRanges: {
        HP_FLAT: { min: 320, max: 580 },
        ATK_FLAT: { min: 50, max: 70 },
        DEF_FLAT: { min: 50, max: 70 },
        ATK: { min: 6.4, max: 11.6 },
        HP: { min: 6.4, max: 11.6 },
        DEF: { min: 8.1, max: 14.7 },
        EnergyRegen: { min: 5.6, max: 14.9 },
        CritRate: { min: 6.3, max: 10.5 },
        CritDMG: { min: 12.6, max: 21.0 },
        BasicAttackDMGBonus: { min: 6.4, max: 11.6 },
        HeavyAttackDMGBonus: { min: 6.4, max: 11.6 },
        ResonanceSkillDMGBonus: { min: 6.4, max: 11.6 },
        ResonanceLiberationDMGBonus: { min: 6.4, max: 11.6 },
      },
      totalCost: 0,
      totalStats: {},
    };
  },
  methods: {
    getReadableLabel(key) {
      const map = {
        HP_FLAT: "HP",
        ATK_FLAT: "ATK",
        DEF_FLAT: "DEF",
        ATK: "ATK%",
        HP: "HP%",
        DEF: "DEF%",
        EnergyRegen: "Energy Regen",
        CritRate: "Crit Rate",
        CritDMG: "Crit DMG",
        BasicAttackDMGBonus: "Basic Attack DMG Bonus",
        HeavyAttackDMGBonus: "Heavy Attack DMG Bonus",
        ResonanceSkillDMGBonus: "Resonance Skill DMG Bonus",
        ResonanceLiberationDMGBonus: "Resonance Liberation DMG Bonus",
        Glacio: "Glacio DMG Bonus",
        Fusion: "Fusion DMG Bonus",
        Electro: "Electro DMG Bonus",
        Aero: "Aero DMG Bonus",
        Spectro: "Spectro DMG Bonus",
        Havoc: "Havoc DMG Bonus",
        HealingBonus: "Healing Bonus",
      };
      return map[key];
    },
    getStats(cost) {
      return Object.keys(this.statsTable[cost] || {});
    },
    getSubStatRange(type) {
      return this.subStatRanges[type] || { min: 0, max: 0 };
    },
    updateTotalStats() {
      this.totalCost = this.echoes.reduce(
        (sum, echo) => sum + (parseInt(echo.type) || 0),
        0
      );
      if (this.totalCost > 12) {
        alert("Total cost exceeds the limit of 12.");
        return;
      }

      const stats = {};
      for (const echo of this.echoes) {
        // add in the base stats (flat HP and flat ATK) that's guaranteed
        if (echo.type && echo.rank) {
          let stat = echo.type === "1" ? "HP_FLAT" : "ATK_FLAT";
          let statValue = this.flatBonusesByRankByType[echo.type][echo.rank];
          console.log("flat bonus of echo", statValue);
          stats[stat] = (stats[stat] || 0) + statValue;
        }
        if (echo.type && echo.rank && echo.stat) {
          const max = this.statsTable[echo.type][echo.stat][echo.rank];
          stats[echo.stat] = (stats[echo.stat] || 0) + max;
        }
        for (const subStat of echo.subStats) {
          if (subStat.type) {
            stats[subStat.type] = (stats[subStat.type] || 0) + subStat.value;
          }
        }
      }
      this.totalStats = stats;
      this.$emit("update-stats", this.totalStats);
    },
  },
};
</script>

<style scoped>
.echo-selector {
  margin-bottom: 20px;
}

.sub-stat-selector {
  display: flex;
  margin-top: 5px;
}

.sub-stat-selector select,
.sub-stat-selector input {
  margin-right: 10px;
}
</style>
