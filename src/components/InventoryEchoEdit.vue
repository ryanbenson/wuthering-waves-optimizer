<template>
  <dialog :id="modalId" class="modal">
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
    <div class="modal-box max-w-xl">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <div
          class="echo__selection flex flex-col w-full items-center gap-6 sm:flex-row">
          <div class="echo__item__img-actions flex flex-col gap-2 items-center">
            <div
              class="echo__item__image rounded-full border border-solid neutral-content size-24 bg-cover min-w-24 text-center"
              :class="{
                'border-amber-300': rank === '5' || rank === 5,
                'border-violet-600': rank === '4' || rank === 4,
                'border-blue-500': rank === '3' || rank === 3,
                'border-green-500': rank === '2' || rank === 2,
              }"
              :style="{
                backgroundImage: `url(${echoImage})`,
              }"></div>
            <button @click="openEchoPicker" class="btn btn-sm btn--echo--find">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="size-4">
                <path
                  d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                  fill="#FFFFFF" />
              </svg>
              Find
            </button>
          </div>
          <div class="echo__item__main-selection flex flex-col gap-4">
            <select
              v-model="echo"
              name="mainEcho"
              class="select select-bordered select select-sm">
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

            <select
              name="mainStat"
              class="select select-bordered select select-sm"
              v-model="stat"
              :disabled="!type">
              <option value="none">Select Stat</option>
              <option v-for="s in getStats(type)" :key="s" :value="s">
                {{ getReadableSubStatLabel(s) }}
              </option>
            </select>
          </div>
          <div class="echo__item__set w-full relative">
            <span
              class="font-bold mb-2 inline-flex w-full justify-center sm:justify-start">
              Echo Set
            </span>
            <div
              class="echo__item__set-selection flex gap-3 justify-center sm:justify-start flex-wrap">
              <div
                v-for="echo in echoSets"
                :key="echo"
                @click="handleChooseEchoSet(echo)"
                class="size-8 rounded-full cursor-pointer echo__item__set-selection--icon"
                :class="{ 'border border-white': isSetSelected(echo) }">
                <img :src="getEchoSetIcon(echo)" :class="echo" />
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="echoPresetsFoundWithEcho.length"
          class="echo__in-preset alert alert-info my-2 flex items-center p-2">
            This echo is found in {{ echoPresetsFoundWithEcho.length }} presets. Any changes will affect those too.
        </div>
        <div class="echo__selection__input w-full mt-8">
          <div class="echo__selection__rank flex flex-col pb-7 relative">
            <label for="rank" class="rank__label">
              Rank
              <span class="text-primary">{{ rank }}</span>
            </label>
            <input
              type="range"
              id="rank"
              min="2"
              max="5"
              v-model="rank"
              step="1"
              :class="rangeClasses"
              class="echo__selection__rank__input range range-xs" />
          </div>
        </div>
        <div class="echo__selection_substats w-full">
          <span class="font-bold text-2xl mb-6 inline-flex">Substats</span>
          <div class="echo__selection_substats__list">
            <div class="echo__selection_substat relative">
              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isCritRateChecked"
                  @change="toggleSubStat"
                  value="CritRate"
                  :disabled="isCritRateDisabled" />
                <span
                  class="label-text"
                  :class="{ substat__label: isCritRateChecked }">
                  Crit Rate
                  <span v-if="isCritRateChecked" class="text-primary">
                    {{ critRateValue }}
                  </span>
                </span>
                <Range
                  v-if="isCritRateChecked"
                  id="CritRate"
                  :values="getSubStatRange('CritRate')"
                  :default-value="getDefaultValue('CritRate')"
                  size="xs"
                  class="echo__selection__rank__input w-full"
                  @update-value="(val) => subStatUpdated('CritRate', val)" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isCritDMGChecked"
                  @change="toggleSubStat"
                  value="CritDMG"
                  :disabled="isCritDMGDisabled" />
                <span
                  class="label-text"
                  :class="{ substat__label: isCritDMGChecked }">
                  Crit DMG
                  <span v-if="isCritDMGChecked" class="text-primary">
                    {{ critDmgValue }}
                  </span>
                </span>
                <Range
                  v-if="isCritDMGChecked"
                  id="CritDMG"
                  :values="getSubStatRange('CritDMG')"
                  :default-value="getDefaultValue('CritDMG')"
                  size="xs"
                  class="echo__selection__rank__input w-full"
                  @update-value="(val) => subStatUpdated('CritDMG', val)" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isAtkChecked"
                  @change="toggleSubStat"
                  :disabled="isAtkDisabled"
                  value="ATK" />
                <span
                  class="label-text"
                  :class="{ substat__label: isAtkChecked }">
                  ATK%
                  <span v-if="isAtkChecked" class="text-primary">
                    {{ atkValue }}
                  </span>
                </span>
                <Range
                  v-if="isAtkChecked"
                  id="ATK"
                  :values="getSubStatRange('ATK')"
                  :default-value="getDefaultValue('ATK')"
                  size="xs"
                  class="echo__selection__rank__input w-full"
                  @update-value="(val) => subStatUpdated('ATK', val)" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isFlatAtkChecked"
                  @change="toggleSubStat"
                  :disabled="isFlatAtkDisabled"
                  value="ATK_FLAT" />
                <span
                  class="label-text"
                  :class="{ substat__label: isFlatAtkChecked }">
                  ATK
                  <span v-if="isFlatAtkChecked" class="text-primary">
                    {{ atkFlatValue }}
                  </span>
                </span>
                <Range
                  v-if="isFlatAtkChecked"
                  id="ATK_FLAT"
                  :values="getSubStatRange('ATK_FLAT')"
                  :default-value="getDefaultValue('ATK_FLAT')"
                  size="xs"
                  class="echo__selection__rank__input w-full"
                  @update-value="(val) => subStatUpdated('ATK_FLAT', val)" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isHpChecked"
                  @change="toggleSubStat"
                  :disabled="isHpDisabled"
                  value="HP" />
                <span
                  class="label-text"
                  :class="{ substat__label: isHpChecked }">
                  HP%
                  <span v-if="isHpChecked" class="text-primary">
                    {{ hpValue }}
                  </span>
                </span>
                <Range
                  v-if="isHpChecked"
                  id="CritRate"
                  :values="getSubStatRange('HP')"
                  :default-value="getDefaultValue('HP')"
                  size="xs"
                  class="echo__selection__rank__input w-full"
                  @update-value="(val) => subStatUpdated('HP', val)" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isFlatHpChecked"
                  @change="toggleSubStat"
                  :disabled="isFlatHpDisabled"
                  value="HP_FLAT" />
                <span
                  class="label-text"
                  :class="{ substat__label: isFlatHpChecked }">
                  HP
                  <span v-if="isFlatHpChecked" class="text-primary">
                    {{ hpFlatValue }}
                  </span>
                </span>
                <Range
                  v-if="isFlatHpChecked"
                  id="HP_FLAT"
                  :values="getSubStatRange('HP_FLAT')"
                  :default-value="getDefaultValue('HP_FLAT')"
                  size="xs"
                  class="echo__selection__rank__input w-full"
                  @update-value="(val) => subStatUpdated('HP_FLAT', val)" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isDefChecked"
                  @change="toggleSubStat"
                  :disabled="isDefDisabled"
                  value="DEF" />
                <span
                  class="label-text"
                  :class="{ substat__label: isDefChecked }">
                  DEF%
                  <span v-if="isDefChecked" class="text-primary">
                    {{ defValue }}
                  </span>
                </span>
                <Range
                  v-if="isDefChecked"
                  id="DEF"
                  :values="getSubStatRange('DEF')"
                  :default-value="getDefaultValue('DEF')"
                  size="xs"
                  class="echo__selection__rank__input w-full"
                  @update-value="(val) => subStatUpdated('DEF', val)" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isFlatDefChecked"
                  @change="toggleSubStat"
                  :disabled="isFlatDefDisabled"
                  value="DEF_FLAT" />
                <span
                  class="label-text"
                  :class="{ substat__label: isFlatDefChecked }">
                  DEF
                  <span v-if="isFlatDefChecked" class="text-primary">
                    {{ defFlatValue }}
                  </span>
                </span>
                <Range
                  v-if="isFlatDefChecked"
                  id="DEF_FLAT"
                  :values="getSubStatRange('DEF_FLAT')"
                  :default-value="getDefaultValue('DEF_FLAT')"
                  size="xs"
                  class="echo__selection__rank__input w-full"
                  @update-value="(val) => subStatUpdated('DEF_FLAT', val)" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isBasicChecked"
                  @change="toggleSubStat"
                  :disabled="isBasicDisabled"
                  value="BasicAttackDMGBonus" />
                <span
                  class="label-text"
                  :class="{ substat__label: isBasicChecked }">
                  Basic Attack DMG Bonus
                  <span v-if="isBasicChecked" class="text-primary">
                    {{ basicValue }}
                  </span>
                </span>
                <Range
                  v-if="isBasicChecked"
                  id="BasicAttackDMGBonus"
                  :values="getSubStatRange('BasicAttackDMGBonus')"
                  :default-value="getDefaultValue('BasicAttackDMGBonus')"
                  size="xs"
                  class="echo__selection__rank__input w-full"
                  @update-value="
                    (val) => subStatUpdated('BasicAttackDMGBonus', val)
                  " />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isHeavyChecked"
                  @change="toggleSubStat"
                  :disabled="isHeavyDisabled"
                  value="HeavyAttackDMGBonus" />
                <span
                  class="label-text"
                  :class="{ substat__label: isHeavyChecked }">
                  Heavy Attack DMG Bonus
                  <span v-if="isHeavyChecked" class="text-primary">
                    {{ heavyValue }}
                  </span>
                </span>
                <Range
                  v-if="isHeavyChecked"
                  id="HeavyAttackDMGBonus"
                  :values="getSubStatRange('HeavyAttackDMGBonus')"
                  :default-value="getDefaultValue('HeavyAttackDMGBonus')"
                  size="xs"
                  class="echo__selection__rank__input w-full"
                  @update-value="
                    (val) => subStatUpdated('HeavyAttackDMGBonus', val)
                  " />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isSkillChecked"
                  @change="toggleSubStat"
                  :disabled="isSkillDisabled"
                  value="ResonanceSkillDMGBonus" />
                <span
                  class="label-text"
                  :class="{ substat__label: isSkillChecked }">
                  Skill DMG Bonus
                  <span v-if="isSkillChecked" class="text-primary">
                    {{ skillValue }}
                  </span>
                </span>
                <Range
                  v-if="isSkillChecked"
                  id="ResonanceSkillDMGBonus"
                  :values="getSubStatRange('ResonanceSkillDMGBonus')"
                  :default-value="getDefaultValue('ResonanceSkillDMGBonus')"
                  size="xs"
                  class="echo__selection__rank__input w-full"
                  @update-value="
                    (val) => subStatUpdated('ResonanceSkillDMGBonus', val)
                  " />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isLiberationChecked"
                  @change="toggleSubStat"
                  :disabled="isLiberationDisabled"
                  value="ResonanceLiberationDMGBonus" />
                <span
                  class="label-text"
                  :class="{ substat__label: isLiberationChecked }">
                  Liberation DMG Bonus
                  <span v-if="isLiberationChecked" class="text-primary">
                    {{ liberationValue }}
                  </span>
                </span>
                <Range
                  v-if="isLiberationChecked"
                  id="ResonanceLiberationDMGBonus"
                  :values="getSubStatRange('ResonanceLiberationDMGBonus')"
                  :default-value="
                    getDefaultValue('ResonanceLiberationDMGBonus')
                  "
                  size="xs"
                  class="echo__selection__rank__input w-full"
                  @update-value="
                    (val) => subStatUpdated('ResonanceLiberationDMGBonus', val)
                  " />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isEnergyRechargeChecked"
                  @change="toggleSubStat"
                  :disabled="isEnergyRechargeDisabled"
                  value="EnergyRegen" />
                <span
                  class="label-text"
                  :class="{ substat__label: isEnergyRechargeChecked }">
                  Energy Regen
                  <span v-if="isEnergyRechargeChecked" class="text-primary">
                    {{ energyRegenValue }}
                  </span>
                </span>
                <Range
                  v-if="isEnergyRechargeChecked"
                  id="EnergyRegen"
                  :values="getSubStatRange('EnergyRegen')"
                  :default-value="getDefaultValue('EnergyRegen')"
                  size="xs"
                  class="echo__selection__rank__input w-full"
                  @update-value="(val) => subStatUpdated('EnergyRegen', val)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>

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
            v-for="echoSet in echoSetsList"
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
                @click="handleOpenModal"></div>
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
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useInventoryStore } from "../stores/inventory";
import { useSettingsStore } from "../stores/settings";
import {
  rankColors,
  statsTable,
  flatBonusesByRankByType,
  subStats,
  subStatRanges,
  subStatLabelMap,
  getReadableSubStatLabel,
  getSubStatIconByType,
  getEchoSetIconByType,
  echoSetLabelMap,
} from "../echoes/stats";
import {
  mainEchoesData,
  getEchoData,
  getCostByClass,
} from "../echoes/index.ts";
import { subStatsTable } from "../echoes/stats.ts";
import Range from "./input/Range.vue";
export default {
  props: {},
  components: {
    Range,
  },
  data() {
    return {
      echoId: null,
      rankColors,
      statsTable,
      flatBonusesByRankByType,
      echoSetLabelMap,
      subStats,
      subStatRanges,
      totalCost: 0,
      allSubStatsEnabled: {
        echoSubStatsType1: false,
        echoSubStatsType2: false,
        echoSubStatsType3: false,
        echoSubStatsType4: false,
        echoSubStatsType5: false,
      },
      allSubStats: [],
      echoSetFilter: null,
    };
  },
  watch: {
    echo: {
      handler: async function (val, previousVal) {
        this.updateEchoChoice(val, previousVal);
      },
      immediate: true,
    },
    echoSubStatsType1: {
      handler: async function () {
        this.syncMainStats();
      },
      immediate: true,
    },
    echoSubStatsType2: {
      handler: async function () {
        this.syncMainStats();
      },
      immediate: true,
    },
    echoSubStatsType3: {
      handler: async function () {
        this.syncMainStats();
      },
      immediate: true,
    },
    echoSubStatsType4: {
      handler: async function () {
        this.syncMainStats();
      },
      immediate: true,
    },
    echoSubStatsType5: {
      handler: async function () {
        this.syncMainStats();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useInventoryStore, [
      "saveEcho",
      "patchEcho",
      "deleteEcho",
      "getEchoById",
      "setEquippedData",
    ]),
    setEchoId(echoId) {
      this.echoId = echoId;
      this.syncMainStats();
    },
    updateEchoChoice(echo, previousEcho) {
      const echoData = getEchoData(echo);
      const echoClass = echoData?.class;
      const echoCost = getCostByClass(echoClass);
      this.selectCost(echoCost);
      // get the cost of the previous echo, if they are different then
      // reset the main stat type and value
      let prevEchoCost = null;
      if (previousEcho) {
        const prevEchoData = getEchoData(previousEcho);
        const prevEchoClass = prevEchoData?.class;
        prevEchoCost = getCostByClass(prevEchoClass);
      }
      // only reset if there was a previous one,
      // otherwise it will reset on load
      if (previousEcho && echoCost !== prevEchoCost) {
        this.stat = "none";
      }
    },
    selectCost(cost) {
      this.type = cost;
    },
    selectRank(rank) {
      this.rank = rank;
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
    syncMainStats() {
      this.allSubStats = [];
      this.allSubStatsEnabled = {
        echoSubStatsType1: false,
        echoSubStatsType2: false,
        echoSubStatsType3: false,
        echoSubStatsType4: false,
        echoSubStatsType5: false,
      };
      let updatedSubStats = [];
      if (this.echoSubStatsType1 && this.echoSubStatsType1 !== "none") {
        this.allSubStatsEnabled["echoSubStatsType1"] = true;
        updatedSubStats.push(this.echoSubStatsType1);
      }
      if (this.echoSubStatsType2 && this.echoSubStatsType2 !== "none") {
        this.allSubStatsEnabled["echoSubStatsType2"] = true;
        updatedSubStats.push(this.echoSubStatsType2);
      }
      if (this.echoSubStatsType3 && this.echoSubStatsType3 !== "none") {
        this.allSubStatsEnabled["echoSubStatsType3"] = true;
        updatedSubStats.push(this.echoSubStatsType3);
      }
      if (this.echoSubStatsType4 && this.echoSubStatsType4 !== "none") {
        this.allSubStatsEnabled["echoSubStatsType4"] = true;
        updatedSubStats.push(this.echoSubStatsType4);
      }
      if (this.echoSubStatsType5 && this.echoSubStatsType5 !== "none") {
        this.allSubStatsEnabled["echoSubStatsType5"] = true;
        updatedSubStats.push(this.echoSubStatsType5);
      }
      this.allSubStats = updatedSubStats;
    },
    toggleSubStat(e) {
      const mainStat = e.target.value;
      const isChecked = e.target.checked;
      // if the checked is now false, find the main stat and disable it
      if (!isChecked) {
        this.deleteSubStatData(mainStat);
        this.syncMainStats();
        return;
      }
      const range = this.getSubStatRange(mainStat);
      // get the first option as the initial val
      const initialSubStatValue = range[0];
      // find the first item that's null or "none" and fill it in
      if (!this.echoSubStatsType1 || this.echoSubStatsType1 === "none") {
        this.echoSubStatsType1 = mainStat;
        this.echoSubStatsValue1 = initialSubStatValue;
        return;
      }
      if (!this.echoSubStatsType2 || this.echoSubStatsType2 === "none") {
        this.echoSubStatsType2 = mainStat;
        this.echoSubStatsValue2 = initialSubStatValue;
        return;
      }
      if (!this.echoSubStatsType3 || this.echoSubStatsType3 === "none") {
        this.echoSubStatsType3 = mainStat;
        this.echoSubStatsValue3 = initialSubStatValue;
        return;
      }
      if (!this.echoSubStatsType4 || this.echoSubStatsType4 === "none") {
        this.echoSubStatsType4 = mainStat;
        this.echoSubStatsValue4 = initialSubStatValue;
        return;
      }
      if (!this.echoSubStatsType5 || this.echoSubStatsType5 === "none") {
        this.echoSubStatsType5 = mainStat;
        this.echoSubStatsValue5 = initialSubStatValue;
        return;
      }
    },
    deleteSubStatData(mainStat) {
      if (this.echoSubStatsType1 === mainStat) {
        this.echoSubStatsType1 = null;
        this.echoSubStatsValue1 = null;
      }
      if (this.echoSubStatsType2 === mainStat) {
        this.echoSubStatsType2 = null;
        this.echoSubStatsValue2 = null;
      }
      if (this.echoSubStatsType3 === mainStat) {
        this.echoSubStatsType3 = null;
        this.echoSubStatsValue3 = null;
      }
      if (this.echoSubStatsType4 === mainStat) {
        this.echoSubStatsType4 = null;
        this.echoSubStatsValue4 = null;
      }
      if (this.echoSubStatsType5 === mainStat) {
        this.echoSubStatsType5 = null;
        this.echoSubStatsValue5 = null;
      }
    },
    handleOpenModal() {
      const modalEl = document.getElementById(this.modalId);
      modalEl.showModal();
    },
    openEchoPicker() {
      const modalEl = document.getElementById(this.modalIdPicker);
      modalEl.showModal();
    },
    subStatUpdated(mainStat, val) {
      if (this.echoSubStatsType1 === mainStat) {
        this.echoSubStatsValue1 = val;
        return;
      }
      if (this.echoSubStatsType2 === mainStat) {
        this.echoSubStatsValue2 = val;
        return;
      }
      if (this.echoSubStatsType3 === mainStat) {
        this.echoSubStatsValue3 = val;
        return;
      }
      if (this.echoSubStatsType4 === mainStat) {
        this.echoSubStatsValue4 = val;
        return;
      }
      if (this.echoSubStatsType5 === mainStat) {
        this.echoSubStatsValue5 = val;
        return;
      }
    },
    getSubStatRange(mainStat) {
      return subStatsTable[mainStat] ?? [];
    },
    getDefaultValue(mainStat) {
      if (this.echoSubStatsType1 === mainStat) {
        return this.echoSubStatsValue1;
      }
      if (this.echoSubStatsType2 === mainStat) {
        return this.echoSubStatsValue2;
      }
      if (this.echoSubStatsType3 === mainStat) {
        return this.echoSubStatsValue3;
      }
      if (this.echoSubStatsType4 === mainStat) {
        return this.echoSubStatsValue4;
      }
      if (this.echoSubStatsType5 === mainStat) {
        return this.echoSubStatsValue5;
      }
      const range = this.getSubStatRange(mainStat);
      const middleVal = range[Math.floor(range.length / 2)];
      return middleVal;
    },
    getEchoSetIcon(type) {
      return getEchoSetIconByType(type);
    },
    handleChooseEchoSet(set) {
      this.echoSet = set;
    },
    isSetSelected(set) {
      return this.echoSet === set;
    },
    openEchoBrowser() {
      this.$emit("open-echoes-browser", this.index);
    },
    getEchoSetImage(echoSet) {
      return getEchoSetIconByType(echoSet);
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
    chooseMainEcho(echoKey) {
      this.echo = echoKey;
      this.closeEchoChooser();
    },
    closeEchoChooser() {
      this.echoSetFilter = null;
      const modalEl = document.getElementById(this.modalIdPicker);
      modalEl.close();
    },
  },
  computed: {
    ...mapState(useInventoryStore, ["echoes", "getEchoPresetsByEchoId"]),
    ...mapState(useSettingsStore, ["config"]),
    echoPresetsFoundWithEcho() {
      return this.getEchoPresetsByEchoId(this.echoId);
    },
    settingsTheme() {
      const settingsTheme = this.config?.theme ?? null;
      return settingsTheme;
    },
    rangeClasses() {
      const classes = [];
      if (this.settingsTheme === "black") {
        classes.push("[--range-shdw:gray]");
      }
      return classes;
    },
    /**
     * Returns the current echo from the inventory
     * @returns {Object|null}
     */
    currentEcho() {
      if (!this.echoId) {
        return null;
      }
      return this.getEchoById(this.echoId);
    },
    /**
     * Getter/setter used in the form for the type for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    type: {
      get() {
        return this.currentEcho?.type;
      },
      async set(value) {
        this.patchEcho(this.echoId, { type: value });
      },
    },
    /**
     * Getter/setter used in the form for the type for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echo: {
      get() {
        return this.currentEcho?.echo ?? null;
      },
      async set(value) {
        await this.patchEcho(this.echoId, { echo: value });
      },
    },
    /**
     * Getter/setter used in the form for the type for this echo set
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSet: {
      get() {
        return this.currentEcho?.echoSet ?? null;
      },
      async set(value) {
        await this.patchEcho(this.echoId, { echoSet: value });
      },
    },
    /**
     * Getter/setter used in the form for the rank for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    rank: {
      get() {
        return this.currentEcho?.rank ?? 5;
      },
      async set(value) {
        await this.patchEcho(this.echoId, { rank: value });
      },
    },
    /**
     * Getter/setter used in the form for the stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    stat: {
      get() {
        return this.currentEcho?.stat ?? "none";
      },
      async set(value) {
        await this.patchEcho(this.echoId, { stat: value });
      },
    },
    /**
     * Getter/setter used in the form for the sub stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSubStatsType1: {
      get() {
        return this.currentEcho?.echoSubStatsType1 ?? "none";
      },
      async set(value) {
        await this.patchEcho(this.echoId, { echoSubStatsType1: value });
      },
    },
    /**
     * Getter/setter used in the form for the sub stat value for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    echoSubStatsValue1: {
      get() {
        return this.currentEcho?.echoSubStatsValue1 ?? 0;
      },
      async set(value) {
        await this.patchEcho(this.echoId, { echoSubStatsValue1: value });
      },
    },

    /**
     * Getter/setter used in the form for the sub stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSubStatsType2: {
      get() {
        return this.currentEcho?.echoSubStatsType2 ?? "none";
      },
      async set(value) {
        await this.patchEcho(this.echoId, { echoSubStatsType2: value });
      },
    },
    /**
     * Getter/setter used in the form for the sub stat value for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    echoSubStatsValue2: {
      get() {
        return this.currentEcho?.echoSubStatsValue2 ?? 0;
      },
      async set(value) {
        await this.patchEcho(this.echoId, { echoSubStatsValue2: value });
      },
    },

    /**
     * Getter/setter used in the form for the sub stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSubStatsType3: {
      get() {
        return this.currentEcho?.echoSubStatsType3 ?? "none";
      },
      async set(value) {
        await this.patchEcho(this.echoId, { echoSubStatsType3: value });
      },
    },
    /**
     * Getter/setter used in the form for the sub stat value for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    echoSubStatsValue3: {
      get() {
        return this.currentEcho?.echoSubStatsValue3 ?? 0;
      },
      async set(value) {
        await this.patchEcho(this.echoId, { echoSubStatsValue3: value });
      },
    },

    /**
     * Getter/setter used in the form for the sub stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSubStatsType4: {
      get() {
        return this.currentEcho?.echoSubStatsType4 ?? "none";
      },
      async set(value) {
        await this.patchEcho(this.echoId, { echoSubStatsType4: value });
      },
    },
    /**
     * Getter/setter used in the form for the sub stat value for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    echoSubStatsValue4: {
      get() {
        return this.currentEcho?.echoSubStatsValue4 ?? 0;
      },
      async set(value) {
        await this.patchEcho(this.echoId, { echoSubStatsValue4: value });
      },
    },
    /**
     * Getter/setter used in the form for the sub stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSubStatsType5: {
      get() {
        return this.currentEcho?.echoSubStatsType5 ?? "none";
      },
      async set(value) {
        await this.patchEcho(this.echoId, { echoSubStatsType5: value });
      },
    },
    /**
     * Getter/setter used in the form for the sub stat value for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    echoSubStatsValue5: {
      get() {
        return this.currentEcho?.echoSubStatsValue5 ?? 0;
      },
      async set(value) {
        await this.patchEcho(this.echoId, { echoSubStatsValue5: value });
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
    mainEchoHasStacks() {
      return this.chosenMainEchoData?.hasStacks ?? false;
    },
    mainEchoMinStacks() {
      return this.chosenMainEchoData?.minStacks ?? 0;
    },
    mainEchoMaxStacks() {
      return this.chosenMainEchoData?.maxStacks ?? 0;
    },
    modalId() {
      return `echoModal`;
    },
    modalIdPicker() {
      return `echoModalPicker`;
    },
    totalSubStatsEnabled() {
      const allValues = Object.values(this.allSubStatsEnabled);
      const allTrueValues = allValues.filter((val) => val === true);
      return allTrueValues.length;
    },
    isMaxSubstats() {
      return this.totalSubStatsEnabled >= 5;
    },
    hasSubStats() {
      return this.totalSubStatsEnabled > 0;
    },
    isCritRateDisabled() {
      if (!this.isMaxSubstats) {
        return false;
      }
      return !this.allSubStats.includes("CritRate");
    },
    isCritDMGDisabled() {
      if (!this.isMaxSubstats) {
        return false;
      }
      return !this.allSubStats.includes("CritDMG");
    },
    isAtkDisabled() {
      if (!this.isMaxSubstats) {
        return false;
      }
      return !this.allSubStats.includes("ATK");
    },
    isFlatAtkDisabled() {
      if (!this.isMaxSubstats) {
        return false;
      }
      return !this.allSubStats.includes("ATK_FLAT");
    },
    isHpDisabled() {
      if (!this.isMaxSubstats) {
        return false;
      }
      return !this.allSubStats.includes("HP");
    },
    isFlatHpDisabled() {
      if (!this.isMaxSubstats) {
        return false;
      }
      return !this.allSubStats.includes("HP_FLAT");
    },
    isDefDisabled() {
      if (!this.isMaxSubstats) {
        return false;
      }
      return !this.allSubStats.includes("DEF");
    },
    isFlatDefDisabled() {
      if (!this.isMaxSubstats) {
        return false;
      }
      return !this.allSubStats.includes("DEF_FLAT");
    },
    isBasicDisabled() {
      if (!this.isMaxSubstats) {
        return false;
      }
      return !this.allSubStats.includes("BasicAttackDMGBonus");
    },
    isHeavyDisabled() {
      if (!this.isMaxSubstats) {
        return false;
      }
      return !this.allSubStats.includes("HeavyAttackDMGBonus");
    },
    isSkillDisabled() {
      if (!this.isMaxSubstats) {
        return false;
      }
      return !this.allSubStats.includes("ResonanceSkillDMGBonus");
    },
    isLiberationDisabled() {
      if (!this.isMaxSubstats) {
        return false;
      }
      return !this.allSubStats.includes("ResonanceLiberationDMGBonus");
    },
    isEnergyRechargeDisabled() {
      if (!this.isMaxSubstats) {
        return false;
      }
      return !this.allSubStats.includes("EnergyRegen");
    },
    isCritRateChecked() {
      return this.allSubStats.includes("CritRate");
    },
    isCritDMGChecked() {
      return this.allSubStats.includes("CritDMG");
    },
    isAtkChecked() {
      return this.allSubStats.includes("ATK");
    },
    isFlatAtkChecked() {
      return this.allSubStats.includes("ATK_FLAT");
    },
    isHpChecked() {
      return this.allSubStats.includes("HP");
    },
    isFlatHpChecked() {
      return this.allSubStats.includes("HP_FLAT");
    },
    isDefChecked() {
      return this.allSubStats.includes("DEF");
    },
    isFlatDefChecked() {
      return this.allSubStats.includes("DEF_FLAT");
    },
    isBasicChecked() {
      return this.allSubStats.includes("BasicAttackDMGBonus");
    },
    isHeavyChecked() {
      return this.allSubStats.includes("HeavyAttackDMGBonus");
    },
    isSkillChecked() {
      return this.allSubStats.includes("ResonanceSkillDMGBonus");
    },
    isLiberationChecked() {
      return this.allSubStats.includes("ResonanceLiberationDMGBonus");
    },
    isEnergyRechargeChecked() {
      return this.allSubStats.includes("EnergyRegen");
    },
    critDmgValue() {
      const mainStat = "CritDMG";
      if (this.echoSubStatsType1 === mainStat) {
        return this.echoSubStatsValue1;
      }
      if (this.echoSubStatsType2 === mainStat) {
        return this.echoSubStatsValue2;
      }
      if (this.echoSubStatsType3 === mainStat) {
        return this.echoSubStatsValue3;
      }
      if (this.echoSubStatsType4 === mainStat) {
        return this.echoSubStatsValue4;
      }
      if (this.echoSubStatsType5 === mainStat) {
        return this.echoSubStatsValue5;
      }
    },
    critRateValue() {
      const mainStat = "CritRate";
      if (this.echoSubStatsType1 === mainStat) {
        return this.echoSubStatsValue1;
      }
      if (this.echoSubStatsType2 === mainStat) {
        return this.echoSubStatsValue2;
      }
      if (this.echoSubStatsType3 === mainStat) {
        return this.echoSubStatsValue3;
      }
      if (this.echoSubStatsType4 === mainStat) {
        return this.echoSubStatsValue4;
      }
      if (this.echoSubStatsType5 === mainStat) {
        return this.echoSubStatsValue5;
      }
    },
    atkValue() {
      const mainStat = "ATK";
      if (this.echoSubStatsType1 === mainStat) {
        return this.echoSubStatsValue1;
      }
      if (this.echoSubStatsType2 === mainStat) {
        return this.echoSubStatsValue2;
      }
      if (this.echoSubStatsType3 === mainStat) {
        return this.echoSubStatsValue3;
      }
      if (this.echoSubStatsType4 === mainStat) {
        return this.echoSubStatsValue4;
      }
      if (this.echoSubStatsType5 === mainStat) {
        return this.echoSubStatsValue5;
      }
    },
    atkFlatValue() {
      const mainStat = "ATK_FLAT";
      if (this.echoSubStatsType1 === mainStat) {
        return this.echoSubStatsValue1;
      }
      if (this.echoSubStatsType2 === mainStat) {
        return this.echoSubStatsValue2;
      }
      if (this.echoSubStatsType3 === mainStat) {
        return this.echoSubStatsValue3;
      }
      if (this.echoSubStatsType4 === mainStat) {
        return this.echoSubStatsValue4;
      }
      if (this.echoSubStatsType5 === mainStat) {
        return this.echoSubStatsValue5;
      }
    },
    hpValue() {
      const mainStat = "HP";
      if (this.echoSubStatsType1 === mainStat) {
        return this.echoSubStatsValue1;
      }
      if (this.echoSubStatsType2 === mainStat) {
        return this.echoSubStatsValue2;
      }
      if (this.echoSubStatsType3 === mainStat) {
        return this.echoSubStatsValue3;
      }
      if (this.echoSubStatsType4 === mainStat) {
        return this.echoSubStatsValue4;
      }
      if (this.echoSubStatsType5 === mainStat) {
        return this.echoSubStatsValue5;
      }
    },
    hpFlatValue() {
      const mainStat = "HP_FLAT";
      if (this.echoSubStatsType1 === mainStat) {
        return this.echoSubStatsValue1;
      }
      if (this.echoSubStatsType2 === mainStat) {
        return this.echoSubStatsValue2;
      }
      if (this.echoSubStatsType3 === mainStat) {
        return this.echoSubStatsValue3;
      }
      if (this.echoSubStatsType4 === mainStat) {
        return this.echoSubStatsValue4;
      }
      if (this.echoSubStatsType5 === mainStat) {
        return this.echoSubStatsValue5;
      }
    },
    defValue() {
      const mainStat = "DEF";
      if (this.echoSubStatsType1 === mainStat) {
        return this.echoSubStatsValue1;
      }
      if (this.echoSubStatsType2 === mainStat) {
        return this.echoSubStatsValue2;
      }
      if (this.echoSubStatsType3 === mainStat) {
        return this.echoSubStatsValue3;
      }
      if (this.echoSubStatsType4 === mainStat) {
        return this.echoSubStatsValue4;
      }
      if (this.echoSubStatsType5 === mainStat) {
        return this.echoSubStatsValue5;
      }
    },
    defFlatValue() {
      const mainStat = "DEF_FLAT";
      if (this.echoSubStatsType1 === mainStat) {
        return this.echoSubStatsValue1;
      }
      if (this.echoSubStatsType2 === mainStat) {
        return this.echoSubStatsValue2;
      }
      if (this.echoSubStatsType3 === mainStat) {
        return this.echoSubStatsValue3;
      }
      if (this.echoSubStatsType4 === mainStat) {
        return this.echoSubStatsValue4;
      }
      if (this.echoSubStatsType5 === mainStat) {
        return this.echoSubStatsValue5;
      }
    },
    basicValue() {
      const mainStat = "BasicAttackDMGBonus";
      if (this.echoSubStatsType1 === mainStat) {
        return this.echoSubStatsValue1;
      }
      if (this.echoSubStatsType2 === mainStat) {
        return this.echoSubStatsValue2;
      }
      if (this.echoSubStatsType3 === mainStat) {
        return this.echoSubStatsValue3;
      }
      if (this.echoSubStatsType4 === mainStat) {
        return this.echoSubStatsValue4;
      }
      if (this.echoSubStatsType5 === mainStat) {
        return this.echoSubStatsValue5;
      }
    },
    heavyValue() {
      const mainStat = "HeavyAttackDMGBonus";
      if (this.echoSubStatsType1 === mainStat) {
        return this.echoSubStatsValue1;
      }
      if (this.echoSubStatsType2 === mainStat) {
        return this.echoSubStatsValue2;
      }
      if (this.echoSubStatsType3 === mainStat) {
        return this.echoSubStatsValue3;
      }
      if (this.echoSubStatsType4 === mainStat) {
        return this.echoSubStatsValue4;
      }
      if (this.echoSubStatsType5 === mainStat) {
        return this.echoSubStatsValue5;
      }
    },
    skillValue() {
      const mainStat = "ResonanceSkillDMGBonus";
      if (this.echoSubStatsType1 === mainStat) {
        return this.echoSubStatsValue1;
      }
      if (this.echoSubStatsType2 === mainStat) {
        return this.echoSubStatsValue2;
      }
      if (this.echoSubStatsType3 === mainStat) {
        return this.echoSubStatsValue3;
      }
      if (this.echoSubStatsType4 === mainStat) {
        return this.echoSubStatsValue4;
      }
      if (this.echoSubStatsType5 === mainStat) {
        return this.echoSubStatsValue5;
      }
    },
    liberationValue() {
      const mainStat = "ResonanceLiberationDMGBonus";
      if (this.echoSubStatsType1 === mainStat) {
        return this.echoSubStatsValue1;
      }
      if (this.echoSubStatsType2 === mainStat) {
        return this.echoSubStatsValue2;
      }
      if (this.echoSubStatsType3 === mainStat) {
        return this.echoSubStatsValue3;
      }
      if (this.echoSubStatsType4 === mainStat) {
        return this.echoSubStatsValue4;
      }
      if (this.echoSubStatsType5 === mainStat) {
        return this.echoSubStatsValue5;
      }
    },
    energyRegenValue() {
      const mainStat = "EnergyRegen";
      if (this.echoSubStatsType1 === mainStat) {
        return this.echoSubStatsValue1;
      }
      if (this.echoSubStatsType2 === mainStat) {
        return this.echoSubStatsValue2;
      }
      if (this.echoSubStatsType3 === mainStat) {
        return this.echoSubStatsValue3;
      }
      if (this.echoSubStatsType4 === mainStat) {
        return this.echoSubStatsValue4;
      }
      if (this.echoSubStatsType5 === mainStat) {
        return this.echoSubStatsValue5;
      }
    },
    echoImage() {
      const defaultImageUrl =
        "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png";
      if (!this.echo) {
        return defaultImageUrl;
      }
      const echoData = getEchoData(this.echo);
      return echoData?.image ?? defaultImageUrl;
    },
    echoSubStatsValue1Display() {
      if (!this.echoSubStatsValue1) {
        return null;
      }
      if (this.echoSubStatsType1.includes("FLAT")) {
        return this.echoSubStatsValue1;
      }
      return `${this.echoSubStatsValue1}%`;
    },
    echoSubStatsValue2Display() {
      if (!this.echoSubStatsValue2) {
        return null;
      }
      if (this.echoSubStatsType2.includes("FLAT")) {
        return this.echoSubStatsValue2;
      }
      return `${this.echoSubStatsValue2}%`;
    },
    echoSubStatsValue3Display() {
      if (!this.echoSubStatsValue3) {
        return null;
      }
      if (this.echoSubStatsType3.includes("FLAT")) {
        return this.echoSubStatsValue3;
      }
      return `${this.echoSubStatsValue3}%`;
    },
    echoSubStatsValue4Display() {
      if (!this.echoSubStatsValue4) {
        return null;
      }
      if (this.echoSubStatsType4.includes("FLAT")) {
        return this.echoSubStatsValue4;
      }
      return `${this.echoSubStatsValue4}%`;
    },
    echoSubStatsValue5Display() {
      if (!this.echoSubStatsValue5) {
        return null;
      }
      if (this.echoSubStatsType5.includes("FLAT")) {
        return this.echoSubStatsValue5;
      }
      return `${this.echoSubStatsValue5}%`;
    },
    echoSubStat1Icon() {
      if (!this.echoSubStatsType1) {
        return null;
      }
      return getSubStatIconByType(this.echoSubStatsType1);
    },
    echoSubStat2Icon() {
      if (!this.echoSubStatsType2) {
        return null;
      }
      return getSubStatIconByType(this.echoSubStatsType2);
    },
    echoSubStat3Icon() {
      if (!this.echoSubStatsType3) {
        return null;
      }
      return getSubStatIconByType(this.echoSubStatsType3);
    },
    echoSubStat4Icon() {
      if (!this.echoSubStatsType4) {
        return null;
      }
      return getSubStatIconByType(this.echoSubStatsType4);
    },
    echoSubStat5Icon() {
      if (!this.echoSubStatsType5) {
        return null;
      }
      return getSubStatIconByType(this.echoSubStatsType5);
    },
    mainStatValue() {
      if (this.type && this.stat && this.stat !== "none" && this.rank) {
        return this.statsTable?.[this.type]?.[this.stat]?.[this.rank];
      }
      return null;
    },
    echoName() {
      if (!this.echo) {
        return null;
      }
      const echoData = getEchoData(this.echo);
      return echoData?.name ?? null;
    },
    echoFreeSubStatType() {
      if (this.type && this.rank) {
        let stat = this.type == "1" ? "HP_FLAT" : "ATK_FLAT";
        return stat;
      }
      return null;
    },
    echoFreeSubStatValue() {
      if (this.type && this.rank) {
        let statValue = this.flatBonusesByRankByType[this.type][this.rank];
        return statValue;
      }
      return null;
    },
    echoFreeSubStatIcon() {
      if (!this.echoFreeSubStatType) {
        return null;
      }
      return getSubStatIconByType(this.echoFreeSubStatType);
    },
    echoSets() {
      if (!this.echo) {
        return [];
      }
      const echoData = getEchoData(this.echo);
      return echoData?.sets ?? [];
    },
    echoSetsList() {
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
    /**
     * Determines if the echo is in your inventory or not
     * @returns {Boolean}
     */
    isInInventory() {
      return !!this.echoId;
    },
  },
};
</script>

<style scoped lang="scss">
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
  max-width: 330px;
}
.main__stat-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.echo__reset {
  background-color: transparent;
  border: none;
  cursor: pointer;
  svg {
    width: 1rem;
    height: 1rem;
  }
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
html[data-theme="light"] {
  .echo__reset,
  .btn--echo--find {
    svg {
      filter: invert(100%);
    }
  }
  .echo__item__set-selection--icon {
    border-color: oklch(var(--bc));
  }
  .echo__item__actions {
    svg {
      filter: invert(100%);
    }
  }
  .modal-backdrop {
    opacity: 0.5;
  }
}
.echo__item__sub-stats {
  td {
    padding: 0.5rem;
    font-size: 16px;
  }
}
.label-text {
  font-size: 16px;
}
.echo__in-inventory img {
  filter: invert(100%);
}
</style>
