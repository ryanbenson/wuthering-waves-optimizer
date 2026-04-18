<template>
  <dialog id="modal-echoes-browser" class="modal">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div class="modal-box max-w-5xl">
      <form method="dialog" @click="handleClose">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
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
            class="select select-bordered select select-sm">
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
          <select
            v-model="equippedFilter"
            name="equippedFilter"
            class="select select-bordered select select-sm mr-4">
            <option :value="null">Show all</option>
            <option value="self">Hide equipped by {{ character }}</option>
            <option value="any">Hide equipped by anyone</option>
          </select>
          <div
            class="echoes__filters__sets echo-filters__sets"
            :class="{ 'echo-filters__sets--active': echoSet !== null }">
            <button
              v-for="echoSet in echoSetsList"
              :key="echoSet"
              @click="toggleEchoSetFilter(echoSet)"
              class="rounded mr-1 p-[.3rem]"
              :class="{
                'btn-active': isEchoSetFilterActive(echoSet),
                echoSet,
              }">
              <img
                :src="getEchoSetImage(echoSet)"
                class="size-7"
                :class="echoSet" />
            </button>
          </div>
          <button @click="resetFilters" class="btn btn-sm btn-ghost">
            Clear
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
            <div
              class="echoes__list__items grid grid-cols-1 md:grid-cols-2 gap-4">
              <CalculatorEchoCard
                v-for="echo in paginatedEchoesList"
                class="echo__item"
                :key="echo.echoId"
                :rank="echo.rank"
                :type="echo.type"
                :echo-id="echo.echoId"
                :echo-set="echo.echoSet"
                :stat="echo.stat"
                :echo="echo.echo"
                :echo-sub-stats-type-1="echo.echoSubStatsType1"
                :echo-sub-stats-value-1="echo.echoSubStatsValue1"
                :echo-sub-stats-type-2="echo.echoSubStatsType2"
                :echo-sub-stats-value-2="echo.echoSubStatsValue2"
                :echo-sub-stats-type-3="echo.echoSubStatsType3"
                :echo-sub-stats-value-3="echo.echoSubStatsValue3"
                :echo-sub-stats-type-4="echo.echoSubStatsType4"
                :echo-sub-stats-value-4="echo.echoSubStatsValue4"
                :echo-sub-stats-type-5="echo.echoSubStatsType5"
                :echo-sub-stats-value-5="echo.echoSubStatsValue5">
                <button
                  @click="assignEcho(echo.echoId)"
                  class="btn btn-primary btn-sm">
                  Use echo
                </button>
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
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { mainEchoesData } from "../echoes/index.ts";
import {
  echoSetLabelMap,
  getEchoSetIconByType,
  getReadableSubStatLabel,
  statsTable,
} from "../echoes/stats";
import { useInventoryStore } from "../stores/inventory";
import { useCharacterStore } from "../stores/character";
import CalculatorEchoCard from "./CalculatorEchoCard.vue";
const props = defineProps<{ character: string }>();
const emit = defineEmits<{ "chosen-echo-inventory": [] }>();

const inventoryStore = useInventoryStore();
const characterStore = useCharacterStore();
const { echoes, echoIdsEquippedByAnyChars } = storeToRefs(inventoryStore);
const { characters } = storeToRefs(characterStore);

const echoIndex = ref<number | null>(null);
const costFilter = ref<number | null>(null);
const echoSet = ref<string | null>(null);
const echo = ref<string | null>(null);
const equippedFilter = ref<"self" | "any" | null>(null);
const mainStatFilter = ref<string | null>(null);
const page = ref(1);
const perPage = 20;

watch([mainStatFilter, echoSet, echo], () => {
  page.value = 1;
});

const currentCharacter = computed(
  () => (characters.value?.[props.character] as Record<string, any>) ?? {},
);
const currentCharacterEchoes = computed(() => currentCharacter.value?.echoes ?? {});
const echoSetsList = computed(() => Object.keys(echoSetLabelMap));
const echoesList = computed(() => {
      let allEchoes = echoes.value ?? [];
      // don't bother filtering if there are none
      if (allEchoes.length <= 0) {
        return allEchoes;
      }
      // filter by type if set
      if (echoSet.value) {
        allEchoes = allEchoes.filter((item: any) => item.echoSet === echoSet.value);
      }
      // filter by main echo if set
      if (echo.value) {
        allEchoes = allEchoes.filter((item: any) => item.echo === echo.value);
      }
      if (costFilter.value) {
        allEchoes = allEchoes.filter((item: any) => item.type === costFilter.value);
      }
      if (mainStatFilter.value) {
        allEchoes = allEchoes.filter(
          (item: any) => item.stat === mainStatFilter.value,
        );
      }
      if (equippedFilter.value) {
        if (equippedFilter.value === "self") {
          const equippedEchoIds = inventoryStore.echoIdsEquippedByChar(props.character);
          allEchoes = allEchoes.filter((item: any) => !equippedEchoIds.includes(item.echoId));
        }
        if (equippedFilter.value === "any") {
          const equippedEchoIds = echoIdsEquippedByAnyChars.value;
          allEchoes = allEchoes.filter((item: any) => !equippedEchoIds.includes(item.echoId));
        }
      }

      return allEchoes;
    });
