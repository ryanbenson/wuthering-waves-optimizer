<template>
  <dialog id="modal-echoes-browser" class="modal">
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
                    :name="character.name"
                    :rarity="character.rarity"
                    :element="character.element"
                    :weapon-type="character.weaponType"
                    :is-active="false"
                > 
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

<script>
import { allCharactersList, characterElementsSetImageMap } from "../characters/characters";
import CalculatorCharacterCard from "./CalculatorCharacterCard.vue";
export default {
  name: "CalculatorEchoesBrowser",
  props: {
    character: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
        characterElementsSetImageMap,
        allCharactersList,
        filterElement: null,
    };
  },
  components: {
    CalculatorCharacterCard
  },
  computed: {
    charactersList() {
        let characterList = JSON.parse(JSON.stringify(this.allCharactersList));
        if (this.filterElement) {
            characterList = characterList.filter((character) => {
                return character.element === this.filterElement;
            });
        }
        return characterList;
    }
  },
  methods: {
    triggerOpenModal(echoIndex) {
      this.echoIndex = echoIndex;
      const modalEl = document.getElementById("modal-echoes-browser");
      modalEl.showModal();
    },
    triggerCloseModal() {
      const modalEl = document.getElementById("modal-echoes-browser");
      modalEl.close();
    },
    handleClose() {
      this.reset();
    },
    reset() {
      this.filterElement = null;
    },
    getEchoSetImage(echoSet) {
      return getEchoSetIconByType(echoSet);
    },
    toggleElementFilter(element) {
      if (this.filterElement === element) {
        this.filterElement = null;
      } else {
        this.filterElement = element;
      }
    },
    isElementFilterActive(element) {
      return this.filterElement === element;
    },
    
    resetFilters() {
      this.filterElement = null;
    },
    getElementClass(element) {
      return `${element.toLowerCase()}--active`;
    },
    chooseCharacter(character) {
        console.log(character);
    }
  },
};
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
</style>
