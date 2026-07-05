<template>
  <InventoryEchoEdit ref="inventoryEchoEditRef"></InventoryEchoEdit>
  <div class="py-4">
    <div class="echoes__filters flex flex-wrap align-center gap-2 mb-6">
      <select
        v-model="mainStatFilter"
        name="mainEcho"
        class="select select-bordered select select-sm">
        <option :value="null">Select a main stat</option>
        <option
          v-for="mainStat in allMainStats"
          :key="mainStat"
          :value="mainStat">
          {{ getReadableSubStatLabel(mainStat) }}
        </option>
      </select>
      <select
        v-model="costFilter"
        name="cost"
        class="select select-bordered select select-sm">
        <option :value="null">Select a cost</option>
        <option v-for="cost in [4, 3, 1]" :key="cost" :value="cost">
          {{ cost }} Cost
        </option>
      </select>
      <select
        v-model="echo"
        name="mainEcho"
        class="select select-bordered select select-sm mr-4">
        <option :value="null">Select an echo</option>
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
      <div
        class="echoes__filters__sets echo-filters__sets"
        :class="{ 'echo-filters__sets--active': echoSet !== null }">
        <button
          v-for="echoSet in echoSetsList"
          :key="echoSet"
          @click="toggleEchoSetFilter(echoSet)"
          class="rounded mr-1 p-[.3rem]"
          :class="{ 'btn-active': isEchoSetFilterActive(echoSet), echoSet }">
          <img
            :src="getEchoSetImage(echoSet)"
            class="size-7"
            :class="echoSet" />
        </button>
      </div>
      <button
        type="button"
        class="btn btn-sm btn-ghost btn-square"
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
        class="btn btn-sm btn-ghost btn-square"
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
        class="btn btn-sm btn-ghost btn-square"
        :class="{ 'btn-active text-warning': ignoreFromOptimizerFilter }"
        v-tooltip="'Show only echoes excluded from the optimizer'"
        aria-label="Show ignored from optimizer only"
        data-test-filter-ignore-optimizer
        @click="ignoreFromOptimizerFilter = !ignoreFromOptimizerFilter">
        <EchoOptimizerVisibilityIcon :hidden="ignoreFromOptimizerFilter" />
      </button>
      <button @click="resetFilters" class="btn btn-sm btn-ghost">Clear</button>
    </div>
    <div class="echoes__actions flex justify-center items-center gap-2 flex-wrap">
      <button @click="createEcho" class="btn btn-primary btn-wide">
        Add echo
      </button>
      <button
        @click="deleteAllTrash"
        class="btn btn-error"
        :disabled="trashEchoCount === 0"
        v-tooltip="
          'Permanently delete all echoes marked as trash. Locked echoes are skipped.'
        "
        data-test-delete-trash-echoes>
        Delete trash ({{ trashEchoCount }})
      </button>
    </div>
    <div class="echoes__list">
      <template v-if="!echoesList.length">
        <div class="echoes__list--empty py-12 text-center w-full">
          No echoes found
        </div>
      </template>
      <template v-else>
        <div class="join flex justify-center py-4">
          <button @click="prevPage" class="join-item btn btn-sm">«</button>
          <button class="join-item btn btn-sm">
            Page {{ page }} / {{ totalPages }}
          </button>
          <button @click="nextPage" class="join-item btn btn-sm">»</button>
        </div>
        <div class="echoes__list__items grid grid-cols-1 md:grid-cols-2 gap-4">
          <CalculatorEchoCard
            v-for="echoRow in paginatedEchoesList"
            class="echo__item"
            :key="echoRow.echoId"
            v-bind="echoCardBinder(echoRow)"
            :hide-inventory="true">
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
  echoSetLabelMap,
  getEchoSetIconByType,
  getReadableSubStatLabel,
  statsTable,
} from "../echoes/stats";
import { useInventoryStore } from "../stores/inventory";
import CalculatorEchoCard from "./CalculatorEchoCard.vue";
import EchoLockTrashActions from "./EchoLockTrashActions.vue";
import EchoOptimizerVisibilityIcon from "./icons/EchoOptimizerVisibilityIcon.vue";
import InventoryEchoEdit from "./InventoryEchoEdit.vue";
import { randomString } from "../utils/strings";
import { useConfirm } from "../composables/useConfirm";
import { useEchoInventory } from "../composables/useEchoInventory";
import { useToast } from "../composables/useToast";

const { confirm } = useConfirm();
const { showToast } = useToast();
const {
  trashEchoCount,
  getEchoFlags,
  removeEchoFully,
  removeAllTrashEchoes,
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
const page = ref(1);
const perPage = 20;

const inventoryStore = useInventoryStore();
const { echoes } = storeToRefs(inventoryStore);
const { getEchoEquippedChars, saveEcho, getEchoById } = inventoryStore;

watch([mainStatFilter, echoSet, echo, lockedFilter, trashFilter, ignoreFromOptimizerFilter], () => {
  page.value = 1;
});

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
</style>
