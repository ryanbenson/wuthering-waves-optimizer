import { defineStore } from "pinia";
import { merge } from "lodash";

export const useCharacterStore = defineStore("character", {
  state: () => ({
    characters: {},
    activeCharacter: "",
  }),
  actions: {
    setActiveCharacter(characterId) {
      this.activeCharacter = characterId;
    },
    setCharacterData(characterId, data) {
      const existingData = this.characters[characterId] ?? {};
      const udpatedData = merge(existingData, data);
      this.characters[characterId] = udpatedData;
    },
    getCharacterWeaponData(characterId) {
      return this.characters[characterId] || {};
    },
    resetCharacterWeaponPassives(characterId) {
      if (this.characters[characterId]) {
        this.characters[characterId].weaponPassives = {};
      }
    },
    setCharacterRotations(characterId, rotationData) {
      if (this.characters[characterId]) {
        this.characters[characterId].rotations = rotationData;
      }
    },
  },
});
