<template>
  <dialog :id="pickerModalId" class="modal" @close="isPickerOpen = false">
    <form method="dialog" class="modal-backdrop" @click="closeEchoChooser">
      <button>close</button>
    </form>
    <div v-if="isPickerOpen" class="modal-box max-w-5xl">
      <form method="dialog" @click="closeEchoChooser">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="py-4">
        <AppFilterPanel
          panel-key="echo-edit-picker"
          class="mb-4"
          :active-count="pickerActiveFilterCount"
          :clear-disabled="!pickerActiveFilterCount"
          @clear="resetFilters">
          <template #bar>
            <input
              v-model="echoSearch"
              type="search"
              placeholder="Search echoes…"
              class="input input-bordered input-sm flex-1 min-w-40"
              aria-label="Search echoes"
              data-test-echo-picker-search />
          </template>

          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-medium opacity-60">Cost</span>
            <div class="join">
              <button
                v-for="cost in ECHO_COST_TIERS"
                :key="cost"
                type="button"
                class="btn btn-sm join-item"
                :class="{ 'btn-active': echoCostFilter === cost }"
                :data-test-echo-picker-cost="cost"
                @click="echoCostFilter = echoCostFilter === cost ? null : cost">
                {{ cost }}
              </button>
            </div>
          </div>

          <div
            class="echoes__filters echo-filters__sets flex align-center gap-1 items-center flex-wrap"
            :class="{ 'echo-filters__sets--active': echoSetFilter !== null }">
            <span class="text-xs font-medium opacity-60 mr-1">Set</span>
            <button
              v-for="echoSetKey in echoSetsList"
              :key="echoSetKey"
              type="button"
              @click="toggleEchoSetFilter(echoSetKey)"
              class="rounded p-[.3rem]"
              :class="{ 'btn-active': isEchoSetFilterActive(echoSetKey) }">
              <img
                :src="getEchoSetIcon(echoSetKey)"
                class="size-7 m-width-7"
                :class="echoSetKey" />
            </button>
          </div>
        </AppFilterPanel>
        <div class="text-xs opacity-60 mb-2" data-test-echo-picker-count>
          {{ allEchoesListFiltered.length }}
          {{ allEchoesListFiltered.length === 1 ? "echo" : "echoes" }}
        </div>
      </div>
      <div class="echoes__list grid grid-cols-1 md:grid-cols-4 gap-4">
        <template v-if="!allEchoesListFiltered.length">
          <div class="echoes__list--empty py-12 text-center w-full col-span-2">No echoes found</div>
        </template>
        <template v-else>
          <div
            v-for="echoesToChoose in allEchoesListFiltered"
            :key="echoesToChoose.key"
            class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer"
            :data-test-echo-picker-option="echoesToChoose.key"
            @click="chooseMainEcho(echoesToChoose.key)">
            <div class="card-body items-center">
              <div
                class="echo__item__image rounded-full border border-solid neutral-content size-20 mb-2 bg-cover cursor-pointer mx-auto lg:m-0"
                :style="{ backgroundImage: `url(${echoesToChoose.image})` }"></div>
              <h2 class="card-title text-center text-lg">{{ echoesToChoose.name }}</h2>
              <h3 class="flex items-center gap-1.5">
                <span class="badge badge-sm badge-ghost">{{ echoesToChoose.class }}</span>
                <span class="badge badge-sm font-mono">
                  Cost {{ getCostByClass(echoesToChoose.class) }}
                </span>
              </h3>
              <div class="echo__item__set-selection flex gap-3 justify-center sm:justify-start flex-wrap">
                <div
                  v-for="echoSetItem in echoesToChoose.sets"
                  :key="echoSetItem"
                  class="size-8 rounded-full cursor-pointer echo__item__set-selection--icon">
                  <img :src="getEchoSetIcon(echoSetItem)" :class="echoSetItem" />
                </div>
              </div>
              <button type="button" class="btn btn-sm btn-primary" @click="chooseMainEcho(echoesToChoose.key)">
                Use echo
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
// Echo/set picker dialog extracted from CalculatorEchoEditPanel.vue — see
// docs/adr/0030-echoes-tab-v3-redesign.md decision #6. Self-sources via
// useEchoEditFields(target), same as EchoEditFields.vue, and exposes
// openPicker/closePicker for a host's Find button / avatar click to call —
// matching the ref.value?.triggerOpenModal?.()-style convention already
// used elsewhere in this codebase rather than new v-model:open plumbing.
import { computed, nextTick, ref } from "vue";
import { useEchoEditFields, type EchoEditTarget } from "../composables/useEchoEditFields";
import { useEchoInventory } from "../composables/useEchoInventory";
import { getEchoSetIconByType, echoSetLabelMap } from "../echoes/stats";
import { mainEchoesData, getCostByClass } from "../echoes/index.ts";
import AppFilterPanel from "./AppFilterPanel.vue";

