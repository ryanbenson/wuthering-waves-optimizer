<template>
  <InventoryEchoEdit ref="inventoryEchoEditRef"></InventoryEchoEdit>
  <div class="py-4">
    <div
      class="echoes__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
      <h3 class="text-sm font-semibold">Inventory</h3>
      <div class="join">
        <button class="btn btn-sm join-item btn-primary" @click="createEcho">
          Add echo
        </button>
        <button
          class="btn btn-sm join-item btn-error"
          :disabled="trashEchoCount === 0"
          v-tooltip="
            'Permanently delete all echoes marked as trash. Locked echoes are skipped.'
          "
          data-test-delete-trash-echoes
          @click="deleteAllTrash">
          Delete trash ({{ trashEchoCount }})
        </button>
      </div>
    </div>

    <div class="echoes__filters mb-6 space-y-3">
      <div
        class="echoes__filters__header flex flex-wrap items-center justify-between gap-4 rounded-lg bg-base-200 p-1 pl-3">
        <h3 class="text-sm font-semibold">
          Filters
          <span
            v-if="activeFilterCount"
            class="badge badge-sm badge-primary ml-2">
            {{ activeFilterCount }}
          </span>
        </h3>
        <div class="join">
          <button
            type="button"
            class="btn btn-sm join-item"
            :disabled="!activeFilterCount"
            @click="resetFilters">
            Clear
          </button>
        </div>

        <!-- Basics: what the echo is -->
        <div class="echoes__filters__row flex flex-wrap items-center gap-2">
          <select
            v-model="costFilter"
            name="cost"
            class="select select-bordered select-sm">
            <option :value="null">Cost</option>
            <option v-for="cost in [4, 3, 1]" :key="cost" :value="cost">
              {{ cost }} Cost
            </option>
          </select>
          <select
            v-model="mainStatFilter"
            name="mainEcho"
            class="select select-bordered select-sm">
            <option :value="null">Main stat</option>
            <option
              v-for="mainStat in allMainStats"
              :key="mainStat"
              :value="mainStat">
              {{ getReadableSubStatLabel(mainStat) }}
            </option>
          </select>
          <select
            v-model="echo"
            name="mainEcho"
            class="select select-bordered select-sm">
            <option :value="null">Echo</option>
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

        <!-- Status flags -->
        <div class="echoes__filters__row flex flex-wrap items-center gap-2">
          <span class="text-xs font-medium opacity-60 mr-1">Status</span>
          <div class="join">
            <button
              type="button"
              class="btn btn-sm btn-ghost join-item"
              :class="{ 'btn-active': favoriteFilter }"
              v-tooltip="'Show only favorite echoes'"
              aria-label="Show favorites only"
              data-test-filter-favorites
              @click="favoriteFilter = !favoriteFilter">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="size-4"
                aria-hidden="true">
                <path
                  v-if="favoriteFilter"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  fill="currentColor" />
                <path
                  v-else
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-ghost join-item"
              :class="{ 'btn-active': lockedFilter }"
              v-tooltip="'Show only locked echoes'"
              aria-label="Show locked only"
              data-test-filter-locked
              @click="lockedFilter = !lockedFilter">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="size-4"
                aria-hidden="true">
                <path
                  d="M144 144c0-44.2 35.8-80 80-80c31.5 0 58.7 18.1 72 44.5c7.6 15.1 26.2 21.2 41.3 13.6s21.2-26.2 13.6-41.3C337.9 31.1 281.5 0 224 0C144.5 0 80 64.5 80 144l0 48L64 192c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64l-16 0-16 0 0-48zm0 96l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80z"
                  fill="currentColor" />
              </svg>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-ghost join-item"
              :class="{ 'btn-active text-error': trashFilter }"
              v-tooltip="'Show only echoes marked as trash'"
              aria-label="Show trash only"
              data-test-filter-trash
              @click="trashFilter = !trashFilter">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="size-4"
                aria-hidden="true">
                <path
                  d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l0 320c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320-64 0 0 48c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-48-96 0 0 48c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-48-64 0z"
                  fill="currentColor" />
              </svg>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-ghost join-item"
              :class="{ 'btn-active text-warning': ignoreFromOptimizerFilter }"
              v-tooltip="'Show only echoes excluded from the optimizer'"
              aria-label="Show ignored from optimizer only"
              data-test-filter-ignore-optimizer
              @click="ignoreFromOptimizerFilter = !ignoreFromOptimizerFilter">
              <EchoOptimizerVisibilityIcon :hidden="ignoreFromOptimizerFilter" />
            </button>
          </div>
        </div>

        <!-- Quality: CV / RV -->
        <div class="echoes__filters__row">
          <EchoCvRvRangeFilters
            v-model:cv-min="cvMin"
            v-model:cv-max="cvMax"
            v-model:rv-min="rvMin"
            v-model:rv-max="rvMax" />
        </div>

        <!-- Sets last -->
        <div class="echoes__filters__row flex flex-wrap items-center gap-2">
          <span class="text-xs font-medium opacity-60 mr-1">Set</span>
          <div
            class="echoes__filters__sets echo-filters__sets flex flex-wrap"
            :class="{ 'echo-filters__sets--active': echoSet !== null }">
            <button
              v-for="setKey in echoSetsList"
              :key="setKey"
              type="button"
              @click="toggleEchoSetFilter(setKey)"
              class="rounded mr-1 p-[.3rem]"
              :class="[setKey, { 'btn-active': isEchoSetFilterActive(setKey) }]">
              <img
                :src="getEchoSetImage(setKey)"
                class="size-7"
                :class="setKey" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="echoes__bulk sticky top-0 z-10 my-4 rounded-box border border-base-300 bg-base-200/95 p-3 backdrop-blur flex flex-wrap items-center gap-2"
      :class="{
        invisible: !hasSelection,
        'pointer-events-none': !hasSelection,
      }"
      :aria-hidden="!hasSelection"
      data-test-bulk-actions>
      <span class="text-sm font-medium mr-1">
        {{ selectedEchoIds.length }} selected
      </span>
      <button
        type="button"
        class="btn btn-sm btn-ghost"
        @click="selectPage"
        data-test-bulk-select-page>
        Select page
      </button>
      <button
        type="button"
        class="btn btn-sm btn-ghost"
        @click="selectAllFiltered"
        data-test-bulk-select-all>
        Select all ({{ echoesList.length }})
      </button>
      <button
        type="button"
        class="btn btn-sm btn-ghost"
        @click="clearSelection"
        data-test-bulk-clear>
        Clear selection
      </button>
      <div class="divider divider-horizontal mx-0 hidden sm:flex"></div>
      <button
        type="button"
        class="btn btn-sm"
        @click="bulkFavorite(true)"
        data-test-bulk-favorite>
        Favorite
      </button>
      <button
        type="button"
        class="btn btn-sm"
        @click="bulkFavorite(false)"
        data-test-bulk-unfavorite>
        Unfavorite
      </button>
      <button
        type="button"
        class="btn btn-sm"
        @click="bulkLock(true)"
        data-test-bulk-lock>
        Lock
      </button>
      <button
        type="button"
        class="btn btn-sm"
        @click="bulkLock(false)"
        data-test-bulk-unlock>
        Unlock
      </button>
      <button
        type="button"
        class="btn btn-sm"
        @click="bulkTrash(true)"
        data-test-bulk-trash>
        Mark trash
      </button>
      <button
        type="button"
        class="btn btn-sm"
        @click="bulkTrash(false)"
        data-test-bulk-untrash>
        Unmark trash
      </button>
      <button
        type="button"
        class="btn btn-sm"
        @click="bulkIgnoreOptimizer(true)"
        data-test-bulk-ignore-optimizer>
        Ignore optimizer
      </button>
      <button
        type="button"
        class="btn btn-sm"
        @click="bulkIgnoreOptimizer(false)"
        data-test-bulk-include-optimizer>
        Include optimizer
      </button>
      <button
        type="button"
        class="btn btn-sm btn-error"
        @click="bulkDelete"
        data-test-bulk-delete>
        Delete
      </button>
    </div>
    <div class="echoes__list">
      <template v-if="!echoesList.length">
        <div class="echoes__list--empty py-12 text-center w-full">
          No echoes found
        </div>
      </template>
      <template v-else>
        <div class="echoes__list__pagination flex justify-center py-4 items-center">
          <div class="join flex-wrap">
            <button @click="prevPage" class="join-item btn btn-sm">«</button>
            <button class="join-item btn btn-sm">
              Page {{ page }} / {{ totalPages }}
            </button>
            <button @click="nextPage" class="join-item btn btn-sm">»</button>
          </div>
          <button
            v-if="false"
            type="button"
            class="btn btn-sm btn-ghost ml-2"
            @click="selectPage"
            data-test-select-page>
            Select page
          </button>
        </div>
        <div
          class="echoes__list__items grid gap-4"
          :class="
            isCompact
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
              : 'grid-cols-1 md:grid-cols-2'
          ">
          <div
            v-for="echoRow in paginatedEchoesList"
            :key="echoRow.echoId"
            class="echo__item-wrap relative"
            :class="{ 'echo__item--selected': isSelected(echoRow.echoId) }">
            <label
              class="echo__item__select absolute top-0 left-0 z-10 flex items-center justify-center rounded-md p-1 cursor-pointer"
              :aria-label="`Select echo ${echoRow.echoId}`">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="isSelected(echoRow.echoId)"
                :data-test-echo-select="echoRow.echoId"
                @change="toggleSelect(echoRow.echoId)" />
            </label>
            <CalculatorEchoCard
              class="echo__item"
              v-bind="echoCardBinder(echoRow)"
              :hide-inventory="true"
              :compact="isCompact">
              <div
                class="echoes__item__foot flex gap-2 justify-between items-center">
                <div class="echoes__items__foot__equipped">
                  <div class="avatar-group -space-x-6 rtl:space-x-reverse">
                    <div class="avatar" v-for="char in getCharsEquipped(echoRow)">
                      <div class="w-12 bg-accent-content">
                        <img :src="getCharImg(char)" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="echoes__item__foot__actions flex gap-2 items-center flex-wrap justify-end">
                  <EchoLockTrashActions :echo-id="echoRow.echoId" />
                  <button
                    @click="handleEditEcho(echoRow.echoId)"
                    class="btn btn-primary btn-sm min-w-16">
                    Edit
                  </button>
                  <button
                    @click="duplicateEcho(echoRow.echoId)"
                    class="btn btn-primary btn-sm min-w-16">
                    Duplicate
                  </button>
                  <span
                    v-tooltip="
                      echoRow.locked
                        ? 'This echo is locked and cannot be deleted'
                        : 'Delete this echo from your inventory'
                    ">
                    <button
                      @click="removeEcho(echoRow.echoId)"
                      class="btn btn-error btn-sm min-w-16"
                      :disabled="echoRow.locked">
                      Delete
                    </button>
                  </span>
                </div>
              </div>
            </CalculatorEchoCard>
          </div>
        </div>
        <div class="join flex justify-center py-4">
          <button @click="prevPage" class="join-item btn btn-sm">«</button>
          <button class="join-item btn btn-sm">
            Page {{ page }} / {{ totalPages }}
          </button>
          <button @click="nextPage" class="join-item btn btn-sm">»</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { mainEchoesData } from "../echoes/index.ts";

