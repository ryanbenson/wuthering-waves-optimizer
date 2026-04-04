<template>
  <CalculatorOptimizerGuide ref="optimizerGuide"></CalculatorOptimizerGuide>
  <dialog :id="modalIdPicker" class="modal">
    <form method="dialog" class="modal-backdrop" @click="closeEchoChooser">
      <button>close</button>
    </form>
    <div class="modal-box max-w-5xl">
      <form method="dialog" @click="closeEchoChooser">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <div
          class="echo-filters__sets flex align-center gap-1 mb-6 items-center flex-wrap"
          :class="{ 'echo-filters__sets--active': echoSetFilter !== null }">
          <span class="mr-2">Filter</span>
          <button
            v-for="echoSet in echoSets"
            :key="echoSet"
            @click="toggleEchoSetFilter(echoSet)"
            class="rounded p-[.3rem]"
            :class="{ 'btn-active': isEchoSetFilterActive(echoSet) }">
            <img
              :src="getEchoSetImage(echoSet)"
              class="size-7 m-width-7"
              :class="echoSet" />
          </button>
          <button @click="resetFilters" class="btn btn-sm btn-ghost">
            Clear
          </button>
        </div>
      </div>
      <div class="echoes__list grid grid-cols-1 md:grid-cols-4 gap-4">
        <template v-if="!allEchoesListFiltered.length">
          <div class="echoes__list--empty py-12 text-center w-full col-span-2">
            No echoes found
          </div>
        </template>
        <template v-else>
          <div
            v-for="echoesToChoose in allEchoesListFiltered"
            :key="echoesToChoose.key"
            class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer">
            <div class="card-body items-center">
              <div
                class="echo__item__image rounded-full border border-solid neutral-content size-20 mb-2 bg-cover cursor-pointer mx-auto lg:m-0"
                :style="{
                  backgroundImage: `url(${echoesToChoose.image})`,
                }"></div>
              <h2 class="card-title text-center text-lg">
                {{ echoesToChoose.name }}
              </h2>
              <h3 class="text-sm">{{ echoesToChoose.class }}</h3>
              <div
                class="echo__item__set-selection flex gap-3 justify-center sm:justify-start flex-wrap">
                <div
                  v-for="echoSetItem in echoesToChoose.sets"
                  :key="echoSetItem"
                  class="size-8 rounded-full cursor-pointer echo__item__set-selection--icon">
                  <img
                    :src="getEchoSetIcon(echoSetItem)"
                    :class="echoSetItem" />
                </div>
              </div>
              <button
                @click="chooseMainEcho(echoesToChoose.key)"
                class="btn btn-sm btn-primary">
                Use echo
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </dialog>
  <div class="optimizer" v-if="!isLoading">
    <button
      class="btn btn-sm w-full btn-primary btn-outline mb-4"
      data-test-optimizer-guide-btn
      @click="handleOpenOptimizerGuide">
      🧪 Optimizer guide
    </button>
    <div class="optimizer-filters">
      <div class="optimizer-filters__sets">
        <h3 class="mb-2">Choose echo sets</h3>
        <div
          class="echo-filters__sets flex gap-1 flex-wrap"
          :class="{ 'echo-filters__sets--active': setFilters.length }">
          <button
            v-for="set in echoSets"
            :key="set"
            @click="toggleSetFilter(set)"
            class="rounded p-[.3rem]"
            :class="{ 'btn-active': isSetFilterActive(set) }">
            <img :src="getSetIcon(set)" :alt="set" class="size-7" />
          </button>
        </div>
        <h3 class="mt-6 mb-2">Choose main echoes</h3>
        <div class="optimizer-echoes-chosen flex gap-2">
          <div
            class="card card-bordered card-compact bg-base-100 shadow text-wrap w-[6rem] flex flex-col items-center">
            <div
              @click="openEchoChooser"
              class="card-body items-center justify-center cursor-pointer">
              <div class="flex flex-col gap-2 justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  class="bi bi-plus-circle"
                  viewBox="0 0 16 16">
                  <path
                    d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path
                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
                <span class="text-center">Choose Echo</span>
              </div>
            </div>
          </div>
          <div
            v-for="echo in allMainEchoesData"
            :key="echo.key"
            class="card card-bordered card-compact bg-base-100 shadow text-wrap w-[6rem] flex flex-col items-center">
            <div class="card-body items-center">
              <div
                class="echo__item__image rounded-full border border-solid neutral-content size-12 mb-2 bg-cover cursor-pointer"
                :style="{
                  backgroundImage: `url(${echo.image})`,
                }"></div>
              <div class="text-center text-sm grow">
                {{ echo.name }}
              </div>
              <div class="card-actions">
                <button
                  class="btn btn-xs btn-outline mt-1"
                  @click="removeMainEcho(echo.key)">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="currentSetBonuses.length"
          class="collapse collapse-arrow bg-base-100 border-base-300 border my-4"
          data-test-optimizer-echo-set-buffs-collapse-bar>
          <input type="checkbox" />
          <h3 class="collapse-title text-xl" data-test-optimizer-echo-set>
            Echo set buffs
          </h3>
          <div class="collapse-content">
            <div v-if="!currentSetBonuses.length">
              <p class="my-6 text-center">
                Choose echo sets to configure their set bonuses
              </p>
            </div>
            <template v-else>
              <CalculatorOptimizerEchoSet
                v-for="(setBonus, index) in currentSetBonuses"
                :key="setBonus.key"
                :set-key="setBonus.key"
                :character="character"
                :name="setBonus.name"
                :passives="setBonus.passives"
                :details="setBonus.details"
                @updated-optimizer-echo-set-stats="
                  handleUpdatedSetStats
                "></CalculatorOptimizerEchoSet>
            </template>
          </div>
        </div>
      </div>

      <div
        class="collapse collapse-arrow bg-base-100 border-base-300 border my-4"
        data-test-optimizer-main-echo-buffs-bar>
        <input type="checkbox" />
        <h3 class="collapse-title text-xl" data-test-optimizer-main-echo-buffs>
          Main echo buffs
        </h3>
        <div class="collapse-content">
          <div v-if="!mainEchoes.length">
            <p class="my-6 text-center">
              Choose main echoes to configure their buffs
            </p>
          </div>
          <template v-else>
            <CalculatorOptimizerMainEcho
              v-for="echo in allMainEchoesData"
              :key="echo.key"
              :character="character"
              :echo-key="echo.key"
              :name="echo.name"
              :echo-class="echo.class"
              :image="echo.image"
              :sets="echo.sets"
              :details="echo.details"
              :modifiers="echo.modifiers"
              :actions="echo.actions"
              :has-stacks="echo.hasStacks"
              :min-stacks="echo.minStacks"
              :max-stacks="echo.maxStacks"
              @updated-main-echo-buffs="
                handleUpdatedMainEchoBuffs
              "></CalculatorOptimizerMainEcho>
          </template>
        </div>
      </div>

      <div class="optimizer-filters__sets">
        <h3 class="mt-6 mb-2">Choose target stats (optional)</h3>
        <CalculatorOptimizerMinStats
          :character="character"
          :key="character"
          :min-stats="minStats"
          @updated-min-stats="
            handleUpdatedMinStats
          "></CalculatorOptimizerMinStats>
      </div>
    </div>
    <div class="optimizer-target">
      <h3 class="mt-6 mb-2">Choose your optimization target</h3>
      <div class="optimizer-target-options flex gap-2">
        <CalculatorOptimizerTarget
          :character="character"
          :current-optimization-target="optimizationTarget"
          @optimizer:target-updated="
            handleUpdatedTarget
          "></CalculatorOptimizerTarget>
        <CalculatorOptimizerDamageType
          :character="character"
          :current-damage-type="damageType"
          @optimizer:damage-type-updated="
            handleUpdatedDamageType
          "></CalculatorOptimizerDamageType>
      </div>
    </div>
    <div class="optimizer-target">
      <h3 class="mt-6 mb-2">Settings</h3>
      <div class="optimizer-target-options flex gap-2">
        <CalculatorOptimizerSettings
          :character="character"
          :current-ignore-other-resonantor-echoes="ignoreOtherResonantorEchoes"
          @optimizer:settings-updated="
            handleUpdatedSettings
          "></CalculatorOptimizerSettings>
      </div>
    </div>
    <div class="optimizer-actions mt-6 flex gap-4 items-center">
      <button
        class="btn btn-primary"
        @click="handleOptimize"
        :disabled="!isValid"
        data-test-optimizer-optimize-btn>
        Optimize
      </button>
      <p v-if="!isValid" class="text-warning">
        <template v-if="isTargetUnavailable" class="text-warning">
          Rotation targets are not supported yet.
          <br />
        </template>
        Choose at least one echo, echo set, and a valid target.
      </p>
    </div>
    <div class="optimizer-progress my-6" v-if="hasTriggeredOptimizer">
      <p
        v-if="optimizerNoPossibleLoadouts"
        class="text-warning text-center my-2">
        There are no possible loadouts based on your settings. Please adjust your
        settings or add more echoes.
      </p>
      <template v-else>
        <div>
          Processed
          <span class="font-bold">{{ processedCombos }}</span>
          of
          <span class="font-bold">{{
            totalCombos === 0 ? "…" : totalCombos
          }}</span>
          loadouts
        </div>
        <progress
          class="progress progress-primary"
          :value="processedCombos"
          :max="Math.max(totalCombos, 1)"></progress>
      </template>
    </div>
    <CalculatorOptimizerResults
      v-if="optimizerResults"
      :character="character"
      :character-element="characterElement"
      :results="optimizerResults"
      :all-damages="allDamages"
      :total-atk="totalAtk"
      :total-hp="totalHp"
      :total-def="totalDef"
      :total-crit-rate="totalCritRate"
      :total-crit-dmg="totalCritDMG"
      :energy-regen="energyRegen"
      :target-type="optimizationTargetType"
      :target-value="optimizationTargetObject" />
  </div>
