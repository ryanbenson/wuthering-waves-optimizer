<template>
  <dialog id="modal-echoes-browser" class="modal">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div v-if="isOpen" class="modal-box max-w-5xl">
      <form method="dialog" @click="handleClose">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
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
              <select
                v-model="equippedFilter"
                name="equippedFilter"
                class="select select-bordered select-sm">
                <option :value="null">Show all</option>
                <option value="self">Hide equipped by {{ character }}</option>
                <option value="any">Hide equipped by anyone</option>
              </select>
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
              </div>
            </div>

            <div class="echoes__filters__row">
              <EchoCvRvRangeFilters
                v-model:cv-min="cvMin"
                v-model:cv-max="cvMax"
                v-model:rv-min="rvMin"
                v-model:rv-max="rvMax" />
            </div>

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
              class="echoes__list__items grid gap-4"
              :class="
                isCompact
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  : 'grid-cols-1 md:grid-cols-2'
              ">
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
                :echo-sub-stats-value-5="echo.echoSubStatsValue5"
                :compact="isCompact">
                <div
                  class="echoes__item__foot flex gap-2 justify-between items-center">
                  <div class="echoes__items__foot__equipped">
                    <div class="avatar-group -space-x-6 rtl:space-x-reverse">
                      <div
                        class="avatar"
                        v-for="char in getCharsEquipped(echo)"
                        :key="char">
                        <div class="w-12 bg-accent-content">
                          <img :src="getCharImg(char)" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="echoes__item__foot__actions flex gap-2">
                    <button
                      @click="assignEcho(echo.echoId)"
                      class="btn btn-primary btn-sm">
                      Use echo
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
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { mainEchoesData } from "../echoes/index.ts";
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
import { useCharacterStore } from "../stores/character";
import CalculatorEchoCard from "./CalculatorEchoCard.vue";
import EchoCvRvRangeFilters from "./EchoCvRvRangeFilters.vue";
import { useToast } from "../composables/useToast";
import { useUiDensity } from "../composables/useUiDensity";

const { showToast } = useToast();
const { isCompact } = useUiDensity();
const props = defineProps<{ character: string }>();
const emit = defineEmits<{ "chosen-echo-inventory": [] }>();

const inventoryStore = useInventoryStore();
const characterStore = useCharacterStore();
const { echoes, echoIdsEquippedByAnyChars } = storeToRefs(inventoryStore);
const { getEchoEquippedChars } = inventoryStore;
const { characters } = storeToRefs(characterStore);

const echoIndex = ref<number | null>(null);
const costFilter = ref<number | null>(null);
const echoSet = ref<string | null>(null);
const echo = ref<string | null>(null);
const equippedFilter = ref<"self" | "any" | null>(null);
const mainStatFilter = ref<string | null>(null);
const favoriteFilter = ref(false);
const cvMin = ref(0);
const cvMax = ref(ECHO_CV_MAX);
const rvMin = ref(0);
const rvMax = ref(ECHO_RV_MAX);
const page = ref(1);
const perPage = 20;
const isOpen = ref(false);

const activeFilterCount = computed(() => {
  let count = 0;
  if (echoSet.value) count += 1;
  if (echo.value) count += 1;
  if (costFilter.value) count += 1;
  if (mainStatFilter.value) count += 1;
  if (equippedFilter.value) count += 1;
  if (favoriteFilter.value) count += 1;
  if (cvMin.value > 0 || cvMax.value < ECHO_CV_MAX) count += 1;
  if (rvMin.value > 0 || rvMax.value < ECHO_RV_MAX) count += 1;
  return count;
});

watch(
  [
    mainStatFilter,
    echoSet,
    echo,
    favoriteFilter,
    equippedFilter,
    costFilter,
    cvMin,
    cvMax,
    rvMin,
    rvMax,
  ],
  () => {
    page.value = 1;
  },
);

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
      if (favoriteFilter.value) {
        allEchoes = allEchoes.filter((item: any) => item.favorite);
      }

      const cvFilterActive = cvMin.value > 0 || cvMax.value < ECHO_CV_MAX;
      const rvFilterActive = rvMin.value > 0 || rvMax.value < ECHO_RV_MAX;
      if (cvFilterActive || rvFilterActive) {
        allEchoes = allEchoes.filter((item: any) => {
          if (cvFilterActive) {
            const cv = getEchoCritValue(item);
            if (cv < cvMin.value || cv > cvMax.value) return false;
          }
          if (rvFilterActive) {
            const rv = getEchoRollValue(item);
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

async function triggerOpenModal(index: number) {
      echoIndex.value = index;
      isOpen.value = true;
      await nextTick();
      const modalEl = document.getElementById("modal-echoes-browser");
      (modalEl as HTMLDialogElement | null)?.showModal();
    }
function triggerCloseModal() {
      const modalEl = document.getElementById("modal-echoes-browser");
      (modalEl as HTMLDialogElement | null)?.close();
      isOpen.value = false;
    }
function handleClose() {
      // Must close the <dialog> itself — only clearing isOpen removes the
      // modal-box (and its method="dialog" form) while leaving the backdrop open.
      triggerCloseModal();
    }
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
        showToast("Echo is already being used.", "warning");
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
      favoriteFilter.value = false;
      cvMin.value = 0;
      cvMax.value = ECHO_CV_MAX;
      rvMin.value = 0;
      rvMax.value = ECHO_RV_MAX;
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
