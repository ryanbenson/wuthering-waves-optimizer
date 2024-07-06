import { defineStore } from "pinia";
import { merge } from "lodash";

export const useCharacterStore = defineStore("character", {
  state: () => ({
    characters: {},
  }),
  actions: {
    setCharacterWeaponData(characterId, weaponData) {
      const existingData = this.characters[characterId] ?? {};
      const udpatedData = merge(existingData, weaponData);
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
  },
});
