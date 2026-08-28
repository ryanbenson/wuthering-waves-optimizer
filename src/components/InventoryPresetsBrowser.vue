<template>
  <dialog id="inventoryPresetEditName" class="modal">
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
    <div class="modal-box max-w-2xl">
      <form method="dialog">
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          data-test-echo-modal-close>
          ✕
        </button>
      </form>
      <div class="py-4">
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Update your preset name</span>
          </div>
          <input type="text" v-model.trim="echoPresetName" class="input input-bordered w-full" />
        </label>
        <button class="btn btn-primary btn-sm mt-4" @click="handleSavePreset">Update</button>
      </div>
    </div>
  </dialog>

  <div class="py-4">
    <div
      class="presets__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
      <h3 class="text-sm font-semibold">
        Manage Presets
        <span class="opacity-60 font-normal">({{ echoPresets.length }})</span>
      </h3>
      <div class="flex flex-wrap items-center gap-2">
        <div class="join">
          <button
            type="button"
            class="join-item btn btn-sm"
            :class="{ 'btn-active': sortField === 'created' }"
            @click="sortField = 'created'">
            Created
          </button>
          <button
            type="button"
            class="join-item btn btn-sm"
            :class="{ 'btn-active': sortField === 'name' }"
            @click="sortField = 'name'">
            Name
          </button>
        </div>
        <button
          type="button"
          class="btn btn-sm btn-ghost"
          :aria-label="sortDir === 'asc' ? 'Sort ascending' : 'Sort descending'"
          v-tooltip="sortDir === 'asc' ? 'Ascending' : 'Descending'"
          @click="sortDir = sortDir === 'asc' ? 'desc' : 'asc'">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            class="size-3.5 transition-transform"
            :class="{ 'rotate-180': sortDir === 'desc' }"
            aria-hidden="true">
            <path
              d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.3V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.3l105.4 105.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
              fill="currentColor" />
          </svg>
        </button>
        <div class="join">
          <button
            type="button"
            class="join-item btn btn-sm"
            :class="{ 'btn-active': viewMode === 'tile' }"
            aria-label="Tile view"
            v-tooltip="'Tile view'"
            @click="setViewMode('tile')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-3.5" aria-hidden="true">
              <path
                d="M0 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32L32 256c-17.7 0-32-14.3-32-32L0 96zM0 352c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32l0-64zM288 96c0-17.7 14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-64zm0 192c0-17.7 14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-128z"
                fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            class="join-item btn btn-sm"
            :class="{ 'btn-active': viewMode === 'list' }"
            aria-label="List view"
            v-tooltip="'List view'"
            @click="setViewMode('list')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-3.5" aria-hidden="true">
              <path
                d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"
                fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <AppFilterPanel
      panel-key="inventory-presets"
      class="mb-6"
      :active-count="activeFilterCount"
      :clear-disabled="!activeFilterCount"
      @clear="resetFilters">
      <div class="presets__filters__row flex flex-wrap items-center gap-2">
        <input
          type="search"
          v-model.trim="nameFilter"
          placeholder="Search by name"
          aria-label="Search presets by name"
          class="input input-bordered input-sm w-fit min-w-[200px]" />
        <AppRichSelect
          v-model="characterFilter"
          :options="characterFilterOptions"
          searchable
          allow-empty
          empty-label="Character"
          aria-label="Character filter"
          class="w-fit min-w-[200px]" />
      </div>
      <div class="presets__filters__row flex flex-wrap gap-6 w-full">
        <div class="presets__filters__cv min-w-[12rem] flex-1 max-w-sm">
          <div class="flex justify-between items-baseline gap-2 text-xs mb-1">
            <span class="font-medium opacity-80">CV</span>
            <span class="tabular-nums opacity-70">{{ cvMin }} – {{ cvMax }}</span>
          </div>
          <RangeMinMax
            id="preset-cv-filter"
            :min="0"
            :max="ECHO_CV_MAX"
            :step="0.5"
            size="xs"
            min-aria-label="Minimum crit value"
            max-aria-label="Maximum crit value"
            v-model:model-min="cvMin"
            v-model:model-max="cvMax" />
        </div>
      </div>
    </AppFilterPanel>

    <div class="presets__list">
      <template v-if="!echoPresets.length">
        <div class="presets__list--empty py-12 text-center w-full">
          No presets found
        </div>
      </template>
      <template v-else-if="!filteredSortedPresets.length">
        <div class="presets__list--empty py-12 text-center w-full">
          No presets match your filters
        </div>
      </template>
      <template v-else>
        <div class="presets__list__pagination flex justify-center py-4">
          <PaginationControls v-model="page" :total-pages="totalPages" />
        </div>
        <div
          class="presets__list__items grid gap-4"
          :class="viewMode === 'tile' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'">
          <EchoCustomPreset
            v-for="echoPreset in paginatedPresetsList"
            :key="echoPreset.presetId"
            :layout="viewMode"
            :preset-id="echoPreset.presetId"
            :name="echoPreset.name"
            :echo-1-id="echoPreset.echo1Id"
            :echo-2-id="echoPreset.echo2Id"
            :echo-3-id="echoPreset.echo3Id"
            :echo-4-id="echoPreset.echo4Id"
            :echo-5-id="echoPreset.echo5Id"
            :disable-action="true"
            :show-equipped-chars="true">
            <div class="presets__item__foot flex items-center gap-2 shrink-0">
              <div v-if="getCharsEquipped(echoPreset.presetId).length" class="presets__item__foot__equipped">
                <div class="avatar-group -space-x-6 rtl:space-x-reverse">
                  <div class="avatar" v-for="char in getCharsEquipped(echoPreset.presetId)" :key="char">
                    <div class="w-8 bg-accent-content">
                      <img :src="getCharImg(char)" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="presets__item__foot__actions flex gap-1.5 ml-auto">
                <button
                  @click="editEchoPresetName(echoPreset.presetId, echoPreset.name)"
                  class="btn btn-sm btn-primary">
                  Edit
                </button>
                <button
                  @click="handleDeleteEchoPreset(echoPreset.presetId)"
                  class="btn btn-sm btn-error">
                  Delete
                </button>
              </div>
            </div>
          </EchoCustomPreset>
        </div>
        <div class="presets__list__pagination flex justify-center py-4">
          <PaginationControls v-model="page" :total-pages="totalPages" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useInventoryStore } from "../stores/inventory";
