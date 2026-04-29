<template>
  <dialog :id="modalId" class="modal">
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
    <div class="modal-box max-w-2xl">
      <form method="dialog">
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          data-test-echo-modal-close>
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
              class="main-echo-selector select select-bordered select select-sm">
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
              class="select select-bordered select select-sm echo-main-stat-selector"
              v-model="stat"
              @change="updateTotalStats"
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
                :class="{ 'border border-white': isSetSelected(echo) }"
                :data-test-echo-set="echo">
                <img :src="getEchoSetIcon(echo)" :class="echo" />
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="isInInventory"
          class="echo__in-inventory alert alert-info my-2 flex items-center p-2">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/backpack.png"
            class="size-8" />
          This echo is in your inventory.
          <template v-if="echoPresetsFoundWithEcho.length">
            This echo is found in {{ echoPresetsFoundWithEcho.length }} presets.
            Any changes will affect those too.
          </template>
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
                  :disabled="isCritRateDisabled"
                  data-test-substat-checkbox="CritRate" />
                <span
                  class="label-text"
                  :class="{ substat__label: isCritRateChecked }"
                  data-test-substat-label="CritRate">
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
                  @update-value="onSubStatValueUpdate('CritRate', $event)"
                  data-test-substat-range="CritRate" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isCritDMGChecked"
                  @change="toggleSubStat"
                  value="CritDMG"
                  :disabled="isCritDMGDisabled"
                  data-test-substat-checkbox="CritDMG" />
                <span
                  class="label-text"
                  :class="{ substat__label: isCritDMGChecked }"
                  data-test-substat-label="CritDMG">
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
                  @update-value="onSubStatValueUpdate('CritDMG', $event)"
                  data-test-substat-range="CritDMG" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isAtkChecked"
                  @change="toggleSubStat"
                  :disabled="isAtkDisabled"
                  value="ATK"
                  data-test-substat-checkbox="ATK" />
                <span
                  class="label-text"
                  :class="{ substat__label: isAtkChecked }"
                  data-test-substat-label="ATK">
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
                  @update-value="onSubStatValueUpdate('ATK', $event)"
                  data-test-substat-range="ATK" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isFlatAtkChecked"
                  @change="toggleSubStat"
                  :disabled="isFlatAtkDisabled"
                  value="ATK_FLAT"
                  data-test-substat-checkbox="ATK_FLAT" />
                <span
                  class="label-text"
                  :class="{ substat__label: isFlatAtkChecked }"
                  data-test-substat-label="ATK_FLAT">
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
                  @update-value="onSubStatValueUpdate('ATK_FLAT', $event)"
                  data-test-substat-range="ATK_FLAT" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isHpChecked"
                  @change="toggleSubStat"
                  :disabled="isHpDisabled"
                  value="HP"
                  data-test-substat-checkbox="HP" />
                <span
                  class="label-text"
                  :class="{ substat__label: isHpChecked }"
                  data-test-substat-label="HP">
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
                  @update-value="onSubStatValueUpdate('HP', $event)"
                  data-test-substat-range="HP" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isFlatHpChecked"
                  @change="toggleSubStat"
                  :disabled="isFlatHpDisabled"
                  value="HP_FLAT"
                  data-test-substat-checkbox="HP_FLAT" />
                <span
                  class="label-text"
                  :class="{ substat__label: isFlatHpChecked }"
                  data-test-substat-label="HP_FLAT">
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
                  @update-value="onSubStatValueUpdate('HP_FLAT', $event)"
                  data-test-substat-range="HP_FLAT" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isDefChecked"
                  @change="toggleSubStat"
                  :disabled="isDefDisabled"
                  value="DEF"
                  data-test-substat-checkbox="DEF" />
                <span
                  class="label-text"
                  :class="{ substat__label: isDefChecked }"
                  data-test-substat-label="DEF">
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
                  @update-value="onSubStatValueUpdate('DEF', $event)"
                  data-test-substat-range="DEF" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isFlatDefChecked"
                  @change="toggleSubStat"
                  :disabled="isFlatDefDisabled"
                  value="DEF_FLAT"
                  data-test-substat-checkbox="DEF_FLAT" />
                <span
                  class="label-text"
                  :class="{ substat__label: isFlatDefChecked }"
                  data-test-substat-label="DEF_FLAT">
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
                  @update-value="onSubStatValueUpdate('DEF_FLAT', $event)"
                  data-test-substat-range="DEF_FLAT" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isBasicChecked"
                  @change="toggleSubStat"
                  :disabled="isBasicDisabled"
                  value="BasicAttackDMGBonus"
                  data-test-substat-checkbox="BasicAttackDMGBonus" />
                <span
                  class="label-text"
                  :class="{ substat__label: isBasicChecked }"
                  data-test-substat-label="BasicAttackDMGBonus">
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
                  @update-value="onSubStatValueUpdate('BasicAttackDMGBonus', $event)"
                  data-test-substat-range="BasicAttackDMGBonus" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isHeavyChecked"
                  @change="toggleSubStat"
                  :disabled="isHeavyDisabled"
                  value="HeavyAttackDMGBonus"
                  data-test-substat-checkbox="HeavyAttackDMGBonus" />
                <span
                  class="label-text"
                  :class="{ substat__label: isHeavyChecked }"
                  data-test-substat-label="HeavyAttackDMGBonus">
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
                  @update-value="onSubStatValueUpdate('HeavyAttackDMGBonus', $event)"
                  data-test-substat-range="HeavyAttackDMGBonus" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isSkillChecked"
                  @change="toggleSubStat"
                  :disabled="isSkillDisabled"
                  value="ResonanceSkillDMGBonus"
                  data-test-substat-checkbox="ResonanceSkillDMGBonus" />
                <span
                  class="label-text"
                  :class="{ substat__label: isSkillChecked }"
                  data-test-substat-label="ResonanceSkillDMGBonus">
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
                  @update-value="onSubStatValueUpdate('ResonanceSkillDMGBonus', $event)"
                  data-test-substat-range="ResonanceSkillDMGBonus" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isLiberationChecked"
                  @change="toggleSubStat"
                  :disabled="isLiberationDisabled"
                  value="ResonanceLiberationDMGBonus"
                  data-test-substat-checkbox="ResonanceLiberationDMGBonus" />
                <span
                  class="label-text"
                  :class="{ substat__label: isLiberationChecked }"
                  data-test-substat-label="ResonanceLiberationDMGBonus">
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
                  @update-value="onSubStatValueUpdate('ResonanceLiberationDMGBonus', $event)"
                  data-test-substat-range="ResonanceLiberationDMGBonus" />
              </div>

              <div
                class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                <input
                  type="checkbox"
                  class="toggle toggle-sm toggle-accent"
                  :checked="isEnergyRechargeChecked"
                  @change="toggleSubStat"
                  :disabled="isEnergyRechargeDisabled"
                  value="EnergyRegen"
                  data-test-substat-checkbox="EnergyRegen" />
                <span
                  class="label-text"
                  :class="{ substat__label: isEnergyRechargeChecked }"
                  data-test-substat-label="EnergyRegen">
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
                  @update-value="onSubStatValueUpdate('EnergyRegen', $event)"
                  data-test-substat-checkbox="EnergyRegen" />
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

  <div
    class="echo__item card card-bordered card-compact bg-base-100 shadow mb-2"
    :data-test-echo-item="index">
    <div class="card-body">
      <div class="echo__content flex gap-6 flex-col lg:flex-row">
        <div class="echo__item__left">
          <div
            class="echo__item__image rounded-full border border-solid neutral-content size-20 mb-2 bg-cover cursor-pointer mx-auto lg:m-0"
            :class="{
              'border-amber-300': rank === '5' || rank === 5,
              'border-violet-600': rank === '4' || rank === 4,
              'border-blue-500': rank === '3' || rank === 3,
              'border-green-500': rank === '2' || rank === 2,
            }"
            :style="{
              backgroundImage: `url(${echoImage})`,
            }"
            @click="handleOpenModal"></div>
          <div class="echo__item__actions flex gap-2 justify-center mt-4">
            <span
              class="echo__item__edit cursor-pointer"
              @click="handleOpenModal">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="size-4">
                <path
                  d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"
                  fill="#FFFFFF" />
              </svg>
            </span>
            <span
              class="echo__item__delete cursor-pointer"
              @click="reset"
              v-tooltip="'Reset echo'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="size-4">
                <path
                  d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"
                  fill="#FFFFFF" />
              </svg>
            </span>
            <span
              class="echo__item__save cursor-pointer"
              @click="saveEchoItem"
              v-tooltip="'Save echo'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="size-4">
                <path
                  d="M48 96l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-245.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l245.5 0c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8L320 184c0 13.3-10.7 24-24 24l-192 0c-13.3 0-24-10.7-24-24L80 80 64 80c-8.8 0-16 7.2-16 16zm80-16l0 80 144 0 0-80L128 80zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"
                  fill="#FFFFFF" />
              </svg>
            </span>
            <span
              @click="openEchoBrowser"
              class="echo__item__open cursor-pointer"
              v-tooltip="'Browse echoes'">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                class="size-4">
                <path
                  d="M384 480l48 0c11.4 0 21.9-6 27.6-15.9l112-192c5.8-9.9 5.8-22.1 .1-32.1S555.5 224 544 224l-400 0c-11.4 0-21.9 6-27.6 15.9L48 357.1 48 96c0-8.8 7.2-16 16-16l117.5 0c4.2 0 8.3 1.7 11.3 4.7l26.5 26.5c21 21 49.5 32.8 79.2 32.8L416 144c8.8 0 16 7.2 16 16l0 32 48 0 0-32c0-35.3-28.7-64-64-64L298.5 96c-17 0-33.3-6.7-45.3-18.7L226.7 50.7c-12-12-28.3-18.7-45.3-18.7L64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l23.7 0L384 480z"
                  fill="#FFFFFF" />
              </svg>
            </span>
          </div>
        </div>
        <div class="echo__item__stats mb-2 w-full relative">
          <h2 class="card-title flex items-center justify-between">
            <span
              :class="{
                'text-amber-300': rank === '5' || rank === 5,
                'text-violet-600': rank === '4' || rank === 4,
                'text-blue-500': rank === '3' || rank === 3,
                'text-green-500': rank === '2' || rank === 2,
              }">
              {{ echoName }}
              <br />
              <div
                v-if="hasSubStats"
                class="echo__item__meta flex gap-2 items-center">
                <span
                  class="echo__item__cv badge text-nowrap"
                  :class="critValueBadgeClass">
                  CV {{ formattedCritValue }}%
                </span>
                <span
                  class="echo__item__rv badge text-nowrap"
                  :class="rollValueBadgeClass">
                  RV {{ echoRollValue }}%
                </span>
                <span
                  class="echo__item__explain-rv-cv"
                  v-tooltip="{
                    content:
                      'CV = Crit value. That\'s the amount of Crit you have on your echo. <br>RV = Roll value. That\'s how lucky your substat rolls were. The higher the value your rolls, the higher the RV',
                    html: true,
                  }">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="size-4">
                    <path
                      d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
                      fill="#CCCCCC" />
                  </svg>
                </span>
              </div>
            </span>
            <div class="echo__item__meta flex gap-2 items-center">
              <span v-if="echoId" class="echo__item__set size-6 rounded-full">
                <img
                  src="https://ryanbenson.github.io/wuthering-waves-assets/images/backpack.png" />
              </span>
              <span v-if="echoSet" class="echo__item__set size-6 rounded-full">
                <img :src="getEchoSetIcon(echoSet)" :class="echoSet" />
              </span>
              <span
                class="echo__item__cost badge badge-primary min-w-16 text-nowrap">
                Cost {{ type }}
              </span>
            </div>
          </h2>
          <table class="echo__item__sub-stats table table-zebra">
            <tbody>
              <tr v-if="mainStatValue" :key="stat">
                <td class="flex gap-2 items-center">
                  <img :src="getSubStatIconByType(stat)" />
                  {{ getReadableSubStatLabel(stat) }}
                </td>
                <td class="text-right">{{ mainStatValue }}%</td>
              </tr>
              <tr v-if="mainStatValue">
                <td class="flex gap-2 items-center">
                  <img :src="echoFreeSubStatIcon" />
                  {{ subStatLabel(echoFreeSubStatType) }}
                </td>
                <td class="text-right">{{ echoFreeSubStatValue }}</td>
              </tr>
              <tr v-if="hasSubStats" class="substats__label">
                <td class="font-bold font-size-8">Substats</td>
              </tr>
              <tr v-if="echoSubStatsType1" class="relative" style="z-index: 1">
                <td class="flex gap-2 items-center">
                  <img
                    v-if="echoSubStatsType1 && echoSubStatsType1 !== 'none'"
                    :src="echoSubStat1Icon" />
                  {{ subStatLabel(echoSubStatsType1) }}
                </td>
                <td class="text-right">{{ echoSubStatsValue1Display }}</td>
              </tr>
              <tr v-if="echoSubStatsType2 && echoSubStatsType2 !== 'none'">
                <td class="flex gap-2 items-center">
                  <img :src="echoSubStat2Icon" />
                  {{ subStatLabel(echoSubStatsType2) }}
                </td>
                <td class="text-right">{{ echoSubStatsValue2Display }}</td>
              </tr>
              <tr v-if="echoSubStatsType3 && echoSubStatsType3 !== 'none'">
                <td class="flex gap-2 items-center">
                  <img v-if="echoSubStatsType3" :src="echoSubStat3Icon" />
                  {{ subStatLabel(echoSubStatsType3) }}
                </td>
                <td class="text-right">{{ echoSubStatsValue3Display }}</td>
              </tr>
              <tr v-if="echoSubStatsType4 && echoSubStatsType4 !== 'none'">
                <td class="flex gap-2 items-center">
                  <img :src="echoSubStat4Icon" />
                  {{ subStatLabel(echoSubStatsType4) }}
                </td>
                <td class="text-right">{{ echoSubStatsValue4Display }}</td>
              </tr>
              <tr v-if="echoSubStatsType5 && echoSubStatsType5 !== 'none'">
                <td class="flex gap-2 items-center">
                  <img :src="echoSubStat5Icon" />
                  {{ subStatLabel(echoSubStatsType5) }}
                </td>
                <td class="text-right">{{ echoSubStatsValue5Display }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { useSettingsStore } from "../stores/settings";
import {
  statsTable,
  flatBonusesByRankByType,
  getReadableSubStatLabel,
  getSubStatIconByType,
  getEchoSetIconByType,
  echoSetLabelMap,
  getRollValue,
} from "../echoes/stats";
import {
  mainEchoesData,
  getEchoData,
  getCostByClass,
} from "../echoes/index.ts";
import { subStatsTable } from "../echoes/stats.ts";
import Range from "./input/Range.vue";
import { randomString } from "../utils/strings.ts";

const props = defineProps<{
  character: string;
  index: number;
}>();

const emit = defineEmits<{
  "update-stats": [payload: { index: number; stats: Record<string, number> }];
  "echo:set-chosen": [payload: { set: string | null; index: number }];
  "updated-echo-cost": [payload: { index: number; cost: number }];
  "main-echo-rank:updated": [rank: string | number];
  "main-echo:updated": [echoKey: string | null];
  "on-echo-removed": [];
  "open-echoes-browser": [index: number];
}>();

const characterStore = useCharacterStore();
const inventoryStore = useInventoryStore();
const settingsStore = useSettingsStore();

const allSubStatsEnabled = ref({
  echoSubStatsType1: false,
  echoSubStatsType2: false,
  echoSubStatsType3: false,
  echoSubStatsType4: false,
  echoSubStatsType5: false,
});
const allSubStats = ref<string[]>([]);
const echoSetFilter = ref<string | null>(null);

const currentCharacter = computed(
  () => characterStore.characters?.[props.character] ?? {},
);

const echoId = computed({
  get() {
    const ch = currentCharacter.value as { echoes?: Record<number, { echoId?: string | null }> };
    return ch.echoes?.[props.index]?.echoId ?? null;
  },
  set(value: string | null) {
    void characterStore.setCharacterData(props.character, {
      echoes: { [props.index]: { echoId: value } },
    });
  },
});

const currentEcho = computed(() => {
  const id = echoId.value;
  if (!id) return null;
  return inventoryStore.getEchoById(id) ?? null;
});

const type = computed({
  get() {
    if (currentEcho.value) {
      return (currentEcho.value as { type?: string | number | null }).type;
    }
    const ch = currentCharacter.value as {
      echoes?: Record<number, { type?: string | number | null }>;
    };
    return ch.echoes?.[props.index]?.type ?? null;
  },
  set(value: string | number | null) {
    if (currentEcho.value) {
      inventoryStore.patchEcho(echoId.value!, { type: value });
    } else {
      void characterStore.setCharacterData(props.character, {
        echoes: { [props.index]: { type: value } },
      });
    }
  },
});

const echo = computed({
  get() {
    if (currentEcho.value) {
      return (currentEcho.value as { echo?: string | null }).echo ?? null;
    }
    const ch = currentCharacter.value as {
      echoes?: Record<number, { echo?: string | null }>;
    };
    return ch.echoes?.[props.index]?.echo ?? null;
  },
  set(value: string | null) {
    if (currentEcho.value) {
      void inventoryStore.patchEcho(echoId.value!, { echo: value });
    } else {
      void characterStore.setCharacterData(props.character, {
        echoes: { [props.index]: { echo: value } },
      });
    }
  },
});

const echoSet = computed({
  get() {
    if (currentEcho.value) {
      return (currentEcho.value as { echoSet?: string | null }).echoSet ?? null;
    }
    const ch = currentCharacter.value as {
      echoes?: Record<number, { echoSet?: string | null }>;
    };
    return ch.echoes?.[props.index]?.echoSet ?? null;
  },
  set(value: string | null) {
    if (currentEcho.value) {
      void inventoryStore.patchEcho(echoId.value!, { echoSet: value });
    } else {
      void characterStore.setCharacterData(props.character, {
        echoes: { [props.index]: { echoSet: value } },
      });
    }
  },
});

const rank = computed({
  get() {
    if (currentEcho.value) {
      return (currentEcho.value as { rank?: string | number | null }).rank ?? 5;
    }
    const ch = currentCharacter.value as {
      echoes?: Record<number, { rank?: string | number | null }>;
    };
    return ch.echoes?.[props.index]?.rank ?? 5;
  },
  set(value: string | number) {
    if (currentEcho.value) {
      void inventoryStore.patchEcho(echoId.value!, { rank: value });
    } else {
      void characterStore.setCharacterData(props.character, {
        echoes: { [props.index]: { rank: value } },
      });
    }
  },
});

const stat = computed({
  get() {
    if (currentEcho.value) {
      return (currentEcho.value as { stat?: string | null }).stat ?? "none";
    }
    const ch = currentCharacter.value as {
      echoes?: Record<number, { stat?: string | null }>;
    };
    return ch.echoes?.[props.index]?.stat ?? "none";
  },
  set(value: string) {
    if (currentEcho.value) {
      void inventoryStore.patchEcho(echoId.value!, { stat: value });
    } else {
      void characterStore.setCharacterData(props.character, {
        echoes: { [props.index]: { stat: value } },
      });
    }
  },
});

function subStatTypeSlot(slot: 1 | 2 | 3 | 4 | 5) {
  const key = `echoSubStatsType${slot}` as const;
  return computed({
    get(): string | null {
      if (currentEcho.value) {
        const v = (currentEcho.value as Record<string, unknown>)[key];
        return (v ?? "none") as string;
      }
      const ch = currentCharacter.value as {
        echoes?: Record<number, Record<string, unknown>>;
      };
      const v = ch.echoes?.[props.index]?.[key];
      return (v ?? "none") as string;
    },
    set(value: string | null) {
      if (currentEcho.value) {
        void inventoryStore.patchEcho(echoId.value!, { [key]: value });
      } else {
        void characterStore.setCharacterData(props.character, {
          echoes: { [props.index]: { [key]: value } },
        });
      }
    },
  });
}

function subStatValueSlot(slot: 1 | 2 | 3 | 4 | 5) {
  const key = `echoSubStatsValue${slot}` as const;
  return computed({
    get(): number {
      if (currentEcho.value) {
        const v = (currentEcho.value as Record<string, unknown>)[key];
        return (v ?? 0) as number;
      }
      const ch = currentCharacter.value as {
        echoes?: Record<number, Record<string, unknown>>;
      };
      const v = ch.echoes?.[props.index]?.[key];
      return (v ?? 0) as number;
    },
    set(value: number | null) {
      if (currentEcho.value) {
        void inventoryStore.patchEcho(echoId.value!, { [key]: value });
      } else {
        void characterStore.setCharacterData(props.character, {
          echoes: { [props.index]: { [key]: value } },
        });
      }
    },
  });
}

const echoSubStatsType1 = subStatTypeSlot(1);
const echoSubStatsType2 = subStatTypeSlot(2);
const echoSubStatsType3 = subStatTypeSlot(3);
const echoSubStatsType4 = subStatTypeSlot(4);
const echoSubStatsType5 = subStatTypeSlot(5);
const echoSubStatsValue1 = subStatValueSlot(1);
const echoSubStatsValue2 = subStatValueSlot(2);
const echoSubStatsValue3 = subStatValueSlot(3);
const echoSubStatsValue4 = subStatValueSlot(4);
const echoSubStatsValue5 = subStatValueSlot(5);

const config = computed(() => settingsStore.config);
const settingsTheme = computed(() => config.value?.theme ?? null);

const echoPresetsFoundWithEcho = computed(() =>
  (inventoryStore as { getEchoPresetsByEchoId?: (id: string | null) => unknown[] })
    .getEchoPresetsByEchoId?.(echoId.value) ?? [],
);

const rangeClasses = computed(() => {
  const classes: string[] = [];
  if (settingsTheme.value === "black") {
    classes.push("[--range-shdw:gray]");
  }
  return classes;
});

const mainEchoesDataComputed = computed(() => ({ ...mainEchoesData }));

const mainEchoOptions = computed(() => {
  const echoes: Record<string, { key: string; name: string; class: string }[]> =
    {
      Calamity: [],
      Overlord: [],
      Elite: [],
      Common: [],
    };
  const mainEchoValues = Object.values(
    mainEchoesDataComputed.value,
  ) as { class?: keyof typeof echoes; key: string; name: string }[];
  mainEchoValues.forEach((e) => {
    if (e?.class && echoes[e.class]) {
      echoes[e.class].push(e as { key: string; name: string; class: string });
    }
  });
  return echoes;
});

const modalId = computed(() => `echoModal${props.index}`);
const modalIdPicker = computed(() => `echoModal${props.index}Picker`);

const totalSubStatsEnabled = computed(() => {
  const allValues = Object.values(allSubStatsEnabled.value);
  return allValues.filter((val) => val === true).length;
});

const isMaxSubstats = computed(() => totalSubStatsEnabled.value >= 5);
const hasSubStats = computed(() => totalSubStatsEnabled.value > 0);

function statDisabled(statName: string) {
  if (!isMaxSubstats.value) return false;
  return !allSubStats.value.includes(statName);
}

const isCritRateDisabled = computed(() => statDisabled("CritRate"));
const isCritDMGDisabled = computed(() => statDisabled("CritDMG"));
const isAtkDisabled = computed(() => statDisabled("ATK"));
const isFlatAtkDisabled = computed(() => statDisabled("ATK_FLAT"));
const isHpDisabled = computed(() => statDisabled("HP"));
const isFlatHpDisabled = computed(() => statDisabled("HP_FLAT"));
const isDefDisabled = computed(() => statDisabled("DEF"));
const isFlatDefDisabled = computed(() => statDisabled("DEF_FLAT"));
const isBasicDisabled = computed(() => statDisabled("BasicAttackDMGBonus"));
const isHeavyDisabled = computed(() => statDisabled("HeavyAttackDMGBonus"));
const isSkillDisabled = computed(() => statDisabled("ResonanceSkillDMGBonus"));
const isLiberationDisabled = computed(() =>
  statDisabled("ResonanceLiberationDMGBonus"),
);
const isEnergyRechargeDisabled = computed(() => statDisabled("EnergyRegen"));

const isCritRateChecked = computed(() => allSubStats.value.includes("CritRate"));
const isCritDMGChecked = computed(() => allSubStats.value.includes("CritDMG"));
const isAtkChecked = computed(() => allSubStats.value.includes("ATK"));
const isFlatAtkChecked = computed(() => allSubStats.value.includes("ATK_FLAT"));
const isHpChecked = computed(() => allSubStats.value.includes("HP"));
const isFlatHpChecked = computed(() => allSubStats.value.includes("HP_FLAT"));
const isDefChecked = computed(() => allSubStats.value.includes("DEF"));
const isFlatDefChecked = computed(() => allSubStats.value.includes("DEF_FLAT"));
const isBasicChecked = computed(() =>
  allSubStats.value.includes("BasicAttackDMGBonus"),
);
const isHeavyChecked = computed(() =>
  allSubStats.value.includes("HeavyAttackDMGBonus"),
);
const isSkillChecked = computed(() =>
  allSubStats.value.includes("ResonanceSkillDMGBonus"),
);
const isLiberationChecked = computed(() =>
  allSubStats.value.includes("ResonanceLiberationDMGBonus"),
);
const isEnergyRechargeChecked = computed(() =>
  allSubStats.value.includes("EnergyRegen"),
);

function valueForSubStat(mainStat: string): number | undefined {
  if (echoSubStatsType1.value === mainStat) return echoSubStatsValue1.value;
  if (echoSubStatsType2.value === mainStat) return echoSubStatsValue2.value;
  if (echoSubStatsType3.value === mainStat) return echoSubStatsValue3.value;
  if (echoSubStatsType4.value === mainStat) return echoSubStatsValue4.value;
  if (echoSubStatsType5.value === mainStat) return echoSubStatsValue5.value;
  return undefined;
}

const critDmgValue = computed(() => valueForSubStat("CritDMG"));
const critRateValue = computed(() => valueForSubStat("CritRate"));
const atkValue = computed(() => valueForSubStat("ATK"));
const atkFlatValue = computed(() => valueForSubStat("ATK_FLAT"));
const hpValue = computed(() => valueForSubStat("HP"));
const hpFlatValue = computed(() => valueForSubStat("HP_FLAT"));
const defValue = computed(() => valueForSubStat("DEF"));
const defFlatValue = computed(() => valueForSubStat("DEF_FLAT"));
const basicValue = computed(() => valueForSubStat("BasicAttackDMGBonus"));
const heavyValue = computed(() => valueForSubStat("HeavyAttackDMGBonus"));
const skillValue = computed(() => valueForSubStat("ResonanceSkillDMGBonus"));
const liberationValue = computed(() =>
  valueForSubStat("ResonanceLiberationDMGBonus"),
);
const energyRegenValue = computed(() => valueForSubStat("EnergyRegen"));

const echoImage = computed(() => {
  const defaultImageUrl =
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png";
  if (!echo.value) return defaultImageUrl;
  const echoData = getEchoData(echo.value);
  return echoData?.image ?? defaultImageUrl;
});

function formatSubStatDisplay(
  typeVal: string | null,
  numVal: number,
): string | number | null {
  if (!numVal) return null;
  if (typeVal?.includes("FLAT")) return numVal;
  return `${numVal}%`;
}

const echoSubStatsValue1Display = computed(() =>
  formatSubStatDisplay(echoSubStatsType1.value, echoSubStatsValue1.value),
);
const echoSubStatsValue2Display = computed(() =>
  formatSubStatDisplay(echoSubStatsType2.value, echoSubStatsValue2.value),
);
const echoSubStatsValue3Display = computed(() =>
  formatSubStatDisplay(echoSubStatsType3.value, echoSubStatsValue3.value),
);
const echoSubStatsValue4Display = computed(() =>
  formatSubStatDisplay(echoSubStatsType4.value, echoSubStatsValue4.value),
);
const echoSubStatsValue5Display = computed(() =>
  formatSubStatDisplay(echoSubStatsType5.value, echoSubStatsValue5.value),
);

const echoSubStat1Icon = computed(() =>
  echoSubStatsType1.value
    ? getSubStatIconByType(echoSubStatsType1.value)
    : undefined,
);
const echoSubStat2Icon = computed(() =>
  echoSubStatsType2.value
    ? getSubStatIconByType(echoSubStatsType2.value)
    : undefined,
);
const echoSubStat3Icon = computed(() =>
  echoSubStatsType3.value
    ? getSubStatIconByType(echoSubStatsType3.value)
    : undefined,
);
const echoSubStat4Icon = computed(() =>
  echoSubStatsType4.value
    ? getSubStatIconByType(echoSubStatsType4.value)
    : undefined,
);
const echoSubStat5Icon = computed(() =>
  echoSubStatsType5.value
    ? getSubStatIconByType(echoSubStatsType5.value)
    : undefined,
);

const mainStatValue = computed(() => {
  const t = type.value;
  const s = stat.value;
  const r = rank.value;
  if (t && s && s !== "none" && r) {
    return (statsTable as Record<string, Record<string, Record<string, number>>>)[
      String(t)
    ]?.[s]?.[String(r)];
  }
  return null;
});

const echoName = computed(() => {
  if (!echo.value) return null;
  const echoData = getEchoData(echo.value);
  return echoData?.name ?? null;
});

const echoFreeSubStatType = computed(() => {
  const t = type.value;
  const r = rank.value;
  if (t && r) {
    return t == "1" ? "HP_FLAT" : "ATK_FLAT";
  }
  return null;
});

const echoFreeSubStatValue = computed(() => {
  const t = type.value;
  const r = rank.value;
  if (t && r) {
    return (flatBonusesByRankByType as Record<string, Record<string, number>>)[
      String(t)
    ]?.[String(r)];
  }
  return null;
});

const echoFreeSubStatIcon = computed(() =>
  echoFreeSubStatType.value
    ? getSubStatIconByType(echoFreeSubStatType.value)
    : undefined,
);

const echoSets = computed(() => {
  if (!echo.value) return [];
  const echoData = getEchoData(echo.value);
  return echoData?.sets ?? [];
});

const echoSetsList = computed(() => Object.keys(echoSetLabelMap));

type EchoListEntry = {
  key: string;
  name: string;
  class: string;
  sets: string[];
  image?: string;
};

const allEchoesListFiltered = computed((): EchoListEntry[] => {
  let allEchoes = Object.values(mainEchoesDataComputed.value) as EchoListEntry[];
  if (echoSetFilter.value) {
    allEchoes = allEchoes.filter((e) =>
      e.sets.includes(echoSetFilter.value!),
    );
  }
  const classOrder: Record<string, number> = {
    Calamity: 0,
    Overlord: 1,
    Elite: 2,
    Common: 3,
  };
  return [...allEchoes].sort((a, b) => {
    const classComparison = classOrder[a.class] - classOrder[b.class];
    if (classComparison === 0) {
      return a.name.localeCompare(b.name);
    }
    return classComparison;
  });
});

const isInInventory = computed(() => !!echoId.value);

const critValue = computed(() => {
  let cv = 0;
  const types = [
    echoSubStatsType1.value,
    echoSubStatsType2.value,
    echoSubStatsType3.value,
    echoSubStatsType4.value,
    echoSubStatsType5.value,
  ];
  const values = [
    echoSubStatsValue1.value,
    echoSubStatsValue2.value,
    echoSubStatsValue3.value,
    echoSubStatsValue4.value,
    echoSubStatsValue5.value,
  ];
  for (let i = 0; i < 5; i++) {
    if (types[i] === "CritRate") {
      cv += Number(values[i]) * 2;
    } else if (types[i] === "CritDMG") {
      cv += Number(values[i]);
    }
  }
  return cv;
});

const critValueBadgeClass = computed(() => {
  const cv = critValue.value ?? 0;
  const percentage = Math.min(Math.max(cv, 0), 42);
  let bgColor: string;
  let color = "text-white";
  let boxShadow: string | undefined;
  let borderColor: string;
  if (percentage <= 7) {
    bgColor = "bg-emerald-800";
    borderColor = "border-emerald-800";
  } else if (percentage <= 14) {
    bgColor = "bg-green-500";
    borderColor = "border-green-500";
  } else if (percentage <= 21) {
    bgColor = "bg-blue-600";
    borderColor = "border-blue-600";
    color = "text-black";
  } else if (percentage <= 28) {
    bgColor = "bg-purple-600";
    borderColor = "border-purple-600";
    color = "text-black";
  } else if (percentage <= 35) {
    bgColor = "bg-purple-400";
    borderColor = "border-purple-400";
    color = "text-black";
  } else {
    bgColor = "bg-yellow-500";
    borderColor = "border-yellow-500";
    color = "text-black";
  }
  if (percentage >= 40) {
    boxShadow = "shadow-md shadow-yellow-500/50";
  }
  return [bgColor, color, borderColor, boxShadow].filter(Boolean) as string[];
});

const formattedCritValue = computed(() => {
  const num = critValue.value;
  if (Number.isInteger(num)) {
    return num;
  }
  const rounded = num.toFixed(1);
  return rounded.endsWith(".0")
    ? parseInt(rounded, 10)
    : parseFloat(rounded);
});

const echoStatsFormatted = computed(() => {
  const echoData: Record<string, number> = {};
  const t1 = echoSubStatsType1.value;
  const t2 = echoSubStatsType2.value;
  const t3 = echoSubStatsType3.value;
  const t4 = echoSubStatsType4.value;
  const t5 = echoSubStatsType5.value;
  if (t1) echoData[t1.toString()] = echoSubStatsValue1.value ?? 0;
  if (t2) echoData[t2.toString()] = echoSubStatsValue2.value ?? 0;
  if (t3) echoData[t3.toString()] = echoSubStatsValue3.value ?? 0;
  if (t4) echoData[t4.toString()] = echoSubStatsValue4.value ?? 0;
  if (t5) echoData[t5.toString()] = echoSubStatsValue5.value ?? 0;
  return echoData;
});

const echoRollValue = computed(() =>
  getRollValue(
    Object.fromEntries(
      Object.entries(echoStatsFormatted.value).map(([k, v]) => [k, String(v)]),
    ) as Record<string, string>,
  ),
);

const rollValueBadgeClass = computed(() => {
  const rv = echoRollValue.value ?? 0;
  const percentage = Math.min(Math.max(rv, 0), 600);
  let bgColor: string;
  let color = "text-white";
  let boxShadow: string | undefined;
  let borderColor: string;
  if (percentage <= 180) {
    bgColor = "bg-emerald-800";
    borderColor = "border-emerald-800";
  } else if (percentage <= 220) {
    bgColor = "bg-green-500";
    borderColor = "border-green-500";
  } else if (percentage <= 300) {
    bgColor = "bg-blue-600";
    borderColor = "border-blue-600";
    color = "text-black";
  } else if (percentage < 400) {
    bgColor = "bg-purple-600";
    borderColor = "border-purple-600";
    color = "text-black";
  } else {
    bgColor = "bg-yellow-500";
    borderColor = "border-yellow-500";
    color = "text-black";
  }
  if (percentage >= 450) {
    boxShadow = "shadow-md shadow-yellow-500/50";
  }
  return [bgColor, color, borderColor, boxShadow].filter(Boolean) as string[];
});

function updateEchoChoice(
  val: string | null,
  previousVal: string | null | undefined,
) {
  const echoData = val ? getEchoData(val) : null;
  const echoClass = echoData?.class;
  const echoCost =
    echoClass != null ? getCostByClass(echoClass) : null;
  selectCost(echoCost);
  if (props.index === 0) {
    emit("main-echo:updated", val);
  }
  let prevEchoCost: string | number | null = null;
  if (previousVal) {
    const prevEchoData = getEchoData(previousVal);
    const prevEchoClass = prevEchoData?.class;
    prevEchoCost =
      prevEchoClass != null ? getCostByClass(prevEchoClass) : null;
  }
  if (previousVal && echoCost !== prevEchoCost) {
    stat.value = "none";
  }
}

function selectCost(cost: string | number | null | undefined) {
  type.value = cost ?? null;
  updateTotalStats();
}

function getStats(cost: string | number | null | undefined) {
  if (cost == null) return [];
  return Object.keys(
    (statsTable as Record<string, Record<string, unknown>>)[String(cost)] || {},
  );
}

function onSubStatValueUpdate(statName: string, val: number) {
  subStatUpdated(statName, val);
}

function subStatLabel(t: string | null) {
  if (!t || t === "none") return "";
  return getReadableSubStatLabel(t);
}

function syncMainStats() {
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

function updateTotalStats() {
  const statsOut: Record<string, number> = {};
  const t = type.value;
  const r = rank.value;
  if (t && r) {
    const flatKey = t == "1" ? "HP_FLAT" : "ATK_FLAT";
    const flatVal = (flatBonusesByRankByType as Record<string, Record<string, number>>)[
      String(t)
    ]?.[String(r)];
    if (flatVal != null) {
      statsOut[flatKey] = (statsOut[flatKey] || 0) + flatVal;
    }
  }
  if (t && r && stat.value) {
    const max = (statsTable as Record<string, Record<string, Record<string, number>>>)[
      String(t)
    ]?.[stat.value]?.[String(r)];
    if (max) {
      statsOut[stat.value] = (statsOut[stat.value] || 0) + max;
    }
  }
  if (echoSubStatsType1.value && echoSubStatsValue1.value) {
    statsOut[echoSubStatsType1.value] =
      (statsOut[echoSubStatsType1.value] || 0) + echoSubStatsValue1.value;
  }
  if (echoSubStatsType2.value && echoSubStatsValue2.value) {
    statsOut[echoSubStatsType2.value] =
      (statsOut[echoSubStatsType2.value] || 0) + echoSubStatsValue2.value;
  }
  if (echoSubStatsType3.value && echoSubStatsValue3.value) {
    statsOut[echoSubStatsType3.value] =
      (statsOut[echoSubStatsType3.value] || 0) + echoSubStatsValue3.value;
  }
  if (echoSubStatsType4.value && echoSubStatsValue4.value) {
    statsOut[echoSubStatsType4.value] =
      (statsOut[echoSubStatsType4.value] || 0) + echoSubStatsValue4.value;
  }
  if (echoSubStatsType5.value && echoSubStatsValue5.value) {
    statsOut[echoSubStatsType5.value] =
      (statsOut[echoSubStatsType5.value] || 0) + echoSubStatsValue5.value;
  }
  emit("update-stats", { index: props.index, stats: statsOut });
}

async function reset() {
  await inventoryStore.deleteEchoEquippedMappingCharacter(
    echoId.value,
    props.character,
  );
  await characterStore.removeCharacterEcho(props.character, props.index);
  emit("on-echo-removed");
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
  const modalEl = document.getElementById(modalId.value);
  (modalEl as HTMLDialogElement | null)?.showModal();
}

function openEchoPicker() {
  const modalEl = document.getElementById(modalIdPicker.value);
  (modalEl as HTMLDialogElement | null)?.showModal();
}

function subStatUpdated(mainStat: string, val: number) {
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
  return (subStatsTable as Record<string, number[]>)[mainStat] ?? [];
}

function getDefaultValue(mainStat: string) {
  if (echoSubStatsType1.value === mainStat) return echoSubStatsValue1.value;
  if (echoSubStatsType2.value === mainStat) return echoSubStatsValue2.value;
  if (echoSubStatsType3.value === mainStat) return echoSubStatsValue3.value;
  if (echoSubStatsType4.value === mainStat) return echoSubStatsValue4.value;
  if (echoSubStatsType5.value === mainStat) return echoSubStatsValue5.value;
  const range = getSubStatRange(mainStat);
  return range[Math.floor(range.length / 2)];
}

function getEchoSetIcon(setType: string) {
  return getEchoSetIconByType(setType);
}

function handleChooseEchoSet(set: string) {
  echoSet.value = set;
}

function isSetSelected(set: string) {
  return echoSet.value === set;
}

async function saveEchoItem() {
  let id: string | null = null;
  if (echoId.value) {
    id = echoId.value;
  } else {
    id = randomString();
  }
  const data = {
    echoId: id,
    echo: echo.value,
    echoSet: echoSet.value,
    echoSubStatsType1: echoSubStatsType1.value,
    echoSubStatsType2: echoSubStatsType2.value,
    echoSubStatsType3: echoSubStatsType3.value,
    echoSubStatsType4: echoSubStatsType4.value,
    echoSubStatsType5: echoSubStatsType5.value,
    echoSubStatsValue1: echoSubStatsValue1.value,
    echoSubStatsValue2: echoSubStatsValue2.value,
    echoSubStatsValue3: echoSubStatsValue3.value,
    echoSubStatsValue4: echoSubStatsValue4.value,
    echoSubStatsValue5: echoSubStatsValue5.value,
    rank: rank.value,
    stat: stat.value,
    type: type.value,
  };
  await inventoryStore.saveEcho(data);
  const echoData = {
    echo: null,
    type: null,
    rank: null,
    stat: null,
    echoId: id,
    echoSet: null,
    echoSubStatsType1: null,
    echoSubStatsValue1: null,
    echoSubStatsType2: null,
    echoSubStatsValue2: null,
    echoSubStatsType3: null,
    echoSubStatsValue3: null,
    echoSubStatsType4: null,
    echoSubStatsValue4: null,
    echoSubStatsType5: null,
    echoSubStatsValue5: null,
  };
  const charData: { echoes: Record<number, typeof echoData> } = { echoes: {} };
  charData.echoes[props.index] = echoData;
  await characterStore.setCharacterData(props.character, charData);
  const equippedData: Record<string, number> = {};
  equippedData[props.character] = props.index;
  await inventoryStore.setEquippedData(id, equippedData);
}

function openEchoBrowser() {
  emit("open-echoes-browser", props.index);
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

async function chooseMainEcho(echoKey: string) {
  echo.value = echoKey;
  if (echoSetFilter.value) {
    echoSet.value = echoSetFilter.value;
  }
  closeEchoChooser();
}

function closeEchoChooser() {
  echoSetFilter.value = null;
  const modalEl = document.getElementById(modalIdPicker.value);
  (modalEl as HTMLDialogElement | null)?.close();
}

watch(
  echo,
  (val, previousVal) => {
    updateEchoChoice(val, previousVal);
  },
  { immediate: true },
);

watch(echoSet, (val, previousVal) => {
  if (val === null && previousVal === undefined) return;
  emit("echo:set-chosen", { set: val, index: props.index });
}, { immediate: true });

watch(type, () => {
  const raw = type.value;
  const costNum = raw == null || raw === "" ? 0 : Number(raw);
  emit("updated-echo-cost", {
    index: props.index,
    cost: Number.isFinite(costNum) ? costNum : 0,
  });
  updateTotalStats();
}, { immediate: true });

watch(rank, (r) => {
  if (props.index === 0) {
    emit("main-echo-rank:updated", r);
  }
  updateTotalStats();
}, { immediate: true });

watch(stat, () => {
  updateTotalStats();
}, { immediate: true });

watch(echoSubStatsType1, () => {
  updateTotalStats();
  syncMainStats();
}, { immediate: true });
watch(echoSubStatsValue1, () => {
  updateTotalStats();
}, { immediate: true });
watch(echoSubStatsType2, () => {
  updateTotalStats();
  syncMainStats();
}, { immediate: true });
watch(echoSubStatsValue2, () => {
  updateTotalStats();
}, { immediate: true });
watch(echoSubStatsType3, () => {
  updateTotalStats();
  syncMainStats();
}, { immediate: true });
watch(echoSubStatsValue3, () => {
  updateTotalStats();
}, { immediate: true });
watch(echoSubStatsType4, () => {
  updateTotalStats();
  syncMainStats();
}, { immediate: true });
watch(echoSubStatsValue4, () => {
  updateTotalStats();
}, { immediate: true });
watch(echoSubStatsType5, () => {
  updateTotalStats();
  syncMainStats();
}, { immediate: true });
watch(echoSubStatsValue5, () => {
  updateTotalStats();
}, { immediate: true });

defineExpose({ saveEchoItem });
</script>


<style scoped lang="scss">
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
  .echo__item__sub-stats img {
    filter: contrast(0);
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
  .echo__item__explain-rv-cv path {
    fill: #333333;
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
