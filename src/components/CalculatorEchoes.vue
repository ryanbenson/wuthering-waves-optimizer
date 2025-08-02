<template>
  <div>
    <CalculatorEchoImporter
      ref="echoesImporter"
      :character="character"></CalculatorEchoImporter>
    <CalculatorEchoesBrowser
      ref="echoesBrowser"
      :character="character"></CalculatorEchoesBrowser>
    <CalculatorEchoesPresets
      ref="echoesPresets"
      :character="character"></CalculatorEchoesPresets>
    <CalculatorSaveEchoesPreset
      ref="echoesSavePreset"
      @on-save-echo-preset="handleOnSaveEchoPreset"></CalculatorSaveEchoesPreset>
    <div v-if="isTotalCostOverCap" class="alert alert--error">
      You have exceeded to total echo cost of 12 with {{ totalEchoCost }}.
    </div>
  <div
    v-if="echoPresetName"
    class="card card-bordered card-compact shadow mb-12 bg-primary">
    <div class="card-body text-white">
      Using {{  echoPresetName }} echo preset.
    </div>
  </div>
    <div class="actions mb-4 flex gap-2">
      <button class="btn btn-primary" @click="handleOpenEchoesImporter">
        Import Echoes
      </button>
      <button class="btn btn-primary" @click="handleOpenEchoesPreset">
        Use Preset Echoes
      </button>
      <button class="btn btn-primary" @click="handleOpenSaveEchoPreset">
        Save Echo Preset
      </button>
    </div>
    <div class="echo__list">
      <CalculatorEcho
        v-for="(n, index) in 5"
        :key="character + '-' + index"
        :ref="'echo' + index"
        :index="index"
        :character="character"
        class="echo-selector"
        @updated-echo-cost="handleUpdatedEchoCost"
        @update-stats="handleEchoStats"
        @echo:set-chosen="handleEchoSetChosen"
        @main-echo:updated="handleMainEchoUpdated"
        @main-echo-rank:updated="handleMainEchoRankUpdated"
        @open-echoes-browser="handleOpenEchoesBrowser"></CalculatorEcho>
    </div>
    <div class="set-bonus-selector mt-6 mb-2">
      <div class="set-bonus-selector__header flex justify-between items-center">
        <h2 class="text-lg font-bold">Set Bonuses</h2>
        <div class="form-control">
          <label class="label cursor-pointer">
            <input
              type="checkbox"
              v-model="setOverride"
              class="toggle toggle-primary" />
            <span class="label-text p-0 m-0 ml-2">Enable set override</span>
          </label>
        </div>
      </div>

      <CalculatorEchoesSetBonusOne
        :character="character"
        :is-override-enabled="setOverride"
        @update-stats="handleSetBonusOneData"
        data-test-echoes-set-one></CalculatorEchoesSetBonusOne>
      <CalculatorEchoesSetBonusTwo
        :character="character"
        :is-override-enabled="setOverride"
        @update-stats="handleSetBonusTwoData"
        data-test-echoes-set-two></CalculatorEchoesSetBonusTwo>
    </div>
    <h2 v-if="false" class="text-lg font-bold mt-6 mb-2">Main Echo Buff</h2>
    <div class="main__echo relative mt-12">
      <h3
        v-if="echoName"
        class="main-echo__name"
        :class="{
          'text-amber-300': mainEchoRank === '5' || mainEchoRank === 5,
          'text-violet-600': mainEchoRank === '4' || mainEchoRank === 4,
          'text-blue-500': mainEchoRank === '3' || mainEchoRank === 3,
          'text-green-500': mainEchoRank === '2' || mainEchoRank === 2,
        }">
        {{ echoName }}
      </h3>
      <div
        v-if="mainEcho"
        class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer relative z-10"
        @click="toggleMainEchoBuffEnabled">
        <div class="card-body">
          <div
            v-if="chosenMainEchoData"
            class="main-echo__details"
            v-html="chosenMainEchoData.details"></div>

          <div class="flex gap-2 items-center">
            <div class="form-control" @click.stop>
              <label
                class="label inline-flex justify-start"
                :class="{ 'cursor-pointer': !setAlwaysEnabled }"
                @click.stop>
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  v-model="mainEchoBuffEnabled"
                  :disabled="setAlwaysEnabled"
                  :data-test-main-echo-enabled="mainEcho" />
                <span class="label-text ml-2">Enabled?</span>
              </label>
            </div>
            <div v-if="mainEchoHasStacks" class="form-control" @click.stop>
              <label
                class="label cursor-pointer inline-flex justify-start"
                v-if="!setAlwaysEnabled">
                <input
                  v-model="mainEchoStacks"
                  type="number"
                  class="input input-bordered input-xs"
                  :min="0"
                  :max="mainEchoMaxStacks"
                  :data-test-main-echo-stacks="mainEcho" />
                <span class="label-text ml-2">Stacks</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mainEchoesData, getEchoData } from "../echoes/index.ts";