type MainEchoRow = (typeof mainEchoesData)[keyof typeof mainEchoesData];
type InventoryEchoRow = {
  echoId: string;
  locked?: boolean;
  trash?: boolean;
  ignoreFromOptimizer?: boolean;
  favorite?: boolean;
  rank?: number;
  type?: string | number | null;
  echoSet?: string | null;
  stat?: string | null;
  echo?: string | null;
  echoSubStatsType1?: string | null;
  echoSubStatsValue1?: unknown;
  echoSubStatsType2?: string | null;
  echoSubStatsValue2?: unknown;
  echoSubStatsType3?: string | null;
  echoSubStatsValue3?: unknown;
  echoSubStatsType4?: string | null;
  echoSubStatsValue4?: unknown;
  echoSubStatsType5?: string | null;
  echoSubStatsValue5?: unknown;
};
import {
  ECHO_CV_MAX,
  ECHO_RV_MAX,
  echoSetLabelMap,
  getEchoCritValue,
  getEchoRollValue,
  getEchoSetIconByType,
  getReadableSubStatLabel,
  statsTable,
} from "../echoes/stats";
import { useInventoryStore } from "../stores/inventory";
import CalculatorEchoCard from "./CalculatorEchoCard.vue";
import EchoCvRvRangeFilters from "./EchoCvRvRangeFilters.vue";
import EchoLockTrashActions from "./EchoLockTrashActions.vue";
import EchoOptimizerVisibilityIcon from "./icons/EchoOptimizerVisibilityIcon.vue";
import InventoryEchoEdit from "./InventoryEchoEdit.vue";
import { randomString } from "../utils/strings";
import { useConfirm } from "../composables/useConfirm";
import { useEchoInventory } from "../composables/useEchoInventory";
import { useToast } from "../composables/useToast";
import { useUiDensity } from "../composables/useUiDensity";

