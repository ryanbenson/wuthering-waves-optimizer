<template>
  <div>
    <CalculatorEcho
      v-for="(echo, index) in echoes"
      :key="index"
      :index="index"
      :character="character"
      class="echo-selector"
      @update-stats="handleEchoStats">
    </CalculatorEcho>
    <div class="set-bonus-selector">
      <CalculatorEchoesSetBonusOne
        :character="character"
        @update-stats="handleSetBonusOneData"></CalculatorEchoesSetBonusOne>
      <CalculatorEchoesSetBonusTwo
        :character="character"
        @update-stats="handleSetBonusTwoData"></CalculatorEchoesSetBonusTwo>
    </div>
    <div class="total-cost">Total Cost: {{ totalCost }} / 12</div>
    <h3>Main Echo</h3>
    <div class="main-echo__selection">
      <div
        :style="{
          backgroundImage: `url(${chosenMainEchoImage})`,
        }"
        class="main-echo__image"></div>
      <select name="mainEcho" v-model="mainEcho">
        <optgroup label="Calamity">
          <option
            v-for="option in mainEchoOptions.Calamity"
            :key="option.key"
            :value="option.key">
            {{ option.name }}
          </option>
        </optgroup>
        <optgroup label="Overlord">
          <option
            v-for="option in mainEchoOptions.Overlord"
            :key="option.key"
            :value="option.key">
            {{ option.name }}
          </option>
        </optgroup>
        <optgroup label="Elite">
          <option
            v-for="option in mainEchoOptions.Elite"
            :key="option.key"
            :value="option.key">
            {{ option.name }}
          </option>
        </optgroup>
        <optgroup label="Common">
          <option
            v-for="option in mainEchoOptions.Common"
            :key="option.key"
            :value="option.key">
            {{ option.name }}
          </option>
        </optgroup>
      </select>
    </div>
    <div
      v-if="chosenMainEchoData"
      class="main-echo__details"
      v-html="chosenMainEchoData.details"></div>
    <div class="main-echo__enabled" v-if="chosenMainEchoHasBuffs">
      <label>
        <input
          type="checkbox"
          v-model="mainEchoBuffEnabled"
          name="mainEchoBuffEnabled" />
        Enabled?</label
      >
      <div v-if="mainEchoHasStacks">
        <label>Stacks:</label>
        <input
          v-model.number="mainEchoStacks"
          type="number"
          min="0"
          :max="mainEchoMaxStacks" />
      </div>
    </div>
  </div>
</template>

<script>
import { mainEchoesData } from "../echoes/index.ts";
import CalculatorEcho from "./CalculatorEcho.vue";
import CalculatorEchoesSetBonusOne from "./CalculatorEchoesSetBonusOne.vue";
import CalculatorEchoesSetBonusTwo from "./CalculatorEchoesSetBonusTwo.vue";
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
export default {
  props: {
    character: {
      type: String,
      required: true,
    },
  },
  components: {
    CalculatorEcho,
    CalculatorEchoesSetBonusOne,
    CalculatorEchoesSetBonusTwo,
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
    };
  },
  watch: {
    mainEcho: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
    mainEchoBuffEnabled: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
    mainEchoMaxStacks: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
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
    handleSetBonusOneData(data) {
      const stats = JSON.parse(JSON.stringify(data));
      console.log("bonuses one", stats);
    },
    handleSetBonusTwoData(data) {
      const stats = JSON.parse(JSON.stringify(data));
      console.log("bonuses two", stats);
    },
    handleEchoStats({ index, stats }) {
      const statData = JSON.parse(JSON.stringify(stats));
      console.log("bonuses echo", index, statData);
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
     * Getter/setter used in the form for the the main echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    mainEcho: {
      get() {
        return this.currentCharacter?.mainEcho?.echo ?? null;
      },
      async set(value) {
        const data = {
          mainEcho: {
            echo: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the isEnabled state for this passive
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    mainEchoBuffEnabled: {
      get() {
        return this.currentCharacter?.mainEcho?.isEnabled ?? false;
      },
      async set(value) {
        const data = {
          mainEcho: {
            isEnabled: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the stacks count state for this passive
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    mainEchoBuffStacks: {
      get() {
        return this.currentCharacter?.mainEcho?.stacks ?? 0;
      },
      async set(value) {
        const data = {
          mainEcho: {
            stacks: value,
          },
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
