<template>
  <AppChooserModal
    ref="modalRef"
    title="Choose character"
    close-test-attr="data-test-character-browser-close"
    @close="reset">
    <template #toolbar>
      <AppFilterPanel
        panel-key="calculator-characters"
        :active-count="activeFilterCount"
        :clear-disabled="!activeFilterCount"
        @clear="resetFilters">
        <template #bar>
          <input
            v-model="search"
            type="search"
            placeholder="Search characters…"
            class="input input-bordered input-sm flex-1 min-w-40"
            aria-label="Search characters"
            data-test-character-browser-search />
        </template>

        <div class="flex flex-wrap items-center gap-2">
          <div class="characters__filters__sets">
            <button
              v-for="(elementIcon, element) in characterElementsSetImageMap"
              :key="element"
              type="button"
              @click="toggleElementFilter(element)"
              class="rounded mr-1"
              :class="{ 'btn-active': isElementFilterActive(element), element }">
              <img
                :src="elementIcon"
                class="size-8"
                :class="getElementClass(element)" />
            </button>
          </div>
          <div class="characters__filters__rarity ml-2">
            <button
              v-for="rarity in [5, 4]"
              :key="rarity"
              type="button"
              class="rounded mr-1 inline-flex justify-center size-8 items-center"
              :class="{ 'btn-active': isRarityFilterActive(rarity) }"
              @click="toggleRarityFilter(rarity)">
              {{ rarity }}✦
            </button>
          </div>
          <div class="characters__filter__weapon ml-2">
            <button
              v-for="(weaponIcon, weapon) in weaponTypesImageMap"
              :key="weapon"
              type="button"
              @click="toggleWeaponFilter(weapon)"
              class="rounded mr-1"
              :class="{ 'btn-active': isWeaponFilterActive(weapon), weapon }">
              <img :src="weaponIcon.toLowerCase()" class="size-8 p-[.15rem]" />
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <div class="min-w-[10rem]">
            <AppRichSelect
              v-model="filterBuildStatus"
              :options="buildStatusFilterOptions"
              allow-empty
              empty-label="All statuses"
              aria-label="Filter by character status"
              data-test-build-status-filter>
              <template #selected="{ option }">
                <span class="flex items-center gap-1.5 min-w-0">
                  <span
                    v-if="option?.dotClass"
                    class="size-2 rounded-full shrink-0"
                    :class="String(option.dotClass)"></span>
                  <span class="truncate">{{ option?.label ?? "All statuses" }}</span>
                </span>
              </template>
              <template #option="{ option }">
                <span
                  v-if="option.dotClass"
                  class="size-2 rounded-full shrink-0"
                  :class="String(option.dotClass)"></span>
                <span>{{ option.label }}</span>
              </template>
            </AppRichSelect>
          </div>
          <label
            class="flex items-center gap-1.5 cursor-pointer text-xs whitespace-nowrap"
            v-tooltip="hideWontBuildTooltip">
            <input
              v-model="hideWontBuildCharacters"
              type="checkbox"
              class="toggle toggle-primary toggle-sm"
              aria-label="Hide characters marked Won't build"
              data-test-browser-hide-wont-build />
            Hide “Won't build”
          </label>
          <button
            type="button"
            @click="toggleFavoriteFilter"
            class="btn btn-sm btn-ghost rounded inline-flex items-center gap-1.5 px-2"
            :class="{ 'btn-active': filterFavorites }"
            data-test-favorites-filter>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="size-4 shrink-0"
              aria-hidden="true">
              <path
                v-if="filterFavorites"
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
            <span>Favorites</span>
          </button>
        </div>
      </AppFilterPanel>

      <div class="flex items-center justify-between gap-2 mt-2">
        <span class="text-xs opacity-60" data-test-character-browser-count>
          {{ charactersList.length }}
          {{ charactersList.length === 1 ? "character" : "characters" }}
        </span>
        <div class="join">
          <button
            type="button"
            class="btn btn-xs join-item"
            :class="viewMode === 'list' ? 'btn-active' : ''"
            aria-label="List view"
            data-test-character-browser-view="list"
            @click="viewMode = 'list'">
            List
          </button>
          <button
            type="button"
            class="btn btn-xs join-item"
            :class="viewMode === 'grid' ? 'btn-active' : ''"
            aria-label="Grid view"
            data-test-character-browser-view="grid"
            @click="viewMode = 'grid'">
            Grid
          </button>
        </div>
      </div>
    </template>

    <div v-if="!charactersList.length" class="py-12 text-center w-full opacity-60">
      No characters found
    </div>
    <div
      v-else-if="viewMode === 'grid'"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <CalculatorCharacterCard
        v-for="character in charactersList"
        :key="character.key"
        :name-key="character.key"
        :name="character.name"
        :rarity="character.rarity"
        :element="character.element"
        :weapon="character.weapon"
        :build-status="getCharacterBuildStatus(character.key, characters)"
        :is-active="false">
        <button
          type="button"
          @click="chooseCharacter(character)"
          :data-test-character-browse-select="character.key"
          class="btn btn-sm btn-primary">
          Use character
        </button>
      </CalculatorCharacterCard>
    </div>
    <div v-else class="flex flex-col gap-2">
      <WorkspaceCharacterRow
        v-for="character in charactersList"
        :key="character.key"
        :name-key="character.key"
        :name="character.name"
        :rarity="character.rarity"
        :element="character.element"
        :weapon="character.weapon"
        :build-status="getCharacterBuildStatus(character.key, characters)"
        @choose="chooseCharacter(character)" />
    </div>
  </AppChooserModal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import {
  allCharactersList,
  characterElementsSetImageMap,
  weaponTypesImageMap,
} from "../../characters/characters";
import {
  getCharacterBuildStatus,
  getCharacterBuildStatusDotClass,
  getCharacterBuildStatusLabel,
  CHARACTER_BUILD_STATUSES,
  type CharacterBuildStatus as CharacterBuildStatusType,
} from "../../characters/characterBuildStatus";
import { useCharacterStore } from "../../stores/character";
import { useSettingsStore } from "../../stores/settings";
import AppRichSelect, { type AppRichSelectOption } from "../AppRichSelect.vue";
import AppFilterPanel from "../AppFilterPanel.vue";
import AppChooserModal from "../AppChooserModal.vue";
import CalculatorCharacterCard from "../CalculatorCharacterCard.vue";
import WorkspaceCharacterRow from "./WorkspaceCharacterRow.vue";

