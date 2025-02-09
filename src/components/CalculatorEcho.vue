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
                :class="{ 'border border-white': isSetSelected(echo) }">
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
                  Energy Recharge
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
            class="rounded mr-1"
            :class="{ 'btn-active': isEchoSetFilterActive(echoSet) }">
            <img
              :src="getEchoSetImage(echoSet)"
              class="size-8 m-width-8"
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
    class="echo__item card card-bordered card-compact bg-base-100 shadow mb-2">
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
              {{ echoName }}<br>
              <span class="echo__item__cost badge badge-primary text-nowrap" :class="critValueBadgeClass">
                CV {{ formattedCritValue }}%
              </span>
            </span>
            <div class="echo__item__meta flex gap-2 items-center">
              <span v-if="echoId" class="echo__item__set size-6 rounded-full">
                <img
                  src="https://ryanbenson.github.io/wuthering-waves-assets/images/backpack.png" />
              </span>
              <span v-if="echoSet" class="echo__item__set size-6 rounded-full">
                <img :src="getEchoSetIcon(echoSet)" :class="echoSet" />
              </span>
              <span class="echo__item__cost badge badge-primary min-w-16 text-nowrap">
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
                  {{ getReadableSubStatLabel(echoFreeSubStatType) }}
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
                  {{ getReadableSubStatLabel(echoSubStatsType1) }}
                </td>
                <td class="text-right">{{ echoSubStatsValue1Display }}</td>
              </tr>
              <tr v-if="echoSubStatsType2 && echoSubStatsType2 !== 'none'">
                <td class="flex gap-2 items-center">
                  <img :src="echoSubStat2Icon" />
                  {{ getReadableSubStatLabel(echoSubStatsType2) }}
                </td>
                <td class="text-right">{{ echoSubStatsValue2Display }}</td>
              </tr>
              <tr v-if="echoSubStatsType3 && echoSubStatsType3 !== 'none'">
                <td class="flex gap-2 items-center">
                  <img v-if="echoSubStatsType3" :src="echoSubStat3Icon" />
                  {{ getReadableSubStatLabel(echoSubStatsType3) }}
                </td>
                <td class="text-right">{{ echoSubStatsValue3Display }}</td>
              </tr>
              <tr v-if="echoSubStatsType4 && echoSubStatsType4 !== 'none'">
                <td class="flex gap-2 items-center">
                  <img :src="echoSubStat4Icon" />
                  {{ getReadableSubStatLabel(echoSubStatsType4) }}
                </td>
                <td class="text-right">{{ echoSubStatsValue4Display }}</td>
              </tr>
              <tr v-if="echoSubStatsType5 && echoSubStatsType5 !== 'none'">
                <td class="flex gap-2 items-center">
                  <img :src="echoSubStat5Icon" />
                  {{ getReadableSubStatLabel(echoSubStatsType5) }}
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