const { confirm } = useConfirm();
const { showToast } = useToast();
const { isCompact } = useUiDensity();
const {
  trashEchoCount,
  getEchoFlags,
  removeEchoFully,
  removeEchoesFully,
  removeAllTrashEchoes,
  bulkSetLocked,
  bulkSetTrash,
  bulkSetIgnoreFromOptimizer,
  bulkSetFavorite,
} = useEchoInventory();

const inventoryEchoEditRef = ref<InstanceType<typeof InventoryEchoEdit> | null>(
  null,
);

const echoSet = ref<string | null>(null);
const echo = ref<string | null>(null);
const costFilter = ref<number | null>(null);
const mainStatFilter = ref<string | null>(null);
const lockedFilter = ref(false);
const trashFilter = ref(false);
const ignoreFromOptimizerFilter = ref(false);
const favoriteFilter = ref(false);
const cvMin = ref(0);
const cvMax = ref(ECHO_CV_MAX);
const rvMin = ref(0);
const rvMax = ref(ECHO_RV_MAX);
const selectedEchoIds = ref<string[]>([]);
const hasSelection = computed(() => selectedEchoIds.value.length > 0);
const activeFilterCount = computed(() => {
  let count = 0;
  if (echoSet.value) count += 1;
  if (echo.value) count += 1;
  if (costFilter.value) count += 1;
  if (mainStatFilter.value) count += 1;
  if (lockedFilter.value) count += 1;
  if (trashFilter.value) count += 1;
  if (ignoreFromOptimizerFilter.value) count += 1;
  if (favoriteFilter.value) count += 1;
  if (cvMin.value > 0 || cvMax.value < ECHO_CV_MAX) count += 1;
  if (rvMin.value > 0 || rvMax.value < ECHO_RV_MAX) count += 1;
  return count;
});
const page = ref(1);
const perPage = 20;

