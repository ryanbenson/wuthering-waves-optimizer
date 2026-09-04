<template>
  <AppChooserModal
    ref="modalRef"
    :title="`Browse inventory${slotLabel}`"
    close-test-attr="data-test-workspace-echoes-browser-close">
    <template #toolbar>
      <AppFilterPanel
        panel-key="workspace-echoes"
        :active-count="activeFilterCount"
        :clear-disabled="!activeFilterCount"
        @clear="resetFilters">
        <template #bar>
          <select
            v-model="sortBy"
            class="select select-bordered select-sm"
            aria-label="Sort echoes"
            data-test-workspace-echoes-browser-sort>
            <option value="default">Sort: Inventory order</option>
            <option value="impact">Sort: Damage impact</option>
          </select>
        </template>

        <div class="flex flex-wrap items-center gap-2">
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
          <button
            type="button"
            class="btn btn-sm btn-ghost rounded inline-flex items-center gap-1.5 px-2"
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

        <div class="flex flex-wrap gap-6 w-full">
          <EchoCvRvRangeFilters
            v-model:cv-min="cvMin"
            v-model:cv-max="cvMax"
            v-model:rv-min="rvMin"
            v-model:rv-max="rvMax" />
          <EchoRatingRangeFilters
            v-model:rating-min="ratingMin"
            v-model:rating-max="ratingMax" />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-medium opacity-60 mr-1">Set</span>
          <div
            class="echo-filters__sets flex flex-wrap"
            :class="{ 'echo-filters__sets--active': echoSet !== null }">
            <button
              v-for="setKey in echoSetsList"
              :key="setKey"
              type="button"
              @click="toggleEchoSetFilter(setKey)"
              class="rounded mr-1 p-[.3rem]"
              :class="[setKey, { 'btn-active': isEchoSetFilterActive(setKey) }]">
              <img :src="getEchoSetImage(setKey)" class="size-7" :class="setKey" />
            </button>
          </div>
        </div>
      </AppFilterPanel>

      <div class="flex items-center justify-between gap-2 mt-2">
        <span class="text-xs opacity-60" data-test-workspace-echoes-browser-count>
          {{ echoesList.length }} {{ echoesList.length === 1 ? "echo" : "echoes" }}
        </span>
        <span
          v-if="impactsLoading"
          class="text-xs opacity-60"
          data-test-workspace-echoes-browser-impact-loading>
          Estimating damage impact…
        </span>
      </div>
    </template>

    <div v-if="!echoesList.length" class="py-12 text-center w-full opacity-60">
      No echoes found
    </div>
    <template v-else>
      <div class="flex justify-center py-2">
        <PaginationControls v-model="page" :total-pages="totalPages" />
      </div>
      <div
        class="grid gap-4"
        :class="
          isCompact
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 md:grid-cols-2'
        "
        data-test-workspace-echoes-browser-list>
        <CalculatorEchoCard
          v-for="item in paginatedEchoesList"
          :key="item.echoId"
          :rank="item.rank"
          :type="item.type"
          :echo-id="item.echoId"
          :echo-set="item.echoSet"
          :stat="item.stat"
          :echo="item.echo"
          :echo-sub-stats-type-1="item.echoSubStatsType1"
          :echo-sub-stats-value-1="item.echoSubStatsValue1"
          :echo-sub-stats-type-2="item.echoSubStatsType2"
          :echo-sub-stats-value-2="item.echoSubStatsValue2"
          :echo-sub-stats-type-3="item.echoSubStatsType3"
          :echo-sub-stats-value-3="item.echoSubStatsValue3"
          :echo-sub-stats-type-4="item.echoSubStatsType4"
          :echo-sub-stats-value-4="item.echoSubStatsValue4"
          :echo-sub-stats-type-5="item.echoSubStatsType5"
          :echo-sub-stats-value-5="item.echoSubStatsValue5"
          :character-id="props.character"
          :compact="isCompact">
          <div class="flex gap-2 justify-between items-center flex-wrap">
            <div class="avatar-group -space-x-6 rtl:space-x-reverse">
              <div class="avatar" v-for="char in getCharsEquipped(item)" :key="char">
                <div class="w-12 bg-accent-content">
                  <img :src="getCharImg(char)" />
                </div>
              </div>
            </div>
            <div class="flex gap-2 items-center">
              <span
                v-if="item.echoId === equippedEchoIdInSlot"
                class="badge badge-primary badge-sm">
                Equipped
              </span>
              <span
                v-else-if="impactByEchoId[item.echoId]"
                class="badge badge-sm"
                :class="impactBadgeClasses(impactByEchoId[item.echoId])"
                :data-test-workspace-echoes-browser-impact="item.echoId">
                {{ formatImpact(impactByEchoId[item.echoId]) }}
              </span>
              <button
                type="button"
                class="btn btn-primary btn-sm"
                :data-test-workspace-echoes-browser-use="item.echoId"
                @click="assignEcho(item.echoId)">
                Use echo
              </button>
            </div>
          </div>
        </CalculatorEchoCard>
      </div>
      <div class="flex justify-center py-2">
        <PaginationControls v-model="page" :total-pages="totalPages" />
      </div>
    </template>
  </AppChooserModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import {
  ECHO_CV_MAX,
  ECHO_RV_MAX,
  getEchoCritValue,
  getEchoRollValue,
  getEchoSetIconByType,
  getReadableSubStatLabel,
  echoSetLabelMap,
  statsTable,
} from "../../echoes/stats";
import { mainEchoesData } from "../../echoes/index";
import { getEchoRatingGrade } from "../../echoes/rating";
import {
  estimateEchoSwapImpactBatch,
  type EchoImpactDelta,
  type EchoSwapCandidate,
} from "../../echoes/echoImpact";
import { useInventoryStore } from "../../stores/inventory";
import { useCharacterStore } from "../../stores/character";
import { useSettingsStore } from "../../stores/settings";
import CalculatorEchoCard from "../CalculatorEchoCard.vue";
import EchoCvRvRangeFilters from "../EchoCvRvRangeFilters.vue";
import EchoRatingRangeFilters from "../EchoRatingRangeFilters.vue";
import PaginationControls from "../PaginationControls.vue";
import AppRichSelect, { type AppRichSelectOption } from "../AppRichSelect.vue";
import AppFilterPanel from "../AppFilterPanel.vue";
import AppChooserModal from "../AppChooserModal.vue";
import {
  buildEchoSelectOptions,
  buildSimpleSelectOptions,
} from "../../utils/richSelectOptions";
import { useToast } from "../../composables/useToast";
import { useUiDensity } from "../../composables/useUiDensity";
import { useEchoSlotAssignment } from "../../composables/useEchoSlotAssignment";