const paginatedEchoesList = computed(() => {
  const start = (page.value - 1) * perPage;
  const end = page.value * perPage;
  return echoesList.value.slice(start, end);
});
const totalPages = computed(() =>
  Math.max(1, Math.ceil(echoesList.value.length / perPage)),
);
const mainEchoOptions = computed(() => {
      const echoes = {
        Calamity: [] as any[],
        Overlord: [] as any[],
        Elite: [] as any[],
        Common: [] as any[],
      };
      const mainEchoValues = Object.values(mainEchoesData);
      mainEchoValues.forEach((echo) => {
        const echoClass = (echo as any)?.class as keyof typeof echoes | undefined;
        if (echoClass && echoes[echoClass]) {
          echoes[echoClass].push(echo);
        }
      });
      return echoes;
    });
const allMainStats = computed(() => {
      const fourSlotOptions = Object.keys((statsTable as any)["4"]);
      const threeSlotOptions = Object.keys((statsTable as any)["3"]);
      const oneSlotOptions = Object.keys((statsTable as any)["1"]);
      const allOptions = [
        ...fourSlotOptions,
        ...threeSlotOptions,
        ...oneSlotOptions,
      ];
      return [...new Set(allOptions)];
    });

function triggerOpenModal(index: number) {
      echoIndex.value = index;
      const modalEl = document.getElementById("modal-echoes-browser");
      (modalEl as HTMLDialogElement | null)?.showModal();
    }
function triggerCloseModal() {
      const modalEl = document.getElementById("modal-echoes-browser");
      (modalEl as HTMLDialogElement | null)?.close();
    }
function handleClose() {}
function getEchoSetImage(type: string) {
      return getEchoSetIconByType(type);
    }
function toggleEchoSetFilter(type: string) {
      if (echoSet.value === type) {
        echoSet.value = null;
      } else {
        echoSet.value = type;
      }
    }
function isEchoSetFilterActive(type: string) {
      return echoSet.value === type;
    }
async function assignEcho(echoId: string) {
      const isUsed = isEchoUsedByChar(echoId);
      if (isUsed) {
        alert("Echo is already being used.");
        return;
      }
      const chosenEcho = inventoryStore.getEchoById(echoId);
      if (!chosenEcho) {
        console.error("Could not find echo", echoId);
        return;
      }
      await characterStore.removeCharacterEcho(props.character, echoIndex.value);
      const echoData = {
        echo: null,
        type: null,
        rank: null,
        stat: null,
        echoId: chosenEcho.echoId,
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
      (data.echoes as any)[echoIndex.value as number] = echoData;
      await characterStore.setCharacterData(props.character, data);
      const equippedData = {};
      (equippedData as any)[props.character] = echoIndex.value;
      await inventoryStore.setEquippedData(echoId, equippedData);
      triggerCloseModal();
      emit("chosen-echo-inventory");
    }
function resetFilters() {
      echoSet.value = null;
      echo.value = null;
      mainStatFilter.value = null;
      costFilter.value = null;
      equippedFilter.value = null;
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
function isEchoUsedByChar(echoId: string) {
      if (currentCharacterEchoes.value?.[0]?.echoId === echoId) {
        return true;
      }
      if (currentCharacterEchoes.value?.[1]?.echoId === echoId) {
        return true;
      }
      if (currentCharacterEchoes.value?.[2]?.echoId === echoId) {
        return true;
      }
      if (currentCharacterEchoes.value?.[3]?.echoId === echoId) {
        return true;
      }
      if (currentCharacterEchoes.value?.[4]?.echoId === echoId) {
        return true;
      }
      return false;
    }

defineExpose({
  triggerOpenModal,
  triggerCloseModal,
});
</script>

<style lang="scss" scoped>
html[data-theme="light"] {
  .modal-backdrop {
    opacity: 0.5;
  }
  .MoonlitClouds {
    filter: contrast(0);
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
