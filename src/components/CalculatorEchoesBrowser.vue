<template>
  <dialog id="modal-echoes-browser" class="modal">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div v-if="isOpen" class="modal-box max-w-5xl min-h-[37.5rem]">
      <form method="dialog" @click="handleClose">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <AppFilterPanel
          panel-key="calculator-echoes"
          class="mb-6"
          :active-count="activeFilterCount"
          :clear-disabled="!activeFilterCount"
          @clear="resetFilters">
          <div class="echoes__filters__row flex flex-wrap items-center gap-2">
            <AppRichSelect
              v-model="costFilter"
              :options="costFilterOptions"
              allow-empty
              empty-label="Cost"
              aria-label="Cost filter"
              class="w-fit min-w-[150px]" />
            <AppRichSelect
              v-model="mainStatFilter"
              :options="mainStatFilterOptions"
              allow-empty
              empty-label="Main stat"
              aria-label="Main stat filter"
              class="w-fit min-w-[150px]" />
            <AppRichSelect
              v-model="echo"
              :options="echoSelectOptions"
              searchable
              allow-empty
              empty-label="Echo"
              aria-label="Echo filter"
              class="w-fit min-w-[200px]" />
            <AppRichSelect
              v-model="equippedFilter"
              :options="equippedFilterOptions"
              allow-empty
              empty-label="Show all"
              aria-label="Equipped filter"
              class="w-fit" />
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

          <div class="echoes__filters__row flex flex-wrap gap-6 w-full">
            <EchoCvRvRangeFilters
              v-model:cv-min="cvMin"
              v-model:cv-max="cvMax"
              v-model:rv-min="rvMin"
              v-model:rv-max="rvMax" />
            <EchoRatingRangeFilters
              v-model:rating-min="ratingMin"
              v-model:rating-max="ratingMax" />
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
        </AppFilterPanel>

        <div class="echoes__list">
          <template v-if="!echoesList.length">
            <div class="echoes__list--empty py-12 text-center w-full">
              No echoes found
            </div>
          </template>
          <template v-else>
            <div class="echoes__list__pagination flex justify-center py-4">
              <PaginationControls v-model="page" :total-pages="totalPages" />
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
                :character-id="props.character"
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
            <div class="echoes__list__pagination flex justify-center py-4">
              <PaginationControls v-model="page" :total-pages="totalPages" />
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
import { useSettingsStore } from "../stores/settings";
import { getEchoRatingGrade } from "../echoes/rating";
import CalculatorEchoCard from "./CalculatorEchoCard.vue";
import EchoCvRvRangeFilters from "./EchoCvRvRangeFilters.vue";
import EchoRatingRangeFilters from "./EchoRatingRangeFilters.vue";
import PaginationControls from "./PaginationControls.vue";
import AppRichSelect, {
  type AppRichSelectOption,
} from "./AppRichSelect.vue";
import AppFilterPanel from "./AppFilterPanel.vue";
import {
  buildEchoSelectOptions,
  buildSimpleSelectOptions,
} from "../utils/richSelectOptions";
import { useToast } from "../composables/useToast";
import { useUiDensity } from "../composables/useUiDensity";
import { useEchoSlotAssignment } from "../composables/useEchoSlotAssignment";

const { showToast } = useToast();
const { isCompact } = useUiDensity();
const props = defineProps<{ character: string }>();
const emit = defineEmits<{ "chosen-echo-inventory": [] }>();

const inventoryStore = useInventoryStore();
const settingsStore = useSettingsStore();
const { assignEchoToCharacterSlot } = useEchoSlotAssignment();
const { echoes, echoIdsEquippedByAnyChars } = storeToRefs(inventoryStore);
const { getEchoEquippedChars } = inventoryStore;

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
// Matches the 0-100% shown on the Echo Rating badge itself.
const RATING_PERCENT_MIN = 0;
const RATING_PERCENT_MAX = 100;
const ratingMin = ref(RATING_PERCENT_MIN);
const ratingMax = ref(RATING_PERCENT_MAX);
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
  if (ratingMin.value > RATING_PERCENT_MIN || ratingMax.value < RATING_PERCENT_MAX) count += 1;
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
    ratingMin,
    ratingMax,
  ],
  () => {
    page.value = 1;
  },
);

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
      const ratingFilterActive =
        ratingMin.value > RATING_PERCENT_MIN || ratingMax.value < RATING_PERCENT_MAX;
      if (cvFilterActive || rvFilterActive || ratingFilterActive) {
        allEchoes = allEchoes.filter((item: any) => {
          if (cvFilterActive) {
            const cv = getEchoCritValue(item);
            if (cv < cvMin.value || cv > cvMax.value) return false;
          }
          if (rvFilterActive) {
            const rv = getEchoRollValue(item);
            if (rv < rvMin.value || rv > rvMax.value) return false;
          }
          if (ratingFilterActive) {
            const { percent } = getEchoRatingGrade(item, settingsStore.echoRatingWeights);
            if (percent < ratingMin.value || percent > ratingMax.value) return false;
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
const costFilterOptions = buildSimpleSelectOptions(
  [4, 3, 1],
  (cost) => `${cost} Cost`,
);
const mainStatFilterOptions = computed((): AppRichSelectOption[] =>
  buildSimpleSelectOptions(allMainStats.value, (stat) =>
    getReadableSubStatLabel(String(stat)),
  ),
);
const echoSelectOptions = computed((): AppRichSelectOption[] =>
  buildEchoSelectOptions(mainEchoOptions.value),
);

function getEchoSetImage(set: string) {
  return getEchoSetIconByType(set);
}

function toggleEchoSetFilter(set: string) {
  echoSet.value = echoSet.value === set ? null : set;
}

function isEchoSetFilterActive(set: string) {
  return echoSet.value === set;
}

const equippedFilterOptions = computed((): AppRichSelectOption[] => [
  { value: "self", label: `Hide equipped by ${props.character}` },
  { value: "any", label: "Hide equipped by anyone" },
]);

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
async function assignEcho(echoId: string) {
      const result = await assignEchoToCharacterSlot(
        props.character,
        echoIndex.value as number,
        echoId,
      );
      if (!result.ok) {
        if (result.reason === "already-equipped") {
          showToast("Echo is already being used.", "warning");
        } else {
          console.error("Could not find echo", echoId);
        }
        return;
      }
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
      ratingMin.value = RATING_PERCENT_MIN;
      ratingMax.value = RATING_PERCENT_MAX;
    }
function getCharsEquipped(e: { echoId: string }) {
      return getEchoEquippedChars(e.echoId);
    }
function getCharImg(character: string) {
      return `https://ryanbenson.github.io/wuthering-waves-assets/images/${character}.png`;
    }
defineExpose({
  triggerOpenModal,
  triggerCloseModal,
});
</script>

<style lang="scss" scoped>
html[data-theme-style="light"] {
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
