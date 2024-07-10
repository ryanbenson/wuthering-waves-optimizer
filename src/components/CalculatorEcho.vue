<template>
  <div class="echo-selector">
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
        {{ getReadableSubStatLabel(stat) }}
      </option>
    </select>
    <div v-for="i in 5" :key="i" class="sub-stat-selector">
      <select v-model="echo.subStats[i - 1].type" @change="updateTotalStats">
        <option value="">Select Sub Stat</option>
        <option v-for="subStat in subStats" :key="subStat" :value="subStat">
          {{ getReadableSubStatLabel(subStat) }}
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
</template>

<script>
import {
  rankColors,
  statsTable,
  flatBonusesByRankByType,
  subStats,
  subStatRanges,
  subStatLabelMap,
  getReadableSubStatLabel,
} from "../echoes/stats";
export default {
  props: {
    character: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
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
      rankColors,
      statsTable,
      flatBonusesByRankByType,
      subStats,
      subStatRanges,
      totalCost: 0,
      totalStats: {},
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
    getReadableSubStatLabel,
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

      // process the main echo buffs, only if enabled
      if (this.mainEchoBuffEnabled) {
        for (const mainEchoBuff of this.chosenMainEchoBuffs) {
          // we're dealing with full numbers right now, not decimals,
          // so multiply * 100
          // TODO: Remove this when we refactor this whole thing to use decimals
          if (this.mainEchoHasStacks) {
            const buffVal = mainEchoBuff.modifierValue * 100;
            stats[mainEchoBuff.modifier] =
              (stats[mainEchoBuff.modifier] || 0) +
              buffVal * this.mainEchoStacks;
          } else {
            const buffVal = mainEchoBuff.modifierValue * 100;
            stats[mainEchoBuff.modifier] =
              (stats[mainEchoBuff.modifier] || 0) + buffVal;
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
      return { ...mainEchoesData };
    },
    chosenMainEchoData() {
      if (!this.mainEcho) {
        return null;
      }
      return this.mainEchoesData?.[this.mainEcho];
    },
    chosenMainEchoBuffs() {
      if (!this.chosenMainEchoData) {
        return [];
      }
      return this.chosenMainEchoData?.modifiers ?? [];
    },
    chosenMainEchoHasBuffs() {
      return this.chosenMainEchoBuffs?.length > 0;
    },
    mainEchoOptions() {
      const echoes = {
        Calamity: [],
        Overlord: [],
        Elite: [],
        Common: [],
      };
      const mainEchoValues = Object.values(this.mainEchoesData);
      mainEchoValues.forEach((echo) => {
        if (echo?.class && echoes?.[echo.class]) {
          echoes[echo.class].push(echo);
        }
      });
      return echoes;
    },
    chosenMainEchoImage() {
      return this.chosenMainEchoData?.image ?? "/images/echoes/monsters.png";
    },
    mainEchoHasStacks() {
      return this.chosenMainEchoData?.hasStacks ?? false;
    },
    mainEchoMinStacks() {
      return this.chosenMainEchoData?.minStacks ?? 0;
    },
    mainEchoMaxStacks() {
      return this.chosenMainEchoData?.maxStacks ?? 0;
    },
  },
};
</script>
