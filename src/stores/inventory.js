import { defineStore } from "pinia";
import { merge } from "lodash";

export const useInventoryStore = defineStore("inventory", {
  state: () => ({
    echoes: [],
    equipped: {},
    echoPresets: [],
    equippedPresets: {},
  }),
  getters: {
    getEquippedEchoData: (state) => {
      return (echoId) => state.equipped?.[echoId] ?? {};
    },
    getEchoPresetData: (state) => {
      return (presetId) =>
        state.echoPresets.find((preset) => preset.presetId === presetId);
    },
    getEchoPresetCharacters: (state) => {
      return (requestedPresetId) => {
        const charactersList = [];
        const allCharactersPresets = Object.entries(state.equippedPresets);
        allCharactersPresets.forEach((characterPreset) => {
          const [character, presetId] = characterPreset;
          if (presetId === requestedPresetId) {
            charactersList.push(character);
          }
        });
        return charactersList;
      };
    },
    getEchoPresetsByEchoId: (state) => {
      return (echoId) =>
        state.echoPresets.filter((preset) => {
          const echoIds = [
            preset.echo1Id,
            preset.echo2Id,
            preset.echo3Id,
            preset.echo4Id,
            preset.echo5Id,
          ];
          return echoIds.includes(echoId);
        });
    },
    echoById: (state) => {
      return (echoId) => state.echoes.find((echo) => echo.echoId === echoId);
    },
    /**
     * look through state.equipped, which is {echoId: {character: index, character2: index2}, echoId2: {...}}
     * if the character is found in the inner obect, skip it
     * otherwise, add the echoId to the list
     */
    echoIdsEquippedByOtherChars: (state) => {
      return (character) => {
        const echoIds = [];
        Object.entries(state.equipped).forEach(([echoId, charMap]) => {
          // if the charMap is empty, don't add the echoId since no one has equipped it
          const characterUsingEcho = Object.keys(charMap);
          if (characterUsingEcho.length === 0) {
            return;
          }
          console.log("charMap", charMap, character, echoId);
          if (characterUsingEcho.includes(character)) {
            return;
          }
          echoIds.push(echoId);
        });
        return echoIds;
      };
    },
  },
  actions: {
    saveEcho(data) {
      const { echoId } = data;
      const foundIndex = this.echoes.findIndex(
        (echo) => echo.echoId === echoId,
      );
      if (foundIndex >= 0) {
        this.echoes[foundIndex] = data;
      } else {
        this.echoes.push(data);
      }
    },
    saveEchoPreset(data) {
      const { presetId } = data;
      const foundIndex = this.echoPresets.findIndex(
        (echoPreset) => echoPreset.presetId === presetId,
      );
      if (foundIndex >= 0) {
        this.echoPresets[foundIndex] = data;
      } else {
        this.echoPresets.push(data);
      }
    },
    patchEcho(echoId, data) {
      const foundIndex = this.echoes.findIndex(
        (echo) => echo.echoId === echoId,
      );
      if (foundIndex >= 0) {
        const existingData = this.echoes[foundIndex];
        const updatedData = merge(existingData, data);
        this.echoes[foundIndex] = updatedData;
      }
    },
    patchEchoPreset(presetId, data) {
      const foundIndex = this.echoPresets.findIndex(
        (echoPreset) => echoPreset.presetId === presetId,
      );
      if (foundIndex >= 0) {
        const existingData = this.echoPresets[foundIndex];
        const updatedData = merge(existingData, data);
        this.echoPresets[foundIndex] = updatedData;
      }
    },
    deleteEcho(echoId) {
      const foundIndex = this.echoes.findIndex(
        (echo) => echo.echoId === echoId,
      );
      if (foundIndex >= 0) {
        this.echoes.splice(foundIndex, 1);
      }
    },
    deleteEchoPreset(presetId) {
      const foundIndex = this.echoPresets.findIndex(
        (echoPreset) => echoPreset.presetId === presetId,
      );
      if (foundIndex >= 0) {
        this.echoPresets.splice(foundIndex, 1);
      }
    },
    getEchoById(echoId) {
      return this.echoes.find((echo) => echo.echoId === echoId);
    },
    getEchoPresetById(presetId) {
      return this.echoPresets.find(
        (echoPreset) => echoPreset.presetId === presetId,
      );
    },
    setEquippedData(echoId, data) {
      const existingData = this.equipped[echoId] ?? {};
      const updatedData = merge(existingData, data);
      this.equipped[echoId] = updatedData;
    },
    setEquippedPresetData(character, presetId) {
      this.equippedPresets[character] = presetId;
    },
    deleteEquippedPreset(character) {
      delete this.equippedPresets[character];
    },
    hardSetState(data) {
      this.echoes = data?.echoes ?? [];
      this.equipped = data?.equipped ?? {};
      this.echoPresets = data?.echoPresets ?? [];
    },
    getEchoEquippedChars(echoId) {
      const equipped = this.equipped[echoId] ?? {};
      return Object.keys(equipped);
    },
    deleteEchoEquippedMapping(echoId) {
      if (!this.equipped[echoId]) return;
      delete this.equipped[echoId];
    },
    deleteEchoEquippedMappingCharacter(echoId, character) {
      if (!this.equipped[echoId]) return;
      if (!this.equipped[echoId][character]) return;
      delete this.equipped[echoId][character];
    },
    removeCharacterFromAllEquipped(character) {
      Object.keys(this.equipped).forEach((echoId) => {
        if (this.equipped[echoId][character] >= 0) {
          delete this.equipped[echoId][character];
        }
      });
    },
  },
});
