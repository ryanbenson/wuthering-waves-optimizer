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
                v-for="setBonus in currentSetBonuses"
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
          :current-optimization-target="(optimizationTarget as string | null)"
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
          :max="Math.max(totalCombos ?? 0, 1)"></progress>
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

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { echoSetLabelMap, getEchoSetIconByType } from "../echoes/stats";
import {
  getSetBonusEffectsFromListOfSetKeys,
  getSetLabelByKey,
} from "../echoes/sets";
import { mainEchoesData, getEchoData } from "../echoes/index";
import { useCharacterStore } from "../stores/character";
import CalculatorOptimizerMinStats from "./CalculatorOptimizerMinStats.vue";
import type { OptimizerMinStatRow } from "./CalculatorOptimizerMinStats.vue";
import CalculatorOptimizerEchoSet from "./CalculatorOptimizerEchoSet.vue";
import CalculatorOptimizerMainEcho from "./CalculatorOptimizerMainEcho.vue";
import CalculatorOptimizerTarget from "./CalculatorOptimizerTarget.vue";
import CalculatorOptimizerDamageType from "./CalculatorOptimizerDamageType.vue";
import CalculatorOptimizerResults from "./CalculatorOptimizerResults.vue";
import CalculatorOptimizerGuide from "./CalculatorOptimizerGuide.vue";
import CalculatorOptimizerSettings from "./CalculatorOptimizerSettings.vue";

const props = defineProps<{
  character: string;
  totalCombos?: number;
  processedCombos?: number;
  optimizerNoPossibleLoadouts?: boolean;
  optimizerResults?: unknown[] | null;
  characterElement: string;
  allDamages?: unknown[];
  totalAtk: number;
  totalHp: number;
  totalDef: number;
  totalCritRate: number;
  totalCritDMG: number;
  energyRegen: number;
  optimizationTargetType: string;
  optimizationTargetObject: string;
}>();

const emit = defineEmits<{
  "optimizer:optimize": [
    setFilters: string[],
    mainEchoes: string[],
    minStats: unknown[],
    echoSetDataByLabel: Record<string, Record<string, number>>,
    mainEchoStats: Record<string, Record<string, number>>,
    optimizationTarget: unknown,
    damageType: string,
    ignoreOtherResonantorEchoes: boolean,
  ];
}>();

const characterStore = useCharacterStore();

const modalIdPicker = "optimizerEchoPicker";
const echoSetFilter = ref<string | null>(null);
const setFilters = ref<string[]>([]);
const mainEchoes = ref<string[]>([]);
const minStats = ref<OptimizerMinStatRow[]>([]);
const optimizationTarget = ref<unknown>(null);
const damageType = ref("Average");
const isLoading = ref(true);
const hasTriggeredOptimizer = ref(false);
const echoSetPassiveStats = reactive<
  Record<string, Record<string, Record<string, number>>>
>({});
const mainEchoStats = reactive<Record<string, Record<string, number>>>({});
const ignoreOtherResonantorEchoes = ref(false);

const optimizerGuide = ref<{ triggerOpenModal: () => void } | null>(null);

const currentCharacter = computed(
  () => characterStore.characters?.[props.character] ?? {},
);

const isTargetUnavailable = computed(() => false);

const isValid = computed(() => {
  const echoSetsCount = setFilters.value.length;
  const mainEchoesCount = mainEchoes.value.length;
  let hasValidTarget = false;
  if (Array.isArray(optimizationTarget.value)) {
    hasValidTarget = optimizationTarget.value.length > 0;
  } else {
    hasValidTarget = !!optimizationTarget.value;
  }
  return hasValidTarget && echoSetsCount > 0 && mainEchoesCount > 0;
});

const echoSets = computed(() => Object.keys(echoSetLabelMap));

type EchoListEntry = {
  key: string;
  name: string;
  class: string;
  sets: string[];
  image?: string;
};