</template>

<script>
import { echoSetLabelMap, getEchoSetIconByType } from "../echoes/stats";
import {
  getSetBonusEffectsFromListOfSetKeys,
  getSetLabelByKey,
} from "../echoes/sets";
import { mainEchoesData, getEchoData } from "../echoes/index";
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import CalculatorOptimizerMinStats from "./CalculatorOptimizerMinStats.vue";
import CalculatorOptimizerEchoSet from "./CalculatorOptimizerEchoSet.vue";
import CalculatorOptimizerMainEcho from "./CalculatorOptimizerMainEcho.vue";
import CalculatorOptimizerTarget from "./CalculatorOptimizerTarget.vue";
import CalculatorOptimizerDamageType from "./CalculatorOptimizerDamageType.vue";
import CalculatorOptimizerResults from "./CalculatorOptimizerResults.vue";
import CalculatorOptimizerGuide from "./CalculatorOptimizerGuide.vue";
import CalculatorOptimizerSettings from "./CalculatorOptimizerSettings.vue";
import { character } from "../characters/Aalto/character";
export default {
  name: "CalculatorOptimizer",
  props: {
    character: {
      type: String,
      required: true,
    },
    totalCombos: {
      type: Number,
    },
    processedCombos: {
      type: Number,
    },
    optimizerNoPossibleLoadouts: {
      type: Boolean,
      default: false,
    },
    optimizerResults: {
      type: Array,
      default: null,
    },
    characterElement: {
      type: String,
      required: true,
    },
    // props for comparison
    allDamages: {
      type: Array,
      default: () => [],
    },
    totalAtk: {
      type: Number,
      required: true,
    },
    totalHp: {
      type: Number,
      required: true,
    },
    totalDef: {
      type: Number,
      required: true,
    },
    totalCritRate: {
      type: Number,
      required: true,
    },
    totalCritDMG: {
      type: Number,
      required: true,
    },
    energyRegen: {
      type: Number,
      required: true,
    },
    // this is passed back because if the user changes it in the UI
    // we don't want to lose the value of what they originally optimized for
    optimizationTargetType: {
      type: String,
      required: true,
    },
    optimizationTargetObject: {
      type: String,
      required: true,
    },
  },
  components: {
    CalculatorOptimizerMinStats,
    CalculatorOptimizerEchoSet,
    CalculatorOptimizerMainEcho,
    CalculatorOptimizerTarget,
    CalculatorOptimizerDamageType,
    CalculatorOptimizerResults,
    CalculatorOptimizerGuide,
    CalculatorOptimizerSettings,
  },
  data() {
    return {
      echoSetLabelMap,
      mainEchoesData,
      // echo chooser modal
      modalIdPicker: "optimizerEchoPicker",
      echoSetFilter: null,
      // filters
      setFilters: [],
      mainEchoes: [],
      minStats: [],
      optimizationTarget: null,
      damageType: "Average",
      // state
      isLoading: true,
      hasTriggeredOptimizer: false,
      // passive stats list
      echoSetPassiveStats: {},
      mainEchoStats: {},
      // settings
      ignoreOtherResonantorEchoes: false,
    };
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    echoSetLabelMap,
    getEchoSetIconByType,
    getSetBonusEffectsFromListOfSetKeys,
    handleOptimize() {
      this.hasTriggeredOptimizer = true;
      this.$emit(
        "optimizer:optimize",
        this.setFilters,
        this.mainEchoes,
        this.minStats,
        this.echoSetDataByLabel,
        this.mainEchoStats,
        this.optimizationTarget,
        this.damageType,
        this.ignoreOtherResonantorEchoes,
      );
    },
    chooseMainEcho(echoKey) {
      this.mainEchoes.push(echoKey);
      this.syncOptimizerConfig();
      this.closeEchoChooser();
    },
    toggleSetFilter(set) {
      const index = this.setFilters.findIndex((setFilter) => {
        return setFilter === set;
      });
      if (index >= 0) {
        this.setFilters.splice(index, 1);
      } else {
        this.setFilters.push(set);
      }
      this.syncOptimizerConfig();
    },
    handleUpdatedTarget(target) {
      this.optimizationTarget = target;
      this.syncOptimizerConfig();
    },
    handleUpdatedDamageType(damageType) {
      this.damageType = damageType;
      this.syncOptimizerConfig();
    },
    async syncOptimizerConfig() {
      const data = {
        optimizer: {
          mainEchoes: JSON.parse(JSON.stringify(this.mainEchoes)),
          echoSets: JSON.parse(JSON.stringify(this.setFilters)),
          minStats: JSON.parse(JSON.stringify(this.minStats)),
          optimizationTarget: this.optimizationTarget,
          damageType: this.damageType,
          ignoreOtherResonantorEchoes: this.ignoreOtherResonantorEchoes,
        },
      };
      await this.setCharacterData(this.character, data);
    },
    isSetFilterActive(set) {
      return this.setFilters.find((setFilter) => {
        return setFilter === set;
      });
    },
    isMainEchoActive(echoKey) {
      return this.mainEchoes.find((echo) => {
        return echo === echoKey;
      });
    },
    getSetIcon(set) {
      return this.getEchoSetIconByType(set);
    },
    openEchoChooser() {
      const modalEl = document.getElementById(this.modalIdPicker);
      modalEl.showModal();
    },
    closeEchoChooser() {
      this.echoSetFilter = null;
      const modalEl = document.getElementById(this.modalIdPicker);
      modalEl.close();
    },
    toggleEchoSetFilter(echoSet) {
      if (this.echoSetFilter === echoSet) {
        this.echoSetFilter = null;
      } else {
        this.echoSetFilter = echoSet;
      }
    },
    isEchoSetFilterActive(echoSet) {
      return this.echoSetFilter === echoSet;
    },
    resetFilters() {
      this.echoSetFilter = null;
    },
    getEchoSetImage(echoSet) {
      return getEchoSetIconByType(echoSet);
    },
    getEchoSetIcon(type) {
      return getEchoSetIconByType(type);
    },
    handleUpdatedMinStats(stats) {
      const minStats = JSON.parse(JSON.stringify(stats));
      this.minStats = minStats;
      this.syncOptimizerConfig();
    },
    removeMainEcho(echoKey) {
      const index = this.mainEchoes.findIndex((echo) => echo === echoKey);
      if (index >= 0) {
        this.mainEchoes.splice(index, 1);
        this.syncOptimizerConfig();
      }
    },
    handleUpdatedSetStats({ setKey, stats, key }) {
      const hasSetAlready = Object.prototype.hasOwnProperty.call(
        this.echoSetPassiveStats,
        setKey,
      );
      if (!hasSetAlready) {
        this.echoSetPassiveStats[setKey] = {};
      }
      this.echoSetPassiveStats[setKey][key] = stats;
    },
    handleUpdatedMainEchoBuffs({ key, stats }) {
      const hasEchoAlready = Object.prototype.hasOwnProperty.call(
        this.mainEchoStats,
        key,
      );
      if (!hasEchoAlready) {
        this.mainEchoStats[key] = {};
      }
      this.mainEchoStats[key] = stats;
    },
    handleOpenOptimizerGuide() {
      this.$refs.optimizerGuide.triggerOpenModal();
    },
    handleUpdatedSettings(settings) {
      this.ignoreOtherResonantorEchoes =
        settings.ignoreOtherResonantorEchoes ?? false;
      this.syncOptimizerConfig();
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
    isValid() {
      const echoSetsCount = this.setFilters.length;
      const mainEchoesCount = this.mainEchoes.length;
      let hasValidTarget = false;
      if (Array.isArray(this.optimizationTarget)) {
        hasValidTarget = this.optimizationTarget.length > 0;
      } else {
        hasValidTarget = !!this.optimizationTarget;
      }
      return hasValidTarget && echoSetsCount > 0 && mainEchoesCount > 0;
    },
    echoSets() {
      return Object.keys(this.echoSetLabelMap);
    },
    allEchoesListFiltered() {
      let allEchoes = Object.values(this.mainEchoesData);
      if (this.echoSetFilter) {
        allEchoes = allEchoes.filter((echo) =>
          echo.sets.includes(this.echoSetFilter),
        );
      }
      // now sort by class then by name
      const classOrder = {
        Calamity: 0,
        Overlord: 1,
        Elite: 2,
        Common: 3,
      };

      // Sort by class first (using classOrder), then by name alphabetically
      const sortedEchoes = allEchoes.sort((a, b) => {
        // First, compare by class based on the classOrder
        const classComparison = classOrder[a.class] - classOrder[b.class];

        // If classes are the same, sort by name alphabetically
        if (classComparison === 0) {
          return a.name.localeCompare(b.name);
        }

        return classComparison;
      });
      return sortedEchoes;
    },
    currentSetBonuses() {
      return this.getSetBonusEffectsFromListOfSetKeys(this.setFilters);
    },
    echoSetPassiveStatsByLabel() {
      const result = {};
      Object.keys(this.echoSetPassiveStats).forEach((setKey) => {
        const label = getSetLabelByKey(setKey);
        result[label] = this.echoSetPassiveStats[setKey];
      });
      return result;
    },
    echoSetDataByLabel() {
      const result = {};
      Object.entries(this.echoSetPassiveStatsByLabel).forEach(
        ([label, passives]) => {
          // loop through all passves and merge the stats, put merged stats into the result object
          // keyed by the current label
          const mergedStats = {};
          Object.values(passives).forEach((passiveStats) => {
            Object.entries(passiveStats).forEach(([stat, value]) => {
              if (!mergedStats[stat]) {
                mergedStats[stat] = 0;
              }
              mergedStats[stat] += value;
            });
          });
          result[label] = mergedStats;
        },
      );
      return result;
    },
    allMainEchoesData() {
      const echoData = [];
      this.mainEchoes.forEach((echoKey) => {
        if (this.mainEchoesData[echoKey]) {
          echoData.push(getEchoData([echoKey]));
        }
      });
      return echoData;
    },
  },
  mounted() {
    this.isLoading = true;
    this.mainEchoes = this.currentCharacter?.optimizer?.mainEchoes ?? [];
    this.setFilters = this.currentCharacter?.optimizer?.echoSets ?? [];
    this.minStats = this.currentCharacter?.optimizer?.minStats ?? [];
    this.optimizationTarget =
      this.currentCharacter?.optimizer?.optimizationTarget ?? [];
    this.ignoreOtherResonantorEchoes =
      this.currentCharacter?.optimizer?.ignoreOtherResonantorEchoes ?? false;
    this.isLoading = false;
  },
};
</script>

<style lang="scss" scoped>
.echo-filters__sets--active {
  button {
    opacity: 0.6;
  }
  button.btn-active {
    opacity: 1;
  }
}
</style>
