<template>
  <div class="flex flex-col gap-4" v-if="!isLoading">
    <AppModal
      ref="pickerRef"
      title="Choose echo"
      max-width-class="max-w-5xl"
      :lazy="false"
      @close="resetFilters">
      <div
        class="flex align-center gap-1 mb-6 items-center flex-wrap"
        :class="{ 'echo-filters__sets--active': echoSetFilter !== null }">
        <span class="mr-2">Filter</span>
        <button
          v-for="echoSet in echoSets"
          :key="echoSet"
          @click="toggleEchoSetFilter(echoSet)"
          class="rounded p-[.3rem]"
          :class="{ 'btn-active': isEchoSetFilterActive(echoSet) }">
          <img :src="getEchoSetImage(echoSet)" class="size-7" :class="echoSet" />
        </button>
        <button @click="resetFilters" class="btn btn-sm btn-ghost">Clear</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <template v-if="!allEchoesListFiltered.length">
          <div class="py-12 text-center w-full col-span-2">No echoes found</div>
        </template>
        <template v-else>
          <div
            v-for="echoesToChoose in allEchoesListFiltered"
            :key="echoesToChoose.key"
            class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer">
            <div class="card-body items-center">
              <div
                class="rounded-full border border-solid neutral-content size-20 mb-2 bg-cover cursor-pointer mx-auto lg:m-0"
                :style="{ backgroundImage: `url(${echoesToChoose.image})` }"></div>
              <h2 class="card-title text-center text-lg">{{ echoesToChoose.name }}</h2>
              <h3 class="text-sm">{{ echoesToChoose.class }}</h3>
              <div class="flex gap-3 justify-center sm:justify-start flex-wrap">
                <div
                  v-for="echoSetItem in echoesToChoose.sets"
                  :key="echoSetItem"
                  class="size-8 rounded-full cursor-pointer">
                  <img :src="getEchoSetIcon(echoSetItem)" :class="echoSetItem" />
                </div>
              </div>
              <button
                @click="chooseMainEcho(echoesToChoose.key)"
                class="btn btn-sm btn-primary"
                :data-test-optimizer-workspace-pick-echo="echoesToChoose.key">
                Use echo
              </button>
            </div>
          </div>
        </template>
      </div>
    </AppModal>

    <div class="run-bar-sticky">
      <OptimizerWorkspaceRunBar
        :echo-set-count="setFilters.length"
        :main-echo-count="mainEchoes.length"
        :has-target="hasValidTarget"
        :buffs-not-set-count="buffsNotSetCount"
        :min-stats-count="minStats.length"
        @run="handleOptimizeClick"
        @jump="jumpToSection"></OptimizerWorkspaceRunBar>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Echo sets + main echo -->
      <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
        <div ref="setsSection" class="scroll-mt-20">
          <div class="text-xs font-bold uppercase tracking-wider opacity-50">
            Eligible echo sets
          </div>
          <p class="text-xs opacity-60 mt-1">
            Only echoes from these sets are considered.
          </p>
        </div>
        <OptimizerWorkspaceEchoSets
          :sets="echoSets"
          :selected="setFilters"
          @toggle="toggleSetFilter"></OptimizerWorkspaceEchoSets>

        <div class="divider my-0"></div>

        <div ref="mainEchoSection" class="scroll-mt-20">
          <div class="text-xs font-bold uppercase tracking-wider opacity-50">
            Main echo &middot; slot 1
          </div>
          <p class="text-xs opacity-60 mt-1">
            Every loadout is built around one of these in slot one.
          </p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <div
            class="card card-bordered card-compact bg-base-100 shadow w-[6rem] flex flex-col items-center">
            <div
              @click="openEchoChooser"
              class="card-body items-center justify-center cursor-pointer"
              data-test-optimizer-workspace-add-echo>
              <div class="flex flex-col gap-2 justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16">
                  <path
                    d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path
                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
                <span class="text-center text-sm">Add echo</span>
              </div>
            </div>
          </div>
          <div
            v-for="echo in allMainEchoesData"
            :key="echo.key"
            class="card card-bordered card-compact bg-base-100 shadow w-[6rem] flex flex-col items-center">
            <div class="card-body items-center">
              <div
                class="rounded-full border border-solid neutral-content size-12 mb-2 bg-cover cursor-pointer"
                :style="{ backgroundImage: `url(${echo.image})` }"></div>
              <div class="text-center text-sm grow">{{ echo.name }}</div>
              <div class="card-actions">
                <button class="btn btn-xs btn-outline mt-1" @click="removeMainEcho(echo.key)">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Target -->
      <div ref="targetSection" class="bg-base-200 rounded-xl p-4 flex flex-col gap-3 scroll-mt-20">
        <div>
          <div class="text-xs font-bold uppercase tracking-wider opacity-50">
            Optimize for
          </div>
          <p class="text-xs opacity-60 mt-1">
            A single attack, a full rotation, or a raw stat.
          </p>
        </div>
        <OptimizerWorkspaceTarget
          :character="character"
          :current-optimization-target="optimizationTarget as string | null"
          :current-damage-type="damageType"
          @target-updated="handleUpdatedTarget"
          @damage-type-updated="handleUpdatedDamageType"></OptimizerWorkspaceTarget>
      </div>

      <!-- Min stats + advanced -->
      <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
        <div>
          <div class="text-xs font-bold uppercase tracking-wider opacity-50">
            Minimum stats &middot; optional
          </div>
          <p class="text-xs opacity-60 mt-1">
            Every loadout must meet or exceed all of these.
          </p>
        </div>
        <CalculatorOptimizerMinStats
          :character="character"
          :key="character"
          :min-stats="minStats"
          :quick-add-stats="quickAddStats"
          @updated-min-stats="handleUpdatedMinStats"></CalculatorOptimizerMinStats>

        <div class="divider my-0"></div>

        <div>
          <div class="text-xs font-bold uppercase tracking-wider opacity-50 mb-2">
            Advanced settings
          </div>
          <CalculatorOptimizerSettings
            :character="character"
            :current-ignore-other-resonantor-echoes="ignoreOtherResonantorEchoes"
            :current-loadout-format="loadoutFormat"
            @optimizer:settings-updated="
              handleUpdatedSettings
            "></CalculatorOptimizerSettings>
        </div>
      </div>
    </div>

    <!-- Echo buffs -->
    <div
      v-if="currentSetBonuses.length || mainEchoes.length"
      ref="buffsSection"
      class="bg-base-200 rounded-xl p-4 flex flex-col gap-3 scroll-mt-20"
      data-test-optimizer-workspace-buffs>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          class="flex items-center gap-2 text-left"
          :aria-expanded="isBuffsOpen"
          data-test-optimizer-workspace-buffs-toggle
          @click="isBuffsOpen = !isBuffsOpen">
          <svg
            class="size-4 transition-transform"
            :class="{ 'rotate-90': isBuffsOpen }"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true">
            <path d="M6 3.5 10.5 8 6 12.5 5 11.5 8.5 8 5 4.5z" />
          </svg>
          <span class="font-semibold">Echo buffs</span>
          <span
            v-if="buffsNotSetCount"
            class="badge badge-warning badge-sm"
            data-test-optimizer-workspace-buffs-not-set>
            {{ buffsNotSetCount }} not set
          </span>
        </button>
        <div v-if="hasOptionalBuffs" class="flex flex-wrap gap-2">
          <button
            type="button"
            class="btn btn-sm"
            data-test-optimizer-workspace-buffs-enable-all
            @click="enableAllBuffs">
            Enable All
          </button>
          <button
            type="button"
            class="btn btn-sm"
            data-test-optimizer-workspace-buffs-max-all
            @click="maxAllBuffs">
            Max All
          </button>
        </div>
      </div>
      <!-- v-show, not v-if: the buff rows report their stats to this
           component, so they must stay mounted while collapsed. -->
      <div v-show="isBuffsOpen" class="flex flex-col gap-1">
        <template v-if="currentSetBonuses.length">
          <CalculatorOptimizerEchoSet
            v-for="setBonus in currentSetBonuses"
            :key="setBonus.key"
            :set-key="setBonus.key"
            :character="character"
            :name="setBonus.name"
            :passives="setBonus.passives"
            :details="setBonus.details"
            calculator-fallback
            @updated-optimizer-echo-set-stats="
              handleUpdatedSetStats
            "></CalculatorOptimizerEchoSet>
        </template>
        <template v-if="mainEchoes.length">
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
            calculator-fallback
            @updated-main-echo-buffs="
              handleUpdatedMainEchoBuffs
            "></CalculatorOptimizerMainEcho>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, toRef } from "vue";
