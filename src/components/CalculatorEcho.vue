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
            :class="{ selected: type == cost }"
            @click="selectCost(cost)">
            0{{ cost }}
          </button>
        </div>
      </div>

      <!-- Rank Selection -->
      <div class="rank-selector">
        <label>Rank:</label>
        <div class="rank-options">
          <div
            v-for="r in [2, 3, 4, 5]"
            :key="r"
            :class="['rank-circle', { selected: rank == r }]"
            :style="{ backgroundColor: rankColors[r] }"
            @click="selectRank(r)"></div>
        </div>
      </div>
    </div>
    <select v-model="stat" @change="updateTotalStats" :disabled="!type">
      <option value="">Select Stat</option>
      <option v-for="s in getStats(type)" :key="s" :value="s">
        {{ getReadableSubStatLabel(s) }}
      </option>
    </select>

    <div class="sub-stat-selector">
      <select v-model="echoSubStatsType1" @change="updateTotalStats">
        <option value="">Select Sub Stat</option>
        <option v-for="subStat in subStats" :key="subStat" :value="subStat">
          {{ getReadableSubStatLabel(subStat) }}
        </option>
      </select>
      <input
        v-model.number="echoSubStatsValue1"
        :min="getSubStatRange(echoSubStatsType1).min"
        :max="getSubStatRange(echoSubStatsType1).max"
        type="number"
        :disabled="!echoSubStatsType1"
        @input="updateTotalStats"
        class="sub-stat__input" />
    </div>

    <div class="sub-stat-selector">
      <select v-model="echoSubStatsType2" @change="updateTotalStats">
        <option value="">Select Sub Stat</option>
        <option v-for="subStat in subStats" :key="subStat" :value="subStat">
          {{ getReadableSubStatLabel(subStat) }}
        </option>
      </select>
      <input
        v-model.number="echoSubStatsValue2"
        :min="getSubStatRange(echoSubStatsType1).min"
        :max="getSubStatRange(echoSubStatsType1).max"
        type="number"
        :disabled="!echoSubStatsType1"
        @input="updateTotalStats"
        class="sub-stat__input" />
    </div>

    <div class="sub-stat-selector">
      <select v-model="echoSubStatsType3" @change="updateTotalStats">
        <option value="">Select Sub Stat</option>
        <option v-for="subStat in subStats" :key="subStat" :value="subStat">
          {{ getReadableSubStatLabel(subStat) }}
        </option>
      </select>
      <input
        v-model.number="echoSubStatsValue3"
        :min="getSubStatRange(echoSubStatsType1).min"
        :max="getSubStatRange(echoSubStatsType1).max"
        type="number"
        :disabled="!echoSubStatsType1"
        @input="updateTotalStats"
        class="sub-stat__input" />
    </div>

    <div class="sub-stat-selector">
      <select v-model="echoSubStatsType4" @change="updateTotalStats">
        <option value="">Select Sub Stat</option>
        <option v-for="subStat in subStats" :key="subStat" :value="subStat">
          {{ getReadableSubStatLabel(subStat) }}
        </option>
      </select>
      <input
        v-model.number="echoSubStatsValue4"
        :min="getSubStatRange(echoSubStatsType1).min"
        :max="getSubStatRange(echoSubStatsType1).max"
        type="number"
        :disabled="!echoSubStatsType1"
        @input="updateTotalStats"
        class="sub-stat__input" />
    </div>

    <div class="sub-stat-selector">
      <select v-model="echoSubStatsType5" @change="updateTotalStats">
        <option value="">Select Sub Stat</option>
        <option v-for="subStat in subStats" :key="subStat" :value="subStat">
          {{ getReadableSubStatLabel(subStat) }}
        </option>
      </select>
      <input
        v-model.number="echoSubStatsValue5"
        :min="getSubStatRange(echoSubStatsType1).min"
        :max="getSubStatRange(echoSubStatsType1).max"
        type="number"
        :disabled="!echoSubStatsType1"
        @input="updateTotalStats"
        class="sub-stat__input" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
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
      rankColors,
      statsTable,
      flatBonusesByRankByType,
      subStats,
      subStatRanges,
      totalCost: 0,
    };
  },
  watch: {
    type: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
    rank: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
    stat: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
    echoSubStatsType1: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
    echoSubStatsValue1: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
    echoSubStatsType2: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
    echoSubStatsValue2: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
    echoSubStatsType3: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
    echoSubStatsValue3: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
    echoSubStatsType4: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
    echoSubStatsValue4: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
    echoSubStatsType5: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
    echoSubStatsValue5: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    selectCost(cost) {
      this.type = cost;
      this.updateTotalStats();
    },
    selectRank(rank) {
      this.rank = rank;
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
      const stats = {};
      // add in the base stats (flat HP and flat ATK) that's guaranteed
      if (this.type && this.rank) {
        let stat = this.type == "1" ? "HP_FLAT" : "ATK_FLAT";
        let statValue = this.flatBonusesByRankByType[this.type][this.rank];
        stats[stat] = (stats[stat] || 0) + statValue;
      }
      if (this.type && this.rank && this.stat) {
        const max = this.statsTable?.[this.type]?.[this.stat]?.[this.rank];
        if (max) {
          stats[this.stat] = (stats[this.stat] || 0) + max;
        }
      }
      if (this.echoSubStatsType1 && this.echoSubStatsValue1) {
        stats[this.echoSubStatsType1] =
          (stats[this.echoSubStatsType1] || 0) + this.echoSubStatsValue1;
      }
      if (this.echoSubStatsType2 && this.echoSubStatsValue2) {
        stats[this.echoSubStatsType2] =
          (stats[this.echoSubStatsType2] || 0) + this.echoSubStatsValue2;
      }
      if (this.echoSubStatsType3 && this.echoSubStatsValue3) {
        stats[this.echoSubStatsType3] =
          (stats[this.echoSubStatsType3] || 0) + this.echoSubStatsValue3;
      }
      if (this.echoSubStatsType4 && this.echoSubStatsValue4) {
        stats[this.echoSubStatsType4] =
          (stats[this.echoSubStatsType4] || 0) + this.echoSubStatsValue4;
      }
      if (this.echoSubStatsType5 && this.echoSubStatsValue5) {
        stats[this.echoSubStatsType5] =
          (stats[this.echoSubStatsType5] || 0) + this.echoSubStatsValue5;
      }

      this.$emit("update-stats", { index: this.index, stats });
    },
  },
  computed: {
    ...mapState(useCharacterStore, ["characters"]),
    /**
     * The current character data
     * @returns {Object}
     */
    currentCharacter() {
      return this.characters[this.character] ?? {};
    },
    /**
     * Getter/setter used in the form for the type for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    type: {
      get() {
        return this.currentCharacter?.echoes?.[this.index]?.type ?? null;
      },
      async set(value) {
        const data = {
          echoes: {},
        };
        data.echoes[this.index] = {
          type: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the rank for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    rank: {
      get() {
        return this.currentCharacter?.echoes?.[this.index]?.rank ?? 5;
      },
      async set(value) {
        const data = {
          echoes: {},
        };
        data.echoes[this.index] = {
          rank: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    stat: {
      get() {
        return this.currentCharacter?.echoes?.[this.index]?.stat ?? null;
      },
      async set(value) {
        const data = {
          echoes: {},
        };
        data.echoes[this.index] = {
          stat: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the sub stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSubStatsType1: {
      get() {
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsType1 ?? null
        );
      },
      async set(value) {
        const data = {
          echoes: {},
        };
        data.echoes[this.index] = {
          echoSubStatsType1: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the sub stat value for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    echoSubStatsValue1: {
      get() {
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsValue1 ??
          null
        );
      },
      async set(value) {
        const data = {
          echoes: {},
        };
        data.echoes[this.index] = {
          echoSubStatsValue1: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },

    /**
     * Getter/setter used in the form for the sub stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSubStatsType2: {
      get() {
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsType2 ?? null
        );
      },
      async set(value) {
        const data = {
          echoes: {},
        };
        data.echoes[this.index] = {
          echoSubStatsType2: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the sub stat value for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    echoSubStatsValue2: {
      get() {
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsValue2 ??
          null
        );
      },
      async set(value) {
        const data = {
          echoes: {},
        };
        data.echoes[this.index] = {
          echoSubStatsValue2: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },

    /**
     * Getter/setter used in the form for the sub stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSubStatsType3: {
      get() {
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsType3 ?? null
        );
      },
      async set(value) {
        const data = {
          echoes: {},
        };
        data.echoes[this.index] = {
          echoSubStatsType3: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the sub stat value for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    echoSubStatsValue3: {
      get() {
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsValue3 ??
          null
        );
      },
      async set(value) {
        const data = {
          echoes: {},
        };
        data.echoes[this.index] = {
          echoSubStatsValue3: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },

    /**
     * Getter/setter used in the form for the sub stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSubStatsType4: {
      get() {
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsType4 ?? null
        );
      },
      async set(value) {
        const data = {
          echoes: {},
        };
        data.echoes[this.index] = {
          echoSubStatsType4: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the sub stat value for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    echoSubStatsValue4: {
      get() {
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsValue4 ??
          null
        );
      },
      async set(value) {
        const data = {
          echoes: {},
        };
        data.echoes[this.index] = {
          echoSubStatsValue4: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the sub stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSubStatsType5: {
      get() {
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsType5 ?? null
        );
      },
      async set(value) {
        const data = {
          echoes: {},
        };
        data.echoes[this.index] = {
          echoSubStatsType5: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the sub stat value for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    echoSubStatsValue5: {
      get() {
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsValue5 ??
          null
        );
      },
      async set(value) {
        const data = {
          echoes: {},
        };
        data.echoes[this.index] = {
          echoSubStatsValue5: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
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
.main-echo__image {
  width: 100px;
  height: 100px;
  background-repeat: no-repeat;
  display: block;
  background-size: contain;
  border-radius: 100%;
  border: 1px solid white;
}
.main-echo__selection {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
  padding-bottom: 2rem;
}
.main-echo__enabled {
  margin-top: 1rem;
}
</style>
