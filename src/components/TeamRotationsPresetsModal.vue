<template>
  <AppChooserModal
    ref="modalRef"
    title="Team presets"
    close-test-attr="data-test-team-rotations-presets-cancel"
    @close="handleClose">
    <template #toolbar>
      <AppFilterPanel
        panel-key="team-rotations-presets"
        :active-count="activeFilterCount"
        :clear-disabled="!activeFilterCount"
        @clear="resetFilters">
        <template #bar>
          <input
            v-model="search"
            type="search"
            placeholder="Search preset name…"
            class="input input-bordered input-sm flex-1 min-w-40"
            aria-label="Search team presets"
            data-test-team-rotations-presets-search />
        </template>

        <div class="flex flex-wrap items-center gap-2">
          <div class="w-52">
            <AppRichSelect
              v-model="characterFilter"
              :options="characterFilterOptions"
              searchable
              allow-empty
              empty-label="Filter by character"
              placeholder="Filter by character"
              aria-label="Filter presets by character"
              size="sm"
              data-test-team-rotations-presets-character-filter />
          </div>
          <div class="flex items-center gap-1">
            <button
              v-for="(icon, element) in characterElementsSetImageMap"
              :key="element"
              type="button"
              class="rounded mr-1"
              :class="{ 'btn-active': elementFilters.has(element) }"
              :aria-pressed="elementFilters.has(element)"
              :title="`Filter by ${element}`"
              :data-test-team-rotations-presets-element-filter="element"
              @click="toggleElementFilter(element)">
              <img :src="icon" class="size-8" :class="getElementClass(element)" />
            </button>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-ghost rounded inline-flex items-center gap-1.5 px-2"
            :class="{ 'btn-active': favoritesOnly }"
            data-test-team-rotations-presets-favorites-filter
            @click="favoritesOnly = !favoritesOnly">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="size-4 shrink-0"
              aria-hidden="true">
              <path
                v-if="favoritesOnly"
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
        <span class="text-xs opacity-60" data-test-team-rotations-presets-count>
          {{ filteredPresets.length }} of {{ presets.length }} presets
        </span>
        <AppRichSelect
          v-model="sortBy"
          class="w-fit"
          :options="sortOptions"
          variant="ghost"
          size="xs"
          aria-label="Sort team presets" />
      </div>
    </template>

    <div
      v-if="!presets.length"
      class="py-12 text-center w-full opacity-60"
      data-test-team-rotations-presets>
      No team presets are available yet.
    </div>
    <div
      v-else-if="!filteredPresets.length"
      class="py-12 text-center w-full opacity-60 flex flex-col items-center gap-2"
      data-test-team-rotations-presets>
      <span>No presets match those filters.</span>
      <button type="button" class="btn btn-sm btn-ghost" @click="resetFilters">
        Clear filters
      </button>
    </div>
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      data-test-team-rotations-presets>
      <article
        v-for="preset in filteredPresets"
        :key="preset.name"
        class="card card-bordered card-compact bg-base-200"
        :data-test-team-rotations-preset="preset.name">
        <div class="card-body gap-2">
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1">
              <div
                v-for="characterId in presetCharacterIds(preset)"
                :key="characterId"
                class="preset-avatar rounded-full border-2 bg-cover bg-center size-8 shrink-0"
                :class="elementClass(characterId)"
                :style="{ backgroundImage: `url(${characterPortraitUrl(characterId)})` }"
                :title="getCharacterRosterDisplayName(characterId)"></div>
            </div>
            <FavoriteHeartButton
              class="ml-auto"
              :active="isFavoritePreset(preset.name)"
              :test-id="preset.name"
              @toggle="teamRotationsStore.toggleFavoritePreset(preset.name)" />
          </div>
          <h4 class="card-title text-sm leading-snug">{{ preset.name }}</h4>
          <p class="text-xs opacity-80">{{ preset.description }}</p>
          <div class="flex items-center justify-between gap-2 mt-1">
            <span class="text-xs italic opacity-60">by {{ preset.author }}</span>
            <button
              type="button"
              class="btn btn-primary btn-xs"
              data-test-team-rotations-preset-import
              @click="emit('import', preset)">
              Import
            </button>
          </div>
        </div>
      </article>
    </div>
  </AppChooserModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import AppChooserModal from "./AppChooserModal.vue";
import AppFilterPanel from "./AppFilterPanel.vue";
import AppRichSelect, { type AppRichSelectOption } from "./AppRichSelect.vue";
import FavoriteHeartButton from "./FavoriteHeartButton.vue";
import {
  allCharactersList,
  characterElementsSetImageMap,
  characterPortraitUrl,
  getCharacterRosterDisplayName,
} from "../characters/characters";
import { useTeamRotationsStore } from "../stores/teamRotations";
import type { TeamRotationPreset } from "../teamRotations/presets";

const props = defineProps<{
  presets: TeamRotationPreset[];
}>();

const emit = defineEmits<{
  import: [preset: TeamRotationPreset];
}>();