const allEchoesListFiltered = computed((): EchoListEntry[] => {
  let allEchoes = Object.values(mainEchoesData) as EchoListEntry[];
  if (echoSetFilter.value) {
    allEchoes = allEchoes.filter((echo) =>
      echo.sets.includes(echoSetFilter.value!),
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

const currentSetBonuses = computed(() =>
  getSetBonusEffectsFromListOfSetKeys(setFilters.value),
);

const echoSetPassiveStatsByLabel = computed(() => {
  const result: Record<string, Record<string, Record<string, number>>> = {};
  Object.keys(echoSetPassiveStats).forEach((setKey) => {
    const label = getSetLabelByKey(setKey);
    result[label ?? setKey] = echoSetPassiveStats[setKey];
  });
  return result;
});

const echoSetDataByLabel = computed(() => {
  const result: Record<string, Record<string, number>> = {};
  Object.entries(echoSetPassiveStatsByLabel.value).forEach(
    ([label, passives]) => {
      const mergedStats: Record<string, number> = {};
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
});

const allMainEchoesData = computed(() => {
  const echoData: ReturnType<typeof getEchoData>[] = [];
  mainEchoes.value.forEach((echoKey) => {
    if (mainEchoesData[echoKey as keyof typeof mainEchoesData]) {
      echoData.push(getEchoData(echoKey));
    }
  });
  return echoData;
});

function handleOptimize() {
  hasTriggeredOptimizer.value = true;
  emit(
    "optimizer:optimize",
    setFilters.value,
    mainEchoes.value,
    minStats.value,
    echoSetDataByLabel.value,
    { ...mainEchoStats },
    optimizationTarget.value,
    damageType.value,
    ignoreOtherResonantorEchoes.value,
  );
}

function chooseMainEcho(echoKey: string) {
  mainEchoes.value.push(echoKey);
  void syncOptimizerConfig();
  closeEchoChooser();
}

function toggleSetFilter(set: string) {
  const index = setFilters.value.findIndex((setFilter) => setFilter === set);
  if (index >= 0) {
    setFilters.value.splice(index, 1);
  } else {
    setFilters.value.push(set);
  }
  void syncOptimizerConfig();
}

function handleUpdatedTarget(target: unknown) {
  optimizationTarget.value = target;
  void syncOptimizerConfig();
}

function handleUpdatedDamageType(dt: string) {
  damageType.value = dt;
  void syncOptimizerConfig();
}

async function syncOptimizerConfig() {
  await characterStore.setCharacterData(props.character, {
    optimizer: {
      mainEchoes: JSON.parse(JSON.stringify(mainEchoes.value)),
      echoSets: JSON.parse(JSON.stringify(setFilters.value)),
      minStats: JSON.parse(JSON.stringify(minStats.value)),
      optimizationTarget: optimizationTarget.value,
      damageType: damageType.value,
      ignoreOtherResonantorEchoes: ignoreOtherResonantorEchoes.value,
    },
  });
}

function isSetFilterActive(set: string) {
  return !!setFilters.value.find((setFilter) => setFilter === set);
}

function getSetIcon(set: string) {
  return getEchoSetIconByType(set);
}

function openEchoChooser() {
  const modalEl = document.getElementById(modalIdPicker);
  (modalEl as HTMLDialogElement | null)?.showModal();
}

function closeEchoChooser() {
  echoSetFilter.value = null;
  const modalEl = document.getElementById(modalIdPicker);
  (modalEl as HTMLDialogElement | null)?.close();
}

function toggleEchoSetFilter(echoSet: string) {
  if (echoSetFilter.value === echoSet) {
    echoSetFilter.value = null;
  } else {
    echoSetFilter.value = echoSet;
  }
}

function isEchoSetFilterActive(echoSet: string) {
  return echoSetFilter.value === echoSet;
}

function resetFilters() {
  echoSetFilter.value = null;
}

function getEchoSetImage(echoSet: string) {
  return getEchoSetIconByType(echoSet);
}

function getEchoSetIcon(type: string) {
  return getEchoSetIconByType(type);
}

function handleUpdatedMinStats(stats: OptimizerMinStatRow[]) {
  minStats.value = JSON.parse(JSON.stringify(stats)) as OptimizerMinStatRow[];
  void syncOptimizerConfig();
}

function removeMainEcho(echoKey: string) {
  const index = mainEchoes.value.findIndex((echo) => echo === echoKey);
  if (index >= 0) {
    mainEchoes.value.splice(index, 1);
    void syncOptimizerConfig();
  }
}

function handleUpdatedSetStats(payload: {
  setKey: string;
  stats: Record<string, unknown>;
  key: string;
}) {
  const { setKey, stats, key } = payload;
  if (!Object.prototype.hasOwnProperty.call(echoSetPassiveStats, setKey)) {
    echoSetPassiveStats[setKey] = {};
  }
  echoSetPassiveStats[setKey][key] = stats as Record<string, number>;
}

function handleUpdatedMainEchoBuffs(payload: {
  key: string;
  stats: Record<string, unknown>;
}) {
  const { key, stats } = payload;
  mainEchoStats[key] = stats as Record<string, number>;
}

function handleOpenOptimizerGuide() {
  optimizerGuide.value?.triggerOpenModal();
}

function handleUpdatedSettings(settings: {
  ignoreOtherResonantorEchoes?: boolean;
}) {
  ignoreOtherResonantorEchoes.value =
    settings.ignoreOtherResonantorEchoes ?? false;
  void syncOptimizerConfig();
}

onMounted(() => {
  isLoading.value = true;
  const ch = currentCharacter.value as {
    optimizer?: {
      mainEchoes?: string[];
      echoSets?: string[];
      minStats?: unknown[];
      optimizationTarget?: unknown;
      ignoreOtherResonantorEchoes?: boolean;
      damageType?: string;
    };
  };
  mainEchoes.value = ch.optimizer?.mainEchoes ?? [];
  setFilters.value = ch.optimizer?.echoSets ?? [];
  minStats.value = (ch.optimizer?.minStats ?? []) as OptimizerMinStatRow[];
  optimizationTarget.value = ch.optimizer?.optimizationTarget ?? null;
  ignoreOtherResonantorEchoes.value =
    ch.optimizer?.ignoreOtherResonantorEchoes ?? false;
  if (ch.optimizer?.damageType) {
    damageType.value = ch.optimizer.damageType;
  }
  isLoading.value = false;
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
</style>