import { echoSetLabelMap, getEchoSetIconByType } from "../../echoes/stats";
import {
  getSetBonusEffectsFromListOfSetKeys,
  getSetLabelByKey,
} from "../../echoes/sets";
import { mainEchoesData, getEchoData } from "../../echoes/index";
import { useCharacterStore } from "../../stores/character";
import CalculatorOptimizerMinStats from "../CalculatorOptimizerMinStats.vue";
import type { OptimizerMinStatRow } from "../CalculatorOptimizerMinStats.vue";
import CalculatorOptimizerEchoSet from "../CalculatorOptimizerEchoSet.vue";
import CalculatorOptimizerMainEcho from "../CalculatorOptimizerMainEcho.vue";
import CalculatorOptimizerSettings from "../CalculatorOptimizerSettings.vue";
import AppModal from "../AppModal.vue";
import OptimizerWorkspaceEchoSets from "./OptimizerWorkspaceEchoSets.vue";
import OptimizerWorkspaceTarget from "./OptimizerWorkspaceTarget.vue";
import OptimizerWorkspaceRunBar, {
  type OptimizerSetupSection,
} from "./OptimizerWorkspaceRunBar.vue";
import { useOptimizerEchoBuffs } from "../../composables/useOptimizerEchoBuffs";
import {
  normalizeLoadoutFormat,
  type OptimizerLoadoutFormat,
} from "../../calculator/optimizer";