type ListedCharacter = (typeof allCharactersList)[number];

const props = withDefaults(
  defineProps<{ character: string; excludeKeys?: string[] }>(),
  { excludeKeys: () => [] },
);

const emit = defineEmits<{
  "character-browser:chosen-character": [key: string];
}>();

const characterStore = useCharacterStore();
const { characters, favoriteCharacters } = storeToRefs(characterStore);
const settingsStore = useSettingsStore();
const { config } = storeToRefs(settingsStore);

const modalRef = ref<InstanceType<typeof AppChooserModal> | null>(null);

const search = ref("");
const filterElement = ref<string | null>(null);
const filterRarity = ref<number | null>(null);
const filterWeapon = ref<string | null>(null);
const filterBuildStatus = ref<CharacterBuildStatusType | null>(null);
const filterFavorites = ref(false);
const viewMode = ref<"list" | "grid">("grid");

const hideWontBuildTooltip =
  "Hide characters marked “Won't build”. This preference is saved globally.";

const hideWontBuildCharacters = computed({
  get: () =>
    Boolean(
      (config.value as { hideWontBuildCharacters?: boolean })?.hideWontBuildCharacters,
    ),
  set: (value: boolean) => {
    if (value && filterBuildStatus.value === "wont-build") {
      filterBuildStatus.value = null;
    }
    void settingsStore.addToConfig({ hideWontBuildCharacters: value });
  },
});

const buildStatusFilterOptions = computed((): AppRichSelectOption[] =>
  CHARACTER_BUILD_STATUSES.map((status) => ({
    value: status,
    label: getCharacterBuildStatusLabel(status),
    dotClass: getCharacterBuildStatusDotClass(status),
    disabled: hideWontBuildCharacters.value && status === "wont-build",
  })),
);

const activeFilterCount = computed(() => {
  let count = 0;
  if (search.value.trim()) count += 1;
  if (filterElement.value) count += 1;
  if (filterRarity.value != null) count += 1;
  if (filterWeapon.value) count += 1;
  if (filterBuildStatus.value) count += 1;
  if (filterFavorites.value) count += 1;
  return count;
});

const charactersList = computed((): ListedCharacter[] => {
  let characterList: ListedCharacter[] = [...allCharactersList];
  if (hideWontBuildCharacters.value) {
    characterList = characterList.filter(
      (c) => getCharacterBuildStatus(c.key, characters.value) !== "wont-build",
    );
  }
  const needle = search.value.trim().toLowerCase();
  if (needle) {
    characterList = characterList.filter((c) =>
      c.name.toLowerCase().includes(needle),
    );
  }
  if (filterElement.value) {
    characterList = characterList.filter((c) => c.element === filterElement.value);
  }
  if (filterRarity.value != null) {
    characterList = characterList.filter((c) => c.rarity === filterRarity.value);
  }
  if (filterWeapon.value) {
    characterList = characterList.filter((c) => c.weapon === filterWeapon.value);
  }
  if (filterBuildStatus.value) {
    characterList = characterList.filter(
      (c) =>
        getCharacterBuildStatus(c.key, characters.value) === filterBuildStatus.value,
    );
  }
  if (filterFavorites.value) {
    characterList = characterList.filter((c) =>
      favoriteCharacters.value.includes(c.key),
    );
  }
  if (props.excludeKeys.length) {
    characterList = characterList.filter((c) => !props.excludeKeys.includes(c.key));
  }
  return characterList;
});

function triggerOpenModal() {
  return modalRef.value?.triggerOpenModal();
}

function triggerCloseModal() {
  modalRef.value?.triggerCloseModal();
}

function reset() {
  search.value = "";
  resetFilters();
}

function resetFilters() {
  filterElement.value = null;
  filterRarity.value = null;
  filterWeapon.value = null;
  filterBuildStatus.value = null;
  filterFavorites.value = false;
}

function toggleElementFilter(element: string) {
  filterElement.value = filterElement.value === element ? null : element;
}
function isElementFilterActive(element: string) {
  return filterElement.value === element;
}
function toggleRarityFilter(rarity: number) {
  filterRarity.value = filterRarity.value === rarity ? null : rarity;
}
function isRarityFilterActive(rarity: number) {
  return filterRarity.value === rarity;
}
function toggleWeaponFilter(weapon: string) {
  filterWeapon.value = filterWeapon.value === weapon ? null : weapon;
}
function isWeaponFilterActive(weapon: string) {
  return filterWeapon.value === weapon;
}
function toggleFavoriteFilter() {
  filterFavorites.value = !filterFavorites.value;
}
function getElementClass(element: string) {
  return `${element.toLowerCase()}--active`;
}

function chooseCharacter(character: ListedCharacter) {
  emit("character-browser:chosen-character", character.key);
  reset();
  triggerCloseModal();
}

defineExpose({ triggerOpenModal, triggerCloseModal });
</script>

<style lang="scss" scoped>
html[data-theme-style="light"] {
  .characters__filter__weapon img {
    filter: invert(1);
  }
}
</style>
