<template>
  <div>
    <h3>Main Echo</h3>
    <select name="mainEcho" :value="mainEcho">
      <optgroup label="Overlord">
        <option v-for="option in mainEchoOptions.Overlord" :key="option.key">{{ option.name }}</option>
      </optgroup>
      <optgroup label="Elite">
        <option v-for="option in mainEchoOptions.Elite" :key="option.key">{{ option.name }}</option>
      </optgroup>
      <optgroup label="Common">
        <option v-for="option in mainEchoOptions.Common" :key="option.key">{{ option.name }}</option>
      </optgroup>
    </select>
    <div v-for="(echo, index) in echoes" :key="index" class="echo-selector">
      <label>Echo {{ index + 1 }}:</label>
      <div class="echo-setup">
        <!-- Cost Selection -->
        <div class="cost-selector">
          <label>Cost:</label>
          <div class="cost-options">
            <button
              v-for="cost in [1, 3, 4]"
              :key="cost"
              :class="{ selected: echo.type == cost }"
              @click="selectCost(index, cost)">
              0{{ cost }}
            </button>
          </div>
        </div>

        <!-- Rank Selection -->
        <div class="rank-selector">
          <label>Rank:</label>
          <div class="rank-options">
            <div
              v-for="rank in [2, 3, 4, 5]"
              :key="rank"
              :class="['rank-circle', { selected: echo.rank == rank }]"
              :style="{ backgroundColor: rankColors[rank] }"
              @click="selectRank(index, rank)"></div>
          </div>
        </div>
      </div>
      <select
        v-model="echo.stat"
        @change="updateTotalStats"
        :disabled="!echo.type">
        <option value="">Select Stat</option>
        <option v-for="stat in getStats(echo.type)" :key="stat" :value="stat">
          {{ getReadableLabel(stat) }}
        </option>
      </select>
      <div v-for="i in 5" :key="i" class="sub-stat-selector">
        <select v-model="echo.subStats[i - 1].type" @change="updateTotalStats">
          <option value="">Select Sub Stat</option>
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
          @input="updateTotalStats"
          class="sub-stat__input" />
      </div>
    </div>
    <div class="set-bonus-selector">
      <label>Set Bonuses:</label>
      <div>
        <select v-model="setBonuses[0].type" @change="updateTotalStats">
          <option value="">Select 2 Set Bonus</option>
          <option
            v-for="setBonus in twoSetBonuses"
            :key="setBonus"
            :value="setBonus">
            {{ setBonus }}
          </option>
        </select>
      </div>
      <div>
        <select v-model="setBonuses[1].type" @change="updateTotalStats">
          <option value="">Select 5 Set Bonus or another 2 Set Bonus</option>
          <optgroup label="5 Set Bonuses">
            <option
              v-for="setBonus in fiveSetBonuses"
              :key="setBonus"
              :value="setBonus">
              {{ setBonus }}
            </option>
          </optgroup>
          <optgroup label="2 Set Bonuses">
            <option
              v-for="setBonus in twoSetBonuses"
              :key="setBonus"
              :value="setBonus">
              {{ setBonus }}
            </option>
          </optgroup>
        </select>
      </div>
      <div v-if="needsStacks(setBonuses[1].type)">
        <label>Stacks:</label>
        <input
          v-model.number="setBonuses[1].stacks"
          type="number"
          min="0"
          :max="getMaxStacks(setBonuses[1].type)"
          @input="updateTotalStats" />
      </div>
    </div>
    <div class="total-cost">Total Cost: {{ totalCost }} / 12</div>
  </div>
</template>