defineOptions({ name: "OptimizerWorkspaceSetup" });

const props = defineProps<{ character: string }>();

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
    loadoutFormat: OptimizerLoadoutFormat,
  ];
}>();

const characterStore = useCharacterStore();

const pickerRef = ref<InstanceType<typeof AppModal> | null>(null);
const echoSetFilter = ref<string | null>(null);
const setFilters = ref<string[]>([]);
const mainEchoes = ref<string[]>([]);
const minStats = ref<OptimizerMinStatRow[]>([]);
const optimizationTarget = ref<unknown>(null);
const damageType = ref("Average");
const isLoading = ref(true);
const echoSetPassiveStats = reactive<
  Record<string, Record<string, Record<string, number>>>
>({});
const mainEchoStats = reactive<Record<string, Record<string, number>>>({});
const ignoreOtherResonantorEchoes = ref(false);
const loadoutFormat = ref<OptimizerLoadoutFormat>("Any");

const quickAddStats = [
  { stat: "energyRegen", label: "Energy Regen" },
  { stat: "totalCritRate", label: "Crit Rate" },
];

const currentCharacter = computed(
  () => characterStore.characters?.[props.character] ?? {},
);

const hasValidTarget = computed(() => {
  if (Array.isArray(optimizationTarget.value)) {
    return optimizationTarget.value.length > 0;
  }
  return !!optimizationTarget.value;
});

const {
  attentionCount: buffsNotSetCount,
  hasOptionalBuffs,
  enableAll: enableAllBuffs,
  maxAll: maxAllBuffs,
} = useOptimizerEchoBuffs(toRef(props, "character"), setFilters, mainEchoes);

// Open every time the setup loads; deliberately not saved (issue #618).
const isBuffsOpen = ref(true);

const setsSection = ref<HTMLElement | null>(null);
const mainEchoSection = ref<HTMLElement | null>(null);
const targetSection = ref<HTMLElement | null>(null);
const buffsSection = ref<HTMLElement | null>(null);