const inventoryStore = useInventoryStore();
const { echoes } = storeToRefs(inventoryStore);
const { getEchoEquippedChars, saveEcho, getEchoById } = inventoryStore;

watch(
  [
    mainStatFilter,
    echoSet,
    echo,
    costFilter,
    lockedFilter,
    trashFilter,
    ignoreFromOptimizerFilter,
    favoriteFilter,
    cvMin,
    cvMax,
    rvMin,
    rvMax,
  ],
  () => {
    page.value = 1;
  },
);

const echoSetsList = computed(() => Object.keys(echoSetLabelMap));

const echoesList = computed(() => {
  let allEchoes = (echoes.value ?? []) as InventoryEchoRow[];
  if (allEchoes.length <= 0) {
    return allEchoes;
  }
  if (echoSet.value) {
    allEchoes = allEchoes.filter((e) => e.echoSet === echoSet.value);
  }
  if (echo.value) {
    allEchoes = allEchoes.filter((e) => e.echo === echo.value);
  }
  if (costFilter.value) {
    allEchoes = allEchoes.filter((e) => e.type === costFilter.value);
  }
  if (mainStatFilter.value) {
    allEchoes = allEchoes.filter((e) => e.stat === mainStatFilter.value);
  }
  if (lockedFilter.value) {
    allEchoes = allEchoes.filter((e) => e.locked);
  }
  if (trashFilter.value) {
    allEchoes = allEchoes.filter((e) => e.trash);
  }
  if (ignoreFromOptimizerFilter.value) {
    allEchoes = allEchoes.filter((e) => e.ignoreFromOptimizer);
  }
  if (favoriteFilter.value) {
    allEchoes = allEchoes.filter((e) => e.favorite);
  }
  const cvFilterActive = cvMin.value > 0 || cvMax.value < ECHO_CV_MAX;
  const rvFilterActive = rvMin.value > 0 || rvMax.value < ECHO_RV_MAX;
  if (cvFilterActive || rvFilterActive) {
    allEchoes = allEchoes.filter((e) => {
      if (cvFilterActive) {
        const cv = getEchoCritValue(e);
        if (cv < cvMin.value || cv > cvMax.value) return false;
      }
      if (rvFilterActive) {
        const rv = getEchoRollValue(e);
        if (rv < rvMin.value || rv > rvMax.value) return false;
      }
      return true;
    });
  }
  return allEchoes;
});

