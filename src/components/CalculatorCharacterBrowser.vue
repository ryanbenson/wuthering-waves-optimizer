<template>
  <dialog id="modal-character-browser" class="modal">
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
        <div class="characters__filters flex flex-wrap align-center gap-2 mb-6">
          <div class="characters__filters__sets">
            <button
              v-for="(elementIcon, element) in characterElementsSetImageMap"
              :key="element"
              @click="toggleElementFilter(element)"
              class="rounded mr-1"
              :class="{
                'btn-active': isElementFilterActive(element),
                element,
              }">
              <img
                :src="elementIcon"
                class="size-8"
                :class="getElementClass(element)" />
            </button>
          </div>
          <div class="characters__filters__rarity ml-2">
            <button
              class="rounded mr-1 inline-flex justify-center size-8 items-center"
              @click="toggleRarityFilter(5)"
              :class="{
                'btn-active': isRarityFilterActive(5),
              }">
              5✦
            </button>
            <button
              class="rounded mr-1 inline-flex justify-center size-8 items-center"
              @click="toggleRarityFilter(4)"
              :class="{
                'btn-active': isRarityFilterActive(4),
              }">
              4✦
            </button>
          </div>
          <div class="characters__filter__weapon ml-2">
            <button
              v-for="(weaponIcon, weapon) in weaponTypesImageMap"
              :key="weapon"
              @click="toggleWeaponFilter(weapon)"
              class="rounded mr-1"
              :class="{
                'btn-active': isWeaponFilterActive(weapon),
                weapon,
              }">
              <img :src="weaponIcon.toLowerCase()" class="size-8 p-[.15rem]" />
            </button>
          </div>
          <button @click="resetFilters" class="btn btn-sm btn-ghost">
            Clear
          </button>
        </div>

        <div class="characters__list">
          <template v-if="!charactersList.length">
            <div class="characters__list--empty py-12 text-center w-full">
              No characters found
            </div>
          </template>
          <template v-else>
            <div
              class="characters__list__items grid grid-cols-1 md:grid-cols-4 gap-4">
              <CalculatorCharacterCard
                v-for="character in charactersList"
                :key="character.key"
                :name-key="character.key"
                :name="character.name"
                :rarity="character.rarity"
                :element="character.element"
                :weapon="character.weapon"
                :is-active="false"
                @click="chooseCharacter(character)"
                class="cursor-pointer">
                <button
                  @click="chooseCharacter(character)"
                  class="btn btn-sm btn-primary">
                  Use character
                </button>
              </CalculatorCharacterCard>
            </div>
          </template>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  allCharactersList,
  characterElementsSetImageMap,
  weaponTypesImageMap,
} from "../characters/characters";
import CalculatorCharacterCard from "./CalculatorCharacterCard.vue";

type ListedCharacter = (typeof allCharactersList)[number];

interface Props {
  character: string;
}

defineProps<Props>();

const emit = defineEmits<{
  "character-browser:chosen-character": [key: string];
}>();

const filterElement = ref<string | null>(null);
const filterRarity = ref<number | null>(null);
const filterWeapon = ref<string | null>(null);

const charactersList = computed((): ListedCharacter[] => {
  let characterList: ListedCharacter[] = JSON.parse(
    JSON.stringify(allCharactersList),
  );
  if (filterElement.value) {
    characterList = characterList.filter(
      (c) => c.element === filterElement.value,
    );
  }
  if (filterRarity.value != null) {
    characterList = characterList.filter(
      (c) => c.rarity === filterRarity.value,
    );
  }
  if (filterWeapon.value) {
    characterList = characterList.filter(
      (c) => c.weapon === filterWeapon.value,
    );
  }
  return characterList;
});

function triggerOpenModal() {
  const modalEl = document.getElementById(
    "modal-character-browser",
  ) as HTMLDialogElement | null;
  modalEl?.showModal();
}

function triggerCloseModal() {
  const modalEl = document.getElementById(
    "modal-character-browser",
  ) as HTMLDialogElement | null;
  modalEl?.close();
}

function reset() {
  filterElement.value = null;
  filterRarity.value = null;
  filterWeapon.value = null;
}

function handleClose() {
  reset();
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

function resetFilters() {
  filterElement.value = null;
  filterRarity.value = null;
  filterWeapon.value = null;
}

function getElementClass(element: string) {
  return `${element.toLowerCase()}--active`;
}

function chooseCharacter(character: ListedCharacter) {
  emit("character-browser:chosen-character", character.key);
  handleClose();
  triggerCloseModal();
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
  .characters__filter__weapon img {
    filter: invert(1);
  }
}
</style>