<script>
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
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
import { randomString } from "../utils/strings.ts";
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
  components: {
    Range,
  },
  data() {
    return {
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
    echoSet: {
      handler: function (val, previousVal) {
        if (val === null && previousVal === undefined) {
          return;
        }
        this.$emit("echo:set-chosen", { set: val, index: this.index });
      },
      immediate: true,
    },
    type: {
      handler: async function () {
        this.$emit("updated-echo-cost", { index: this.index, cost: this.type });
        this.updateTotalStats();
      },
      immediate: true,
    },
    rank: {
      handler: async function (rank) {
        // update the main echo rank if it's the first one
        if (this.index === 0) {
          this.$emit("main-echo-rank:updated", rank);
        }
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
        this.syncMainStats();
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
        this.syncMainStats();
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
        this.syncMainStats();
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
        this.syncMainStats();
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
        this.syncMainStats();
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
    ...mapActions(useInventoryStore, [
      "saveEcho",
      "patchEcho",
      "deleteEcho",
      "getEchoById",
      "setEquippedData",
    ]),
    getSubStatIconByType,
    updateEchoChoice(echo, previousEcho) {
      const echoData = getEchoData(echo);
      const echoClass = echoData?.class;
      const echoCost = getCostByClass(echoClass);
      this.selectCost(echoCost);
      // update the main echo if it's the first one
      if (this.index === 0) {
        this.$emit("main-echo:updated", echo);
      }
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
    // getSubStatRange(type) {
    //   return this.subStatRanges[type] || { min: 0, max: 0 };
    // },
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
    // reset everything
    async reset() {
      const echoData = {
        echo: null,
        type: null,
        rank: null,
        stat: null,
        echoId: null,
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
      const data = { echoes: {} };
      data.echoes[this.index] = echoData;
      await this.setCharacterData(this.character, data);
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
    async saveEchoItem() {
      let id = null;
      if (this.echoId) {
        id = this.echoId;
      } else {
        id = randomString();
      }
      const data = {
        echoId: id,
        echo: this.echo,
        echoSet: this.echoSet,
        echoSubStatsType1: this.echoSubStatsType1,
        echoSubStatsType2: this.echoSubStatsType2,
        echoSubStatsType3: this.echoSubStatsType3,
        echoSubStatsType4: this.echoSubStatsType4,
        echoSubStatsType5: this.echoSubStatsType5,
        echoSubStatsValue1: this.echoSubStatsValue1,
        echoSubStatsValue2: this.echoSubStatsValue2,
        echoSubStatsValue3: this.echoSubStatsValue3,
        echoSubStatsValue4: this.echoSubStatsValue4,
        echoSubStatsValue5: this.echoSubStatsValue5,
        rank: this.rank,
        stat: this.stat,
        type: this.type,
      };

      await this.saveEcho(data);
      // update the character to reference the inventory
      // when we assign the echo from inventory, clear out all data except echoId
      // the stats will come from the inventory to have one source of truth for its stats
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
      const charData = { echoes: {} };
      charData.echoes[this.index] = echoData;
      await this.setCharacterData(this.character, charData);
      // add to our equipped list
      const equippedData = {};
      equippedData[this.character] = this.index;
      await this.setEquippedData(id, equippedData);
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
    ...mapState(useCharacterStore, ["characters"]),
    ...mapState(useInventoryStore, ["echoes"]),
    /**
     * The current character data
     * @returns {Object}
     */
    currentCharacter() {
      return this.characters[this.character] ?? {};
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
    echoId: {
      get() {
        return this.currentCharacter?.echoes?.[this.index]?.echoId ?? null;
      },
      async set(value) {
        const data = {
          echoes: {},
        };
        data.echoes[this.index] = {
          echoId: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the type for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    type: {
      get() {
        if (this.currentEcho) {
          return this.currentEcho.type;
        }
        return this.currentCharacter?.echoes?.[this.index]?.type ?? null;
      },
      async set(value) {
        if (this.currentEcho) {
          this.patchEcho(this.echoId, { type: value });
        } else {
          const data = {
            echoes: {},
          };
          data.echoes[this.index] = {
            type: value,
          };
          await this.setCharacterData(this.character, data);
        }
      },
    },
    /**
     * Getter/setter used in the form for the type for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echo: {
      get() {
        if (this.currentEcho) {
          return this.currentEcho.echo ?? null;
        }
        return this.currentCharacter?.echoes?.[this.index]?.echo ?? null;
      },
      async set(value) {
        if (this.currentEcho) {
          await this.patchEcho(this.echoId, { echo: value });
        } else {
          const data = {
            echoes: {},
          };
          data.echoes[this.index] = {
            echo: value,
          };
          await this.setCharacterData(this.character, data);
        }
      },
    },
    /**
     * Getter/setter used in the form for the type for this echo set
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSet: {
      get() {
        if (this.currentEcho) {
          return this.currentEcho.echoSet ?? null;
        }
        return this.currentCharacter?.echoes?.[this.index]?.echoSet ?? null;
      },
      async set(value) {
        if (this.currentEcho) {
          await this.patchEcho(this.echoId, { echoSet: value });
        } else {
          const data = {
            echoes: {},
          };
          data.echoes[this.index] = {
            echoSet: value,
          };
          await this.setCharacterData(this.character, data);
        }
      },
    },
    /**
     * Getter/setter used in the form for the rank for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    rank: {
      get() {
        if (this.currentEcho) {
          return this.currentEcho.rank ?? 5;
        }
        return this.currentCharacter?.echoes?.[this.index]?.rank ?? 5;
      },
      async set(value) {
        if (this.currentEcho) {
          await this.patchEcho(this.echoId, { rank: value });
        } else {
          const data = {
            echoes: {},
          };
          data.echoes[this.index] = {
            rank: value,
          };
          await this.setCharacterData(this.character, data);
        }
      },
    },
    /**
     * Getter/setter used in the form for the stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    stat: {
      get() {
        if (this.currentEcho) {
          return this.currentEcho.stat ?? "none";
        }
        return this.currentCharacter?.echoes?.[this.index]?.stat ?? "none";
      },
      async set(value) {
        if (this.currentEcho) {
          await this.patchEcho(this.echoId, { stat: value });
        } else {
          const data = {
            echoes: {},
          };
          data.echoes[this.index] = {
            stat: value,
          };
          await this.setCharacterData(this.character, data);
        }
      },
    },
    /**
     * Getter/setter used in the form for the sub stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSubStatsType1: {
      get() {
        if (this.currentEcho) {
          return this.currentEcho.echoSubStatsType1 ?? "none";
        }
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsType1 ??
          "none"
        );
      },
      async set(value) {
        if (this.currentEcho) {
          await this.patchEcho(this.echoId, { echoSubStatsType1: value });
        } else {
          const data = {
            echoes: {},
          };
          data.echoes[this.index] = {
            echoSubStatsType1: value,
          };
          await this.setCharacterData(this.character, data);
        }
      },
    },
    /**
     * Getter/setter used in the form for the sub stat value for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    echoSubStatsValue1: {
      get() {
        if (this.currentEcho) {
          return this.currentEcho.echoSubStatsValue1 ?? 0;
        }
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsValue1 ?? 0
        );
      },
      async set(value) {
        if (this.currentEcho) {
          await this.patchEcho(this.echoId, { echoSubStatsValue1: value });
        } else {
          const data = {
            echoes: {},
          };
          data.echoes[this.index] = {
            echoSubStatsValue1: value,
          };
          await this.setCharacterData(this.character, data);
        }
      },
    },

    /**
     * Getter/setter used in the form for the sub stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSubStatsType2: {
      get() {
        if (this.currentEcho) {
          return this.currentEcho.echoSubStatsType2 ?? "none";
        }
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsType2 ??
          "none"
        );
      },
      async set(value) {
        if (this.currentEcho) {
          await this.patchEcho(this.echoId, { echoSubStatsType2: value });
        } else {
          const data = {
            echoes: {},
          };
          data.echoes[this.index] = {
            echoSubStatsType2: value,
          };
          await this.setCharacterData(this.character, data);
        }
      },
    },
    /**
     * Getter/setter used in the form for the sub stat value for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    echoSubStatsValue2: {
      get() {
        if (this.currentEcho) {
          return this.currentEcho.echoSubStatsValue2 ?? 0;
        }
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsValue2 ?? 0
        );
      },
      async set(value) {
        if (this.currentEcho) {
          await this.patchEcho(this.echoId, { echoSubStatsValue2: value });
        } else {
          const data = {
            echoes: {},
          };
          data.echoes[this.index] = {
            echoSubStatsValue2: value,
          };
          await this.setCharacterData(this.character, data);
        }
      },
    },

    /**
     * Getter/setter used in the form for the sub stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSubStatsType3: {
      get() {
        if (this.currentEcho) {
          return this.currentEcho.echoSubStatsType3 ?? "none";
        }
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsType3 ??
          "none"
        );
      },
      async set(value) {
        if (this.currentEcho) {
          await this.patchEcho(this.echoId, { echoSubStatsType3: value });
        } else {
          const data = {
            echoes: {},
          };
          data.echoes[this.index] = {
            echoSubStatsType3: value,
          };
          await this.setCharacterData(this.character, data);
        }
      },
    },
    /**
     * Getter/setter used in the form for the sub stat value for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    echoSubStatsValue3: {
      get() {
        if (this.currentEcho) {
          return this.currentEcho.echoSubStatsValue3 ?? 0;
        }
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsValue3 ?? 0
        );
      },
      async set(value) {
        if (this.currentEcho) {
          await this.patchEcho(this.echoId, { echoSubStatsValue3: value });
        } else {
          const data = {
            echoes: {},
          };
          data.echoes[this.index] = {
            echoSubStatsValue3: value,
          };
          await this.setCharacterData(this.character, data);
        }
      },
    },

    /**
     * Getter/setter used in the form for the sub stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSubStatsType4: {
      get() {
        if (this.currentEcho) {
          return this.currentEcho.echoSubStatsType4 ?? "none";
        }
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsType4 ??
          "none"
        );
      },
      async set(value) {
        if (this.currentEcho) {
          await this.patchEcho(this.echoId, { echoSubStatsType4: value });
        } else {
          const data = {
            echoes: {},
          };
          data.echoes[this.index] = {
            echoSubStatsType4: value,
          };
          await this.setCharacterData(this.character, data);
        }
      },
    },
    /**
     * Getter/setter used in the form for the sub stat value for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    echoSubStatsValue4: {
      get() {
        if (this.currentEcho) {
          return this.currentEcho.echoSubStatsValue4 ?? 0;
        }
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsValue4 ?? 0
        );
      },
      async set(value) {
        if (this.currentEcho) {
          await this.patchEcho(this.echoId, { echoSubStatsValue4: value });
        } else {
          const data = {
            echoes: {},
          };
          data.echoes[this.index] = {
            echoSubStatsValue4: value,
          };
          await this.setCharacterData(this.character, data);
        }
      },
    },
    /**
     * Getter/setter used in the form for the sub stat for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    echoSubStatsType5: {
      get() {
        if (this.currentEcho) {
          return this.currentEcho.echoSubStatsType5 ?? "none";
        }
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsType5 ??
          "none"
        );
      },
      async set(value) {
        if (this.currentEcho) {
          await this.patchEcho(this.echoId, { echoSubStatsType5: value });
        } else {
          const data = {
            echoes: {},
          };
          data.echoes[this.index] = {
            echoSubStatsType5: value,
          };
          await this.setCharacterData(this.character, data);
        }
      },
    },
    /**
     * Getter/setter used in the form for the sub stat value for this echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {String|null}
     */
    echoSubStatsValue5: {
      get() {
        if (this.currentEcho) {
          return this.currentEcho.echoSubStatsValue5 ?? 0;
        }
        return (
          this.currentCharacter?.echoes?.[this.index]?.echoSubStatsValue5 ?? 0
        );
      },
      async set(value) {
        if (this.currentEcho) {
          await this.patchEcho(this.echoId, { echoSubStatsValue5: value });
        } else {
          const data = {
            echoes: {},
          };
          data.echoes[this.index] = {
            echoSubStatsValue5: value,
          };
          await this.setCharacterData(this.character, data);
        }
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
      return `echoModal${this.index}`;
    },
    modalIdPicker() {
      return `echoModal${this.index}Picker`;
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
    critValue() {
      let cv = 0;
      for (let i = 1; i <= 5; i++) {
        const typeKey = `echoSubStatsType${i}`;
        const valueKey = `echoSubStatsValue${i}`;
        
        if (this[typeKey] === 'CritRate') {
          cv += this[valueKey] * 2; // Double the value for CritRate
        } else if (this[typeKey] === 'CritDMG') {
          cv += this[valueKey]; // Add the value for CritDMG
        }
      }
      return cv;
    },
    critValueBadgeClass() {
      const cv = this.critValue ?? 0;
      
      // Ensure cv is within the valid range
      const percentage = Math.min(Math.max(cv, 0), 42);

      let bgColor;
      let color = 'text-white';
      let boxShadow;
      let borderColor;

      if (percentage <= 7) {
        bgColor = 'bg-emerald-800';  // Dark Green
        borderColor = 'border-emerald-800';
      } else if (percentage <= 14) {
        bgColor = 'bg-green-500';  // Lighter Green
        borderColor = 'border-green-500';
      } else if (percentage <= 21) {
        bgColor = 'bg-blue-600';   // Blue
        borderColor = 'border-blue-600';
        color = 'text-black';
      } else if (percentage <= 28) {
        bgColor = 'bg-purple-600'; // Purple
        borderColor = 'border-purple-600';
        color = 'text-black';
      } else if (percentage <= 35) {
        bgColor = 'bg-purple-400'; // Lighter Purple
        borderColor = 'border-purple-400';
        color = 'text-black';
      } else {
        bgColor = 'bg-yellow-500'; // Gold or Red (depending on preference)
        borderColor = 'border-yellow-500';
        color = 'text-black';
      }
      if (percentage >= 40) {
        boxShadow = 'shadow-md shadow-yellow-500/50';
      }

      return [
        bgColor,  // Dynamically return the class based on the cv
        color,
        borderColor,
        boxShadow,
      ];
    },
    formattedCritValue() {
      const num = this.critValue;
      if (Number.isInteger(num)) {
        return num;  // If it's an integer, return it as is
      } else {
        const rounded = num.toFixed(1);  // Round to 1 decimal place
        return (rounded.endsWith('.0')) ? parseInt(rounded) : parseFloat(rounded);  // Remove the '.0' if it's a whole number
      }
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
    img.FreezingFrost,
    img.MoltenRift,
    img.MoltenRift,
    img.SierraGale,
    img.CelestialLight,
    img.SunSinkingEclipse,
    img.RejuvenatingGlow,
    img.MoonlitClouds,
    img.LingeringTunes {
      filter: invert(100%);
    }
  }
  .echo__item__stats,
  .echoes__filters {
    img.FreezingFrost,
    img.MoltenRift,
    img.MoltenRift,
    img.SierraGale,
    img.CelestialLight,
    img.SunSinkingEclipse,
    img.RejuvenatingGlow,
    img.MoonlitClouds,
    img.LingeringTunes {
      filter: invert(100%);
    }
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