defineOptions({ name: "EchoPickerDialog" });

const props = defineProps<{
  target: EchoEditTarget;
}>();

const { echo, echoId, echoSet } = useEchoEditFields(() => props.target);

const { getEchoFlags } = useEchoInventory();
const isEchoLocked = computed(() => (echoId.value ? getEchoFlags(echoId.value).locked : false));

function getEchoSetIcon(type: string) {
  return getEchoSetIconByType(type);
}

const pickerModalId = computed(() => {
  const t = props.target;
  return t.context === "build"
    ? `echoEditPickerModal-build-${t.character}-${t.index}`
    : `echoEditPickerModal-inventory-${t.echoId}`;
});
const isPickerOpen = ref(false);
const echoSetFilter = ref<string | null>(null);
const echoSearch = ref("");
const echoCostFilter = ref<number | null>(null);

async function openEchoPicker() {
  isPickerOpen.value = true;
  await nextTick();
  const modalEl = document.getElementById(pickerModalId.value);
  (modalEl as HTMLDialogElement | null)?.showModal();
}

function closeEchoChooser() {
  resetFilters();
  const modalEl = document.getElementById(pickerModalId.value);
  (modalEl as HTMLDialogElement | null)?.close();
  isPickerOpen.value = false;
}

function chooseMainEcho(echoKey: string) {
  if (isEchoLocked.value) return;
  echo.value = echoKey;
  if (props.target.context === "inventory") {
    if (!echoSet.value) echoSet.value = echoSetFilter.value;
  } else if (echoSetFilter.value) {
    echoSet.value = echoSetFilter.value;
  }
  closeEchoChooser();
}

const echoSetsList = computed(() => Object.keys(echoSetLabelMap));

function toggleEchoSetFilter(echoSetKey: string) {
  echoSetFilter.value = echoSetFilter.value === echoSetKey ? null : echoSetKey;
}

function isEchoSetFilterActive(echoSetKey: string) {
  return echoSetFilter.value === echoSetKey;
}

function resetFilters() {
  echoSetFilter.value = null;
  echoSearch.value = "";
  echoCostFilter.value = null;
}

const pickerActiveFilterCount = computed(() => {
  let count = 0;
  if (echoSetFilter.value) count += 1;
  if (echoSearch.value.trim()) count += 1;
  if (echoCostFilter.value != null) count += 1;
  return count;
});

/**
 * Cost tiers offered by the filter. Every slot can hold any cost — the only
 * constraint the app enforces is the 12-point total across all 5 slots — so
 * this deliberately lists all three rather than narrowing by slot position.
 */
const ECHO_COST_TIERS = [4, 3, 1];

type EchoListEntry = { key: string; name: string; class: string; sets: string[]; image?: string };
const classOrder: Record<string, number> = { Calamity: 0, Overlord: 1, Elite: 2, Common: 3 };
const allEchoesListFiltered = computed((): EchoListEntry[] => {
  let allEchoes = Object.values(mainEchoesData) as EchoListEntry[];
  if (echoSetFilter.value) {
    allEchoes = allEchoes.filter((e) => e.sets.includes(echoSetFilter.value!));
  }
  if (echoCostFilter.value != null) {
    allEchoes = allEchoes.filter(
      (e) => getCostByClass(e.class) === echoCostFilter.value,
    );
  }
  const needle = echoSearch.value.trim().toLowerCase();
  if (needle) {
    allEchoes = allEchoes.filter((e) => e.name.toLowerCase().includes(needle));
  }
  return [...allEchoes].sort((a, b) => {
    const cmp = classOrder[a.class] - classOrder[b.class];
    return cmp === 0 ? a.name.localeCompare(b.name) : cmp;
  });
});

defineExpose({ openPicker: openEchoPicker, closePicker: closeEchoChooser });
</script>

<style scoped>
.echo-filters__sets--active button {
  opacity: 0.6;
}
.echo-filters__sets--active button.btn-active {
  opacity: 1;
}
</style>
