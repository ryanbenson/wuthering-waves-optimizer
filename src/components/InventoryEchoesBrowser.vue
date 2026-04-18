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
      <button @click="resetFilters" class="btn btn-sm btn-ghost">Clear</button>
    </div>
    <div class="echoes__actions flex justify-center items-center">
      <button @click="createEcho" class="btn btn-primary btn-wide">
        Add echo
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
              <div class="echoes__item__foot__actions flex gap-2">
                <button
                  @click="handleEditEcho(echoRow.echoId)"
                  class="btn btn-primary btn-sm min-w-16">
                  Edit
                </button>
                <button
                  @click="removeEcho(echoRow.echoId)"
                  class="btn btn-error btn-sm min-w-16">
                  Delete
                </button>
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
import { useCharacterStore } from "../stores/character";
import CalculatorEchoCard from "./CalculatorEchoCard.vue";
import InventoryEchoEdit from "./InventoryEchoEdit.vue";
import { randomString } from "../utils/strings";

const inventoryEchoEditRef = ref<InstanceType<typeof InventoryEchoEdit> | null>(
  null,
);

const echoSet = ref<string | null>(null);
const echo = ref<string | null>(null);
const costFilter = ref<number | null>(null);
const mainStatFilter = ref<string | null>(null);
const page = ref(1);
const perPage = 20;

const inventoryStore = useInventoryStore();
const characterStore = useCharacterStore();
const { echoes } = storeToRefs(inventoryStore);
const {
  getEchoEquippedChars,
  deleteEcho,
  deleteEchoEquippedMapping,
  saveEcho,
  getEquippedEchoData,
} = inventoryStore;
const { removeCharacterEcho } = characterStore;

watch([mainStatFilter, echoSet, echo], () => {
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
  if (window.confirm("Do you really want to delete this echo?")) {
    await deleteEcho(echoId);
    await deleteEchoEquippedMapping(echoId);
    const equippedCharsData = getEquippedEchoData(echoId);
    const equippedChars = Object.entries(equippedCharsData);
    for (const equippedChar of equippedChars) {
      const [character, index] = equippedChar;
      await removeCharacterEcho(character, Number(index));
    }
  }
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
