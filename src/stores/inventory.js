import { defineStore } from "pinia";
import { merge } from "lodash";

export const useInventoryStore = defineStore("inventory", {
  state: () => ({
    echoes: [],
    equipped: {},
    echoPresets: [],
  }),
  getters: {
    getEquippedEchoData: (state) => {
      return (echoId) => state.equipped?.[echoId] ?? {};
    },
    getEchoPresetData: (state) => {
      return (presetId) => state.echoPresets.find((preset) => preset.presetId === presetId);
    }
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
      return this.echoPresets.find((echoPreset) => echoPreset.presetId === presetId);
    },
    setEquippedData(echoId, data) {
      const existingData = this.equipped[echoId] ?? {};
      const updatedData = merge(existingData, data);
      this.equipped[echoId] = updatedData;
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
      delete this.equipped[echoId];
    }
  },
});