<script>
import { mainEchoesData } from '../echoes/index.ts';
export default {
  data() {
    return {
      mainEcho: null,
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
      rankColors: {
        2: "#11cb11",
        3: "#0580ff",
        4: "#a314a3",
        5: "#e1e115",
      },
      statsTable: {
        1: {
          HP: { 2: 5.7, 3: 8.1, 4: 11.3, 5: 18.0 },
          ATK: { 2: 5.7, 3: 8.1, 4: 11.3, 5: 18.0 },
          DEF: { 2: 7.2, 3: 10.2, 4: 14.2, 5: 22.8 },
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
        },
        4: {
          HP: { 2: 10.6, 3: 14.6, 4: 20.5, 5: 33.0 },
          ATK: { 2: 10.6, 3: 14.6, 4: 20.5, 5: 33.0 },
          DEF: { 2: 13.5, 3: 18.7, 4: 26.0, 5: 41.5 },
          CritRate: { 2: 7.1, 3: 9.8, 4: 13.8, 5: 22.0 },
          CritDMG: { 2: 14.3, 3: 19.7, 4: 27.7, 5: 44.0 },
          HealingBonus: { 2: 8.5, 3: 11.9, 4: 16.3, 5: 26.0 },
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
        ATK_FLAT: { min: 30, max: 60 },
        DEF_FLAT: { min: 40, max: 70 },
        ATK: { min: 6.4, max: 11.6 },
        HP: { min: 6.4, max: 11.6 },
        DEF: { min: 8.1, max: 14.7 },
        EnergyRegen: { min: 6.8, max: 12.4 },
        CritRate: { min: 6.3, max: 10.5 },
        CritDMG: { min: 12.6, max: 21.0 },
        BasicAttackDMGBonus: { min: 6.4, max: 11.6 },
        HeavyAttackDMGBonus: { min: 6.4, max: 11.6 },
        ResonanceSkillDMGBonus: { min: 6.4, max: 11.6 },
        ResonanceLiberationDMGBonus: { min: 6.4, max: 11.6 },
      },
      totalCost: 0,
      totalStats: {},
      setBonuses: [
        { type: "", stacks: 0 },
        { type: "", stacks: 0 },
      ],
      twoSetBonuses: [
        "Freezing Frost 2 Set",
        "Molten Rift 2 Set",
        "Void Thunder 2 Set",
        "Sierra Gale 2 Set",
        "Celestial Light 2 Set",
        "Sun-sinking Eclipse 2 Set",
        "Rejuvenating Glow 2 Set",
        "Moonlit Clouds 2 Set",
        "Lingering Tunes 2 Set",
      ],
      fiveSetBonuses: [
        "Freezing Frost 5 Set",
        "Molten Rift 5 Set",
        "Void Thunder 5 Set",
        "Sierra Gale 5 Set",
        "Celestial Light 5 Set",
        "Sun-sinking Eclipse 5 Set",
        "Rejuvenating Glow 5 Set",
        "Moonlit Clouds 5 Set",
        "Lingering Tunes 5 Set",
      ],
      setBonusEffects: {
        "Freezing Frost 2 Set": { Glacio: 10 },
        "Molten Rift 2 Set": { Fusion: 10 },
        "Void Thunder 2 Set": { Electro: 10 },
        "Sierra Gale 2 Set": { Aero: 10 },
        "Celestial Light 2 Set": { Spectro: 10 },
        "Sun-sinking Eclipse 2 Set": { Havoc: 10 },
        "Rejuvenating Glow 2 Set": { HealingBonus: 10 },
        "Moonlit Clouds 2 Set": { EnergyRegen: 10 },
        "Lingering Tunes 2 Set": { ATK: 10 },
        "Freezing Frost 5 Set": { Glacio: 10, maxStacks: 3 },
        "Molten Rift 5 Set": { Fusion: 30 },
        "Void Thunder 5 Set": { Electro: 15, maxStacks: 2 },
        "Sierra Gale 5 Set": { Aero: 30 },
        "Celestial Light 5 Set": { Spectro: 30 },
        "Sun-sinking Eclipse 5 Set": { Havoc: 7.5, maxStacks: 4 },
        "Rejuvenating Glow 5 Set": { ATK: 15 },
        "Moonlit Clouds 5 Set": { ATK: 22.5 },
        "Lingering Tunes 5 Set": { ATK: 5, maxStacks: 4, Outro: 60 },
      },
    };
  },
  methods: {
    selectCost(index, cost) {
      this.echoes[index].type = cost;
      this.updateTotalStats();
    },
    selectRank(index, rank) {
      this.echoes[index].rank = rank;
      this.updateTotalStats();
    },
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
    getMaxStacks(type) {
      return this.setBonusEffects[type]?.maxStacks || 0;
    },
    needsStacks(type) {
      return !!this.setBonusEffects[type]?.maxStacks;
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
          let stat = echo.type == "1" ? "HP_FLAT" : "ATK_FLAT";
          let statValue = this.flatBonusesByRankByType[echo.type][echo.rank];
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

      for (const setBonus of this.setBonuses) {
        if (setBonus.type) {
          const setBonusEffect = this.setBonusEffects[setBonus.type];
          for (const [key, value] of Object.entries(setBonusEffect)) {
            if (key !== "maxStacks") {
              if (
                setBonus.type === "Lingering Tunes 5 Set" &&
                key === "Outro"
              ) {
                // Apply Outro stat directly
                stats[key] = (stats[key] || 0) + value;
              } else {
                // Apply other stats with stacks if applicable
                const bonus =
                  value *
                  (this.needsStacks(setBonus.type) ? setBonus.stacks : 1);
                stats[key] = (stats[key] || 0) + bonus;
              }
            }
          }
        }
      }

      this.totalStats = stats;
      this.$emit("update-stats", this.totalStats);
    },
  },
  computed: {
    mainEchoesData() {
      return {...mainEchoesData};
    },
    mainEchoOptions() {
      const echoes = {
        Overlord: [],
        Elite: [],
        Common: []
      };
      
      this.mainEchoesData.forEach((echo) => {
        if (echo?.class && echoes?.[echo.class]) {
          echoes[echo.class] = echo;
        }
      });
      return echoes;
    }
  }
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

.set-bonus-selector {
  margin-bottom: 20px;
}

.set-bonus-selector select {
  margin-right: 10px;
}
.echo-selector {
  margin-bottom: 20px;
}

.cost-selector,
.rank-selector {
  margin: 0 1rem 1rem 0;
}
.echo-setup {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.rank-options {
  display: flex;
}
.cost-options button,
.rank-options .rank-circle {
  margin-right: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.rank-options .rank-circle {
  width: 24px;
  height: 24px;
  border-radius: 100%;
  display: inline-block;
  padding: 0;
  border: none;
}

.cost-options button {
  background-color: transparent;
  border-radius: 6px;
}
.cost-options button.selected {
  font-weight: bold;
  border-color: yellow !important;
}

.sub-stat-selector {
  display: flex;
  margin-top: 5px;
}

.sub-stat-selector select,
.sub-stat-selector input {
  margin-right: 10px;
}

.set-bonus-selector {
  margin-bottom: 20px;
}

.set-bonus-selector select {
  margin-right: 10px;
}
.rank-circle.selected {
  transform: scale(1.3);
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}
.sub-stat__input {
  max-width: 3rem;
  width: 3rem;
}
</style>
