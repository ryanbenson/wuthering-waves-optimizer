<template>
  <div class="workspace-identity flex flex-wrap items-center gap-6 bg-base-200 rounded-xl p-4">
    <div class="flex items-center gap-3 min-w-[12rem]">
      <button
        type="button"
        class="workspace-identity__favorite"
        :class="{ 'workspace-identity__favorite--active': isFavorite }"
        :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        :data-test-workspace-favorite="character"
        @click.stop="characterStore.toggleFavoriteCharacter(character)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4" aria-hidden="true">
          <path
            v-if="isFavorite"
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            fill="currentColor" />
          <path
            v-else
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            fill="none"
            stroke="currentColor"
            stroke-width="2" />
        </svg>
      </button>
      <button
        type="button"
        class="workspace-identity__avatar shrink-0"
        :class="{
          'border-amber-300': rarity === 5,
          'border-violet-600': rarity === 4,
        }"
        :style="{ backgroundImage: `url(${CHARACTER_IMAGE_BASE}/${character}.png)` }"
        title="Choose a different character"
        :data-test-workspace-avatar="character"
        @click="$emit('open-character-browser')" />
      <div class="min-w-0">
        <div class="flex items-baseline gap-1.5">
          <h2 class="font-bold text-lg leading-tight truncate">{{ characterName }}</h2>
          <span v-if="rarity" class="text-xs text-amber-400 font-semibold">{{ rarity }}★</span>
        </div>
        <div class="text-xs opacity-60 flex items-center gap-1">
          <span v-if="element">{{ element }}</span>
          <span v-if="element && weaponType">·</span>
          <span v-if="weaponType">{{ weaponType }}</span>
        </div>
      </div>
    </div>

    <div class="flex items-end gap-4 flex-wrap">
      <div>
        <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-1">Level</div>
        <WorkspaceLevelStepper
          :character="character"
          @character-level-updated="$emit('character-level-updated', $event)" />
      </div>
      <div>
        <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 mb-1">Status</div>
        <CharacterBuildStatus :status="buildStatus" :character-key="character" interactive />
      </div>
    </div>

    <div class="ml-auto">
      <WorkspaceBuildSwitcher
        :character="character"
        @create-build="$emit('create-build')"
        @manage-builds="$emit('manage-builds')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../../stores/character";
import { getCharacterBuildStatus } from "../../characters/characterBuildStatus";
import CharacterBuildStatus from "../CharacterBuildStatus.vue";
import WorkspaceLevelStepper from "./WorkspaceLevelStepper.vue";
import WorkspaceBuildSwitcher from "./WorkspaceBuildSwitcher.vue";

const CHARACTER_IMAGE_BASE = "https://ryanbenson.github.io/wuthering-waves-assets/images";

interface Props {
  character: string;
  characterName: string;
  rarity?: number;
  element?: string;
  weaponType?: string;
}

const props = defineProps<Props>();
defineEmits<{
  "open-character-browser": [];
  "create-build": [];
  "manage-builds": [];
  "character-level-updated": [level: string];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const isFavorite = computed(() => characterStore.isFavoriteCharacter(props.character));

const buildStatus = computed(() => getCharacterBuildStatus(props.character, characters.value));
</script>

<style scoped lang="scss">
.workspace-identity__favorite {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: none;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  cursor: pointer;
  flex: none;

  &--active {
    color: #f472b6;
  }
}
.workspace-identity__avatar {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 9999px;
  background-repeat: no-repeat;
  background-size: contain;
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  padding: 0;
}
</style>