const { showToast } = useToast();
const { isCompact } = useUiDensity();
const props = defineProps<{ character: string }>();
const emit = defineEmits<{ "chosen-echo-inventory": [] }>();

const inventoryStore = useInventoryStore();
const characterStore = useCharacterStore();
const settingsStore = useSettingsStore();
const { assignEchoToCharacterSlot } = useEchoSlotAssignment();
const { echoes, echoIdsEquippedByAnyChars } = storeToRefs(inventoryStore);
const { characters } = storeToRefs(characterStore);
const { getEchoEquippedChars } = inventoryStore;

const modalRef = ref<InstanceType<typeof AppChooserModal> | null>(null);
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
const RATING_PERCENT_MIN = 0;
const RATING_PERCENT_MAX = 100;
const ratingMin = ref(RATING_PERCENT_MIN);
const ratingMax = ref(RATING_PERCENT_MAX);
const page = ref(1);
const perPage = 20;
const sortBy = ref<"default" | "impact">("default");

const impactByEchoId = ref<Record<string, EchoImpactDelta | null>>({});
const impactsLoading = ref(false);
/** Guards against a slow batch landing after its filters have moved on. */
let impactRequestToken = 0;

const slotLabel = computed(() =>
  echoIndex.value == null ? "" : ` · Slot ${echoIndex.value + 1}`,
);