async function jumpToSection(section: OptimizerSetupSection) {
  if (section === "buffs") isBuffsOpen.value = true;
  // Let an opened section render first, or there may be nothing to scroll to.
  await nextTick();
  const el = {
    sets: setsSection,
    mainEcho: mainEchoSection,
    target: targetSection,
    buffs: buffsSection,
    minStats: null,
  }[section]?.value;
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

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
    allEchoes = allEchoes.filter((echo) => echo.sets.includes(echoSetFilter.value!));
  }
  const classOrder: Record<string, number> = {
    Calamity: 0,
    Overlord: 1,
    Elite: 2,
    Common: 3,
  };
  return [...allEchoes].sort((a, b) => {
    const classComparison = classOrder[a.class] - classOrder[b.class];
    if (classComparison === 0) return a.name.localeCompare(b.name);
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
  Object.entries(echoSetPassiveStatsByLabel.value).forEach(([label, passives]) => {
    const mergedStats: Record<string, number> = {};
    Object.values(passives).forEach((passiveStats) => {
      Object.entries(passiveStats).forEach(([stat, value]) => {
        if (!mergedStats[stat]) mergedStats[stat] = 0;
        mergedStats[stat] += value;
      });
    });
    result[label] = mergedStats;
  });
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

function handleOptimizeClick() {
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
    loadoutFormat.value,
  );
}

function chooseMainEcho(echoKey: string) {
  mainEchoes.value.push(echoKey);
  void syncOptimizerConfig();
  closeEchoChooser();
}

function toggleSetFilter(set: string) {
  const index = setFilters.value.findIndex((setFilter) => setFilter === set);
  if (index >= 0) setFilters.value.splice(index, 1);
  else setFilters.value.push(set);
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
      loadoutFormat: loadoutFormat.value,
    },
  });
}

function getEchoSetImage(echoSet: string) {
  return getEchoSetIconByType(echoSet);
}

function getEchoSetIcon(type: string) {
  return getEchoSetIconByType(type);
}

function openEchoChooser() {
  pickerRef.value?.triggerOpenModal();
}

function closeEchoChooser() {
  echoSetFilter.value = null;
  pickerRef.value?.triggerCloseModal();
}

function toggleEchoSetFilter(echoSet: string) {
  echoSetFilter.value = echoSetFilter.value === echoSet ? null : echoSet;
}

function isEchoSetFilterActive(echoSet: string) {
  return echoSetFilter.value === echoSet;
}

function resetFilters() {
  echoSetFilter.value = null;
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

function handleUpdatedSettings(settings: {
  ignoreOtherResonantorEchoes?: boolean;
  loadoutFormat?: OptimizerLoadoutFormat;
}) {
  ignoreOtherResonantorEchoes.value = settings.ignoreOtherResonantorEchoes ?? false;
  loadoutFormat.value = settings.loadoutFormat ?? "Any";
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
      loadoutFormat?: OptimizerLoadoutFormat | string;
    };
  };
  mainEchoes.value = ch.optimizer?.mainEchoes ?? [];
  setFilters.value = ch.optimizer?.echoSets ?? [];
  minStats.value = (ch.optimizer?.minStats ?? []) as OptimizerMinStatRow[];
  optimizationTarget.value = ch.optimizer?.optimizationTarget ?? null;
  ignoreOtherResonantorEchoes.value = ch.optimizer?.ignoreOtherResonantorEchoes ?? false;
  loadoutFormat.value = normalizeLoadoutFormat(ch.optimizer?.loadoutFormat);
  if (ch.optimizer?.damageType) damageType.value = ch.optimizer.damageType;
  isLoading.value = false;
});
</script>

<style scoped lang="scss">
// Pins the run bar while the setup scrolls. The scroll container
// (Calculator.vue's .calculations__screens) has 2rem padding (1rem on
// phones), and sticky offsets are measured inside it, so a plain top: 0
// would leave page content showing above the bar. Pin the strip at the real
// edge instead, on the page background, with the bar a little below it.
.run-bar-sticky {
  position: sticky;
  top: -2rem;
  z-index: 20;
  margin-top: -0.75rem;
  padding-top: 0.75rem;
  background: oklch(var(--b1));

  @media (max-width: 480px) {
    top: -1rem;
  }
}
</style>
