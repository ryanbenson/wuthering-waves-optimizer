<template>
  <div>
    <CalculatorEcho
      v-for="(n, index) in 5"
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
      totalCost: 0,
      setBonusOne: {},
      setBonusTwo: {},
      echoData: {},
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
    mainEchoStacks: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    updateTotalStats() {
      const stats = {};
      // process all of the echo data
      if (this.echoData) {
        const echoItemsData = Object.values(JSON.parse(JSON.stringify(this.echoData)));
        // go through each echo data and merge each stat
        for (const echo of echoItemsData) {
          for (const [stat, value] of Object.entries(echo)) {
            stats[stat] = (stats[stat] || 0) + value;
          }
        }
      }
      // process the first set bonus
      if (this.setBonusOne) {
        for (const [stat, value] of Object.entries(JSON.parse(JSON.stringify(this.setBonusOne)))) {
          stats[stat] = (stats[stat] || 0) + value;
        }
      }
      // process the second set bonus
      if (this.setBonusTwo) {
        for (const [stat, value] of Object.entries(JSON.parse(JSON.stringify(this.setBonusTwo)))) {
          stats[stat] = (stats[stat] || 0) + value;
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

      this.$emit("update-stats", stats);
    },
    handleSetBonusOneData(data) {
      const stats = JSON.parse(JSON.stringify(data));
      this.setBonusOne = stats;
      this.updateTotalStats();
    },
    handleSetBonusTwoData(data) {
      const stats = JSON.parse(JSON.stringify(data));
      this.setBonusTwo = stats;
      this.updateTotalStats();
    },
    handleEchoStats({ index, stats }) {
      const statData = JSON.parse(JSON.stringify(stats));
      this.echoData[index] = stats;
      this.updateTotalStats();
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
     mainEchoStacks: {
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
