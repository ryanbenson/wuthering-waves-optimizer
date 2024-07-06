import { defineStore } from "pinia";

export const useCharacterStore = defineStore("character", {
  state: () => ({
    characters: {},
  }),
  actions: {
    setCharacterWeaponData(characterId, weaponData) {
      this.characters[characterId] = {
        ...this.characters[characterId],
        ...weaponData,
      };
    },
    getCharacterWeaponData(characterId) {
      return this.characters[characterId] || {};
    },
  },
});
