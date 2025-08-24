<template>
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
          class="echoes__filters flex align-center gap-2 mb-6 items-center flex-wrap">
          <span class="mr-2">Filter</span>
          <button
            v-for="echoSet in echoSets"
            :key="echoSet"
            @click="toggleEchoSetFilter(echoSet)"
            class="rounded"
            :class="{ 'btn-active': isEchoSetFilterActive(echoSet) }">
            <img
              :src="getEchoSetImage(echoSet)"
              class="size-8 m-width-8 p-[.15rem]"
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
            class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer"
            @click="chooseMainEcho(echoesToChoose.key)">
            <div class="card-body items-center">
              <div
                class="echo__item__image rounded-full border border-solid neutral-content size-20 mb-2 bg-cover cursor-pointer mx-auto lg:m-0"
                :style="{
                  backgroundImage: `url(${echoesToChoose.image})`,
                }"
                ></div>
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
    <div class="optimizer-filters">
        <div class="optimizer-filters__sets">
            <h3>Choose echo sets</h3>
            <div class="optimizer-filters__sets--two flex gap-2">
                <button
                    v-for="set in echoSets"
                    :key="set"
                    @click="toggleSetFilter(set)"
                    class="size-8 rounded p-[.15rem]"
                    :class="{'btn-active': isSetFilterActive(set)}"
                >
                    <img :src="getSetIcon(set)" :alt="set" />
                </button>
            </div>
            <h3 class="mt-6">Choose main echoes</h3>
            <div class="optimizer-echoes-chosen flex gap-2">
              <div v-for="echoKey in mainEchoes" :key="echoKey" class="text-wrap w-[6rem] flex flex-col items-center">
                  <div
                      class="echo__item__image rounded-full border border-solid neutral-content size-12 mb-2 bg-cover cursor-pointer"
                      :style="{
                          backgroundImage: `url(${mainEchoesData[echoKey]?.image})`,
                      }"
                  ></div>
                  <div class="text-center text-sm">{{ mainEchoesData[echoKey]?.name }}</div>
                  <button class="btn btn-xs btn-outline mt-1" @click="removeMainEcho(echoKey)">Remove</button>
              </div>
            </div>
            <div>
                <button @click="openEchoChooser" class="btn btn-primary btn-sm">Choose an echo</button>
            </div>
        </div>
        <div class="optimizer-filters__sets">
            <h3>Choose target stats</h3>
            <CalculatorOptimizerMinStats
              :character="character"
              :key="character"
              :min-stats="minStats"
              @updated-min-stats="handleUpdatedMinStats"
            ></CalculatorOptimizerMinStats>
        </div>
    </div>
    <div class="mt-4">Processed {{ processedCombos }} of {{  totalCombos }}</div>
    <progress class="progress progress-primary w-56" :value="processedCombos" :max="totalCombos"></progress>
    <div>
        <p v-if="!isValid">Choose echo sets and main echoes</p>
        <button class="btn btn-primary" @click="handleOptimize" :disabled="!isValid">Optimize</button>
    </div>
    <pre>{{ setFilters }}</pre>
    <pre>{{  mainEchoes }}</pre>
    <hr></hr>
    <pre>{{ optimizerResults }}</pre>
  </div>
</template>

<script>
import { echoSetLabelMap, getEchoSetIconByType } from "../echoes/stats";
import { mainEchoesData } from "../echoes/index";
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import CalculatorOptimizerMinStats from "./CalculatorOptimizerMinStats.vue";
export default {
    name: "CalculatorOptimizer",
    props: {
        character: {
            type: String,
            required: true,
        },
        totalCombos: {
            type: Number
        },
        processedCombos: {
            type: Number
        },
        optimizerResults: {
            type: Array,
            default: () => []
        }
    },
    components: {
      CalculatorOptimizerMinStats,
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
            // state
            isLoading: true,
        }
    },
    methods: {
        ...mapActions(useCharacterStore, ["setCharacterData"]),
        echoSetLabelMap,
        getEchoSetIconByType,
        handleOptimize() {
            this.$emit('optimizer:optimize', this.setFilters, this.mainEchoes, this.minStats)
        },
        chooseMainEcho(echoKey) {
            this.mainEchoes.push(echoKey);
            this.syncOptimizerConfig();
            this.closeEchoChooser();
        },
        toggleSetFilter(set) {
            const index = this.setFilters.findIndex((setFilter) => { return setFilter === set});
            if (index >= 0) {
                this.setFilters.splice(index, 1);
            } else {
                this.setFilters.push(set);
            }
            this.syncOptimizerConfig();
        },
        async syncOptimizerConfig() {
            const data = {
                optimizer: {
                    mainEchoes: JSON.parse(JSON.stringify(this.mainEchoes)),
                    echoSets: JSON.parse(JSON.stringify(this.setFilters)),
                    minStats: JSON.parse(JSON.stringify(this.minStats)),
                }
            };
            await this.setCharacterData(this.character, data);
        },
        isSetFilterActive(set) {
            return this.setFilters.find((setFilter) => { return setFilter === set});
        },
        isMainEchoActive(echoKey) {
            return this.mainEchoes.find((echo) => { return echo === echoKey});
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
      }
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
            return echoSetsCount > 0 && mainEchoesCount > 0;
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
    },
    mounted() {
        this.isLoading = true;
        this.mainEchoes = this.currentCharacter?.optimizer?.mainEchoes ?? [];
        this.setFilters = this.currentCharacter?.optimizer?.echoSets ?? [];
        this.minStats = this.currentCharacter?.optimizer?.minStats ?? [];
        this.isLoading = false;
    }
}
</script>