import { useCharacterStore } from "../stores/character";
import { characterPickerRoster } from "../characters/characters.ts";
import { ECHO_CV_MAX, getEchoCritValue } from "../echoes/stats";
import EchoCustomPreset from "./EchoCustomPreset.vue";
import AppFilterPanel from "./AppFilterPanel.vue";
import AppRichSelect, { type AppRichSelectOption } from "./AppRichSelect.vue";
import RangeMinMax from "./input/RangeMinMax.vue";
import PaginationControls from "./PaginationControls.vue";
import { buildSimpleSelectOptions } from "../utils/richSelectOptions";
import { usePresetsViewMode } from "../composables/usePresetsViewMode";
import { useConfirm } from "../composables/useConfirm";

type EchoPresetRow = {
  presetId: string;
  name: string;
  echo1Id?: string;
  echo2Id?: string;
  echo3Id?: string;
  echo4Id?: string;
  echo5Id?: string;
};

type SortField = "created" | "name";
type SortDir = "asc" | "desc";

const { confirm } = useConfirm();
const { viewMode, setViewMode } = usePresetsViewMode();

const page = ref(1);
const perPage = 10;
const modalId = "inventoryPresetEditName";
const echoPresetName = ref<string | null>(null);
const echoPresetId = ref<string | null>(null);

const nameFilter = ref("");
const characterFilter = ref<string | null>(null);
const cvMin = ref(0);
const cvMax = ref(ECHO_CV_MAX);
const sortField = ref<SortField>("created");
const sortDir = ref<SortDir>("asc");

const inventoryStore = useInventoryStore();
const characterStore = useCharacterStore();
const { echoPresets } = storeToRefs(inventoryStore);
const { getEchoPresetData, getEchoPresetCharacters } = inventoryStore;
const { patchEchoPreset, deleteEchoPreset, deleteEquippedPreset } =
  inventoryStore;
const { setCharacterData } = characterStore;

const characterFilterOptions = computed((): AppRichSelectOption[] => {
  const all = [
    ...characterPickerRoster.five,
    ...characterPickerRoster.four,
  ];
  return buildSimpleSelectOptions(
    all.map((c) => c.key),
    (key) => all.find((c) => c.key === key)?.name ?? String(key),
  );
});

