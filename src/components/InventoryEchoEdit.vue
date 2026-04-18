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
          This echo is found in {{ echoPresetsFoundWithEcho.length }} presets.
          Any changes will affect those too.
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
                  @update-value="(val: number) => subStatUpdated('CritRate', val)" />
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
                  @update-value="(val: number) => subStatUpdated('CritDMG', val)" />
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
                  @update-value="(val: number) => subStatUpdated('ATK', val)" />
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
                  @update-value="(val: number) => subStatUpdated('ATK_FLAT', val)" />
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
                  @update-value="(val: number) => subStatUpdated('HP', val)" />
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
                  @update-value="(val: number) => subStatUpdated('HP_FLAT', val)" />
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
                  @update-value="(val: number) => subStatUpdated('DEF', val)" />
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
                  @update-value="(val: number) => subStatUpdated('DEF_FLAT', val)" />
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
                    (val: number) => subStatUpdated('BasicAttackDMGBonus', val)
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
                    (val: number) => subStatUpdated('HeavyAttackDMGBonus', val)
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
                    (val: number) => subStatUpdated('ResonanceSkillDMGBonus', val)
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
                    (val: number) => subStatUpdated('ResonanceLiberationDMGBonus', val)
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
                  @update-value="(val: number) => subStatUpdated('EnergyRegen', val)" />
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
          class="echoes__filters echo-filters__sets flex align-center gap-1 mb-6 items-center flex-wrap"
          :class="{ 'echo-filters__sets--active': echoSetFilter !== null }">
          <span class="mr-2">Filter</span>
          <button
            v-for="echoSet in echoSetsList"
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

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useInventoryStore } from "../stores/inventory";
import { useSettingsStore } from "../stores/settings";
import {
  statsTable,
  getReadableSubStatLabel,
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

type MainEchoRow = (typeof mainEchoesData)[keyof typeof mainEchoesData];

const inventoryStore = useInventoryStore();
const { getEchoPresetsByEchoId } = inventoryStore;
const { config } = storeToRefs(useSettingsStore());
const { patchEcho, getEchoById } = inventoryStore;

const echoId = ref<string | null>(null);
const allSubStatsEnabled = ref({
  echoSubStatsType1: false,
  echoSubStatsType2: false,
  echoSubStatsType3: false,
  echoSubStatsType4: false,
  echoSubStatsType5: false,
});
const allSubStats = ref<string[]>([]);
const echoSetFilter = ref<string | null>(null);

const currentEcho = computed(() => {
  if (!echoId.value) return null;
  return getEchoById(echoId.value);
});

const type = computed({
  get() {
    return currentEcho.value?.type;
  },
  async set(value: unknown) {
    await patchEcho(echoId.value!, { type: value });
  },
});

const echo = computed({
  get() {
    return currentEcho.value?.echo ?? null;
  },
  async set(value: unknown) {
    await patchEcho(echoId.value!, { echo: value });
  },
});

const echoSet = computed({
  get() {
    return currentEcho.value?.echoSet ?? null;
  },
  async set(value: unknown) {
    await patchEcho(echoId.value!, { echoSet: value });
  },
});

const rank = computed({
  get() {
    return currentEcho.value?.rank ?? 5;
  },
  async set(value: unknown) {
    await patchEcho(echoId.value!, { rank: value });
  },
});

const stat = computed({
  get() {
    return currentEcho.value?.stat ?? "none";
  },
  async set(value: unknown) {
    await patchEcho(echoId.value!, { stat: value });
  },
});

const echoSubStatsType1 = computed({
  get() {
    return currentEcho.value?.echoSubStatsType1 ?? "none";
  },
  async set(value: unknown) {
    await patchEcho(echoId.value!, { echoSubStatsType1: value });
  },
});

const echoSubStatsValue1 = computed({
  get() {
    return currentEcho.value?.echoSubStatsValue1 ?? 0;
  },
  async set(value: unknown) {
    await patchEcho(echoId.value!, { echoSubStatsValue1: value });
  },
});

const echoSubStatsType2 = computed({
  get() {
    return currentEcho.value?.echoSubStatsType2 ?? "none";
  },
  async set(value: unknown) {
    await patchEcho(echoId.value!, { echoSubStatsType2: value });
  },
});

const echoSubStatsValue2 = computed({
  get() {
    return currentEcho.value?.echoSubStatsValue2 ?? 0;
  },
  async set(value: unknown) {
    await patchEcho(echoId.value!, { echoSubStatsValue2: value });
  },
});

const echoSubStatsType3 = computed({
  get() {
    return currentEcho.value?.echoSubStatsType3 ?? "none";
  },
  async set(value: unknown) {
    await patchEcho(echoId.value!, { echoSubStatsType3: value });
  },
});

const echoSubStatsValue3 = computed({
  get() {
    return currentEcho.value?.echoSubStatsValue3 ?? 0;
  },
  async set(value: unknown) {
    await patchEcho(echoId.value!, { echoSubStatsValue3: value });
  },
});

const echoSubStatsType4 = computed({
  get() {
    return currentEcho.value?.echoSubStatsType4 ?? "none";
  },
  async set(value: unknown) {
    await patchEcho(echoId.value!, { echoSubStatsType4: value });
  },
});

const echoSubStatsValue4 = computed({
  get() {
    return currentEcho.value?.echoSubStatsValue4 ?? 0;
  },
  async set(value: unknown) {
    await patchEcho(echoId.value!, { echoSubStatsValue4: value });
  },
});

const echoSubStatsType5 = computed({
  get() {
    return currentEcho.value?.echoSubStatsType5 ?? "none";
  },
  async set(value: unknown) {
    await patchEcho(echoId.value!, { echoSubStatsType5: value });
  },
});

const echoSubStatsValue5 = computed({
  get() {
    return currentEcho.value?.echoSubStatsValue5 ?? 0;
  },
  async set(value: unknown) {
    await patchEcho(echoId.value!, { echoSubStatsValue5: value });
  },
});

function syncMainStats() {
  allSubStats.value = [];
  allSubStatsEnabled.value = {
    echoSubStatsType1: false,
    echoSubStatsType2: false,
    echoSubStatsType3: false,
    echoSubStatsType4: false,
    echoSubStatsType5: false,
  };
  const updatedSubStats: string[] = [];
  if (echoSubStatsType1.value && echoSubStatsType1.value !== "none") {
    allSubStatsEnabled.value.echoSubStatsType1 = true;
    updatedSubStats.push(echoSubStatsType1.value);
  }
  if (echoSubStatsType2.value && echoSubStatsType2.value !== "none") {
    allSubStatsEnabled.value.echoSubStatsType2 = true;
    updatedSubStats.push(echoSubStatsType2.value);
  }
  if (echoSubStatsType3.value && echoSubStatsType3.value !== "none") {
    allSubStatsEnabled.value.echoSubStatsType3 = true;
    updatedSubStats.push(echoSubStatsType3.value);
  }
  if (echoSubStatsType4.value && echoSubStatsType4.value !== "none") {
    allSubStatsEnabled.value.echoSubStatsType4 = true;
    updatedSubStats.push(echoSubStatsType4.value);
  }
  if (echoSubStatsType5.value && echoSubStatsType5.value !== "none") {
    allSubStatsEnabled.value.echoSubStatsType5 = true;
    updatedSubStats.push(echoSubStatsType5.value);
  }
  allSubStats.value = updatedSubStats;
}

watch(
  echo,
  (val, previousVal) => {
    void updateEchoChoice(val, previousVal);
  },
  { immediate: true },
);

watch(
  [
    echoSubStatsType1,
    echoSubStatsType2,
    echoSubStatsType3,
    echoSubStatsType4,
    echoSubStatsType5,
  ],
  () => {
    syncMainStats();
  },
  { immediate: true },
);

function setEchoId(id: string | null) {
  echoId.value = id;
  syncMainStats();
}

async function updateEchoChoice(
  echoVal: string | null,
  previousEcho: string | null | undefined,
) {
  const echoData = echoVal ? getEchoData(echoVal) : null;
  const echoClass = echoData?.class;
  const echoCost = echoClass ? getCostByClass(echoClass) : null;
  selectCost(echoCost);
  let prevEchoCost: ReturnType<typeof getCostByClass> | null = null;
  if (previousEcho) {
    const prevEchoData = getEchoData(previousEcho);
    const prevEchoClass = prevEchoData?.class;
    prevEchoCost = prevEchoClass ? getCostByClass(prevEchoClass) : null;
  }
  if (previousEcho && echoCost !== prevEchoCost) {
    stat.value = "none";
  }
}

function selectCost(cost: unknown) {
  type.value = cost;
}

function getStats(cost: string | number) {
  const row = (statsTable as Record<string, Record<string, unknown>>)[
    String(cost)
  ];
  return Object.keys(row || {});
}

function toggleSubStat(e: Event) {
  const target = e.target as HTMLInputElement;
  const mainStat = target.value;
  const isChecked = target.checked;
  if (!isChecked) {
    deleteSubStatData(mainStat);
    syncMainStats();
    return;
  }
  const range = getSubStatRange(mainStat);
  const initialSubStatValue = range[0];
  if (!echoSubStatsType1.value || echoSubStatsType1.value === "none") {
    echoSubStatsType1.value = mainStat;
    echoSubStatsValue1.value = initialSubStatValue;
    return;
  }
  if (!echoSubStatsType2.value || echoSubStatsType2.value === "none") {
    echoSubStatsType2.value = mainStat;
    echoSubStatsValue2.value = initialSubStatValue;
    return;
  }
  if (!echoSubStatsType3.value || echoSubStatsType3.value === "none") {
    echoSubStatsType3.value = mainStat;
    echoSubStatsValue3.value = initialSubStatValue;
    return;
  }
  if (!echoSubStatsType4.value || echoSubStatsType4.value === "none") {
    echoSubStatsType4.value = mainStat;
    echoSubStatsValue4.value = initialSubStatValue;
    return;
  }
  if (!echoSubStatsType5.value || echoSubStatsType5.value === "none") {
    echoSubStatsType5.value = mainStat;
    echoSubStatsValue5.value = initialSubStatValue;
    return;
  }
}

function deleteSubStatData(mainStat: string) {
  if (echoSubStatsType1.value === mainStat) {
    echoSubStatsType1.value = null;
    echoSubStatsValue1.value = null;
  }
  if (echoSubStatsType2.value === mainStat) {
    echoSubStatsType2.value = null;
    echoSubStatsValue2.value = null;
  }
  if (echoSubStatsType3.value === mainStat) {
    echoSubStatsType3.value = null;
    echoSubStatsValue3.value = null;
  }
  if (echoSubStatsType4.value === mainStat) {
    echoSubStatsType4.value = null;
    echoSubStatsValue4.value = null;
  }
  if (echoSubStatsType5.value === mainStat) {
    echoSubStatsType5.value = null;
    echoSubStatsValue5.value = null;
  }
}

function handleOpenModal() {
  const modalEl = document.getElementById(
    modalId.value,
  ) as HTMLDialogElement | null;
  modalEl?.showModal();
}

function openEchoPicker() {
  const modalEl = document.getElementById(
    modalIdPicker.value,
  ) as HTMLDialogElement | null;
  modalEl?.showModal();
}

function subStatUpdated(mainStat: string, val: unknown) {
  if (echoSubStatsType1.value === mainStat) {
    echoSubStatsValue1.value = val;
    return;
  }
  if (echoSubStatsType2.value === mainStat) {
    echoSubStatsValue2.value = val;
    return;
  }
  if (echoSubStatsType3.value === mainStat) {
    echoSubStatsValue3.value = val;
    return;
  }
  if (echoSubStatsType4.value === mainStat) {
    echoSubStatsValue4.value = val;
    return;
  }
  if (echoSubStatsType5.value === mainStat) {
    echoSubStatsValue5.value = val;
    return;
  }
}

function getSubStatRange(mainStat: string) {
  return subStatsTable[mainStat as keyof typeof subStatsTable] ?? [];
}

function getDefaultValue(mainStat: string) {
  if (echoSubStatsType1.value === mainStat) {
    return echoSubStatsValue1.value;
  }
  if (echoSubStatsType2.value === mainStat) {
    return echoSubStatsValue2.value;
  }
  if (echoSubStatsType3.value === mainStat) {
    return echoSubStatsValue3.value;
  }
  if (echoSubStatsType4.value === mainStat) {
    return echoSubStatsValue4.value;
  }
  if (echoSubStatsType5.value === mainStat) {
    return echoSubStatsValue5.value;
  }
  const range = getSubStatRange(mainStat);
  return range[Math.floor(range.length / 2)];
}

function getEchoSetIcon(type: string) {
  return getEchoSetIconByType(type);
}

function handleChooseEchoSet(set: string) {
  echoSet.value = set;
}

function isSetSelected(set: string) {
  return echoSet.value === set;
}

function getEchoSetImage(echoSetKey: string) {
  return getEchoSetIconByType(echoSetKey);
}

function toggleEchoSetFilter(echoSetKey: string) {
  if (echoSetFilter.value === echoSetKey) {
    echoSetFilter.value = null;
  } else {
    echoSetFilter.value = echoSetKey;
  }
}

function isEchoSetFilterActive(echoSetKey: string) {
  return echoSetFilter.value === echoSetKey;
}

function resetFilters() {
  echoSetFilter.value = null;
}

function chooseMainEcho(echoKey: string) {
  echo.value = echoKey;
  if (!echoSet.value) {
    echoSet.value = echoSetFilter.value;
  }
  closeEchoChooser();
}

function closeEchoChooser() {
  echoSetFilter.value = null;
  const modalEl = document.getElementById(
    modalIdPicker.value,
  ) as HTMLDialogElement | null;
  const box = document.querySelector(`#${modalIdPicker.value} .modal-box`);
  if (box) (box as HTMLElement).scrollTop = 0;
  modalEl?.close();
}

const echoPresetsFoundWithEcho = computed(() =>
  getEchoPresetsByEchoId(echoId.value),
);

const settingsTheme = computed(() => config.value?.theme ?? null);

const rangeClasses = computed(() => {
  const classes: string[] = [];
  if (settingsTheme.value === "black") {
    classes.push("[--range-shdw:gray]");
  }
  return classes;
});

const mainEchoesDataComputed = computed(() => ({ ...mainEchoesData }));

const mainEchoOptions = computed(() => {
  const buckets: Record<MainEchoRow["class"], MainEchoRow[]> = {
    Calamity: [],
    Overlord: [],
    Elite: [],
    Common: [],
  };
  const mainEchoValues = Object.values(mainEchoesDataComputed.value);
  mainEchoValues.forEach((e) => {
    if (e?.class && buckets[e.class]) {
      buckets[e.class].push(e);
    }
  });
  return buckets;
});

const modalId = computed(() => `echoModal`);
const modalIdPicker = computed(() => `echoModalPicker`);

const totalSubStatsEnabled = computed(() => {
  const allValues = Object.values(allSubStatsEnabled.value);
  return allValues.filter((val) => val === true).length;
});

const isMaxSubstats = computed(() => totalSubStatsEnabled.value >= 5);

function mkDisabled(statName: string) {
  return computed(() => {
    if (!isMaxSubstats.value) return false;
    return !allSubStats.value.includes(statName);
  });
}

const isCritRateDisabled = mkDisabled("CritRate");
const isCritDMGDisabled = mkDisabled("CritDMG");
const isAtkDisabled = mkDisabled("ATK");
const isFlatAtkDisabled = mkDisabled("ATK_FLAT");
const isHpDisabled = mkDisabled("HP");
const isFlatHpDisabled = mkDisabled("HP_FLAT");
const isDefDisabled = mkDisabled("DEF");
const isFlatDefDisabled = mkDisabled("DEF_FLAT");
const isBasicDisabled = mkDisabled("BasicAttackDMGBonus");
const isHeavyDisabled = mkDisabled("HeavyAttackDMGBonus");
const isSkillDisabled = mkDisabled("ResonanceSkillDMGBonus");
const isLiberationDisabled = mkDisabled("ResonanceLiberationDMGBonus");
const isEnergyRechargeDisabled = mkDisabled("EnergyRegen");

function mkChecked(statName: string) {
  return computed(() => allSubStats.value.includes(statName));
}

const isCritRateChecked = mkChecked("CritRate");
const isCritDMGChecked = mkChecked("CritDMG");
const isAtkChecked = mkChecked("ATK");
const isFlatAtkChecked = mkChecked("ATK_FLAT");
const isHpChecked = mkChecked("HP");
const isFlatHpChecked = mkChecked("HP_FLAT");
const isDefChecked = mkChecked("DEF");
const isFlatDefChecked = mkChecked("DEF_FLAT");
const isBasicChecked = mkChecked("BasicAttackDMGBonus");
const isHeavyChecked = mkChecked("HeavyAttackDMGBonus");
const isSkillChecked = mkChecked("ResonanceSkillDMGBonus");
const isLiberationChecked = mkChecked("ResonanceLiberationDMGBonus");
const isEnergyRechargeChecked = mkChecked("EnergyRegen");

function subValueFor(mainStat: string) {
  return computed(() => {
    if (echoSubStatsType1.value === mainStat) return echoSubStatsValue1.value;
    if (echoSubStatsType2.value === mainStat) return echoSubStatsValue2.value;
    if (echoSubStatsType3.value === mainStat) return echoSubStatsValue3.value;
    if (echoSubStatsType4.value === mainStat) return echoSubStatsValue4.value;
    if (echoSubStatsType5.value === mainStat) return echoSubStatsValue5.value;
    return undefined;
  });
}

const critDmgValue = subValueFor("CritDMG");
const critRateValue = subValueFor("CritRate");
const atkValue = subValueFor("ATK");
const atkFlatValue = subValueFor("ATK_FLAT");
const hpValue = subValueFor("HP");
const hpFlatValue = subValueFor("HP_FLAT");
const defValue = subValueFor("DEF");
const defFlatValue = subValueFor("DEF_FLAT");
const basicValue = subValueFor("BasicAttackDMGBonus");
const heavyValue = subValueFor("HeavyAttackDMGBonus");
const skillValue = subValueFor("ResonanceSkillDMGBonus");
const liberationValue = subValueFor("ResonanceLiberationDMGBonus");
const energyRegenValue = subValueFor("EnergyRegen");

const echoImage = computed(() => {
  const defaultImageUrl =
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png";
  if (!echo.value) {
    return defaultImageUrl;
  }
  const echoData = getEchoData(echo.value);
  return echoData?.image ?? defaultImageUrl;
});

const echoSets = computed(() => {
  if (!echo.value) {
    return [];
  }
  const echoData = getEchoData(echo.value);
  return echoData?.sets ?? [];
});

const echoSetsList = computed(() => Object.keys(echoSetLabelMap));

const allEchoesListFiltered = computed(() => {
  const classOrder: Record<MainEchoRow["class"], number> = {
    Calamity: 0,
    Overlord: 1,
    Elite: 2,
    Common: 3,
  };
  let allEchoes = Object.values(
    mainEchoesDataComputed.value,
  ) as MainEchoRow[];
  if (echoSetFilter.value) {
    allEchoes = allEchoes.filter((e) =>
      e.sets.includes(echoSetFilter.value!),
    );
  }
  return allEchoes.sort((a, b) => {
    const classComparison = classOrder[a.class] - classOrder[b.class];
    if (classComparison === 0) {
      return a.name.localeCompare(b.name);
    }
    return classComparison;
  });
});

defineExpose({
  setEchoId,
  handleOpenModal,
});
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
