import { defineStore } from "pinia";
import { merge } from "lodash";

export const useCharacterStore = defineStore("character", {
  state: () => ({
    characters: {},
    activeCharacter: "",
  }),
  getters: {
    getRotationById: (state) => {
      return (characterName, rotationId) => {
        const rotations = state.characters?.[characterName]?.rotations ?? [];
        return rotations.find((rotation) => rotation.id === rotationId);
      };
    },
    getActiveCharacter: (state) => {
      return state.characters?.[state.activeCharacter];
    },
  },
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
    setCharacterOptimizerMinStats(characterId, data) {
      if (this.characters[characterId]) {
        if (!this.characters[characterId].optimizer) {
          this.characters[characterId].optimizer = {};
        }
        this.characters[characterId].optimizer.minStats = data;
      }
    },
    setCharacterEchoes(characterId, echoes) {
      if (this.characters[characterId]) {
        this.characters[characterId].echoes = echoes;
      }
    },
    hardSetState(data) {
      this.characters = data.characters;
      this.activeCharacter = data.activeCharacter;
    },
    removeCharacterEcho(characterId, echoIndex) {
      this.characters[characterId].echoes[echoIndex] = {
        echo: null,
        type: null,
        rank: null,
        stat: null,
        echoId: null,
        echoSet: null,
        echoSubStatsType1: null,
        echoSubStatsValue1: null,
        echoSubStatsType2: null,
        echoSubStatsValue2: null,
        echoSubStatsType3: null,
        echoSubStatsValue3: null,
        echoSubStatsType4: null,
        echoSubStatsValue4: null,
        echoSubStatsType5: null,
        echoSubStatsValue5: null,
      };
    },
  },
});
