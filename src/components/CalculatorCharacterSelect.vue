<template>
  <div class="character__selection" :class="character">
    <div class="character__selection__left flex flex-col gap-2">
      <div
        class="character__selection__avatar cursor-pointer"
        :class="{
          'border-amber-300': characterRarity === '5' || characterRarity === 5,
          'border-violet-600': characterRarity === '4' || characterRarity === 4,
        }"
        :style="{
          backgroundImage: `url(https://ryanbenson.github.io/wuthering-waves-assets/images/${characterChosen}.png)`,
        }"
        :data-test-char-avatar="character"
        @click="openCharacterBrowser">
        <div class="character__selection__avatar-overlay">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="character__selection__avatar-icon"
            aria-hidden="true">
            <path
              d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
              fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      <CharacterBuildStatus
        :status="buildStatus"
        :character-key="characterChosen"
        interactive
        class="w-full" />
    </div>
    <div class="character__selection__form">
      <div class="character__selection__form--character">
        <select
          name="character"
          v-model="characterChosen"
          class="select select-bordered select-sm"
          @change="handleUpdatedCharacter">
          <optgroup label="5 Star">
            <option
              v-for="char in charactersList.five"
              :key="char.key"
              :value="char.key">
              {{ char.name }}
            </option>
          </optgroup>
          <optgroup label="4 Star">
            <option
              v-for="char in charactersList.four"
              :key="char.key"
              :value="char.key">
              {{ char.name }}
            </option>
          </optgroup>
        </select>
      </div>
      <CalculatorCharacterLevel
        :character="character"
        @character-level-updated="handleCharacterLevelUpdated"></CalculatorCharacterLevel>
    </div>
    <CalculatorCharacterBrowser
      :character="character"
      ref="characterBrowserRef"
      @character-browser:chosen-character="handleChosenCharacter" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import CalculatorCharacterBrowser from "./CalculatorCharacterBrowser.vue";
import CalculatorCharacterLevel from "./CalculatorCharacterLevel.vue";
import CharacterBuildStatus from "./CharacterBuildStatus.vue";
import {
  allCharactersList,
  getCharactersAvailable,
} from "../characters/characters";
import { getCharacterBuildStatus } from "../characters/characterBuildStatus";
import { useCharacterStore } from "../stores/character";

type ListedCharacter = (typeof allCharactersList)[number];
type CharacterPickerList = ReturnType<typeof getCharactersAvailable>;

interface Props {
  character: string;
}

const props = defineProps<Props>();

const { characters } = storeToRefs(useCharacterStore());

const emit = defineEmits<{
  "updated-chosen-character": [key: string];
  "character-level-updated": [level: string];
}>();

const characterBrowserRef = ref<{
  triggerOpenModal: () => void;
  triggerCloseModal: () => void;
} | null>(null);

const charactersList = ref<CharacterPickerList>({ five: [], four: [] });
const characterChosen = ref<string>("");

const basicCharacterData = computed((): ListedCharacter | undefined =>
  allCharactersList.find((char) => char.key === characterChosen.value),
);

const characterRarity = computed((): number | string => {
  if (basicCharacterData.value) {
    return basicCharacterData.value.rarity;
  }
  return 5;
});

const buildStatus = computed(() =>
  getCharacterBuildStatus(characterChosen.value, characters.value),
);

function handleUpdatedCharacter(e: Event) {
  const target = e.target as HTMLSelectElement;
  const next = target.value;
  emit("updated-chosen-character", next);
}

function handleChosenCharacter(nextCharacter: string) {
  characterChosen.value = nextCharacter;
  emit("updated-chosen-character", nextCharacter);
}

function openCharacterBrowser() {
  characterBrowserRef.value?.triggerOpenModal();
}

function handleCharacterLevelUpdated(charLevel: string) {
  emit("character-level-updated", charLevel);
}

watch(
  () => props.character,
  (next) => {
    characterChosen.value = next;
  },
);

onMounted(() => {
  charactersList.value = getCharactersAvailable();
  characterChosen.value = props.character;
});
</script>

<style lang="scss" scoped>
.character__selection {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  grid-gap: 2rem;
}
.character__selection__form--character {
  margin-bottom: 1rem;
}
.character__selection__form {
  label {
    margin-left: 0.5rem;
  }
}
.character__selection__avatar {
  position: relative;
  width: 100px;
  height: 100px;
  background-repeat: no-repeat;
  display: block;
  background-size: contain;
  border-radius: 100%;
  border-width: 1px;
  border-style: solid;
  overflow: hidden;
}

.character__selection__avatar-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background: rgba(0, 0, 0, 0);
  opacity: 0;
  transition:
    opacity 0.15s ease,
    background-color 0.15s ease;
}

.character__selection__avatar-icon {
  width: 1.5rem;
  height: 1.5rem;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.character__selection__avatar:hover .character__selection__avatar-overlay {
  opacity: 1;
  background: rgba(0, 0, 0, 0.65);
}

.character__selection__avatar:hover .character__selection__avatar-icon {
  opacity: 1;
}
</style>
