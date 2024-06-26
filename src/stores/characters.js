import { defineStore } from "pinia";
import {
  getCharactersAvailable,
  allCharacters,
} from "../characters/characters.ts";
const allActiveCharacters = [...getCharactersAvailable()];

export const useCharactersStore = defineStore("characters", {
  state: () => ({
    savedCharacterData: {},
    activeCharacter: null,
  }),
  getters: {
    // getCharactersSaved: (state) => ({...state.savedCharacterData}),
  },
  actions: {
    changeCharacter(character) {
      this.activeCharacter = character;
    },
    updateActiveCharacterBuffs(buffData) {
      if (!this.savedCharacterData?.[this.activeCharacter]) {
        this.savedCharacterData[this.activeCharacter] = {
          buffs: buffData,
        };
      } else {
        this.savedCharacterData[this.activeCharacter].buffs = buffData;
      }
    },
    updateActiveCharacterResonanceChains(data) {
      if (!this.savedCharacterData?.[this.activeCharacter]) {
        this.savedCharacterData[this.activeCharacter] = {
          buffs: buffData,
        };
      } else {
        this.savedCharacterData[this.activeCharacter].resonanceChains = data;
      }
    },
  },
});