import { getEchoSetLabelByType, echoSetLabelMap } from "../echoes/stats.ts";
import {
  twoSetBonuses,
  threeSetBonuses,
  fiveSetBonuses,
} from "../echoes/sets.ts";
import CalculatorEcho from "./CalculatorEcho.vue";
import CalculatorEchoesSetBonusOne from "./CalculatorEchoesSetBonusOne.vue";
import CalculatorEchoesSetBonusTwo from "./CalculatorEchoesSetBonusTwo.vue";
import CalculatorEchoesBrowser from "./CalculatorEchoesBrowser.vue";
import CalculatorEchoImporter from "./CalculatorEchoImporter.vue";
import CalculatorEchoesPresets from "./CalculatorEchoesPresets.vue";
import CalculatorSaveEchoesPreset from "./CalculatorSaveEchoesPreset.vue";
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { randomString } from "../utils/strings.ts";
const MAX_ECHO_COST = 12;

export default {
  props: {
    character: {
      type: String,
      required: true,
    },
  },
  components: {
    CalculatorEcho,
    CalculatorEchoesBrowser,
    CalculatorEchoesPresets,
    CalculatorEchoesSetBonusOne,
    CalculatorEchoesSetBonusTwo,
    CalculatorEchoImporter,
    CalculatorSaveEchoesPreset,
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
      echoCosts: [],
      echoSetsChosen: [],
      // needed data
      twoSetBonuses,
      threeSetBonuses,
      fiveSetBonuses,
    };
  },
  watch: {
    mainEcho: {
      handler: async function () {
        this.handleMainEchoChange();
        // prevent stacks from exceeding max stacks
        if (this.mainEchoStacks > this.mainEchoMaxStacks) {
          this.mainEchoStacks = this.mainEchoMaxStacks;
        }
        this.updateTotalStats();
      },
      immediate: true,
    },
    mainEchoRank: {
      handler: async function () {
        this.handleMainEchoRank();
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
      handler: async function (stacksVal) {
        // prevent stacks from exceeding max stacks
        if (stacksVal > this.mainEchoMaxStacks) {
          this.mainEchoStacks = this.mainEchoMaxStacks;
        }
        this.updateTotalStats();
      },
      immediate: true,
    },
    setOverride(newValue) {
      if (newValue === false) {
        this.updateEchoSets();
      }
    }
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    ...mapActions(useInventoryStore, [
      "saveEchoPreset",
      "patchEchoPreset",
      "deleteEchoPreset",
      "getEchoPresetById",
    ]),
    updateTotalStats() {
      const stats = {};
      // process all of the echo data
      if (this.echoData) {
        const echoItemsData = Object.values(
          JSON.parse(JSON.stringify(this.echoData)),
        );
        // go through each echo data and merge each stat
        for (const echo of echoItemsData) {
          for (const [stat, value] of Object.entries(echo)) {
            stats[stat] = (stats[stat] || 0) + value;
          }
        }
      }
      // process the first set bonus
      if (this.setBonusOne) {
        for (const [stat, value] of Object.entries(
          JSON.parse(JSON.stringify(this.setBonusOne)),
        )) {
          stats[stat] = (stats[stat] || 0) + value;
        }
      }
      // process the second set bonus
      if (this.setBonusTwo) {
        for (const [stat, value] of Object.entries(
          JSON.parse(JSON.stringify(this.setBonusTwo)),
        )) {
          if (stat === "EnableAttack") {
            stats[stat] = value;
          } else {
            stats[stat] = (stats[stat] || 0) + value;
          }
        }
      }

      let modifySpecificTalents = [];
      // process the main echo buffs, only if enabled
      if (this.mainEchoBuffEnabled) {
        for (const mainEchoBuff of this.chosenMainEchoBuffs) {
          // if it has buffs for specific characters, validate that first
          const specificCharacters = mainEchoBuff?.specificCharacters ?? [];
          if (specificCharacters.length > 0) {
            // check if the current character key is in the list
            const isValidCharacter = specificCharacters.includes(
              this.character,
            );
            if (!isValidCharacter) {
              continue;
            }
          }
          if (mainEchoBuff?.modifySpecificTalents) {
            stats.specificTalentBuffs = {};
            mainEchoBuff?.modifySpecificTalents.forEach((buffTalentName) => {
              stats.specificTalentBuffs[buffTalentName] =
                mainEchoBuff.modifierValue;
            });
          } else {
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
    handleUpdatedEchoCost({ index, cost }) {
      this.echoCosts[index] = cost;
    },
    toggleMainEchoBuffEnabled() {
      this.mainEchoBuffEnabled = !this.mainEchoBuffEnabled;
    },
    handleMainEchoChange() {
      this.$emit("updated-main-echo", this.mainEcho);
    },
    handleMainEchoRank() {
      this.$emit("updated-main-echo-rank", this.mainEchoRank);
    },
    async handleEchoSetChosen({ set, index }) {
      this.echoSetsChosen[index] = set;
      await this.updateEchoSets();
    },
    async updateEchoSets() {
      // Filter out nulls and create a count map for each value
      const counts = this.echoSetsChosen
        .filter(v => v !== null)
        .reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {});

      // Create lookup sets from your constants for which bonuses exist
      const has2SetBonus = new Set(
        this.twoSetBonuses.map(bonus => {
          const match = bonus.match(/^(.+) 2 Set$/);
          return match ? Object.keys(echoSetLabelMap).find(key => 
            getEchoSetLabelByType(key) === match[1]
          ) : null;
        }).filter(Boolean)
      );

      const has3SetBonus = new Set(
        this.threeSetBonuses.map(bonus => {
          const match = bonus.match(/^(.+) 3 Set$/);
          return match ? Object.keys(echoSetLabelMap).find(key => 
            getEchoSetLabelByType(key) === match[1]
          ) : null;
        }).filter(Boolean)
      );

      const has5SetBonus = new Set(
        this.fiveSetBonuses.map(bonus => {
          const match = bonus.match(/^(.+) 5 Set$/);
          return match ? Object.keys(echoSetLabelMap).find(key => 
            getEchoSetLabelByType(key) === match[1]
          ) : null;
        }).filter(Boolean)
      );

      // Get all possible bonuses for each set
      const availableBonuses = [];
      
      for (const [setType, count] of Object.entries(counts)) {
        const setLabel = getEchoSetLabelByType(setType);
        
        // Add bonuses based on count and what bonuses exist for this set
        if (count >= 5 && has5SetBonus.has(setType)) {
          availableBonuses.push({ bonus: `${setLabel} 5 Set`, priority: 3, setType });
        }
        if (count >= 3 && has3SetBonus.has(setType)) {
          availableBonuses.push({ bonus: `${setLabel} 3 Set`, priority: 2, setType });
        }
        if (count >= 2 && has2SetBonus.has(setType)) {
          availableBonuses.push({ bonus: `${setLabel} 2 Set`, priority: 1, setType });
        }
      }

      // Separate 2-set bonuses from higher-tier bonuses
      const twoSetBonuses = availableBonuses.filter(b => b.bonus.includes('2 Set'));
      const higherTierBonuses = availableBonuses.filter(b => b.bonus.includes('3 Set') || b.bonus.includes('5 Set'));
      
      // Sort each group by set type for consistency
      twoSetBonuses.sort((a, b) => a.setType.localeCompare(b.setType));
      higherTierBonuses.sort((a, b) => {
        // Priority: 5-set > 3-set, then by set type
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return a.setType.localeCompare(b.setType);
      });

      // Select bonuses following game rules
      let setBonusOneVal = null;
      let setBonusTwoVal = null;

      // setBonusOne: Always a 2-set bonus (pick the first available)
      if (twoSetBonuses.length > 0) {
        setBonusOneVal = twoSetBonuses[0].bonus;
      }

      // setBonusTwo: Can be 2-set, 3-set, or 5-set
      // Priority: higher-tier bonuses first, then remaining 2-set bonuses
      const usedSetTypes = setBonusOneVal ? new Set([twoSetBonuses[0].setType]) : new Set();
      
      // First try higher-tier bonuses
      for (const { bonus, setType } of higherTierBonuses) {
        if (!usedSetTypes.has(setType) || setBonusOneVal?.includes(getEchoSetLabelByType(setType))) {
          setBonusTwoVal = bonus;
          break;
        }
      }
      
      // If no higher-tier bonus found, try remaining 2-set bonuses
      if (!setBonusTwoVal) {
        for (const { bonus, setType } of twoSetBonuses.slice(1)) {
          if (!usedSetTypes.has(setType)) {
            setBonusTwoVal = bonus;
            break;
          }
        }
      }

      // If the user wants to manually manage the sets, don't automatically set them
      if (this.setOverride) {
        return;
      }

      // Update the store
      const data = {
        echoSetBonus: {
          setBonusOne: setBonusOneVal,
          setBonusTwo: setBonusTwoVal,
        },
      };

      await this.setCharacterData(this.character, data);
    },
    handleMainEchoUpdated(echo) {
      this.mainEcho = echo;
    },
    handleMainEchoRankUpdated(rank) {
      this.mainEchoRank = rank;
    },
    handleOpenEchoesBrowser(echoIndex) {
      this.$refs.echoesBrowser.triggerOpenModal(echoIndex);
    },
    handleOpenEchoesImporter() {
      this.$refs.echoesImporter.triggerOpenModal();
    },
    handleOpenEchoesPreset() {
      this.$refs.echoesPresets.triggerOpenModal();
    },
    handleOpenSaveEchoPreset() {
      if (this.echoPresetName) {
        this.$refs.echoesSavePreset.setPresetName(this.echoPresetName);
      }
      this.$refs.echoesSavePreset.triggerOpenModal();
    },
    async handleOnSaveEchoPreset(data) {
      let id;
      if (this.echoPresetId) {
        id = this.echoPresetId;
      } else {
        id = randomString();
      }
      // make sure all echoes are saved
      await this.$refs.echo0[0].saveEchoItem();
      await this.$refs.echo1[0].saveEchoItem();
      await this.$refs.echo2[0].saveEchoItem();
      await this.$refs.echo3[0].saveEchoItem();
      await this.$refs.echo4[0].saveEchoItem();
      const presetData = {
        presetId: id,
        name: data.name,
        echo1Id: this.currentCharacter?.echoes?.[0]?.echoId ?? null,
        echo2Id: this.currentCharacter?.echoes?.[1]?.echoId ?? null,
        echo3Id: this.currentCharacter?.echoes?.[2]?.echoId ?? null,
        echo4Id: this.currentCharacter?.echoes?.[3]?.echoId ?? null,
        echo5Id: this.currentCharacter?.echoes?.[4]?.echoId ?? null,
      };
      await this.saveEchoPreset(presetData);
      this.echoPresetId = id;
    }
  },
  computed: {
    ...mapState(useCharacterStore, ["characters"]),
    ...mapState(useInventoryStore, ["getEchoPresetData"]),
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
     * Getter/setter used in the form for the the main echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoPresetId: {
      get() {
        return this.currentCharacter?.echoPresetId ?? null;
      },
      async set(value) {
        const data = {
          echoPresetId: value
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used to determine if the user can manually change the echo sets
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    setOverride: {
      get() {
        return this.currentCharacter?.setOverride ?? null;
      },
      async set(value) {
        const data = {
          setOverride: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the the main echo rarity
     * @returns {Boolean}
     */
    mainEchoRank: {
      get() {
        return this.currentCharacter?.mainEcho?.rank ?? 5;
      },
      async set(value) {
        const data = {
          mainEcho: {
            rank: value,
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
      return (
        this.chosenMainEchoData?.image ??
        "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png"
      );
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
    totalEchoCost() {
      const totalCost = this.echoCosts.reduce((totalCost, cost) => {
        return (totalCost += cost);
      }, 0);
      return totalCost;
    },
    isTotalCostOverCap() {
      return this.totalEchoCost > MAX_ECHO_COST;
    },
    echoName() {
      if (!this.mainEcho) {
        return null;
      }
      const echoData = getEchoData(this.mainEcho);
      return echoData?.name ?? null;
    },
    echoPresetData() {
      return this.getEchoPresetData(this.echoPresetId);
    },
    echoPresetName() {
      return this.echoPresetData?.name ?? null;
    }
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
}
.main-echo__enabled {
  margin-top: 1rem;
}
.alert {
  background: #126a5a;
  padding: 0.25rem 0.5rem;
  font-size: 14px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: white;
}
.alert--error {
  background-color: #7b7c27;
}
.main-echo-level {
  padding-top: 0.5rem;
  label {
    display: block;
  }
}
.main-echo {
  background-color: #161616;
  padding: 0.5rem 0.75rem;
  margin-top: 2rem;
  border-radius: 6px;
  cursor: pointer;

  span:first-of-type {
    font-weight: bold;
  }
}
.substats__label {
  position: relative;
  left: -10px;
  top: 4px;
  z-index: 0;
  font-size: 24px;
}
html[data-theme="light"] {
  .main-echo {
    background-color: #f8f8f8;
  }
  .echo__item__actions {
    svg {
      filter: invert(100%);
    }
  }
}

.main-echo__name {
  font-size: 36px;
  font-weight: 700;
  position: absolute;
  top: -2.6rem;
  left: 0.5rem;
  z-index: 0;
}

.rank__label {
  font-size: 24px;
  font-weight: 700;
  position: absolute;
  top: -1.6rem;
  left: 0.5rem;
  z-index: 0;
}
.substat__label {
  font-size: 16px;
  position: absolute;
  left: 3rem;
  top: -0.9rem;
  z-index: 0;
}
.echo__selection__rank__input {
  position: relative;
  z-index: 10;
}
</style>