const paginatedEchoesList = computed(() => {
  const start = (page.value - 1) * perPage;
  const end = page.value * perPage;
  return echoesList.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(echoesList.value.length / perPage),
);

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

const allMainStats = computed(() => {
  const fourSlotOptions = Object.keys(statsTable["4"]);
  const threeSlotOptions = Object.keys(statsTable["3"]);
  const oneSlotOptions = Object.keys(statsTable["1"]);
  const allOptions = [
    ...fourSlotOptions,
    ...threeSlotOptions,
    ...oneSlotOptions,
  ];
  return [...new Set(allOptions)];
});

function echoCardBinder(e: InventoryEchoRow) {
  const str = (v: unknown) => (v == null ? "" : String(v));
  const numish = (v: unknown): number | string =>
    v == null ? 0 : (v as number | string);
  return {
    rank: e.rank ?? 5,
    type: str(e.type),
    echoId: e.echoId,
    echoSet: str(e.echoSet),
    stat: str(e.stat),
    echo: str(e.echo),
    echoSubStatsType1: str(e.echoSubStatsType1),
    echoSubStatsValue1: numish(e.echoSubStatsValue1),
    echoSubStatsType2: str(e.echoSubStatsType2),
    echoSubStatsValue2: numish(e.echoSubStatsValue2),
    echoSubStatsType3: str(e.echoSubStatsType3),
    echoSubStatsValue3: numish(e.echoSubStatsValue3),
    echoSubStatsType4: str(e.echoSubStatsType4),
    echoSubStatsValue4: numish(e.echoSubStatsValue4),
    echoSubStatsType5: str(e.echoSubStatsType5),
    echoSubStatsValue5: numish(e.echoSubStatsValue5),
  };
}

function handleEditEcho(echoId: string) {
  inventoryEchoEditRef.value?.setEchoId(echoId);
  inventoryEchoEditRef.value?.handleOpenModal();
}

function getEchoSetImage(set: string) {
  return getEchoSetIconByType(set);
}

function toggleEchoSetFilter(set: string) {
  if (echoSet.value === set) {
    echoSet.value = null;
  } else {
    echoSet.value = set;
  }
}

function isEchoSetFilterActive(set: string) {
  return echoSet.value === set;
}

function resetFilters() {
  echoSet.value = null;
  echo.value = null;
  mainStatFilter.value = null;
  costFilter.value = null;
  lockedFilter.value = false;
  trashFilter.value = false;
  ignoreFromOptimizerFilter.value = false;
  favoriteFilter.value = false;
  cvMin.value = 0;
  cvMax.value = ECHO_CV_MAX;
  rvMin.value = 0;
  rvMax.value = ECHO_RV_MAX;
}

function isSelected(echoId: string) {
  return selectedEchoIds.value.includes(echoId);
}

function toggleSelect(echoId: string) {
  if (isSelected(echoId)) {
    selectedEchoIds.value = selectedEchoIds.value.filter((id) => id !== echoId);
  } else {
    selectedEchoIds.value = [...selectedEchoIds.value, echoId];
  }
}

function clearSelection() {
  selectedEchoIds.value = [];
}

function selectPage() {
  const pageIds = paginatedEchoesList.value.map((e) => e.echoId);
  selectedEchoIds.value = [
    ...new Set([...selectedEchoIds.value, ...pageIds]),
  ];
}

function selectAllFiltered() {
  selectedEchoIds.value = echoesList.value.map((e) => e.echoId);
}

function bulkFavorite(favorite: boolean) {
  bulkSetFavorite(selectedEchoIds.value, favorite);
  showToast(
    favorite
      ? `Favorited ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"}.`
      : `Unfavorited ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"}.`,
    "success",
  );
}

function bulkLock(locked: boolean) {
  bulkSetLocked(selectedEchoIds.value, locked);
  showToast(
    locked
      ? `Locked ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"}.`
      : `Unlocked ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"}.`,
    "success",
  );
}

function bulkTrash(trash: boolean) {
  bulkSetTrash(selectedEchoIds.value, trash);
  showToast(
    trash
      ? `Marked ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"} as trash.`
      : `Unmarked ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"} as trash.`,
    "success",
  );
}

function bulkIgnoreOptimizer(ignore: boolean) {
  bulkSetIgnoreFromOptimizer(selectedEchoIds.value, ignore);
  showToast(
    ignore
      ? `Excluded ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"} from optimizer.`
      : `Included ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"} in optimizer.`,
    "success",
  );
}

async function bulkDelete() {
  const ids = [...selectedEchoIds.value];
  if (!ids.length) return;

  const lockedCount = ids.filter((id) => getEchoFlags(id).locked).length;
  const deletableCount = ids.length - lockedCount;
  if (deletableCount <= 0) {
    showToast("All selected echoes are locked and cannot be deleted.", "warning");
    return;
  }

  const lockedNote =
    lockedCount > 0
      ? ` ${lockedCount} locked echo${lockedCount === 1 ? "" : "es"} will be skipped.`
      : "";
  const confirmed = await confirm(
    `Delete ${deletableCount} echo${deletableCount === 1 ? "" : "es"}? This cannot be undone.${lockedNote}`,
    {
      title: "Delete selected echoes",
      confirmLabel: "Delete",
      variant: "error",
    },
  );
  if (!confirmed) return;

  const { deleted, skippedLocked } = await removeEchoesFully(ids);
  clearSelection();
  if (deleted > 0) {
    showToast(
      `Deleted ${deleted} echo${deleted === 1 ? "" : "es"}${
        skippedLocked
          ? ` (${skippedLocked} locked skipped)`
          : ""
      }.`,
      "success",
    );
  } else if (skippedLocked > 0) {
    showToast("No echoes deleted; all selected were locked.", "warning");
  }
}

function prevPage() {
  if (page.value <= 1) {
    page.value = 1;
  } else {
    page.value--;
  }
}

function nextPage() {
  if (page.value >= totalPages.value) {
    page.value = totalPages.value;
  } else {
    page.value++;
  }
}

function getCharsEquipped(e: { echoId: string }) {
  return getEchoEquippedChars(e.echoId);
}

function getCharImg(character: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${character}.png`;
}

async function removeEcho(echoId: string) {
  const { locked } = getEchoFlags(echoId);
  if (locked) {
    showToast("This echo is locked and cannot be deleted.", "warning");
    return;
  }

  const confirmed = await confirm("Do you really want to delete this echo?", {
    title: "Delete echo",
    confirmLabel: "Delete",
    variant: "error",
  });
  if (!confirmed) return;

  await removeEchoFully(echoId);
  selectedEchoIds.value = selectedEchoIds.value.filter((id) => id !== echoId);
}

async function deleteAllTrash() {
  const count = trashEchoCount.value;
  if (count <= 0) return;

  const confirmed = await confirm(
    `Delete ${count} echo${count === 1 ? "" : "es"} marked as trash? This cannot be undone.`,
    {
      title: "Delete trash echoes",
      confirmLabel: "Delete all",
      variant: "error",
    },
  );
  if (!confirmed) return;

  const deletedCount = await removeAllTrashEchoes();
  if (deletedCount > 0) {
    clearSelection();
    showToast(
      `Deleted ${deletedCount} trash echo${deletedCount === 1 ? "" : "es"}.`,
      "success",
    );
  }
}

async function duplicateEcho(sourceEchoId: string) {
  const source = getEchoById(sourceEchoId);
  if (!source) return;

  const echoId = randomString();
  await saveEcho({
    ...source,
    echoId,
    locked: false,
    trash: false,
    ignoreFromOptimizer: false,
    favorite: false,
  });
}

async function createEcho() {
  const echoId = randomString();
  const echoData = {
    echo: null,
    type: null,
    rank: 5,
    stat: null,
    echoId,
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
  await saveEcho(echoData);
  handleEditEcho(echoId);
}
</script>

<style lang="scss" scoped>
html[data-theme="light"] {
  .modal-backdrop {
    opacity: 0.5;
  }
}
.echo-filters__sets--active {
  button {
    opacity: 0.6;
  }
  button.btn-active {
    opacity: 1;
  }
}
.echo__item--selected {
  outline: 2px solid oklch(var(--p));
  outline-offset: 2px;
  border-radius: var(--rounded-box, 1rem);
}
</style>
