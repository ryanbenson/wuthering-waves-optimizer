import { defineStore } from "pinia";
import { merge } from "lodash";

export const useCharacterStore = defineStore("character", {
  state: () => ({
    characters: {},
    activeCharacter: "",
    enemyLevel: 90,
    enemyResistance: 0.1,
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
    setEnemyLevel(level) {
      this.enemylevel = level;
    }
    setEnemyResistance(resist) {
      this.enemyResistance = resist;
    }
  },
});