const equippedEchoIdInSlot = computed(() => {
  if (echoIndex.value == null) return null;
  return characters.value?.[props.character]?.echoes?.[echoIndex.value]?.echoId ?? null;
});

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
  [mainStatFilter, echoSet, echo, favoriteFilter, equippedFilter, costFilter,
   cvMin, cvMax, rvMin, rvMax, ratingMin, ratingMax],
  () => {
    page.value = 1;
  },
);

const echoSetsList = computed(() => Object.keys(echoSetLabelMap));

const echoesFiltered = computed(() => {
  let allEchoes = echoes.value ?? [];
  if (allEchoes.length <= 0) return allEchoes;
  if (echoSet.value) {
    allEchoes = allEchoes.filter((item: any) => item.echoSet === echoSet.value);
  }
  if (echo.value) {
    allEchoes = allEchoes.filter((item: any) => item.echo === echo.value);
  }
  if (costFilter.value) {
    allEchoes = allEchoes.filter((item: any) => item.type === costFilter.value);
  }
  if (mainStatFilter.value) {
    allEchoes = allEchoes.filter((item: any) => item.stat === mainStatFilter.value);
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

const echoesList = computed(() => {
  if (sortBy.value !== "impact") return echoesFiltered.value;
  // Echoes with no computed impact yet (still loading, or the estimate
  // failed) sort last rather than being treated as a 0% swing.
  return [...echoesFiltered.value].sort((a: any, b: any) => {
    const impactA = impactByEchoId.value[a.echoId]?.pct ?? null;
    const impactB = impactByEchoId.value[b.echoId]?.pct ?? null;
    if (impactA == null && impactB == null) return 0;
    if (impactA == null) return 1;
    if (impactB == null) return -1;
    return impactB - impactA;
  });
});

const paginatedEchoesList = computed(() => {
  const start = (page.value - 1) * perPage;
  return echoesList.value.slice(start, start + perPage);
});
const totalPages = computed(() =>
  Math.max(1, Math.ceil(echoesList.value.length / perPage)),
);

/**
 * The exact rotation/attack + damage-type mode the Live Result Bar is
 * currently showing for this character (persisted per-character in
 * settingsStore.config.liveResultBarByCharacter — see Calculator.vue).
 * Passed through so the impact estimate measures the same number the user
 * is actually watching, instead of guessing "first saved rotation", which
 * can silently be a completely different (and much more/less
 * stat-sensitive) rotation — the root cause of a reported case where the
 * estimate overstated a real damage change by several times.
 */
const liveResultBarPreference = computed(() => {
  const saved = settingsStore.config?.liveResultBarByCharacter?.[props.character];
  return {
    target: saved?.target ?? null,
    damageType: saved?.damageType ?? "Average",
  };
});

const enemyConfig = computed(() => {
  const data = characters.value[props.character] ?? {};
  return {
    enemyLevel: data.enemyLevel ?? 90,
    enemyResist: data.enemyResist ?? 0.1,
    enemyType: data.enemyType ?? "Calamity",
  };
});

/**
 * Each candidate costs a full headless context rebuild (~1-6ms), so this is
 * deliberately scoped: the visible page only (≤20) while browsing normally,
 * widening to the whole filtered list solely when the user asks to sort by
 * impact — which is the one case where a number is needed for every row, not
 * just the ones on screen. Already-computed echoes are never recomputed.
 */
async function loadImpactsFor(items: any[]) {
  if (echoIndex.value == null) return;
  const slotIndex = echoIndex.value;
  const candidates: EchoSwapCandidate[] = items
    .filter(
      (item) =>
        item.echoId &&
        item.echoId !== equippedEchoIdInSlot.value &&
        !(item.echoId in impactByEchoId.value),
    )
    .map((item) => ({ echoId: item.echoId, slotIndex }));
  if (!candidates.length) return;

  const token = ++impactRequestToken;
  impactsLoading.value = true;
  try {
    const results = await estimateEchoSwapImpactBatch(
      props.character,
      characters.value,
      candidates,
      enemyConfig.value,
      echoes.value ?? [],
      liveResultBarPreference.value,
    );
    if (token !== impactRequestToken) return;
    const next = { ...impactByEchoId.value };
    for (const [echoId, delta] of results.entries()) {
      next[echoId] = delta;
    }
    impactByEchoId.value = next;
  } finally {
    if (token === impactRequestToken) {
      impactsLoading.value = false;
    }
  }
}

// Browsing normally: keep the visible page's badges filled in.
watch(paginatedEchoesList, (items) => {
  if (sortBy.value === "impact") return;
  void loadImpactsFor(items);
});

// Sorting by impact needs a number for every row, not just the visible page.
watch(sortBy, (mode) => {
  if (mode !== "impact") return;
  void loadImpactsFor(echoesFiltered.value);
});

// A different slot means every cached delta was measured against the wrong
// baseline — drop them rather than showing numbers for the previous slot.
watch(echoIndex, () => {
  impactByEchoId.value = {};
  impactRequestToken += 1;
});

function formatImpact(delta: EchoImpactDelta | null | undefined): string {
  if (!delta) return "";
  const sign = delta.delta >= 0 ? "+" : "";
  return `${sign}${Math.round(delta.delta).toLocaleString()} · ${sign}${(delta.pct * 100).toFixed(1)}%`;
}

function impactBadgeClasses(delta: EchoImpactDelta | null | undefined) {
  if (!delta) return "badge-ghost";
  return delta.pct >= 0 ? "badge-success" : "badge-error";
}

const mainEchoOptions = computed(() => {
  const grouped = {
    Calamity: [] as any[],
    Overlord: [] as any[],
    Elite: [] as any[],
    Common: [] as any[],
  };
  Object.values(mainEchoesData).forEach((entry) => {
    const echoClass = (entry as any)?.class as keyof typeof grouped | undefined;
    if (echoClass && grouped[echoClass]) {
      grouped[echoClass].push(entry);
    }
  });
  return grouped;
});

const allMainStats = computed(() => {
  const allOptions = [
    ...Object.keys((statsTable as any)["4"]),
    ...Object.keys((statsTable as any)["3"]),
    ...Object.keys((statsTable as any)["1"]),
  ];
  return [...new Set(allOptions)];
});

const costFilterOptions = buildSimpleSelectOptions([4, 3, 1], (cost) => `${cost} Cost`);
const mainStatFilterOptions = computed((): AppRichSelectOption[] =>
  buildSimpleSelectOptions(allMainStats.value, (stat) =>
    getReadableSubStatLabel(String(stat)),
  ),
);
const echoSelectOptions = computed((): AppRichSelectOption[] =>
  buildEchoSelectOptions(mainEchoOptions.value),
);
const equippedFilterOptions = computed((): AppRichSelectOption[] => [
  { value: "self", label: `Hide equipped by ${props.character}` },
  { value: "any", label: "Hide equipped by anyone" },
]);

function resetFilters() {
  echoSet.value = null;
  echo.value = null;
  costFilter.value = null;
  mainStatFilter.value = null;
  equippedFilter.value = null;
  favoriteFilter.value = false;
  cvMin.value = 0;
  cvMax.value = ECHO_CV_MAX;
  rvMin.value = 0;
  rvMax.value = ECHO_RV_MAX;
  ratingMin.value = RATING_PERCENT_MIN;
  ratingMax.value = RATING_PERCENT_MAX;
}

function getEchoSetImage(set: string) {
  return getEchoSetIconByType(set);
}
function toggleEchoSetFilter(set: string) {
  echoSet.value = echoSet.value === set ? null : set;
}
function isEchoSetFilterActive(set: string) {
  return echoSet.value === set;
}
function getCharsEquipped(item: any) {
  return getEchoEquippedChars(item.echoId);
}
function getCharImg(character: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${character}.png`;
}

async function triggerOpenModal(index: number) {
  echoIndex.value = index;
  await modalRef.value?.triggerOpenModal();
  void loadImpactsFor(paginatedEchoesList.value);
}

function triggerCloseModal() {
  modalRef.value?.triggerCloseModal();
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

defineExpose({ triggerOpenModal, triggerCloseModal });
</script>