const isOpen = defineModel<boolean>("open", { default: false });
const modalRef = ref<InstanceType<typeof AppChooserModal> | null>(null);

const teamRotationsStore = useTeamRotationsStore();
const { favoritePresetNames } = storeToRefs(teamRotationsStore);

watch(isOpen, async (open) => {
  if (open) {
    await modalRef.value?.triggerOpenModal();
  } else {
    modalRef.value?.triggerCloseModal();
  }
});

function handleClose() {
  isOpen.value = false;
  resetFilters();
}

const search = ref("");
const characterFilter = ref<string | null>(null);
const elementFilters = ref(new Set<string>());
const favoritesOnly = ref(false);
const sortBy = ref<string>("character");

const sortOptions: AppRichSelectOption[] = [
  { value: "character", label: "Sort: Character" },
  { value: "name", label: "Sort: Name" },
  { value: "favorite", label: "Sort: Favorites first" },
];

/** characterId -> element, for the element filter and each card's avatar ring. */
const elementByCharacter = new Map(allCharactersList.map((c) => [c.key, c.element]));

function presetCharacterIds(preset: TeamRotationPreset): string[] {
  return preset.data.characterIds.filter((id): id is string => Boolean(id));
}

function elementClass(characterId: string): string {
  const element = elementByCharacter.get(characterId);
  return element ? `preset-avatar--${element.toLowerCase()}` : "";
}

function getElementClass(element: string) {
  return `${element.toLowerCase()}--active`;
}

function toggleElementFilter(element: string) {
  if (elementFilters.value.has(element)) {
    elementFilters.value.delete(element);
  } else {
    elementFilters.value.add(element);
  }
}

function isFavoritePreset(name: string): boolean {
  return favoritePresetNames.value.includes(name);
}

/**
 * Built from the presets actually on hand rather than the full 64-character
 * roster — a character with zero presets isn't a useful filter option here.
 */
const characterFilterOptions = computed((): AppRichSelectOption[] => {
  const seen = new Set<string>();
  const options: AppRichSelectOption[] = [];
  for (const preset of props.presets) {
    for (const id of presetCharacterIds(preset)) {
      if (seen.has(id)) continue;
      seen.add(id);
      options.push({
        value: id,
        label: getCharacterRosterDisplayName(id),
        image: characterPortraitUrl(id),
      });
    }
  }
  options.sort((a, b) => a.label.localeCompare(b.label));
  return options;
});

const activeFilterCount = computed(() => {
  let count = 0;
  if (search.value.trim()) count += 1;
  if (characterFilter.value) count += 1;
  if (elementFilters.value.size) count += 1;
  if (favoritesOnly.value) count += 1;
  return count;
});

function resetFilters() {
  search.value = "";
  characterFilter.value = null;
  elementFilters.value = new Set();
  favoritesOnly.value = false;
}

const filteredPresets = computed((): TeamRotationPreset[] => {
  const needle = search.value.trim().toLowerCase();
  let list = props.presets;
  if (needle) {
    list = list.filter((preset) => preset.name.toLowerCase().includes(needle));
  }
  if (characterFilter.value) {
    const wanted = characterFilter.value;
    list = list.filter((preset) => presetCharacterIds(preset).includes(wanted));
  }
  if (elementFilters.value.size) {
    list = list.filter((preset) =>
      presetCharacterIds(preset).some((id) =>
        elementFilters.value.has(elementByCharacter.get(id) ?? ""),
      ),
    );
  }
  if (favoritesOnly.value) {
    list = list.filter((preset) => isFavoritePreset(preset.name));
  }

  const sorted = [...list];
  sorted.sort((a, b) => {
    if (sortBy.value === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy.value === "favorite") {
      const aFav = isFavoritePreset(a.name) ? 0 : 1;
      const bFav = isFavoritePreset(b.name) ? 0 : 1;
      if (aFav !== bFav) return aFav - bFav;
      return a.name.localeCompare(b.name);
    }
    const aCharacter = presetCharacterIds(a)[0] ?? "";
    const bCharacter = presetCharacterIds(b)[0] ?? "";
    return aCharacter.localeCompare(bCharacter) || a.name.localeCompare(b.name);
  });
  return sorted;
});
</script>

<style scoped>
/* Element-colored avatar rings, matching the hex values style.css already
   uses for these elements' in-game icon tint (.Light/.Dark/.Thunder/etc). */
.preset-avatar--spectro {
  border-color: #f8e56c;
}
html[data-theme-style="light"] .preset-avatar--spectro {
  border-color: #e1c200;
}
.preset-avatar--havoc {
  border-color: #e649a6;
}
.preset-avatar--electro {
  border-color: #b46bff;
}
.preset-avatar--fusion {
  border-color: #f0744e;
}
.preset-avatar--glacio {
  border-color: #41aefb;
}
.preset-avatar--aero {
  border-color: #55ffb5;
}
html[data-theme-style="light"] .preset-avatar--aero {
  border-color: #0dc776;
}
</style>