const cvFilterActive = computed(
  () => cvMin.value > 0 || cvMax.value < ECHO_CV_MAX,
);

const activeFilterCount = computed(() => {
  let count = 0;
  if (characterFilter.value) count += 1;
  if (cvFilterActive.value) count += 1;
  return count;
});

function resetFilters() {
  characterFilter.value = null;
  cvMin.value = 0;
  cvMax.value = ECHO_CV_MAX;
}

// Each preset's total CV, computed once per echoPresets change rather than
// per-render — presets can number in the hundreds and each lookup resolves
// 5 echo IDs against the inventory.
const presetCvById = computed(() => {
  const map = new Map<string, number>();
  for (const preset of (echoPresets.value ?? []) as EchoPresetRow[]) {
    const echoIds = [
      preset.echo1Id,
      preset.echo2Id,
      preset.echo3Id,
      preset.echo4Id,
      preset.echo5Id,
    ];
    let cv = 0;
    for (const echoId of echoIds) {
      if (!echoId) continue;
      const echo = inventoryStore.getEchoById(echoId);
      if (echo) cv += getEchoCritValue(echo);
    }
    map.set(preset.presetId, cv);
  }
  return map;
});

watch([nameFilter, characterFilter, cvMin, cvMax, sortField, sortDir], () => {
  page.value = 1;
});

const filteredSortedPresets = computed(() => {
  let list = ((echoPresets.value ?? []) as EchoPresetRow[]).map(
    (preset, index) => ({ preset, index }),
  );

  if (nameFilter.value) {
    const query = nameFilter.value.toLowerCase();
    list = list.filter(({ preset }) =>
      preset.name?.toLowerCase().includes(query),
    );
  }

  if (characterFilter.value) {
    const character = characterFilter.value;
    list = list.filter(({ preset }) =>
      getEchoPresetCharacters(preset.presetId).includes(character),
    );
  }

  if (cvFilterActive.value) {
    list = list.filter(({ preset }) => {
      const cv = presetCvById.value.get(preset.presetId) ?? 0;
      return cv >= cvMin.value && cv <= cvMax.value;
    });
  }

  const dir = sortDir.value === "asc" ? 1 : -1;
  list = list.slice().sort((a, b) => {
    if (sortField.value === "name") {
      return dir * (a.preset.name ?? "").localeCompare(b.preset.name ?? "");
    }
    return dir * (a.index - b.index);
  });

  return list.map(({ preset }) => preset);
});

const paginatedPresetsList = computed(() => {
  const start = (page.value - 1) * perPage;
  const end = page.value * perPage;
  return filteredSortedPresets.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredSortedPresets.value.length / perPage),
);

const echoPresetData = computed(() =>
  echoPresetId.value ? getEchoPresetData(echoPresetId.value) : undefined,
);

function editEchoPresetName(presetId: string, presetName: string) {
  echoPresetId.value = presetId;
  echoPresetName.value = presetName;
  handleOpenModal();
}

function handleOpenModal() {
  const modalEl = document.getElementById(modalId) as HTMLDialogElement | null;
  modalEl?.showModal();
}

function handleCloseModal() {
  const modalEl = document.getElementById(modalId) as HTMLDialogElement | null;
  modalEl?.close();
}

async function handleSavePreset() {
  const presetData = JSON.parse(JSON.stringify(echoPresetData.value));
  const data = Object.assign({}, presetData, { name: echoPresetName.value });
  await patchEchoPreset(presetData.presetId, data);
  resetForm();
  handleCloseModal();
}

function resetForm() {
  echoPresetId.value = null;
  echoPresetName.value = null;
}

function getCharsEquipped(presetId: string) {
  return getEchoPresetCharacters(presetId);
}

function getCharImg(character: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${character}.png`;
}

async function handleDeleteEchoPreset(presetId: string) {
  const preset = getEchoPresetData(presetId) as { name?: string } | undefined;
  const confirmed = await confirm(
    `Delete preset "${preset?.name ?? "this preset"}"? This cannot be undone.`,
    {
      title: "Delete preset",
      confirmLabel: "Delete",
      variant: "error",
    },
  );
  if (!confirmed) return;

  const allCharacters = getCharsEquipped(presetId);
  for (const character of allCharacters) {
    await deleteEquippedPreset(character);
    const data = { echoPresetId: null };
    await setCharacterData(character, data);
  }
  await deleteEchoPreset(presetId);
}
</script>
